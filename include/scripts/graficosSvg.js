var svg;
var medidas_svg;
var largura_svg;
var altura_svg;

function svg_criarGraficos(x, y) {
    var circulo = svg.circle(larguraNo);
    circulo.fill('#FFFFFF');
    circulo.stroke('#000000');
    //circulo.animate(1000).move(x, y); 

    y += larguraNo;

    var x2l = x - (larguraNo);
    var x2r = x + (larguraNo * 1.5);
    var y2 = y + (larguraNo * 0.866);

    var linhaesq = svg.line(x, y, x2l, y2);
    linhaesq.stroke('#000000');

    var linhadir = svg.line(x + larguraNo, y, x2r + larguraNo, y2);
    linhadir.stroke('#000000');
    //linhadir.animate(1000).move(0, 0, x2l, y2);

    var result = {
        circulo: circulo, linha_esq: linhaesq, linha_dir: linhadir, directions: { x1: x, y1: y, x2l: x2l, x2r: x2r, y2: y2 }
    };

    return result;
}

function svg_mover_arvore(h) {
    var haux = h / 2;
    var x1 = xinicial;
    var y1 = yinicial - (larguraNo * haux);
    var y2 = y1 + larguraNo;
    h--;
    var x2l = xinicial + (larguraNo * haux * -1);
    var x2r = xinicial + (larguraNo * haux);

    arvore.raiz.svg_nopont.directions.x1 = x1;
    arvore.raiz.svg_nopont.directions.y1 = y1;
    arvore.raiz.svg_nopont.directions.y2 = y2;
    arvore.raiz.svg_nopont.directions.x2l = x2l;
    arvore.raiz.svg_nopont.directions.x2r = x2r;

    move(arvore.raiz);

    svg_mover_no(arvore.raiz.no_esquerda, h--, x2l, y2);
    svg_mover_no(arvore.raiz.no_direita, h--, x2r, y2);
}

function move(No) {
    var directions = No.svg_nopont.directions;
    No.svg_nopont.circulo.animate(1000).move(directions.x1, directions.y1);

    No.svg_nopont.linha_esq.x1 = directions.x1;
    No.svg_nopont.linha_esq.y1 = directions.y1;
    No.svg_nopont.linha_esq.x2 = directions.x2;
    No.svg_nopont.linha_esq.y2 = directions.y2;

    var id = No.svg_nopont.linha_dir.node.id;
    $('#' + id).remove();
    id = No.svg_nopont.linha_esq.node.id;
    $('#' + id).remove();

    var linhaesq = svg.line(directions.x1,directions.y1,directions.x2l,directions.y2);
    linhaesq.stroke('#000000');
    No.svg_nopont.linha_esq = linhaesq;

    var linhadir = svg.line(directions.x1, directions.y1, directions.x2r, directions.y2);
    linhadir.stroke('#000000');
    No.svg_nopont.linha_dir = linhadir;
    //No.svg_nopont.linha_esq.animate(1000).move(directions.x1 - larguraNo, directions.y1 + larguraNo, directions.x2l, directions.y2 + larguraNo);
    //No.svg_nopont.linha_dir.animate(1000).move(directions.x1 + larguraNo, directions.y1 + larguraNo, directions.x2r, directions.y2 + larguraNo);
}

function svg_mover_no(No, h, x1, y1) {
    if (No !== null) {
        var haux = h / 2;

        var x2l = x1 + (larguraNo * haux * -1);
        var x2r = x1 + (larguraNo * haux);
        var y2 = y1 + larguraNo;

        No.svg_nopont.directions.x1 = x1;
        No.svg_nopont.directions.y1 = y1;
        No.svg_nopont.directions.y2 = y2;
        No.svg_nopont.directions.x2l = x2l;
        No.svg_nopont.directions.x2r = x2r;

        move(No);

        svg_mover_no(No.no_esquerda, h--, x2l, y2);
        svg_mover_no(No.no_direita, h--, x2r, y2);
    }

}