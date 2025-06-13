const imagens = ['imagens/1130.webp', 'imagens/11301.webp', 'imagens/11302.webp', 'imagens/11303.webp', 'imagens/11304.webp'];
let indiceAtual = 0;

function trocarImagem(direcao) {
    indiceAtual += direcao;
    if (indiceAtual < 0) indiceAtual = imagens.length - 1;
    if (indiceAtual >= imagens.length) indiceAtual = 0;
    document.getElementById('main-image').src = imagens[indiceAtual];
}

function selecionarImagem(indice) {
    indiceAtual = indice;
    document.getElementById('main-image').src = imagens[indiceAtual];
}