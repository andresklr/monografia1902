function e_Arvore() {
    return { raiz: null, altura: 0, svg_arvpont: svg_firstNode() };
}



function e_No(valor) {
    return {
        valor: valor, no_esquerda: null,
        no_direita: null, svg_nopont: null
    };
}

function e_graficosNo(No, animate) {
    No.svg_nopont = svg_criarGraficos(0, 0, No.valor);
    var h = e_Altura_Arvore(arvore.raiz, 0);
    svg_mover_arvore(h + 2, animate);
}

function e_BuscaArvore(valorBusca, operacao) {
    var doDelete = { value: true };
    if (arvore.raiz === null) {
        if (operacao === 'I') {
            arvore.raiz = e_No(valorBusca);
            e_graficosNo(arvore.raiz, true);
        }
        return false;
    }
    else {
        result = e_BuscaNo(arvore.raiz, valorBusca, operacao, doDelete);
        if (doDelete.value === true && operacao === 'R') {
            e_RemoveArvore();
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
                e_graficosNo(No.no_esquerda, true);
            }
            return false;
        }
        else {
            result = e_BuscaNo(No.no_esquerda, valorBusca, operacao, doDelete);
            if (doDelete.value === true && operacao === 'R') {
                e_RemoveNo(No, 'E');
                doDelete.value = false;
            }
            return result;
        }
    }
    else if (No.valor < valorBusca) {
        if (No.no_direita === null) {
            if (operacao === 'I') {
                No.no_direita = e_No(valorBusca);
                e_graficosNo(No.no_direita, true);
            }
            return false;
        }
        else {
            result = e_BuscaNo(No.no_direita, valorBusca, operacao, doDelete);
            if (doDelete.value === true && operacao === 'R') {
                e_RemoveNo(No, 'D');
                doDelete.value = false;
            }
            return result;
        }
    }
}

function e_RemoveArvore() {
    svg_removeSvgs(arvore.raiz, false);
    if (arvore.raiz.no_esquerda === null) {
        if (arvore.raiz.no_direita === null) {
            main_initiate();
            criar_arvore();
        }
        else {
            svg_Substituir_No(arvore.raiz.no_direita, arvore.raiz, true);
            arvore.raiz = arvore.raiz.no_direita;
        }
    }
    else {
        if (arvore.raiz.no_direita === null) {
            svg_Substituir_No(arvore.raiz.no_esquerda, arvore.raiz, true);
            arvore.raiz = arvore.raiz.no_esquerda;
        }
        else {
            noIt = arvore.raiz.no_esquerda;
            if (noIt.no_direita === null) {
                svg_Substituir_No(noIt, arvore.raiz, true);
                noIt.no_direita = arvore.raiz.no_direita;
                No = noIt;
            }
            else {
                while (noIt.no_direita.no_direita !== null) {
                    noIt = noIt.no_direita;
                }
                novoNo = noIt.no_direita;
                svg_Substituir_No(novoNo, arvore.raiz, false);
                svg_Substituir_No(novoNo.no_esquerda, novoNo, false);
                noIt.no_direita = novoNo.no_esquerda;
                svg_removeSvgs(noIt, false);
                novoNo.no_esquerda = arvore.raiz.no_esquerda;
                novoNo.no_direita = arvore.raiz.no_direita;
                arvore.raiz = novoNo;
                e_graficosNo(noIt, false);
            }

        }
    }
    svg_removeSvgs(arvore.raiz, false);
    e_graficosNo(arvore.raiz, false);
}

function e_RemoveNo(No, lado) {
    //Observação, precisou ser feito desta forma, duplicando a função para o lado esquerdo e direito porque o javascript não aceita passada de parâmetro por referência, dessa forma, precisou ser enviado
    //o nó pai, e teve que fazer a lógica para caso o nó a remover fosse do lado esquerdo e caso fosse para o lado direito
    var noIt = null, novoNo = null;
    if (lado === 'E') {
        svg_removeSvgs(No.no_esquerda, false);
        if (No.no_esquerda.no_esquerda === null) {
            if (No.no_esquerda.no_direita === null) {
                No.no_esquerda = null;
            }
            else {
                svg_Substituir_No(No.no_esquerda.no_direita, No.no_esquerda, true);
                No.no_esquerda = No.no_esquerda.no_direita;
            }
        }
        else {
            if (No.no_esquerda.no_direita === null) {
                svg_Substituir_No(No.no_esquerda.no_esquerda, No.no_esquerda, true);
                No.no_esquerda = No.no_esquerda.no_esquerda;
            }
            else {
                noIt = No.no_esquerda.no_esquerda;
                if (noIt.no_direita === null) {
                    svg_Substituir_No(noIt, No.no_esquerda, true);
                    noIt.no_direita = No.no_esquerda.no_direita;
                    No.no_esquerda = noIt;
                    //No.no_esquerda.valor = noIt.valor;
                    //No.no_esquerda.no_esquerda = noIt.no_esquerda;
                }
                else {
                    while (noIt.no_direita.no_direita !== null) {
                        noIt = noIt.no_direita;
                    }
                    novoNo = noIt.no_direita;
                    svg_Substituir_No(novoNo, No.no_esquerda, false);
                    svg_Substituir_No(novoNo.no_esquerda, novoNo, false);
                    noIt.no_direita = novoNo.no_esquerda;
                    svg_removeSvgs(noIt, false);
                    novoNo.no_esquerda = No.no_esquerda.no_esquerda;
                    novoNo.no_direita = No.no_esquerda.no_direita;
                    No.no_esquerda = novoNo;
                    e_graficosNo(noIt, false);
                }
            }
        }
    }
    else //if (lado === 'D') {
        svg_removeSvgs(No.no_direita, false);
    if (No.no_direita.no_esquerda === null) {
        if (No.no_direita.no_direita === null) {
            svg_removeSvgs(No.no_direita, false);
            No.no_direita = null;
        }
        else {
            svg_Substituir_No(No.no_direita.no_direita, No.no_direita, true);
            No.no_direita = No.no_direita.no_direita;
        }
    }
    else {
        if (No.no_direita.no_direita === null) {
            svg_Substituir_No(No.no_direita.no_esquerda, No.no_direita, true);
            No.no_direita = No.no_direita.no_esquerda;
        }
        else {
            noIt = No.no_direita.no_esquerda;
            if (noIt.no_direita === null) {
                svg_Substituir_No(noIt, No.no_direita, true);
                noIt.no_direita = No.no_direita.no_direita;
                No.no_direita = noIt;
            }
            else {
                while (noIt.no_direita.no_direita !== null) {
                    noIt = noIt.no_direita;
                }
                novoNo = noIt.no_direita;
                svg_Substituir_No(novoNo, No.no_direita, false);
                svg_Substituir_No(novoNo.no_esquerda, novoNo, false);
                noIt.no_direita = novoNo.no_esquerda;
                svg_removeSvgs(noIt, false);
                novoNo.no_esquerda = No.no_direita.no_esquerda;
                novoNo.no_direita = No.no_direita.no_direita;
                No.no_direita = novoNo;
                e_graficosNo(noIt, false);
            }
        }
        //}
    }
}

function e_Altura_Arvore(No, h) {
    if (No !== null) {
        h++;
        var he = e_Altura_Arvore(No.no_esquerda, h);
        var hd = e_Altura_Arvore(No.no_direita, h);
        h = he > h ? he : h;
        h = hd > h ? hd : h;
        return h;
    }
}

function e_Imprimir_RED(No) {
    if (No !== null) {
        b_logIndex(", " + No.valor, false);
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