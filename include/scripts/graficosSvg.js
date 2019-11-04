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

    var x2l = x - (larguraNo * 3);
    var x2r = x + (larguraNo * 3);
    var y2 = y + (larguraNo * 0.7);

    var linhaesq = svg.line(x, y, x2l, y2);
    linhaesq.stroke('#000000');

    var linhadir = svg.line(x + larguraNo, y, x2r + larguraNo, y2);
    linhadir.stroke('#000000');

    var result = { circulo: circulo ,linha_esq: linhaesq,linha_dir: linhadir,x1:x,y1:y,x2:x,y2:y};

    return result;
}