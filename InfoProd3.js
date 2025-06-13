const imagens = ['imagens/cortez-1.webp', 'imagens/cortez-2.webp', 'imagens/cortez-4.webp', 'imagens/cortez-3.webp', 'imagens/cortez-5.webp'];
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