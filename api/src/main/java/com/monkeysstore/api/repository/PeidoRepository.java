package com.monkeysstore.api.repository;

import com.monkeysstore.api.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeidoRepository extends JpaRepository<Pedido, Integer> {
    // O Spring Data gera automaticamente save(), findAll(), findById() e delete()
}