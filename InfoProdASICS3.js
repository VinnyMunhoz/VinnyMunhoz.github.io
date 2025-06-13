const imagens = ['imagens/kayano14.webp', 'imagens/kayano142.webp', 'imagens/kayano143.webp', 'imagens/kayano144.webp', 'imagens/kayano145.webp'];
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