package com.monkeysstore.api.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;

@Entity
@DiscriminatorValue("PROPRIETARIO")
public class Proprietario extends Vendedor {
    
    @Column(length = 18)
    private String cnpj;
    
    // Construtores, Getters e Setters
}
