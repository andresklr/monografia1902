function e_Arvore() {
    return { raiz: null, altura: 0, svg_arvpont: svg_firstNode() };
}



function e_No(valor) {
    return {
        valor: valor, no_esquerda: null,
        no_direita: null, svg_nopont: null,balance:0
    };
}

async function e_graficosNo(No, animate) {
    No.svg_nopont = svg_criarGraficos(0, 0, No.valor);
    await e_moverArvore(animate);
}

async function e_moverArvore(animate) {    
    await sleep(velocidade);    
    var h = await e_Altura_Arvore(arvore.raiz, 0);
    $('#acao-principal').text("Movendo arvore... ");
    await svg_mover_arvore(h + 2, animate);
}

async function e_BuscaArvore(valorBusca, operacao) {
    await svg_limparCores();
    var doDelete = { value: true };
    if (arvore.raiz === null) {
        if (operacao === 'I') {
            arvore.raiz = e_No(valorBusca);
            e_graficosNo(arvore.raiz, true);
        }
        return false;
    }
    else {
        result = await e_BuscaNo(arvore.raiz, valorBusca, operacao, doDelete);
        if (result === true && doDelete.value === true && operacao === 'R') {
            await svg_paint_no(arvore.raiz, 'noSuccess', false);
            await e_RemoveArvore();
            doDelete.value = false;
        }
        return result;
    }
}

async function e_BuscaNo(No, valorBusca, operacao, doDelete) {    
    await svg_paint_no(No, 'noPath', false);
    var result;
    if (No.valor === valorBusca) {
        await svg_paint_no(No, 'noSuccess', false);
        return true;        
    }
    else if (No.valor > valorBusca) {
        await svg_paint_no(No.no_direita, 'noDisabled', true);
        if (No.no_esquerda === null) {
            if (operacao === 'I') {
                No.no_esquerda = e_No(valorBusca);
                e_graficosNo(No.no_esquerda, true);
                await svg_paint_no(No.no_esquerda, 'noSuccess', false);
            }
            return false;
        }
        else {
            result = await e_BuscaNo(No.no_esquerda, valorBusca, operacao, doDelete);
            if (result === true && doDelete.value === true && operacao === 'R') {
                await svg_paint_no(No.no_esquerda, 'noSuccess', false);
                await e_RemoveNo(No, 'E');
                doDelete.value = false;
            }
            return result;
        }
    }
    else if (No.valor < valorBusca) {
        await svg_paint_no(No.no_esquerda, 'noDisabled', true);
        if (No.no_direita === null) {
            if (operacao === 'I') {
                No.no_direita = e_No(valorBusca);
                e_graficosNo(No.no_direita, true);
                await svg_paint_no(No.no_direita, 'noSuccess', false);
            }
            return false;
        }
        else {
            result = await e_BuscaNo(No.no_direita, valorBusca, operacao, doDelete);
            if (result === true && doDelete.value === true && operacao === 'R') {
                await svg_paint_no(No.no_direita, 'noSuccess', false);
                await e_RemoveNo(No, 'D');
                doDelete.value = false;
            }
            return result;
        }
    }
}

async function e_RemoveArvore() {    
    svg_removeSvgs(arvore.raiz, false);
    if (arvore.raiz.no_esquerda === null) {
        if (arvore.raiz.no_direita === null) {
            main_initiate();
            criar_arvore();
        }
        else {            
            arvore.raiz = arvore.raiz.no_direita;
            await svg_paint_no(arvore.raiz.no_direita, 'noSuccess', false);                
        }
    }
    else {
        if (arvore.raiz.no_direita === null) {            
            arvore.raiz = arvore.raiz.no_esquerda;
            await svg_paint_no(arvore.raiz.no_esquerda, 'noSuccess', false);
        }
        else {
            noIt = arvore.raiz.no_esquerda;
            await svg_paint_no(noIt, 'noPath', false);
            if (noIt.no_direita === null) {                
                noIt.no_direita = arvore.raiz.no_direita;
                arvore.raiz = noIt;
                await svg_paint_no(noIt, 'noSuccess', false);
            }
            else {
                while (noIt.no_direita.no_direita !== null) {
                    noIt = noIt.no_direita;
                    await svg_paint_no(noIt, 'noPath', false);
                }
                novoNo = noIt.no_direita;                
                noIt.no_direita = novoNo.no_esquerda;                
                novoNo.no_esquerda = arvore.raiz.no_esquerda;
                novoNo.no_direita = arvore.raiz.no_direita;
                arvore.raiz = novoNo;     
                await svg_paint_no(novoNo, 'noSuccess', false);
            }

        }
    }
    await e_moverArvore(true);
    
}

async function e_RemoveNo(No, lado) {    
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
                await svg_paint_no(No.no_esquerda.no_direita, 'noSuccess', false);
                No.no_esquerda = No.no_esquerda.no_direita;
            }
        }
        else {
            if (No.no_esquerda.no_direita === null) {
                await svg_paint_no(No.no_esquerda.no_esquerda, 'noSuccess', false);
                No.no_esquerda = No.no_esquerda.no_esquerda;
            }
            else {
                noIt = No.no_esquerda.no_esquerda;
                await svg_paint_no(noIt, 'noPath', false);
                if (noIt.no_direita === null) {
                    noIt.no_direita = No.no_esquerda.no_direita;
                    No.no_esquerda = noIt;
                    await svg_paint_no(noIt, 'noSuccess', false);
                }
                else {
                    while (noIt.no_direita.no_direita !== null) {
                        noIt = noIt.no_direita;
                        await svg_paint_no(noIt, 'noPath', false);
                    }
                    novoNo = noIt.no_direita;
                    noIt.no_direita = novoNo.no_esquerda;
                    novoNo.no_esquerda = No.no_esquerda.no_esquerda;
                    novoNo.no_direita = No.no_esquerda.no_direita;
                    No.no_esquerda = novoNo;
                    await svg_paint_no(novoNo, 'noSuccess', false);
                }
            }
        }
    }
    else {
        svg_removeSvgs(No.no_direita, false);
        if (No.no_direita.no_esquerda === null) {
            if (No.no_direita.no_direita === null) {
                No.no_direita = null;
            }
            else {
                await svg_paint_no(No.no_direita.no_direita, 'noSuccess', false);
                No.no_direita = No.no_direita.no_direita;
            }
        }
        else {
            if (No.no_direita.no_direita === null) {
                await svg_paint_no(No.no_direita.no_esquerda, 'noSuccess', false);
                No.no_direita = No.no_direita.no_esquerda;
            }
            else {
                noIt = No.no_direita.no_esquerda;
                await svg_paint_no(noIt, 'noPath', false);
                if (noIt.no_direita === null) {
                    noIt.no_direita = No.no_direita.no_direita;
                    No.no_direita = noIt;
                    await svg_paint_no(noIt, 'noSuccess', false);
                }
                else {
                    while (noIt.no_direita.no_direita !== null) {
                        noIt = noIt.no_direita;
                        await svg_paint_no(noIt, 'noPath', false);
                    }
                    novoNo = noIt.no_direita;
                    noIt.no_direita = novoNo.no_esquerda;
                    novoNo.no_esquerda = No.no_direita.no_esquerda;
                    novoNo.no_direita = No.no_direita.no_direita;
                    No.no_direita = novoNo;
                    await svg_paint_no(novoNo, 'noSuccess', false);
                }
            }
        }
    }
    await e_moverArvore(true);
}

async function e_Altura_Arvore(No, h, paint = false) {
    if (No !== null) {
        $('#acao-principal').text("Calculando a altura dos nos...");
        if (paint === true) {            
            await svg_paint_no(No, 'noHeight', false);
        }
        h++;
        var he = await e_Altura_Arvore(No.no_esquerda, h, paint);
        var hd = await e_Altura_Arvore(No.no_direita, h, paint);
        h = he > h ? he : h;
        h = hd > h ? hd : h;
        return h;
    }
    else return 0;
}

async function e_Calcular_Balanceamento(No,desbalanceado,cascade = true) {
    if (No !== null) {             
        await svg_limparCores();
        await svg_paint_no(No, 'noSuccess', false, false);
        var he = await e_Altura_Arvore(No.no_esquerda, 0,true);
        var hd = await e_Altura_Arvore(No.no_direita, 0, true);
        No.balance = he - hd;
        if (Math.abs(No.balance) > 1) {
            desbalanceado.valor = No.valor;
        }
        await svg_draw_Balance(No);
        if (cascade === true) {
            await svg_limparCores();
            await e_Calcular_Balanceamento(No.no_esquerda, desbalanceado, true);
            await svg_limparCores();
            await e_Calcular_Balanceamento(No.no_direita, desbalanceado, true);
        }
    }
    else return 0;
}

async function e_InserirValor(valor) {
    $('#acao-principal').text("Inserindo o valor: " + valor);
    var result = await e_BuscaArvore(valor, 'I');
    await e_BalancearArvore();
    return result;
}

async function e_RemoverValor(valor) {
    $('#acao-principal').text("Removendo o valor: " + valor);
    var result = await e_BuscaArvore(valor, 'R');
    //await sleep(velocidade);
    await e_BalancearArvore();
    return result;
}

async function e_BalancearArvore() {
    if (tipo_arvore === 'AVL') {
        //await sleep(velocidade);
        var desbalanceado = { valor: null };
        await e_Calcular_Balanceamento(arvore.raiz, desbalanceado, true);
        if (desbalanceado.valor !== null) {
            await e_RotacaoArvore(desbalanceado);
            await e_BalancearArvore();
        }
    }
}

async function e_RotacaoArvore(desbalanceado) {
    if (arvore.raiz !== null) {
        $('#acao-principal').text("Efetuando o balanceamento...");
        if (arvore.raiz.valor === desbalanceado.valor) {
            
            var tipoTransformacao;
            var NoA, NoB, NoC;

            if (arvore.raiz.balance > 0) {
                tipoTransformacao = 'L';
                if (arvore.raiz.no_esquerda.balance >= 0) {
                    tipoTransformacao += 'L';
                }
                else tipoTransformacao += 'R';
            }
            else {
                tipoTransformacao = 'R';
                if (arvore.raiz.no_direita.balance > 0) {
                    tipoTransformacao += 'L';
                }
                else tipoTransformacao += 'R';
            }

            NoA = arvore.raiz;

            $('#acao-principal').text("Tipo de rotacao: " + tipoTransformacao);

            switch (tipoTransformacao) {
                case 'LL': {
                    NoB = arvore.raiz.no_esquerda;
                    NoC = arvore.raiz.no_esquerda.no_esquerda;

                    NoA.no_esquerda = NoB.no_direita;
                    NoB.no_esquerda = NoC;
                    NoB.no_direita = NoA;

                    arvore.raiz = NoB;
                    break;
                }
                case 'LR': {
                    NoB = arvore.raiz.no_esquerda;
                    NoC = arvore.raiz.no_esquerda.no_direita;

                    NoA.no_esquerda = NoC.no_direita;
                    NoB.no_direita = NoC.no_esquerda;
                    NoC.no_esquerda = NoB;
                    NoC.no_direita = NoA;

                    arvore.raiz = NoC;

                    break;
                }
                case 'RR': {
                    NoB = arvore.raiz.no_direita;
                    NoC = arvore.raiz.no_direita.no_direita;

                    NoA.no_direita = NoB.no_esquerda;
                    NoB.no_direita = NoC;
                    NoB.no_esquerda = NoA;

                    arvore.raiz = NoB;
                    break;
                }
                case 'RL': {
                    NoB = arvore.raiz.no_direita;
                    NoC = arvore.raiz.no_direita.no_esquerda;

                    NoA.no_direita = NoC.no_esquerda;
                    NoB.no_esquerda = NoC.no_direita;
                    NoC.no_esquerda = NoA;
                    NoC.no_direita = NoB;

                    arvore.raiz = NoC;

                    break;
                }
            }

            await svg_paint_no(NoA, 'noWarning', false);
            await svg_paint_no(NoB, 'noWarning', false);
            await svg_paint_no(NoC, 'noWarning', false);
            await sleep(velocidade * 3);
            await e_moverArvore(true);
        }
        else {
            
            await e_RotacaoNo(arvore.raiz,(arvore.raiz.valor > desbalanceado.valor) ? 'E' : 'D', desbalanceado);
        }
    }
}

async function e_RotacaoNo(No, lado, desbalanceado) {
    //Observação, precisou ser feito desta forma, duplicando a função para o lado esquerdo e direito porque o javascript não aceita passada de parâmetro por referência, dessa forma, precisou ser enviado
    //o nó pai, e teve que fazer a lógica para caso o nó a remover fosse do lado esquerdo e caso fosse para o lado direito
    var tipoTransformacao;
    var NoA,NoB, NoC;
    if (lado === 'E') {
        if (No.no_esquerda !== null) {
            if (No.no_esquerda.valor === desbalanceado.valor) {                
                if (No.no_esquerda.balance > 0) {
                    tipoTransformacao = 'L';
                    if (No.no_esquerda.no_esquerda.balance >= 0) {
                        tipoTransformacao += 'L';
                    }
                    else tipoTransformacao += 'R';
                }
                else {
                    tipoTransformacao = 'R';
                    if (No.no_esquerda.no_direita.balance > 0) {
                        tipoTransformacao += 'L';
                    }
                    else tipoTransformacao += 'R';
                }

                NoA = No.no_esquerda;          

                $('#acao-principal').text("Tipo de rotacao: " + tipoTransformacao);

                switch (tipoTransformacao) {
                    case 'LL': {
                        NoB = No.no_esquerda.no_esquerda;
                        NoC = No.no_esquerda.no_esquerda.no_esquerda;

                        NoA.no_esquerda = NoB.no_direita;
                        NoB.no_esquerda = NoC;
                        NoB.no_direita = NoA;

                        No.no_esquerda = NoB;
                        break;
                    }
                    case 'LR': {
                        NoB = No.no_esquerda.no_esquerda;
                        NoC = No.no_esquerda.no_esquerda.no_direita;

                        NoA.no_esquerda = NoC.no_direita;
                        NoB.no_direita = NoC.no_esquerda;
                        NoC.no_esquerda = NoB;
                        NoC.no_direita = NoA;

                        No.no_esquerda = NoC;

                        break;
                    }
                    case 'RR': {
                        NoB = No.no_esquerda.no_direita;
                        NoC = No.no_esquerda.no_direita.no_direita;

                        NoA.no_direita = NoB.no_esquerda;
                        NoB.no_direita = NoC;
                        NoB.no_esquerda = NoA;

                        No.no_esquerda = NoB;
                        break;
                    }
                    case 'RL': {
                        NoB = No.no_esquerda.no_direita;
                        NoC = No.no_esquerda.no_direita.no_esquerda;

                        NoA.no_direita = NoC.no_esquerda;
                        NoB.no_esquerda = NoC.no_direita;
                        NoC.no_esquerda = NoA;
                        NoC.no_direita = NoB;

                        No.no_esquerda = NoC;

                        break;
                    }
                }

                await svg_paint_no(NoA, 'noWarning', false);
                await svg_paint_no(NoB, 'noWarning', false);
                await svg_paint_no(NoC, 'noWarning', false);
                await sleep(velocidade * 3);
                await e_moverArvore(true);
            }
            else if (No.no_esquerda.valor > desbalanceado.valor) {
                await e_RotacaoNo(No.no_esquerda,'E', desbalanceado);
            }
            else {
                await e_RotacaoNo(No.no_esquerda,'D', desbalanceado);
            }
        }
    }
    else {
        if (No.no_direita !== null) {
            if (No.no_direita.valor === desbalanceado.valor) {                
                if (No.no_direita.balance > 0) {
                    tipoTransformacao = 'L';
                    if (No.no_direita.no_esquerda.balance > 0) {
                        tipoTransformacao += 'L';
                    }
                    else tipoTransformacao += 'R';
                }
                else {
                    tipoTransformacao = 'R';
                    if (No.no_direita.no_direita.balance > 0) {
                        tipoTransformacao += 'L';
                    }
                    else tipoTransformacao += 'R';
                }

                NoA = No.no_direita;    

                $('#acao-principal').text("Tipo de rotacao: " + tipoTransformacao);

                switch (tipoTransformacao) {
                    case 'LL': {
                        NoB = No.no_direita.no_esquerda;
                        NoC = No.no_direita.no_esquerda.no_esquerda;

                        NoA.no_esquerda = NoB.no_direita;
                        NoB.no_esquerda = NoC;
                        NoB.no_direita = NoA;

                        No.no_direita = NoB;
                        break;
                    }
                    case 'LR': {
                        NoB = No.no_direita.no_esquerda;
                        NoC = No.no_direita.no_esquerda.no_direita;

                        NoA.no_esquerda = NoC.no_direita;
                        NoB.no_direita = NoC.no_esquerda;
                        NoC.no_esquerda = NoB;
                        NoC.no_direita = NoA;

                        No.no_direita = NoC;

                        break;
                    }
                    case 'RR': {
                        NoB = No.no_direita.no_direita;
                        NoC = No.no_direita.no_direita.no_direita;

                        NoA.no_direita = NoB.no_esquerda;
                        NoB.no_direita = NoC;
                        NoB.no_esquerda = NoA;

                        No.no_direita = NoB;
                        break;
                    }
                    case 'RL': {
                        NoB = No.no_direita.no_direita;
                        NoC = No.no_direita.no_direita.no_esquerda;

                        NoA.no_direita = NoC.no_esquerda;
                        NoB.no_esquerda = NoC.no_direita;
                        NoC.no_esquerda = NoA;
                        NoC.no_direita = NoB;

                        No.no_direita = NoC;

                        break;
                    }
                }

                await svg_paint_no(NoA, 'noWarning', false);
                await svg_paint_no(NoB, 'noWarning', false);
                await svg_paint_no(NoC, 'noWarning', false);
                await sleep(velocidade * 3);
                await e_moverArvore(true);
            }
            else if (No.no_direita.valor > desbalanceado.valor) {
                await e_RotacaoNo(No.no_direita, 'E', desbalanceado);
            }
            else {
                await e_RotacaoNo(No.no_direita,'D', desbalanceado);
            }
        }
    }
}

async function e_Imprimir_RED(No) {
    if (No !== null) {
        await svg_paint_no(No, 'noPath', false);
        b_logIndex(", " + No.valor, false);
        await e_Imprimir_RED(No.no_esquerda);
        await e_Imprimir_RED(No.no_direita);
    }
}

async function e_Imprimir_ERD(No) {
    if (No !== null) {
        await e_Imprimir_ERD(No.no_esquerda);
        await svg_paint_no(No, 'noPath', false);
        b_logIndex(", " + No.valor, false);
        await e_Imprimir_ERD(No.no_direita);
    }
}

async function e_Imprimir_EDR(No) {
    if (No !== null) {
        await e_Imprimir_EDR(No.no_esquerda);
        await e_Imprimir_EDR(No.no_direita);
        await svg_paint_no(No, 'noPath', false);
        b_logIndex(", " + No.valor, false);
    }
}