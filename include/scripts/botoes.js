function b_criar_click() {
    arvore = e_Arvore();
    b_desbloquearBotoes();
    $('#remover').attr('disabled', 'disabled');
    $('#imprimir').attr('disabled', 'disabled');
}

function b_pesquisar_click() {
    var valorBusca = valor_Usuario();
    if (!isNaN(valor_Usuario())) {
        if (e_BuscaArvore(valorBusca, 'P') === true) {
            alert('Sucesso! Foi encontrado!');
        }
        else {
            alert('Não foi encontrado');
        }
    }
}

function b_remover_click() {
    var valorBusca = valor_Usuario();
    if (!isNaN(valorBusca)) {
        if (e_BuscaArvore(valorBusca, 'R') === true) {
            alert('O valor foi removido com sucesso!');
        }
        else {
            alert('O valor não foi removido, ele não existe na árvore!');
        }
    }
    if (arvore.raiz === null) {
        $('#remover').attr('disabled', 'disabled');
        $('#imprimir').attr('disabled', 'disabled');
    }
}

function b_adicionar_click() {
    var valorBusca = valor_Usuario();
    if (!isNaN(valorBusca)) {
        if (e_BuscaArvore(valorBusca, 'I') === true) {
            alert('O valor não foi inserido, ele já existe na árvore!');
        }
        else {
            alert('O valor foi inserido com sucesso!');
            b_desbloquearBotoes();
        }
    }
}

function b_limpar_click() {
    arvore = e_Arvore();
    $('#remover').attr('disabled', 'disabled');
    $('#imprimir').attr('disabled', 'disabled');
    console.clear();
}

function valor_Usuario() {
    var valorBusca = parseInt(prompt('Selecione o valor a pesquisar:', '0'));
    if (isNaN(valorBusca)) {
        alert('Não foi inserido um valor corretamente');
    }
    return valorBusca;
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
    arvore = e_Arvore();
    ListaAleatoria(maxItems);      
    /*e_BuscaArvore(4, 'I');
    e_BuscaArvore(2, 'I');
    e_BuscaArvore(6, 'I');
    e_BuscaArvore(1, 'I');
    e_BuscaArvore(3, 'I');
    e_BuscaArvore(5, 'I');
    e_BuscaArvore(7, 'I');*/
    b_desbloquearBotoes();
    alert('A altura da árvore é: ' + e_Altura_Arvore(arvore.raiz,0));
}


function ListaAleatoria(quantity) {
    var numbers = [];
    while (quantity > 0) {
        var n = Math.floor((Math.random() * 1000) + 1);
        if (numbers.includes(n) === false) {
            e_BuscaArvore(n, 'I');
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