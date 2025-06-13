const imagens = ['imagens/air max 90.jpg', 'imagens/air max 90 - 2.jpg', 'imagens/air max 90 - 3.jpg', 'imagens/air max 90 - 4.jpg', 'imagens/air max 90 - 5.jpg'];
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