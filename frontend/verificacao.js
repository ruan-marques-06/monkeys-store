// Pega o e-mail que passaremos pela URL (ex: verificacao.html?email=teste@gmail.com)
const urlParams = new URLSearchParams(window.location.search);
const emailDoCliente = urlParams.get('email');

// Se alguém tentar acessar a tela direto sem ter um e-mail na URL, manda de volta pro cadastro
if (!emailDoCliente) {
    window.location.href = 'cadastro.html';
}

document.getElementById('form-verificacao').addEventListener('submit', async function(event) {
    event.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const botao = event.target.querySelector('button');

    botao.textContent = 'Verificando...';
    botao.disabled = true;

    try {
        const resposta = await fetch('http://localhost:8080/api/usuarios/verificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Mandamos o DTO exatamente como o Java espera: email e codigo
            body: JSON.stringify({ email: emailDoCliente, codigo: codigo }) 
        });

        if (resposta.ok) {
            alert('Conta ativada com sucesso! Você já pode fazer login e aproveitar a loja.');
            // Tudo certo! Redireciona para a tela de login
            window.location.href = 'login.html'; 
        } else {
            const mensagemErro = await resposta.text();
            alert('Erro: ' + mensagemErro);
            botao.textContent = 'Verificar Código';
            botao.disabled = false;
        }
    } catch (erro) {
        console.error('Erro ao conectar:', erro);
        alert('Erro de conexão com o servidor.');
        botao.textContent = 'Verificar Código';
        botao.disabled = false;
    }
});