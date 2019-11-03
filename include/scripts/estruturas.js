function e_Arvore() {
    return { raiz: null, quant_nos: null };
    /*this.raiz = null;  //Primeiro nó   
    this.quant_nos = 0; */
}

function e_No(valor) {
    return { valor: valor, no_esquerda: null, no_direita: null };
    /*this.valor = valor; 
    this.no_esquerda = null; 
    this.no_direita = null; */
}

function e_BuscaArvore(valorBusca,insere) {
    if (arvore.raiz === null) {
        if (insere === true) {
            arvore.raiz = e_No(valorBusca);
        }        
        return false;
    }
    else {
        return e_BuscaNo(arvore.raiz, valorBusca, insere);
    }
}

function e_BuscaNo(No, valorBusca, insere) {
    if (No.valor === valorBusca) {
        return true;
    }
    else if (No.valor > valorBusca) {
        if (No.no_esquerda === null) {
            if (insere === true) {
                No.no_esquerda = e_No(valorBusca);
            }
            return false;
        }
        else {
            return e_BuscaNo(No.no_esquerda, valorBusca, insere);
        }
    }
    else if (No.valor < valorBusca) {
        if (No.no_direita === null) {
            if (insere === true) {
                No.no_direita = e_No(valorBusca);
            }
            return false;
        }
        else {
            return e_BuscaNo(No.no_direita, valorBusca, insere);
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