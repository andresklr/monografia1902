var arvore;
var maxItems = 20;
var larguraNo = 30;
var xinicial;
var yinicial;
var espacamento = 0.65;
var velocidade = 1;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}