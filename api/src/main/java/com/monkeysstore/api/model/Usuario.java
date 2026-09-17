package com.monkeysstore.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_usuario", discriminatorType = DiscriminatorType.STRING)
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 100, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;
    
    @Column(name = "ativo")
    private boolean ativo = false; // Toda conta nasce bloqueada até confirmar o e-mail

    @Column(name = "codigo_verificacao")
    private String codigoVerificacao;

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public boolean isAtivo(){ return ativo; }
    public void setAtivo(boolean ativo){ this.ativo = ativo; }

    public String getCodigoVerificacao() { return codigoVerificacao; }
    public void setCodigoVerificacao(String codigoVerificacao) { this.codigoVerificacao = codigoVerificacao; }
    

    // O @Transient diz ao banco de dados para ignorar isso, servindo apenas para o JSON do frontend
    @Transient
    public String getTipo() {
        // Isso vai ler o nome da classe filha (ex: Vendedor) e transformar em "VENDEDOR"
        return this.getClass().getSimpleName().toUpperCase();
    }
}