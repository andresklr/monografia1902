function b_criar_click() {
    criar_arvore();
}

function criar_arvore() {
    main_initiate();    
    arvore = e_Arvore();
    b_desbloquearBotoes();
    $('#remover').attr('disabled', 'disabled');
    $('#imprimir').attr('disabled', 'disabled');
}

async function b_pesquisar_click() {    
    var valorBusca = valor_Usuario();
    if (!isNaN(valorBusca)) {        
        if (await e_BuscaArvore(valorBusca, 'P') === true) {
            alert('Sucesso! Foi encontrado!');
        }
        else {
            alert('Não foi encontrado');
        }
    }
}

function b_altura_click() {
    svg_paint_no(arvore.raiz, 'noNormal', true,false);
    var h = e_Altura_Arvore(arvore.raiz, 0);
    if (h === undefined) {
        h = 0;
    }
    alert('A altura da árvore é: ' + h);
}

async function b_remover_click() {    
    var valorBusca = valor_Usuario();
    if (!isNaN(valorBusca)) {
        if (await e_BuscaArvore(valorBusca, 'R') === true) {
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

async function b_adicionar_click() {    
    var valorBusca = valor_Usuario();
    if (!isNaN(valorBusca)) {
        if (await e_BuscaArvore(valorBusca, 'I') === true) {
            alert('O valor não foi inserido, ele já existe na árvore!');
        }
        else {
            //alert('O valor foi inserido com sucesso!');
            b_desbloquearBotoes();
        }
    }
}

function b_limpar_click() {    
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
    criar_arvore();
    //await ListaAleatoria(maxItems);      
    await e_BuscaArvore(50, 'I');
    //await sleep(velocidade);
    await e_BuscaArvore(40, 'I');
    //await sleep(velocidade);
    await e_BuscaArvore(99, 'I');
    //await sleep(velocidade);
    await e_BuscaArvore(30, 'I');
    //await sleep(velocidade);
    await e_BuscaArvore(45, 'I');
    //await sleep(velocidade);
    await e_BuscaArvore(25, 'I');
    //await sleep(velocidade);
    await e_BuscaArvore(35, 'I');
    //await sleep(velocidade);
    await e_BuscaArvore(5, 'I');
    //await sleep(velocidade);
    await e_BuscaArvore(32, 'I');
    //await sleep(velocidade);
    await e_BuscaArvore(38, 'I');
    //await sleep(velocidade);
    await e_BuscaArvore(36, 'I');
    //await sleep(velocidade);    
    b_desbloquearBotoes();    
}


async function ListaAleatoria(quantity) {
    var numbers = [];
    while (quantity > 0) {
        var n = Math.floor((Math.random() * maxItems) + 1);
        if (numbers.includes(n) === false) {
            await e_BuscaArvore(n, 'I');
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