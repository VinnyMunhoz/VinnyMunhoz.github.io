const imagens = ['imagens/34.jpg', 'imagens/35.jpg', 'imagens/36.jpg', 'imagens/37.jpg', 'imagens/38.jpg'];
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