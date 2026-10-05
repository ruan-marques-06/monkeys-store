package com.monkeysstore.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoResumoDTO {

    private Integer id;
    private String nomeCliente;
    private LocalDateTime dataEmissao;
    private String status;
    private BigDecimal valorTotal;
    private String cep;
    private String rua;
    private String numero;
    private String cidade;
    private List<ItemPedidoResumoDTO> itens;

    // --- GETTERS E SETTERS ---

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public LocalDateTime getDataEmissao() {
        return dataEmissao;
    }

    public void setDataEmissao(LocalDateTime dataEmissao) {
        this.dataEmissao = dataEmissao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getRua() { return rua; }
    public void setRua(String rua) { this.rua = rua; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public List<ItemPedidoResumoDTO> getItens() { return itens; }
    public void setItens(List<ItemPedidoResumoDTO> itens) { this.itens = itens; }
}
