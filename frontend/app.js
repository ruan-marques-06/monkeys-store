document.addEventListener('DOMContentLoaded', carregarVitrine);

// Memória temporária do carrinho
let itensCarrinho = [];

// Busca os produtos na API e desenha a vitrine
async function carregarVitrine() {
    const grid = document.querySelector('.product-grid');
    grid.innerHTML = '<p style="text-align: center; width: 100%;">Carregando roupas...</p>';

    try {
        const resposta = await fetch('http://localhost:8080/api/produtos');
        
        if (!resposta.ok) throw new Error('Falha ao comunicar com o servidor');
        
        const produtos = await resposta.json();
        grid.innerHTML = ''; 

        produtos.forEach(produto => {
            const card = `
                <article class="card">
                    <div class="image-wrapper">
                        <img src="${produto.imagemUrl || 'img/placeholder.png'}" alt="${produto.nome}">
                    </div>
                    <div class="card-info">
                        <h2 class="title">${produto.nome}</h2>
                        <span class="price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        <!-- Botão atualizado para enviar os dados do produto para o carrinho -->
                        <button class="btn-cart" onclick="adicionarAoCarrinho(${produto.id}, '${produto.nome}', ${produto.preco}, '${produto.imagemUrl}')">
                            ADICIONAR AO CARRINHO
                        </button>
                    </div>
                </article>
            `;
            grid.innerHTML += card;
        });

    } catch (erro) {
        console.error(erro);
        grid.innerHTML = '<p style="color: var(--btn-red); text-align: center; width: 100%;">Erro ao carregar o catálogo. O backend está rodando?</p>';
    }
}

// Adiciona o item na lista e abre a barra lateral
function adicionarAoCarrinho(id, nome, preco, imagem) {
    itensCarrinho.push({ id, nome, preco, imagem });
    renderizarCarrinho();
    abrirSidebar();
}

// Desenha os itens dentro da barra lateral e soma o total
function renderizarCarrinho() {
    let html = '';
    let total = 0;

    if (itensCarrinho.length === 0) {
        document.getElementById('itens-sidebar').innerHTML = '<p style="text-align:center; color:gray; margin-top: 20px;">O seu carrinho está vazio.</p>';
        document.getElementById('total-sidebar').innerText = 'R$ 0,00';
        return;
    }

    itensCarrinho.forEach((item, index) => {
        total += item.preco;
        html += `
            <div class="item-carrinho">
                <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='img/placeholder.png'">
                <div style="flex-grow: 1;">
                    <p style="margin: 0; font-size: 14px;">${item.nome}</p>
                    <p style="margin: 5px 0 0; color: var(--price-green); font-weight: bold;">
                        R$ ${item.preco.toFixed(2).replace('.', ',')}
                    </p>
                </div>
                <button onclick="removerDoCarrinho(${index})" style="background: transparent; border: none; color: var(--btn-red); cursor: pointer; font-size: 16px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    document.getElementById('itens-sidebar').innerHTML = html;
    document.getElementById('total-sidebar').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Remove o item e atualiza o visual da barra
function removerDoCarrinho(index) {
    itensCarrinho.splice(index, 1);
    renderizarCarrinho();
}

// Abre a barra lateral
function abrirSidebar() {
    document.getElementById('carrinho-sidebar').classList.add('aberto');
    document.getElementById('carrinho-overlay').style.display = 'block';
}

// Fecha a barra lateral
function fecharCarrinhos() {
    document.getElementById('carrinho-sidebar').classList.remove('aberto');
    document.getElementById('carrinho-overlay').style.display = 'none';
}

async function finalizarPedido() {
    if (itensCarrinho.length === 0) {
        alert("O seu carrinho está vazio.");
        return;
    }

    // Calcula o total e formata os itens para o Java
    let total = 0;
    const itensFormatados = itensCarrinho.map(item => {
        total += item.preco;
        return {
            produtoId: item.id,
            quantidade: 1, // Por padrão, 1 unidade de cada clique
            precoUnitario: item.preco
        };
    });

    const payload = {
        clienteId: 1, // ID provisório para evitar o erro de 'nullable = false'
        valorTotal: total,
        itens: itensFormatados
    };

    try {
        const resposta = await fetch('http://localhost:8080/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (resposta.ok) {
            alert("Encomenda finalizada com sucesso!");
            itensCarrinho = []; // Limpa o carrinho
            renderizarCarrinho(); // Atualiza a tela
            fecharCarrinhos();
        } else {
            alert("Falha ao processar encomenda.");
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro de conexão com o servidor.");
    }
}