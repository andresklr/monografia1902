$(document).ready(
    function () {
        set_ddl();
        b_Toggle_Columns();
        main_initiate();
    }
);

function main_initiate() {    
    $('#lista').empty();
    svg = SVG('lista');
    medidas_svg = document.getElementById('lista').getBoundingClientRect();
    largura_svg = medidas_svg.width;
    altura_svg = medidas_svg.height;

    xinicial = (largura_svg - larguraNo) / 2;
    yinicial = altura_svg * 0.15;

    b_bloquearBotoes();
    $('#criar').removeAttr('disabled');

    $('#log').empty();
    tipo_arvore = $('#tipo-lista').val();
}

function set_ddl() {    
    var url = new URL(window.location.href);
    try {
        var o = url.searchParams.get("tipo");
        $('#tipo-lista').val(o);
    }
    catch{
        1;
    }
}