function b_criar_click() {
    criar_arvore();
}

function criar_arvore() {
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
            alert('N�o foi encontrado');
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
            alert('O valor n�o foi removido, ele n�o existe na �rvore!');
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
            alert('O valor n�o foi inserido, ele j� existe na �rvore!');
        }
        else {
            alert('O valor foi inserido com sucesso!');
            b_desbloquearBotoes();
        }
    }
}

function b_limpar_click() {
    main_initiate();
    criar_arvore();
    console.clear();
}

function valor_Usuario() {
    var valorBusca = parseInt(prompt('Selecione o valor a pesquisar:', '0'));
    if (isNaN(valorBusca)) {
        alert('N�o foi inserido um valor corretamente');
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
    main_initiate();
    criar_arvore();
    //ListaAleatoria(maxItems);      
    e_BuscaArvore(10, 'I');
    e_BuscaArvore(5, 'I');
    e_BuscaArvore(15, 'I');
    e_BuscaArvore(3, 'I');
    e_BuscaArvore(7, 'I');
    e_BuscaArvore(2, 'I');
    e_BuscaArvore(4, 'I');
    e_BuscaArvore(6, 'I');
    e_BuscaArvore(8, 'I');
    e_BuscaArvore(13, 'I');
    e_BuscaArvore(18, 'I');
    e_BuscaArvore(12, 'I');
    e_BuscaArvore(14, 'I');
    e_BuscaArvore(16, 'I');
    e_BuscaArvore(19, 'I');
    b_desbloquearBotoes();    
}


function ListaAleatoria(quantity) {
    var numbers = [];
    while (quantity > 0) {
        var n = Math.floor((Math.random() * maxItems) + 1);
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