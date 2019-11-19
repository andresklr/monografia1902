var svg;
var medidas_svg;
var largura_svg;
var altura_svg;

function svg_firstNode() {
    var ponteiro = svg.plain("a->prim");
    ponteiro.move(xinicial, yinicial - larguraNo, true);
    ponteiro.node.style.fontSize = fontsize;

    var ponteiroDimensions = document.getElementById(ponteiro.node.id).getBoundingClientRect();

    var heightPonteiro = ponteiroDimensions.height;
    var widthPonteiro = ponteiroDimensions.width;

    var x1 = xinicial + widthPonteiro / 2;
    var x2 = x1;
    var y1 = yinicial - larguraNo + heightPonteiro;
    var y2 = yinicial;

    var linha = svg.line(x1, y1, x2, y2);
    linha.stroke('#000000');

    var nullTitle = svg.plain("NULL");
    nullTitle.move(xinicial, yinicial, true);
    nullTitle.node.style.fontSize = fontsize;

    var result = {
        ponteiro: { ponteiro: ponteiro, height: heightPonteiro, width: widthPonteiro }, linha: linha, nullTitle: nullTitle
    };

    return result;

}

function svg_criarGraficos(x, y, valor) {
    var circulo = svg.circle(larguraNo);
    circulo.fill('#FFFFFF');
    circulo.stroke('#000000');

    var numero = svg.plain(valor);
    numero.node.style.fontSize = fontsize;

    y += larguraNo;

    var x2l = x - (larguraNo);
    var x2r = x + (larguraNo * 1.5);
    var y2 = y + (larguraNo * 0.866);

    var result = {
        circulo: circulo, numero: numero, linha_esq: null, linha_dir: null, null_esq: null, null_dir: null, directions: { x1: x, y1: y, x2l: x2l, x2r: x2r, y2: y2 }
    };

    return result;
}

function svg_mover_arvore(h, animate) {
    h--;
    var haux = h * espacamento;
    var x1 = xinicial;
    var y1 = yinicial - (larguraNo * haux);
    var y2 = y1 + larguraNo * 1.3;
    var x2l = xinicial + (larguraNo * haux * -1);
    var x2r = xinicial + (larguraNo * haux);

    arvore.raiz.svg_nopont.directions.x1 = x1;
    arvore.raiz.svg_nopont.directions.y1 = y1;
    arvore.raiz.svg_nopont.directions.y2 = y2;
    arvore.raiz.svg_nopont.directions.x2l = x2l;
    arvore.raiz.svg_nopont.directions.x2r = x2r;

    arvore.svg_arvpont.ponteiro.ponteiro.animate(animate === true ? velocidade : 1).move(x1, y1 - larguraNo, animate);
    arvore.svg_arvpont.linha.animate(animate === true ? velocidade : 1).move(x1 + arvore.svg_arvpont.ponteiro.width / 2, y1 - larguraNo + arvore.svg_arvpont.ponteiro.height, animate);

    remove(arvore.svg_arvpont.nullTitle);
    arvore.svg_arvpont.nullTitle = null;

    move(arvore.raiz, animate);

    svg_mover_no(arvore.raiz.no_esquerda, h, x2l, y2, 'E', animate);
    svg_mover_no(arvore.raiz.no_direita, h, x2r, y2, 'D', animate);
}

function remove(element) {
    try {
        var id = element.node.id;
        $('#' + id).remove();
    }
    catch{ null; }

}

function svg_Substituir_No(No, NoDestino, cascata) {

}

function svg_removeSvgs(No, cascata) {
    if (No !== null) {
        remove(No.svg_nopont.circulo);
        remove(No.svg_nopont.numero);
        remove(No.svg_nopont.linha_esq);
        remove(No.svg_nopont.linha_dir);
        remove(No.svg_nopont.null_esq);
        remove(No.svg_nopont.null_dir);
        if (cascata === true) {
            svg_removeSvgs(No.no_esquerda, true);
            svg_removeSvgs(No.no_direita, true);
        }
    }
}

function fadeIn(object, speed) {
    $('#' + object.node.id).addClass("svgOp").css("animation-duration", ((speed * 1.1) / 1000) + "s");
}

function move(No, animate) {

    var speed = animate === true ? velocidade : 1;

    var directions = No.svg_nopont.directions;
    No.svg_nopont.circulo.animate(speed).move(directions.x1, directions.y1);

    var numeroDimensions = document.getElementById(No.svg_nopont.numero.node.id).getBoundingClientRect();

    var heightNumero = numeroDimensions.height;
    var widthNumero = numeroDimensions.width;

    var tx = directions.x1 + ((larguraNo - widthNumero) / 2);
    var ty = directions.y1 + ((larguraNo - heightNumero) / 2);

    No.svg_nopont.numero.animate(speed).move(tx, ty);

    remove(No.svg_nopont.linha_dir);
    remove(No.svg_nopont.linha_esq);

    var lx2l = directions.x2l + larguraNo / 2;
    var lx2r = directions.x2r + larguraNo / 2;
    var ly2 = directions.y2;

    var linhaesq = svg.line(directions.x1, directions.y1 + larguraNo, lx2l, ly2);
    linhaesq.stroke('#000000');
    fadeIn(linhaesq, speed);
    No.svg_nopont.linha_esq = linhaesq;

    var linhadir = svg.line(directions.x1 + larguraNo, directions.y1 + larguraNo, lx2r, ly2);
    linhadir.stroke('#000000');
    fadeIn(linhadir, speed);
    No.svg_nopont.linha_dir = linhadir;

    remove(No.svg_nopont.null_esq);
    No.svg_nopont.null_esq = null;

    if (No.no_esquerda === null) {
        No.svg_nopont.null_esq = svg.plain("NULL");
        No.svg_nopont.null_esq.node.style.fontSize = fontsize * 0.8;
        No.svg_nopont.null_esq.move(lx2l, ly2, animate);
        No.svg_nopont.null_esq.rotate(90, lx2l, ly2);
        fadeIn(No.svg_nopont.null_esq, speed * 1.75);
    }

    remove(No.svg_nopont.null_dir);
    No.svg_nopont.null_dir = null;

    if (No.no_direita === null) {
        No.svg_nopont.null_dir = svg.plain("NULL");
        No.svg_nopont.null_dir.node.style.fontSize = fontsize * 0.8;
        No.svg_nopont.null_dir.move(lx2r, ly2, animate);
        No.svg_nopont.null_dir.rotate(90, lx2r, ly2);
        fadeIn(No.svg_nopont.null_dir, speed * 1.75);
    }
}

function svg_paint_no(No, classe, cascate) {
    if (No !== null) {
        No.svg_nopont.circulo.removeClass().addClass(classe);
        //No.svg_nopont.numero.removeClass().addClass(classe);
    }
    if (cascate === true) {
        svg_paint_no(No.no_esquerda, classe, true);
        svg_paint_no(No.no_direita, classe, true);
    }
}

function svg_mover_no(No, h, x1, y1, fronteira, animate) {
    if (No !== null) {
        h--;
        var distfronteira = h * espacamento;
        var distnormal = h * 0.5 * espacamento;

        var x2l = x1 + (larguraNo * (fronteira === 'E' ? distfronteira : distnormal) * -1);
        var x2r = x1 + (larguraNo * (fronteira === 'D' ? distfronteira : distnormal));
        var y2 = y1 + larguraNo * 1.3;

        No.svg_nopont.directions.x1 = x1;
        No.svg_nopont.directions.y1 = y1;
        No.svg_nopont.directions.y2 = y2;
        No.svg_nopont.directions.x2l = x2l;
        No.svg_nopont.directions.x2r = x2r;

        move(No, animate);

        svg_mover_no(No.no_esquerda, h, x2l, y2, fronteira === 'E' ? 'E' : 'N', animate);
        svg_mover_no(No.no_direita, h, x2r, y2, fronteira === 'D' ? 'D' : 'N', animate);
    }

}