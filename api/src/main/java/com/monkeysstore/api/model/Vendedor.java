package com.monkeysstore.api.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("VENDEDOR")
public class Vendedor extends Usuario {
    
    // Atributo exclusivo de quem trabalha na loja
    private String nivelAcesso; 

    public String getNivelAcesso() { return nivelAcesso; }
    public void setNivelAcesso(String nivelAcesso) { this.nivelAcesso = nivelAcesso; }
}