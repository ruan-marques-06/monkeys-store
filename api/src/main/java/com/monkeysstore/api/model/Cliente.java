package com.monkeysstore.api.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;

@Entity
@DiscriminatorValue("CLIENTE")
public class Cliente extends Usuario {
    
    @Column(length = 14)
    private String cpf;
    
    @Column(length = 255)
    private String endereco;
    
    // Construtores, Getters e Setters específicos do Cliente omitidos
}
