document.addEventListener('DOMContentLoaded', carregarDadosPerfil);

function carregarDadosPerfil() {
    const usuarioJSON = localStorage.getItem('usuarioLogado');

    if (!usuarioJSON) {
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(usuarioJSON);

    // Preenche os dados no HTML
    document.getElementById('perfil-nome').innerText = usuario.nome;
    document.getElementById('perfil-email').innerText = usuario.email;
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}