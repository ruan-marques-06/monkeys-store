package com.monkeysstore.api.controller;

import com.monkeysstore.api.model.Produto;
import com.monkeysstore.api.repository.ProdutoRepository;
import com.monkeysstore.api.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*") // Permite que o frontend acesse sem bloqueios
public class ProdutoController {

    // --- DEPENDÊNCIAS (Sempre no topo) ---
    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // --- ROTAS (MÉTODOS) ---

    // 1. LER: Retorna todos os produtos cadastrados
    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        List<Produto> produtos = produtoRepository.findAll();
        return ResponseEntity.ok(produtos);
    }

    // 2. CRIAR: Recebe os dados do formulário e a imagem física
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Produto> criarProduto(
            @RequestParam("nome") String nome,
            @RequestParam("descricao") String descricao,
            @RequestParam("preco") BigDecimal preco,
            @RequestParam("quantidadeEmEstoque") Integer quantidadeEmEstoque,
            @RequestParam("imagemFile") MultipartFile imagemFile) {

        try {
            // 1. Envia a foto para a nuvem e recebe a URL
            String urlDaFoto = cloudinaryService.uploadImagem(imagemFile);

            // 2. Monta o objeto Produto com os dados e a nova URL
            Produto novo = new Produto();
            novo.setNome(nome);
            novo.setDescricao(descricao);
            novo.setPreco(preco);
            novo.setQuantidadeEmEstoque(quantidadeEmEstoque);
            novo.setImagemUrl(urlDaFoto);

            // 3. Salva no banco de dados (Supabase)
            Produto produtoSalvo = produtoRepository.save(novo);
            return ResponseEntity.status(HttpStatus.CREATED).body(produtoSalvo);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    } // <-- ESTA ERA A CHAVE QUE ESTAVA FALTANDO!

    // 3. ATUALIZAR: Edita um produto existente
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarProduto(@PathVariable Integer id, @RequestBody Produto produtoAtualizado) {
        Optional<Produto> produtoExistente = produtoRepository.findById(id);
        
        if (produtoExistente.isPresent()) {
            Produto produto = produtoExistente.get();
            produto.setNome(produtoAtualizado.getNome());
            produto.setDescricao(produtoAtualizado.getDescricao());
            produto.setPreco(produtoAtualizado.getPreco());
            produto.setQuantidadeEmEstoque(produtoAtualizado.getQuantidadeEmEstoque());
            produto.setImagemUrl(produtoAtualizado.getImagemUrl());
            
            produtoRepository.save(produto);
            return ResponseEntity.ok(produto);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado.");
    }

    // 4. DELETAR: Remove um produto do banco de dados
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarProduto(@PathVariable Integer id) {
        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
            return ResponseEntity.ok("Produto deletado com sucesso.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado.");
    }
}