function b_criar_click() {
    criar_arvore();
}

function criar_arvore() {
    $('#acao-principal').text("");
    main_initiate();    
    arvore = e_Arvore();
    b_desbloquearBotoes();
    $('#remover').attr('disabled', 'disabled');
    $('#imprimir').attr('disabled', 'disabled');
}

async function b_pesquisar_click() {    
    var valorBusca = valor_Usuario();
    if (!isNaN(valorBusca)) {        
        var result = await e_BuscaArvore(valorBusca, 'P');
        await sleep(velocidade);
        if (result === true) {
            alert('Sucesso! Foi encontrado!');
        }
        else {
            alert('Não foi encontrado');
        }
    }
}

async function b_pause_click() {
    try {
        $('#pause').attr('disabled', 'disabled');
        $('#continue').removeAttr('disabled');
    }
    catch{ 1; }
    paused = true;
}

async function b_continue_click() {
    try {
        $('#continue').attr('disabled', 'disabled');
        $('#pause').removeAttr('disabled');
    }
    catch{ 1; }
    paused = false;
}

async function b_altura_click() {    
    await svg_limparCores();
    var h = await e_Altura_Arvore(arvore.raiz, 0, true); 
    await sleep(velocidade);
    if (h === undefined) {
        h = 0;
    }
    alert('A altura da árvore é: ' + h);
}

async function b_remover_click() {    
    var valorBusca = valor_Usuario();
    if (!isNaN(valorBusca)) {
        $('#acao-principal').text("Efetuando remocao do no...");
        if (await e_RemoverValor(valorBusca) === true) {
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
        if (await e_InserirValor(valorBusca) === true) {
            alert('O valor não foi inserido, ele já existe na árvore!');
        }
        else {                                   
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

async function b_imprimir_click() {
    await svg_limparCores(); 
    b_logIndex("Impressão RED (Pré-Ordem)",true);    
    await e_Imprimir_RED(arvore.raiz);    
    await sleep(velocidade);
    await svg_limparCores();   
    b_logIndex("Impressão ERD (Em-Ordem)",true);
    await e_Imprimir_ERD(arvore.raiz);
    await sleep(velocidade);
    await svg_limparCores();   
    b_logIndex("Impressão EDR (Pós-Ordem)",true);
    await e_Imprimir_EDR(arvore.raiz);
}

function b_mudararvore_click() {
    main_initiate();
}

async function b_gerar_click() {      
    criar_arvore();
    await ListaAleatoria(maxItems);      
    /*await e_InserirValor(40);    
    await e_InserirValor(20);
    await e_InserirValor(10);
    await e_InserirValor(25);
    await e_InserirValor(30);
    await e_InserirValor(22);
    await e_InserirValor(50);    */

    b_desbloquearBotoes();    
}


async function ListaAleatoria(quantity) {
    var numbers = [];
    while (quantity > 0) {
        var n = Math.floor((Math.random() * maxItems) + 1);
        if (numbers.includes(n) === false) {            
            await e_InserirValor(n, 'I');
            numbers.push(n);
            quantity--;
        }        
    }    
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