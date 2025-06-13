const imagens = ['imagens/Ultraboost-1.webp', 'imagens/Ultraboost-2.webp', 'imagens/Ultraboost-3.webp', 'imagens/Ultraboost-4.webp', 'imagens/Ultraboost-5.webp'];
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