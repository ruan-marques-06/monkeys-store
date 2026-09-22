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
@CrossOrigin(origins = "*") 
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // 1. LER
    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        List<Produto> produtos = produtoRepository.findAll();
        return ResponseEntity.ok(produtos);
    }

    // 2. CRIAR
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Produto> criarProduto(
            @RequestParam("nome") String nome,
            @RequestParam("categoria") String categoria, // NOVA VARIÁVEL RECEBIDA
            @RequestParam("descricao") String descricao,
            @RequestParam("preco") BigDecimal preco,
            @RequestParam("quantidadeEmEstoque") Integer quantidadeEmEstoque,
            @RequestParam("imagemFile") MultipartFile imagemFile) {

        try {
            String urlDaFoto = cloudinaryService.uploadImagem(imagemFile);

            Produto novo = new Produto();
            novo.setNome(nome);
            novo.setCategoria(categoria); // SETANDO A CATEGORIA
            novo.setDescricao(descricao);
            novo.setPreco(preco);
            novo.setQuantidadeEmEstoque(quantidadeEmEstoque);
            novo.setImagemUrl(urlDaFoto);

            Produto produtoSalvo = produtoRepository.save(novo);
            return ResponseEntity.status(HttpStatus.CREATED).body(produtoSalvo);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    } 

    // 3. ATUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarProduto(@PathVariable Integer id, @RequestBody Produto produtoAtualizado) {
        Optional<Produto> produtoExistente = produtoRepository.findById(id);
        
        if (produtoExistente.isPresent()) {
            Produto produto = produtoExistente.get();
            produto.setNome(produtoAtualizado.getNome());
            produto.setCategoria(produtoAtualizado.getCategoria()); // ATUALIZANDO A CATEGORIA
            produto.setDescricao(produtoAtualizado.getDescricao());
            produto.setPreco(produtoAtualizado.getPreco());
            produto.setQuantidadeEmEstoque(produtoAtualizado.getQuantidadeEmEstoque());
            produto.setImagemUrl(produtoAtualizado.getImagemUrl());
            
            produtoRepository.save(produto);
            return ResponseEntity.ok(produto);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado.");
    }

    // 4. DELETAR
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarProduto(@PathVariable Integer id) {
        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
            return ResponseEntity.ok("Produto deletado com sucesso.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado.");
    }
}