package com.monkeysstore.api.dto;

import java.math.BigDecimal;

public class ItemPedidoDTO {
    private Integer produtoId;
    private Integer quantidade;
    private BigDecimal precoUnitario;

    public Integer getProdutoId() { return produtoId; }
    public void setProdutoId(Integer produtoId) { this.produtoId = produtoId; }
    
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    
    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }
}