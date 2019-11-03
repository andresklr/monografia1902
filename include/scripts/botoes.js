function b_criar_click() {
    arvore = e_Arvore();
    b_desbloquearBotoes();
}

function b_pesquisar_click() {
    var valorBusca = parseInt(prompt('Selecione o valor a pesquisar:', '0'));
    if (isNaN(valorBusca)) {
        alert('Não foi inserido um valor corretamente');
    }
    else {
        if (e_BuscaArvore(valorBusca, false) === true) {
            alert('Sucesso! Foi encontrado!');
        }
        else {
            alert('Não foi encontrado');
        }
    }
}

function b_imprimir_click() {
    console.log('RED');
    e_Imprimir_RED(arvore.raiz);
    console.log('ERD');
    e_Imprimir_ERD(arvore.raiz);
    console.log('EDR');
    e_Imprimir_EDR(arvore.raiz);
}

function b_gerar_click() {
    ListaAleatoria(maxItems);    
    /*e_BuscaArvore(4, true);
    e_BuscaArvore(2, true);
    e_BuscaArvore(6, true);
    e_BuscaArvore(1, true);
    e_BuscaArvore(3, true);
    e_BuscaArvore(5, true);
    e_BuscaArvore(7, true);*/
}


function ListaAleatoria(quantity) {
    var numbers = [];
    while (quantity > 0) {
        var n = Math.floor((Math.random() * 1000) + 1);
        if (numbers.includes(n) === false) {
            e_BuscaArvore(n,true);
            numbers.push(n);
            quantity--;
        }        
    }
    alert(numbers);
}

function b_bloquearBotoes() {
    $('#adicionar').attr('disabled', 'disabled');
    $('#remover').attr('disabled', 'disabled');
    $('#pesquisar').attr('disabled', 'disabled');
    $('#gerar').attr('disabled', 'disabled');
    $('#limpar').attr('disabled', 'disabled');
    $('#imprimir').attr('disabled', 'disabled');
}

function b_desbloquearBotoes() {
    $('#adicionar').removeAttr('disabled');
    $('#remover').removeAttr('disabled');
    $('#pesquisar').removeAttr('disabled');
    $('#gerar').removeAttr('disabled');
    $('#limpar').removeAttr('disabled');
    $('#imprimir').removeAttr('disabled');
}