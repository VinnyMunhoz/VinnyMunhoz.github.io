const imagens = ['imagens/asicsgt2160.webp', 'imagens/asicsgt21602.webp', 'imagens/asicsgt21603.webp', 'imagens/asicsgt21604.webp', 'imagens/asicsgt21605.webp'];
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