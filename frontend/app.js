// ==========================================
// ESTADO GLOBAL
// ==========================================
let itensCarrinho = JSON.parse(localStorage.getItem('carrinhoMonkeys')) || [];
let todosOsProdutos = []; 

document.addEventListener('DOMContentLoaded', () => {
    carregarVitrine();
    renderizarCarrinho();
});

// ==========================================
// UI: COMPONENTES GERAIS
// ==========================================
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    const corFundo = '#000000';
    const corBorda = tipo === 'sucesso' ? '1px solid #00ff88' : '1px solid #ff0000';
    const corTexto = tipo === 'sucesso' ? '#00ff88' : '#ff0000';

    Toastify({
        text: mensagem,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: corFundo,
            border: corBorda,
            color: corTexto,
            borderRadius: "8px",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
        }
    }).showToast();
}

// ==========================================
// API & RENDERIZAÇÃO: VITRINE E CATEGORIAS
// ==========================================
async function carregarVitrine() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    grid.innerHTML = '<p style="text-align: center; width: 100%;">A carregar coleção...</p>';

    try {
        const resposta = await fetch('http://localhost:8080/api/produtos');
        if (!resposta.ok) throw new Error('Falha de API');
        
        todosOsProdutos = await resposta.json();
        
        renderizarProdutos(todosOsProdutos);
        renderizarCategorias();
    } catch (erro) {
        console.error(erro);
        grid.innerHTML = '<p style="color: var(--btn-red); text-align: center; width: 100%;">Erro de conexão com servidor.</p>';
    }
}

function renderizarProdutos(listaDeProdutos) {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    grid.innerHTML = ''; 

    if (listaDeProdutos.length === 0) {
        grid.innerHTML = '<p style="text-align: center; width: 100%; color: #888;">Nenhuma peça encontrada.</p>';
        return;
    }

    listaDeProdutos.forEach(produto => {
        const card = `
            <article class="card">
                <div class="image-wrapper" onclick="window.location.href='produto.html?id=${produto.id}'" style="cursor: pointer;">
                    <img src="${produto.imagemUrl || 'img/placeholder.png'}" alt="${produto.nome}">
                </div>
                <div class="card-info">
                    <h2 class="title" onclick="window.location.href='produto.html?id=${produto.id}'" style="cursor: pointer;">${produto.nome}</h2>
                    <span class="price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                    <button class="btn-cart" onclick="window.location.href='produto.html?id=${produto.id}'">
                        VER DETALHES
                    </button>
                </div>
            </article>
        `;
        grid.innerHTML += card;
    });
}

function renderizarCategorias() {
    const lista = document.getElementById('lista-categorias');
    if (!lista) return;

    const categoriasBrutas = todosOsProdutos
        .map(produto => produto.categoria)
        .filter(categoria => categoria != null && categoria.trim() !== '');
    
    const categoriasUnicas = [...new Set(categoriasBrutas)].sort();

    let html = `<li><a href="#" onclick="filtrarPorCategoria('TODAS', this)" class="link-categoria ativo">Todas as Peças</a></li>`;

    categoriasUnicas.forEach(categoria => {
        html += `<li><a href="#" onclick="filtrarPorCategoria('${categoria}', this)" class="link-categoria">${categoria}</a></li>`;
    });

    lista.innerHTML = html;
}

function filtrarPorCategoria(categoriaDesejada, elementoClicado) {
    if (event) event.preventDefault(); 

    if (elementoClicado) {
        document.querySelectorAll('.link-categoria').forEach(link => link.classList.remove('ativo'));
        elementoClicado.classList.add('ativo');
    }

    if (categoriaDesejada === 'TODAS') {
        renderizarProdutos(todosOsProdutos);
    } else {
        const filtrados = todosOsProdutos.filter(produto => 
            produto.categoria && produto.categoria.toUpperCase() === categoriaDesejada.toUpperCase()
        );
        renderizarProdutos(filtrados);
    }
}

// ==========================================
// CARRINHO DE COMPRAS
// ==========================================
function adicionarAoCarrinho(id, nome, preco, imagem, quantidadeDesejada = 1) {
    const itemExistente = itensCarrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += quantidadeDesejada;
    } else {
        itensCarrinho.push({ id, nome, preco, imagem, quantidade: quantidadeDesejada });
    }

    localStorage.setItem('carrinhoMonkeys', JSON.stringify(itensCarrinho));
    renderizarCarrinho();
    abrirSidebar();
}

function alterarQuantidade(index, mudanca) {
    itensCarrinho[index].quantidade += mudanca;
    
    if (itensCarrinho[index].quantidade <= 0) {
        removerDoCarrinho(index);
    } else {
        localStorage.setItem('carrinhoMonkeys', JSON.stringify(itensCarrinho));
        renderizarCarrinho();
    }
}

function removerDoCarrinho(index) {
    itensCarrinho.splice(index, 1);
    localStorage.setItem('carrinhoMonkeys', JSON.stringify(itensCarrinho));
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const container = document.getElementById('itens-sidebar');
    const totalContainer = document.getElementById('total-sidebar');
    if(!container || !totalContainer) return;

    let html = '';
    let total = 0;

    if (itensCarrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:gray; margin-top: 20px;">O seu carrinho está vazio.</p>';
        totalContainer.innerText = 'R$ 0,00';
        return;
    }

    itensCarrinho.forEach((item, index) => {
        const qtd = item.quantidade || 1;
        const subtotal = item.preco * qtd;
        total += subtotal;

        html += `
            <div class="item-carrinho" style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #222;">
                <img src="${item.imagem}" alt="${item.nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='img/placeholder.png'">
                <div style="flex-grow: 1;">
                    <p style="margin: 0; font-size: 14px; font-weight: bold;">${item.nome}</p>
                    <p style="margin: 5px 0 0; color: var(--price-green); font-weight: bold;">
                        R$ ${subtotal.toFixed(2).replace('.', ',')}
                    </p>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                        <button onclick="alterarQuantidade(${index}, -1)" style="background: #222; color: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                        <span style="font-size: 14px;">${qtd}</span>
                        <button onclick="alterarQuantidade(${index}, 1)" style="background: #222; color: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                    </div>
                </div>
                <button onclick="removerDoCarrinho(${index})" style="background: transparent; border: none; color: var(--brand-red, #e60000); cursor: pointer; font-size: 18px;" title="Remover Peça">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    container.innerHTML = html;
    totalContainer.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function abrirSidebar() {
    document.getElementById('carrinho-sidebar').classList.add('aberto');
    document.getElementById('carrinho-overlay').style.display = 'block';
}

function fecharCarrinhos() {
    document.getElementById('carrinho-sidebar').classList.remove('aberto');
    document.getElementById('carrinho-overlay').style.display = 'none';
}

// ==========================================
// API: CHECKOUT
// ==========================================
async function finalizarPedido() {
    if (itensCarrinho.length === 0) {
        mostrarNotificacao("O seu carrinho está vazio.", "erro");
        return;
    }

    const usuarioJSON = localStorage.getItem('usuarioLogado');

    if (!usuarioJSON) {
        mostrarNotificacao("Faça login para finalizar a encomenda.", "erro");
        window.location.href = 'login.html';
        return; 
    }

    const usuarioLogado = JSON.parse(usuarioJSON);
    let total = 0;
    const mapaItens = {};

    itensCarrinho.forEach(item => {
        const qtd = item.quantidade || 1;
        total += (item.preco * qtd);
        
        if (mapaItens[item.id]) {
            mapaItens[item.id].quantidade += qtd;
        } else {
            mapaItens[item.id] = { 
                produtoId: item.id, 
                quantidade: qtd, 
                precoUnitario: item.preco 
            };
        }
    });

    const itensFormatados = Object.values(mapaItens);

    const payload = {
        clienteId: usuarioLogado.id, 
        valorTotal: total,
        itens: itensFormatados
    };

    try {
        const resposta = await fetch('http://localhost:8080/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (resposta.ok) {
            mostrarNotificacao("🚀 Encomenda finalizada com sucesso!", "sucesso"); 
            itensCarrinho = []; 
            localStorage.setItem('carrinhoMonkeys', JSON.stringify(itensCarrinho));
            renderizarCarrinho(); 
            fecharCarrinhos();
        } else {
            mostrarNotificacao("⚠️ Falha ao processar encomenda.", "erro");
        }
    } catch (erro) {
        console.error(erro);
        mostrarNotificacao("❌ Erro de conexão com o Servidor.", "erro");
    }
}