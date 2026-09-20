package com.monkeysstore.api.controller;

import com.monkeysstore.api.dto.PedidoDTO;
import com.monkeysstore.api.dto.ItemPedidoDTO;
import com.monkeysstore.api.model.Cliente;
import com.monkeysstore.api.model.ItemPedido;
import com.monkeysstore.api.model.ItemPedidoId;
import com.monkeysstore.api.model.Pedido;
import com.monkeysstore.api.model.Produto;
import com.monkeysstore.api.repository.ClienteRepository;
import com.monkeysstore.api.repository.PedidoRepository;
import com.monkeysstore.api.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping
    @Transactional // Garante que salva o Pedido e os Itens juntos com segurança
    public ResponseEntity<String> criarPedido(@RequestBody PedidoDTO pedidoDTO) {
        try {
            // 1. Buscar o cliente no banco (como o id_cliente não pode ser nulo)
            Cliente cliente = clienteRepository.findById(pedidoDTO.getClienteId())
                    .orElseThrow(
                            () -> new RuntimeException("Cliente não encontrado com ID: " + pedidoDTO.getClienteId()));

            // 2. Criar a estrutura principal do Pedido
            Pedido pedido = new Pedido();
            pedido.setCliente(cliente);
            pedido.setDataEmissao(LocalDateTime.now());
            pedido.setStatus("AGUARDANDO PAGAMENTO");
            pedido.setValorTotal(pedidoDTO.getValorTotal());

            // 3. Montar a lista de peças de roupa (Itens)
            List<ItemPedido> itens = new ArrayList<>();
            for (ItemPedidoDTO itemDto : pedidoDTO.getItens()) {
                Produto produto = produtoRepository.findById(itemDto.getProdutoId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

                ItemPedido item = new ItemPedido();
                item.setId(new ItemPedidoId()); // O id real será preenchido pelo Hibernate
                item.setPedido(pedido);
                item.setProduto(produto);
                item.setQuantidade(itemDto.getQuantidade());
                item.setPrecoUnitario(itemDto.getPrecoUnitario());

                itens.add(item);
            }

            // 4. Conectar os itens ao pedido e salvar no Supabase
            pedido.setItens(itens);
            pedidoRepository.save(pedido); // Graças ao CascadeType.ALL, os itens são salvos automaticamente!

            return ResponseEntity.ok("Encomenda nº " + pedido.getId() + " registada com sucesso!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao processar a encomenda: " + e.getMessage());
        }
    }
}