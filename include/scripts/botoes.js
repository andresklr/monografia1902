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
            alert('N�o foi encontrado');
        }
    }
}

async function b_altura_click() {    
    await e_Calcular_Balanceamento(arvore.raiz, true);    
    await svg_limparCores();
    var h = await e_Altura_Arvore(arvore.raiz, 0, true); 
    await sleep(velocidade);
    if (h === undefined) {
        h = 0;
    }
    alert('A altura da �rvore �: ' + h);
}

async function b_remover_click() {    
    var valorBusca = valor_Usuario();
    if (!isNaN(valorBusca)) {
        if (await e_BuscaArvore(valorBusca, 'R') === true) {
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

async function b_adicionar_click() {    
    var valorBusca = valor_Usuario();
    if (!isNaN(valorBusca)) {
        if (await e_BuscaArvore(valorBusca, 'I') === true) {
            alert('O valor n�o foi inserido, ele j� existe na �rvore!');
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
        alert('N�o foi inserido um valor corretamente');
    }
    return valorBusca;
}

function b_logIndex(message, novalinha) {
    $('#log').append((novalinha === true ? "<br/>" : "") + message);
}

async function b_imprimir_click() {
    await svg_limparCores(); 
    b_logIndex("Impress�o RED (Pr�-Ordem)",true);    
    await e_Imprimir_RED(arvore.raiz);    
    await sleep(velocidade);
    await svg_limparCores();   
    b_logIndex("Impress�o ERD (Em-Ordem)",true);
    await e_Imprimir_ERD(arvore.raiz);
    await sleep(velocidade);
    await svg_limparCores();   
    b_logIndex("Impress�o EDR (P�s-Ordem)",true);
    await e_Imprimir_EDR(arvore.raiz);
}

function b_mudararvore_click() {
    main_initiate();
}

async function b_gerar_click() {      
    criar_arvore();
    //await ListaAleatoria(maxItems);      
    await e_BuscaArvore(50, 'I');    
    await e_BuscaArvore(40, 'I');
    await e_BuscaArvore(99, 'I');
    await e_BuscaArvore(30, 'I');
    await e_BuscaArvore(45, 'I');
    await e_BuscaArvore(25, 'I');
    await e_BuscaArvore(35, 'I');
    await e_BuscaArvore(5, 'I');
    await e_BuscaArvore(32, 'I');
    await e_BuscaArvore(38, 'I');
    await e_BuscaArvore(36, 'I');
        
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