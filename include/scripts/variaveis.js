var arvore;
var maxItems = 15;
var larguraNo = 30;
var xinicial;
var yinicial;
var espacamento = 0.65;
var velocidade = 400;
var fontsize = 8 + (larguraNo / 4);
var tipo_arvore;
var paused = false;

async function sleep(ms) {
    do {
        await new Promise(resolve => setTimeout(resolve, ms));
    }
    while (paused === true);        
    return;
}