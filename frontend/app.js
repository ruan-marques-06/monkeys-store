document.addEventListener('DOMContentLoaded', carregarVitrine);

async function carregarVitrine() {
    const grid = document.querySelector('.product-grid');
    grid.innerHTML = '<p style="text-align: center; width: 100%;">Carregando roupas...</p>';

    try {
        // Faz a requisição para a sua API Java
        const resposta = await fetch('http://localhost:8080/api/produtos');
        
        if (!resposta.ok) throw new Error('Falha ao comunicar com o servidor');
        
        const produtos = await resposta.json();
        grid.innerHTML = ''; // Limpa a mensagem de carregamento

        // Cria um cartão automaticamente para cada produto retornado do PostgreSQL
        produtos.forEach(produto => {
            const card = `
                <article class="card">
                    <div class="image-wrapper">
                        <!-- Puxa o caminho da imagem salvo no banco -->
                        <img src="${produto.imagemUrl || 'img/placeholder.png'}" alt="${produto.nome}">
                    </div>
                    <div class="card-info">
                        <h2 class="title">${produto.nome}</h2>
                        <span class="price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        <button class="btn-cart" onclick="adicionarAoCarrinho(${produto.id})">
                            ADICIONAR AO CARRINHO
                        </button>
                    </div>
                </article>
            `;
            grid.innerHTML += card; // Injeta o HTML na tela
        });

    } catch (erro) {
        console.error(erro);
        grid.innerHTML = '<p style="color: var(--btn-red); text-align: center; width: 100%;">Erro ao carregar o catálogo. O backend está rodando?</p>';
    }
}

function adicionarAoCarrinho(idProduto) {
    alert(`Produto ID ${idProduto} adicionado! O carrinho será implementado em breve.`);
}