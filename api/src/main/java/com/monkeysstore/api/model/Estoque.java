package com.monkeysstore.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "estoque")
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "id_produto", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(length = 50)
    private String localizacao;

    public void darBaixa(int qtd) {
        if (this.quantidade >= qtd) {
            this.quantidade -= qtd;
        } else {
            throw new IllegalArgumentException("Estoque insuficiente.");
        }
    }

    public void adicionar(int qtd) {
        this.quantidade += qtd;
    }

    // Construtores, Getters e Setters omitidos
}
