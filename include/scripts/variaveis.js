var arvore;
var maxItems = 15;
var larguraNo = 30;
var xinicial;
var yinicial;
var espacamento = 0.65;
var velocidade = 1;
var fontsize = 8 + (larguraNo / 4);
var tipo_arvore;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}