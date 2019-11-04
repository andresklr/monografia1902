$(document).ready(
    function () {
        svg = SVG('lista');
        medidas_svg = document.getElementById('lista').getBoundingClientRect();
        largura_svg = medidas_svg.width;
        altura_svg = medidas_svg.height;

        xinicial = (largura_svg - larguraNo) / 2;
        yinicial = altura_svg * 0.05;

        b_bloquearBotoes();
        $('#criar').removeAttr('disabled');
    }
);