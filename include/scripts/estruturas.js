function e_Arvore() {
    return { raiz: null, quantidade: 0};
    /*this.raiz = null;  //Primeiro nó   
    this.quant_nos = 0; */
}



function e_No(valor) {
    return {
        valor: valor, no_esquerda: null,
        no_direita: null, svg_nopont:null
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
            arvore.raiz.svg_nopont = svg_circulo(xinicial, yinicial);
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
                No.no_esquerda.svg_nopont = svg_circulo(No.svg_nopont.directions.x2l, No.svg_nopont.directions.y2);
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
                No.no_direita.svg_nopont = svg_circulo(No.svg_nopont.directions.x2r, No.svg_nopont.directions.y2);
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