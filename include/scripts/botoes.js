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
    if (!isNaN(valorBusca)) {
        if (e_BuscaArvore(valorBusca, 'P') === true) {
            alert('Sucesso! Foi encontrado!');
        }
        else {
            alert('Não foi encontrado');
        }
    }
}

function b_altura_click() {
    var h = e_Altura_Arvore(arvore.raiz, 0);
    if (h === undefined) {
        h = 0;
    }
    alert('A altura da árvore é: ' + h);
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
            //alert('O valor foi inserido com sucesso!');
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
        alert('Não foi inserido um valor corretamente');
    }
    return valorBusca;
}

function b_logIndex(message, novalinha) {
    $('#log').append((novalinha === true ? "<br/>" : "") + message);
}

function b_imprimir_click() {
    b_logIndex("Impressão RED (Pré-Ordem)",true);    
    e_Imprimir_RED(arvore.raiz);    
    b_logIndex("Impressão ERD (Em-Ordem)",true);
    e_Imprimir_ERD(arvore.raiz);
    b_logIndex("Impressão EDR (Pós-Ordem)",true);
    e_Imprimir_EDR(arvore.raiz);
}

async function b_gerar_click() {
    main_initiate();
    criar_arvore();
    //ListaAleatoria(maxItems);      
    e_BuscaArvore(10, 'I');
    await sleep(velocidade);
    e_BuscaArvore(5, 'I');
    await sleep(velocidade);
    e_BuscaArvore(15, 'I');
    await sleep(velocidade);
    e_BuscaArvore(3, 'I');
    await sleep(velocidade);
    e_BuscaArvore(7, 'I');
    await sleep(velocidade);
    e_BuscaArvore(2, 'I');
    await sleep(velocidade);
    e_BuscaArvore(4, 'I');
    await sleep(velocidade);
    e_BuscaArvore(6, 'I');
    await sleep(velocidade);
    e_BuscaArvore(8, 'I');
    await sleep(velocidade);
    e_BuscaArvore(13, 'I');
    await sleep(velocidade);
    e_BuscaArvore(18, 'I');
    await sleep(velocidade);
    e_BuscaArvore(12, 'I');
    await sleep(velocidade);
    e_BuscaArvore(14, 'I');
    await sleep(velocidade);
    e_BuscaArvore(16, 'I');
    await sleep(velocidade);
    e_BuscaArvore(19, 'I');
    await sleep(velocidade);
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
    $('#altura').attr('disabled', 'disabled');
    $('#remover').attr('disabled', 'disabled');
    $('#pesquisar').attr('disabled', 'disabled');
    $('#gerar').attr('disabled', 'disabled');
    $('#limpar').attr('disabled', 'disabled');
    $('#imprimir').attr('disabled', 'disabled');
}

function b_desbloquearBotoes() {
    $('#adicionar').removeAttr('disabled');
    $('#altura').removeAttr('disabled');
    $('#remover').removeAttr('disabled');
    $('#pesquisar').removeAttr('disabled');
    $('#gerar').removeAttr('disabled');
    $('#limpar').removeAttr('disabled');
    $('#imprimir').removeAttr('disabled');
}