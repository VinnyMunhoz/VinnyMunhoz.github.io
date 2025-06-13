const imagens = ['imagens/asicsgel.webp', 'imagens/asicsgel2.webp', 'imagens/asicsgel3.webp', 'imagens/asicsgel4.webp', 'imagens/asicsgel5.webp'];
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