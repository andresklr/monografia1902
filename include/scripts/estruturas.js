function e_Arvore() {
    return { raiz: null, quantidade: 0,svg_arvpont: null};
    /*this.raiz = null;  //Primeiro n�   
    this.quant_nos = 0; */
}



function e_No(valor) {
    return {
        valor: valor, no_esquerda: null,
        no_direita: null, svg_esquerda: null,
        svg_direita: null, x: null, y:null
    };
    /*this.valor = valor; 
    this.no_esquerda = null; 
    this.no_direita = null; */
}



function e_BuscaArvore(valorBusca, operacao) {
    var doDelete = {value:true};
    if (arvore.raiz === null) {
        if (operacao === 'I') {
            arvore.raiz = e_No(valorBusca);
            //arvore.quantidade++;
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
                //arvore.quantidade++;
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
                //arvore.quantidade++;
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

function e_Imprimir_RED(No) {
    if (No !== null) {
        console.log(No.valor);
        e_Imprimir_RED(No.no_esquerda);
        e_Imprimir_RED(No.no_direita);
    }
}

function e_Imprimir_ERD(No) {
    if (No !== null) {
        e_Imprimir_ERD(No.no_esquerda);
        console.log(No.valor);
        e_Imprimir_ERD(No.no_direita);
    }
}

function e_Imprimir_EDR(No) {
    if (No !== null) {
        e_Imprimir_EDR(No.no_esquerda);
        e_Imprimir_EDR(No.no_direita);
        console.log(No.valor);
    }
}