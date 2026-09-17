package com.monkeysstore.api.repository;

import com.monkeysstore.api.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    // O Spring já vai nos dar os métodos save(), findAll(), findById() e deleteById() de graça!
}