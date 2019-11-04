var svg;
var medidas_svg;
var largura_svg;
var altura_svg;

function svg_circulo(x, y) {
    var circulo = svg.circle(larguraNo);
    circulo.fill('#FFFFFF');
    circulo.stroke('#000000');
    circulo.animate(1000).move(x, y); 

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
        circulo: circulo, linha_esq: linhaesq, linha_dir: linhadir, directions : {x1:x,y1:y,x2l:x2l,x2r:x2r,y2:y2}};

    return result;
}