package com.monkeysstore.api.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;

@Entity
@DiscriminatorValue("VENDEDOR")
public class Vendedor extends Usuario {
    
    @Column(length = 20)
    private String matricula;
    
    // Construtores, Getters e Setters
}