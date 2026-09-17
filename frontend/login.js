document.getElementById('form-login').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que a página recarregue

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const botao = event.target.querySelector('button');

    // Feedback visual de carregamento
    botao.textContent = 'Carregando...';
    botao.disabled = true;

    try {
        // Envia os dados para a nossa API Spring Boot
        const resposta = await fetch('http://localhost:8080/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (resposta.ok) {
            const usuario = await resposta.json();

            // Salva os dados no navegador para usar depois (ex: mostrar "Olá, Nome")
            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

            // REDIRECIONAMENTO COM BASE NA HIERARQUIA
            if (usuario.tipo === 'VENDEDOR' || usuario.tipo === 'PROPRIETARIO') {
                window.location.href = 'painel.html'; // Vai para a área da Equipe
            } else {
                window.location.href = 'index.html'; // Vai para a loja pública
            }

        } else {
            alert('E-mail ou senha incorretos!');
            botao.textContent = 'Entrar';
            botao.disabled = false;
        }
    } catch (erro) {
        console.error('Erro ao conectar com a API:', erro);
        alert('Servidor fora do ar. Tente novamente mais tarde.');
        botao.textContent = 'Entrar';
        botao.disabled = false;
    }
});