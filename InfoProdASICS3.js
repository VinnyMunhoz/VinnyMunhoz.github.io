const imagens = ['imagens/24.jpg', 'imagens/25.jpg', 'imagens/26.jpg', 'imagens/27.jpg', 'imagens/28.jpg'];
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