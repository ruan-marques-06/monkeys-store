package com.monkeysstore.api.controller;

import com.monkeysstore.api.model.Produto;
import com.monkeysstore.api.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*") // Permite que o frontend acesse sem bloqueios
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    // 1. LER: Retorna todos os produtos cadastrados (Para mostrar na tabela do painel e na vitrine)
    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        List<Produto> produtos = produtoRepository.findAll();
        return ResponseEntity.ok(produtos);
    }

    // 2. CRIAR: Adiciona um novo produto no estoque
    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto produto) {
        Produto produtoSalvo = produtoRepository.save(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoSalvo);
    }

    // 3. ATUALIZAR: Edita um produto existente (ex: mudar o preço ou a quantidade)
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