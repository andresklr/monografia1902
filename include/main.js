$(document).ready(
    function () {
        svg = SVG('lista');
        medidas_svg = document.getElementById('lista').getBoundingClientRect();
        largura_svg = medidas_svg.width;
        altura_svg = medidas_svg.height;
        /*seta_preta = svg.marker(5, 5, function (add) {
            add.path('M0 0 L5 2 L0 5').fill('#000');
        }); */

        var x1 = largura_svg / 2;
        var x2 = largura_svg / 2 + (larguraNo * 0.25);
        var y1 = altura_svg / 2;
        var y2 = altura_svg / 2 - larguraNo;

        b_bloquearBotoes();
        $('#criar').removeAttr('disabled');
        var circulo = svg.circle(50);
        circulo.fill('#FFFFFF');
        circulo.stroke('#000000');
        circulo.animate(1000).move(x1,y1);
        circulo.attr('stroke-width', '2');

        var arv_pont = svg.plain('a->');
        arv_pont.move(x2,y2);

        var line = svg.line(x1, y1, x2, y2);
        line.stroke('#000000');
        line.attr('stroke-width','2');
    }
);