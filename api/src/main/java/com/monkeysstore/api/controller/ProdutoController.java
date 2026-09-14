package com.monkeysstore.api.controller;

import com.monkeysstore.api.model.Produto;
import com.monkeysstore.api.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*") // Libera o navegador para acessar a API
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    // Endpoint que o app.js consome para montar a vitrine
    @GetMapping
    public ResponseEntity<List<Produto>> listarCatalogo() {
        List<Produto> vitrine = produtoRepository.findAll();
        return ResponseEntity.ok(vitrine);
    }

    // Endpoint da Interface Maker (já havíamos feito)
    @PostMapping("/maker/adicionar")
    public ResponseEntity<Produto> adicionarProdutoCatalogo(@RequestBody Produto produto) {
        Produto novoProduto = produtoRepository.save(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }
}