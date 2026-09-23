// ==========================================
// ESTADO DO PRODUTO (PDP)
// ==========================================
let produtoAtual = null;
let tamanhoSelecionado = null;
let quantidadeSelecionada = 1;

document.addEventListener('DOMContentLoaded', carregarDetalhesProduto);

// ==========================================
// RENDERIZAÇÃO E API
// ==========================================
async function carregarDetalhesProduto() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        document.getElementById('pdp-conteudo').innerHTML = '<h2 style="color:red; text-align:center;">Produto não especificado.</h2>';
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:8080/api/produtos/${id}`);
        if (!resposta.ok) throw new Error('Produto não encontrado');

        produtoAtual = await resposta.json();

        const container = document.getElementById('pdp-conteudo');
        container.innerHTML = `
            <div class="pdp-imagem">
                <img src="${produtoAtual.imagemUrl}" alt="${produtoAtual.nome}">
            </div>
            
            <div class="pdp-info">
                <span class="pdp-categoria">${produtoAtual.categoria || 'Monkeys Original'}</span>
                <h1 class="pdp-titulo">${produtoAtual.nome}</h1>
                <span class="pdp-preco">R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}</span>
                
                <p class="pdp-descricao">${produtoAtual.descricao.replace(/\n/g, '<br>')}</p>
                
                <div class="tamanhos-wrapper">
                    <p style="margin: 0; color: #888; text-transform: uppercase; font-size: 0.9rem;">Escolha o Tamanho:</p>
                    <div class="tamanhos-grid">
                        <button class="btn-tamanho" onclick="selecionarTamanho('P', this)">P</button>
                        <button class="btn-tamanho" onclick="selecionarTamanho('M', this)">M</button>
                        <button class="btn-tamanho" onclick="selecionarTamanho('G', this)">G</button>
                        <button class="btn-tamanho" onclick="selecionarTamanho('GG', this)">GG</button>
                    </div>
                </div>

                <div class="quantidade-wrapper" style="margin-top: 20px;">
                    <p style="margin: 0; color: #888; text-transform: uppercase; font-size: 0.9rem;">Quantidade:</p>
                    <div style="display: flex; align-items: center; gap: 15px; margin-top: 10px;">
                        <button class="btn-tamanho" style="padding: 5px 15px;" onclick="alterarQuantidadePDP(-1)">-</button>
                        <span id="qtd-pdp" style="font-size: 1.5rem; font-weight: bold; width: 30px; text-align: center;">1</span>
                        <button class="btn-tamanho" style="padding: 5px 15px;" onclick="alterarQuantidadePDP(1)">+</button>
                    </div>
                </div>

                <button class="btn-comprar-grande" onclick="adicionarProdutoSelecionadoAoCarrinho()">
                    <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                </button>
            </div>
        `;

    } catch (erro) {
        console.error(erro);
        document.getElementById('pdp-conteudo').innerHTML = '<h2 style="color:red; text-align:center;">Erro ao carregar o produto.</h2>';
    }
}

// ==========================================
// CONTROLES DE INTERFACE
// ==========================================
function selecionarTamanho(tamanho, botaoElemento) {
    tamanhoSelecionado = tamanho;
    document.querySelectorAll('.btn-tamanho').forEach(btn => btn.classList.remove('selecionado'));
    botaoElemento.classList.add('selecionado');
}

function alterarQuantidadePDP(mudanca) {
    quantidadeSelecionada += mudanca;
    
    if (quantidadeSelecionada < 1) {
        quantidadeSelecionada = 1; 
    }
    
    document.getElementById('qtd-pdp').innerText = quantidadeSelecionada;
}

// ==========================================
// INTEGRAÇÃO COM CARRINHO GERAL
// ==========================================
function adicionarProdutoSelecionadoAoCarrinho() {
    if (!tamanhoSelecionado) {
        Toastify({
            text: "❌ Por favor, selecione um tamanho antes de comprar!",
            duration: 3000,
            style: { background: "#000", border: "1px solid #ff0000", color: "#ff0000", borderRadius: "8px" }
        }).showToast();
        return;
    }

    const nomeComTamanho = `${produtoAtual.nome} (Tam: ${tamanhoSelecionado})`;

    adicionarAoCarrinho(
        produtoAtual.id, 
        nomeComTamanho, 
        produtoAtual.preco, 
        produtoAtual.imagemUrl, 
        quantidadeSelecionada
    );
    
    quantidadeSelecionada = 1;
    document.getElementById('qtd-pdp').innerText = quantidadeSelecionada;
    
    Toastify({
        text: `✅ Peça adicionada ao carrinho!`,
        duration: 3000,
        style: { background: "#000", border: "1px solid #00ff88", color: "#00ff88", borderRadius: "8px" }
    }).showToast();
}