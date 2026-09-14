package com.monkeysstore.api.repository;

import com.monkeysstore.api.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    // O Spring Data gera automaticamente save(), findAll(), findById() e delete()
}