package com.monkeysstore.api.repository;

import com.monkeysstore.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    // O Spring Data gera automaticamente save(), findAll(), findById() e delete()
}
