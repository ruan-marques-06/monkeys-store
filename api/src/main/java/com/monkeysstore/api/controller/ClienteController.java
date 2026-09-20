package com.monkeysstore.api.controller;

import com.monkeysstore.api.model.Cliente;
import com.monkeysstore.api.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrarCliente(@RequestBody Cliente cliente) {
        try {
            // Regras de negócio padrão para uma nova conta
            cliente.setAtivo(true);
            
            // O Hibernate já sabe que o tipo_usuario é 'CLIENTE' devido à estrutura da sua entidade
            clienteRepository.save(cliente);
            
            return ResponseEntity.ok("Conta criada com sucesso!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao registar cliente: " + e.getMessage());
        }
    }
}