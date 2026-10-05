package com.monkeysstore.api.dto;

public record CadastroDTO(String nome, String email, String senha, String cpf, String telefone, String cep, String rua,
        String numero, String cidade) {
}