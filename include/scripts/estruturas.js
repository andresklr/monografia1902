function e_Arvore() {         
    return { raiz: null, altura: 0, svg_arvpont: svg_firstNode()};    
}



function e_No(valor) {
    return {
        valor: valor, no_esquerda: null,
        no_direita: null, svg_nopont:null
    };    
}

function e_graficosNo(No) {
    No.svg_nopont = svg_criarGraficos(0, 0, No.valor);
    var h = e_Altura_Arvore(arvore.raiz, 0);
    svg_mover_arvore(h+2);
}

function e_BuscaArvore(valorBusca, operacao) {
    var doDelete = {value:true};
    if (arvore.raiz === null) {
        if (operacao === 'I') {
            arvore.raiz = e_No(valorBusca);
            e_graficosNo(arvore.raiz);            
        }
        return false;
    }
    else {
        result = e_BuscaNo(arvore.raiz, valorBusca, operacao, doDelete);
        if (doDelete.value === true && operacao === 'R') {
            arvore.raiz = null;
            doDelete.value = false;
        }
        return result;        
    }
}

function e_BuscaNo(No, valorBusca, operacao, doDelete) {
    var result;
    if (No.valor === valorBusca) {
        return true;
    }
    else if (No.valor > valorBusca) {
        if (No.no_esquerda === null) {
            if (operacao === 'I') {
                No.no_esquerda = e_No(valorBusca);                
                e_graficosNo(No.no_esquerda);                
            }
            return false;
        }
        else {
            result = e_BuscaNo(No.no_esquerda, valorBusca, operacao, doDelete);
            if (doDelete.value === true && operacao === 'R') {
                No.no_esquerda = null;
                doDelete.value = false;
            }
            return result;
        }
    }
    else if (No.valor < valorBusca) {
        if (No.no_direita === null) {
            if (operacao === 'I') {
                No.no_direita = e_No(valorBusca);                
                e_graficosNo(No.no_direita);                
            }
            return false;
        }
        else {
            result = e_BuscaNo(No.no_direita, valorBusca, operacao, doDelete);
            if (doDelete.value === true && operacao === 'R') {
                No.no_direita = null;
                doDelete.value = false;
            }
            return result;
        }
    }
}

function e_Altura_Arvore(No,h) {
    if (No !== null) {
        h++;
        var he = e_Altura_Arvore(No.no_esquerda,h);
        var hd = e_Altura_Arvore(No.no_direita,h);
        h = he > h ? he : h;
        h = hd > h ? hd : h;
        return h;
    }
}

function e_Imprimir_RED(No) {
    if (No !== null) {
        b_logIndex(", " + No.valor,false);
        e_Imprimir_RED(No.no_esquerda);
        e_Imprimir_RED(No.no_direita);
    }
}

function e_Imprimir_ERD(No) {
    if (No !== null) {
        e_Imprimir_ERD(No.no_esquerda);
        b_logIndex(", " + No.valor, false);
        e_Imprimir_ERD(No.no_direita);
    }
}

function e_Imprimir_EDR(No) {
    if (No !== null) {
        e_Imprimir_EDR(No.no_esquerda);
        e_Imprimir_EDR(No.no_direita);
        b_logIndex(", " + No.valor, false);
    }
}