/*

-Algumas funções foram criadas de última hora pra tentar organizar melhor o código e diminuir as linhas repetidas, mas por conta do tempo nem todo o código repetido foi substituído por elas.
-Os trechos mais complexos do código foram comentados linha por linha, mas não foi possível comentar todo o código.
-Os dados de cada nó, inclusive os elementos de manipulação gráfica, são armazenados em uma estrutura, que funciona como uma estrutura de dados real.

*/

$(document).ready(
    function () {
        var quant_nos = 0; // Quantidade de nós na lista.
        var lista = null; // Primeiro elemento da lista.
        var pos_inicial_padrao = 30; // Posição padrão para inserção do primeiro elemento criado em cada lista no eixo x.
        var pos_inicial = pos_inicial_padrao; // Posição do primeiro elemento da lista no eixo x, inicialmente igual à posição padrão, porém pode ser alterada no decorrer do código devido a estruturas que necessitam de mais espaço no início.
        var larg_no = 60; // Largura padrão da representação gráfica dos nós.
        var alt_no = 40; // Altura padrão da representação gráfica dos nós.
        var dist_padrao = larg_no + 25; // Distância padrão entre os elementos da lista, contada a partir do início do retângulo anterior (largura do nó + 20 pixels de largura da seta + 5 pixels de largura do marcador da seta).
        var tipo_lista = 'lse'; // Define o tipo da lista a ser utilizada. Por padrão, o tipo de lista selecionado é a lista simplesmente encadeada desordenada.
        var pausa = false; // Define se a execução está pausada ou não.
        var velocidade = 3; // Define a velocidade da execução. Varia de 1 a 4, sendo 3 é a velocidade padrão.
        var automatico = true; // Define se o código deve avançar automaticamente. A alteração ocorre por meio do checkbox referente ao avanço automático localizado na parte inferior da página.
        var avancar = false; // Define se o usuário solicitou que a execução avance. Utilizada quando o modo automático está desativado.
        var max_nos = 7; // Define a quantidade máxima de nós e de áreas de memória para nós.
        var areas_memoria; // Vetor com todas as áreas de memória geradas.
        var max_memoria_variaveis = 7; // Número máximo de áreas de memória para armazenamento de variáveis temporárias.
        var memoria_variaveis; // Armazena as variáveis temporárias com seus respectivos endereços de memória
        var no_recente; // Armazena o último nó manipulado, para que seja possível remover formatações inseridas durante a operação anterior.

        var svg = SVG('lista'); // Elemento que permite manipular os elementos dentro do SVG. A função SVG(id) cria o elemento SVG a partir do ID de uma DIV existente na página HTML.

        var medidas_svg = document.getElementById('lista').getBoundingClientRect(); // Obtém um retângulo que determina as medidas e a posição do elemento SVG criado na página

        var largura_svg = medidas_svg.width; // Obtém a largura do elemento SVG criado.
        var altura_svg = medidas_svg.height; // Obtém a altura do elemento SVG criado.

        var pos_y = altura_svg / 2; // Altura padrão dos retângulos que representam os nós (metade da altura do elemento SVG).

        var meio_x = largura_svg / 2; // Determina o centro do eixo x

        var marker_seta = svg.marker(5, 5, function (add) {
            add.path('M0 0 L5 2 L0 5').fill('#000');
        }); // Marcador com forma de seta, utilizado na extremidade das setas que fazem a ligação entre os elementos. Possui a cor preta.

        var marker_seta_vermelha = svg.marker(5, 5, function (add) {
            add.path('M0 0 L5 2 L0 5').fill('#F00');
        }); // Marcador com forma de seta na cor vermelha para uso nos ponteiros "ant" e "pos", criado devido à impossibilidade de alteração da cor do marcador preto durante o uso. Possui a cor vermelha.

        set_ddl();
        limparTela(); // A função limparTela elimina qualquer elemento que haja na tela, retornando o sistema para o estado após a criação da lista.
        inicializarTela(); // A função inicializarTela retorna todos os elementos para o estado inicial do sistema, como quando a página é aberta pela primeira vez, evitando que haja inconsistências entre o que está nos campos e o que está armazenado internamente, já que o navegador mantém os valores nos campos quando se atualiza a página.

        /*--------------------------------ESTRUTURAS----------------------------------------*/

		/*
			Estrutura que representa internamente as listas, pilhas e filas criadas.
		*/
        function Lista() {
            this.primeiro = null; // Primeiro elemento da lista
            this.fim = null; // Último elemento da lista (utilizado somente para fila)
            this.quant_nos = 0; // Quantidade de elementos da lista;
            this.elem_svg; // Estrutura com elementos SVG relacionados à lista em geral (texto da variável que aponta para o primeiro elemento, seta para o valor NULL, texto NULL, texto do primeiro elemento e quantidade, etc.
            this.x; // Posição no eixo x da caixa onde são exibidas informações sobre a lista (ponteiro para o primeiro elemento e quantidade de elementos.
            this.y; // Posição no eixo y da caixa onde são exibidas informações sobre a lista (ponteiro para o primeiro elemento e quantidade de elementos.
        }


		/*
			Estrutura que representa um nó individualmente.
		*/
        function No(valor, prox_no, no_ant) {
            this.valor = valor; // Valor do elemento
            this.prox_no = prox_no; // Ponteiro para o próximo nó
            this.no_ant = no_ant; // Ponteiro para o nó anterior (exclusivamente para lista duplamente encadeada)
            this.elem_svg; // Estrutura com elementos SVG relacionados ao elemento (retângulo, texto do valor e seta para o próximo elemento)
            this.x; //Posição do retângulo do elemento no eixo x
            this.y; //Posição do retângulo do elemento no eixo y
            this.memoria; // Endereços inicial da área de memória onde o nó foi alocado
        }

		/*
			Estrutura que representa todos os elementos SVG referentes ao nó, para permitir a manipulação posterior
		*/
        function ElementosSVGNo() {
            this.retangulo1; // Elemento do retângulo externo do nó
            this.retangulo2; // Elemento do retângulo interno do nó. Utilizado para permitir que apareçam as divisões que representam o ponteiro para o elemento seguinte, e, no caso da lista duplamente encadeada, para o elemento anterior.
            this.texto; // Elemento do valor do nó
            this.seta_direita; // Elemento da seta para o próximo nó
            this.seta_esquerda; // Elemento da seta para o nó anterior
        }

		/*
			Estrutura que representa todos os elementos SVG referentes à lista, para permitir a manipulação posterior
		*/
        function ElementosSVGLista() { //Estrutura para armazenar os elementos gráficos SVG referentes à lista, para permitir a manipulação posterior
            this.texto_inicio; // Elemento do texto com o nome da variável que aponta para o primeiro elemento da lista, para representação do primeiro elemento graficamente
            this.texto_fim; // Elemento do texto com o nome da variável que aponta para o primeiro elemento da lista, para representação do primeiro elemento graficamente
            this.seta_inicio; // Elemento da seta que faz com que a representação do primeiro elemento da variável aponte para o valor NULL ou para o primeiro elemento da lista
            this.seta_fim; // Elemento da seta que faz com que a representação do primeiro elemento da variável aponte para o valor NULL ou para o primeiro elemento da lista
            this.texto_nulo_1; // Elemento do texto com valor NULL, que pode ser apontado pela variável do primeiro elemento ou pelo último elemento da lista
            this.texto_nulo_2; // Elemento do texto com valor NULL, exclusivamente para ser apontado pelo primeiro elemento em listas duplamente encadeadas.
            this.pont_anterior; // Elemento do texto que indica o nó que se encontra na variável "ant" enquanto se percorre a lista
            this.seta_pont_anterior; // 
            this.pont_atual; // Elemento do texto que indica o nó que se encontra na variável "pos" enquanto se percorre a lista
            this.seta_pont_atual; // 
        }

		/*
			Estrutura que representa
		*/
        function AreaMemoria(endereco) {
            this.endereco = endereco; // Endereço da área de memória
            this.livre = true; // Indicador para determinar se a área está livre ou não
            this.conteudo; // Conteúdo da área de memória
        }

        /*-------------------------------------------------------------------------------*/

        /*-------------------------FUNÇÕES DE CONTROLE DA MEMÓRIA------------------------*/

		/*
			Função responsável por gerar as áreas de memória para alocação dos nós e de algumas variáveis, sendo o primeiro endereço gerado aleatoriamente.
		*/
        function gerarAreasdeMemoria() {
            aleatorio = Math.floor((Math.random() * 2000) + 1);
            mem_inicial = 1000 + (aleatorio - (aleatorio % 4)); // Cálculo da área inicial de memória (início em 1000 e divisível por 4)
            var i = 0, cont_memoria = mem_inicial;
            var max_areas_memoria = (tipo_lista != 'lde' ? 2 : 3) * max_nos;
            max_areas_memoria += max_memoria_variaveis; // É acrescentado o número de áreas necessárias para alocar as variáveis referentes à lista e as temporárias
            $('#memoria').html('');
            areas_memoria = new Array();
            for (i = 1; i <= max_areas_memoria; i++) {
                $('#memoria').append('<div id="memoria-' + cont_memoria + '" class="area-memoria"><span class="numero-area-memoria">' + cont_memoria + '</span><div class="conteudo-area-memoria"><span class="titulo-memoria"></span><span class="valor-memoria"></span><hr class="linha-memoria-1" /><hr class="linha-memoria-2" /><hr class="linha-memoria-3" /></div></div>');
                areas_memoria.push(new AreaMemoria(cont_memoria));
                cont_memoria += 4;
            }
            memoria_variaveis = new Array();
        }

		/*
			Função responsável por obter uma área de memória livre para a alocação de um novo nó. Retorna o endereço obtido.
		*/
        function alocarMemoria(tipo, quantidade) {
            var livres = new Array();
            var qnt_memoria = areas_memoria.length;
            var i, memoria_max, incremento;

            if (tipo == 'no') {
                i = max_memoria_variaveis;
                memoria_max = qnt_memoria;
                incremento = quantidade;
            }
            else if (tipo == 'var_temp') {
                i = 0;
                memoria_max = max_memoria_variaveis - (tipo_lista != 'fila' ? 1 : 2);
                incremento = 1;
            }

            for (; i < memoria_max; i += incremento) {
                if (areas_memoria[i].livre) {
                    livres.push(areas_memoria[i].endereco);
                }
            }

            area_alocacao = Math.floor((Math.random() * livres.length));
            end = livres[area_alocacao];

            for (i = 0; i < quantidade; i++) {
                localizarMemoria(end).livre = false;
                end += 4;
            }

            return livres[area_alocacao];
        }

		/*
			Função responsável por liberar uma área de memória alocada anteriormente, limpando seu conteúdo e definindo-a como livre.
		*/
        function liberarMemoria(endereco, tipo) {
            qnt_memoria_no = (tipo_lista != 'lde' ? 2 : 3);
            end = endereco;
            var i;
            if (tipo == 'no') {
                for (i = 0; i < qnt_memoria_no; i++) {
                    memoria = localizarMemoria(end);
                    preencherMemoria('', end, '');
                    memoria.livre = true;
                    end += 4;
                }
            }
            else if (tipo == 'var_temp') {
                memoria = localizarMemoria(end);
                if (memoria != null) {
                    preencherMemoria('', end, '');
                    memoria.livre = true;
                }
            }
        }

		/*
			Função responsável por atribuir um valor ao endereço de memória, além de possibilitar a inclusão de um título a ser exibido na área alocada, caso desejado.
		*/
        function preencherMemoria(valor, endereco, titulo) {
            localizarMemoria(endereco).conteudo = valor;
            $('#memoria-' + endereco + ' .conteudo-area-memoria .valor-memoria').html(valor);
            if (titulo !== null) {
                $('#memoria-' + endereco + ' .conteudo-area-memoria .titulo-memoria').html(titulo);
            }
        }

		/*
			Função responsável por eliminar da memória todas as variáveis temporárias auxiliares, o que não inclui as referentes à lista, como o ponteiro para início e fim e a quantidade de elementos.
		*/
        function desalocarVariaveisTemporarias() {
            var i = 0;
            if (memoria_variaveis != null) {
                while (i < memoria_variaveis.length) {
                    if (memoria_variaveis[i].variavel != 'primeiro' && memoria_variaveis[i].variavel != 'quantidade' && memoria_variaveis[i].variavel != 'fim') {
                        liberarMemoria(memoria_variaveis[i].endereco, 'var_temp');
                        memoria_variaveis.splice(i, 1);
                    }
                    else {
                        i++
                    }
                }
            }
        }

		/*
			Função responsável por obter o objeto correspondente a um determinado endereço de memória.
		*/
        function localizarMemoria(endereco) {
            for (i = 0; i < areas_memoria.length; i++) {
                if (areas_memoria[i].endereco == endereco) {
                    return areas_memoria[i];
                }
            }
            return false;
        }

        function localizarMemoriadeVariavel(nome_variavel) {
            for (i = 0; i < memoria_variaveis.length; i++) {
                if (memoria_variaveis[i].variavel == nome_variavel) {
                    return memoria_variaveis[i].endereco;
                }
            }
            return false;
        }

		/*
			Função responsável por esvaziar todas as áreas de memória relacionadas aos nós, mantendo somente as referentes à lista.
		*/
        function limparMemoriaNos() {
            if (areas_memoria != null) {
                for (i = max_memoria_variaveis; i < areas_memoria.length; i++) {
                    areas_memoria[i].livre = true;
                    $('#memoria-' + areas_memoria[i].endereco + ' .conteudo-area-memoria .valor-memoria').html('');
                    $('#memoria-' + areas_memoria[i].endereco + ' .conteudo-area-memoria .titulo-memoria').html('');
                }
                $('.conteudo-area-memoria').css('border', '3px solid #000'); // Retorna as bordas das áreas de memória que estejam vermelhas para a cor preta
            }
        }

        /*-------------------------------------------------------------------------------*/

        /*--------------------------------FUNÇÕES DE TEMPO-------------------------------*/

		/*
			Função que permite os atrasos e pausas durante o código para permitir a visualização do que está ocorrendo.
		*/
        function pausar(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

		/*
			Função que gerencia os atrasos e pausas durante o código, determinando inclusive a velocidade e modo de execução.
		*/
        async function sleep(ms, pular) {
            switch (velocidade) {
                case 1: // Se a velocidade for a menor possível, o atraso que está no parâmetro (normalmente 1000) é multiplicado por 3, para tornar a execução mais demorada.
                    ms *= 3;
                    break;
                case 2:  // Se a velocidade for a segunda menor, o atraso que está no parâmetro é multiplicado por 2.
                    ms *= 2;
                    break;
                case 4:  // Se a velocidade for a maior possível, o atraso que está no parâmetro é dividido por 2, para que a execução se torne mais rápida.
                    ms /= 2;
                    break;
            }
            ms = Math.floor(ms); // Para evitar números decimais, o atraso é arredondado para baixo.
            if (pausa == true || automatico == false) { // Se o sistema estiver com a execução pausada, ou se estiver no modo manual
                while (pausa == true || (automatico == false && avancar == false)) { // Permanece pausado acionando continuamente a função pausar até que o usuário retome a execução, ou, se estiver no modo manual, mantém pausado até que o usuário acione o botão Avançar.
                    await pausar(100); // Aguarda a execução da função pausar, que sempre será chamada por 100ms até que saia da pausa.
                }
                avancar = false; // Depois que o usuário clicar em avançar, o loop é encerrado e a variável avançar é novamente definida como false
            }
            else { // Se não estiver pausado ou no modo manual
                //if (pular != false) {
                await pausar(ms);
                //}
            }
        }

        /*-------------------------------------------------------------------------------*/

        /*---------------------------FUNÇÕES DE CONTROLE DA TELA-------------------------*/

		/*
			Função destinada a preparar a tela para o início da criação da lista, com a finalidade de evitar inconsistências entre os valores contidos nos 
			campos e os que estão nas variáveis internas, e bloquear botões que não possuem uso antes da criação da lista.
		*/
        function inicializarTela() {
            bloquearBotoes();
            $('#criar').removeAttr('disabled');
            $('#avanc_auto').prop('checked', true);
            $('#avancar').attr('disabled', 'disabled');
            $('#pausar').html('Pausar');
            $('#pausar').removeAttr('disabled');
            $('#velocidade').val(3);
            $('#memoria').html('');
            areas_memoria = null;
            memoria_variaveis = null;
            if (lista != null && typeof lista.elem_svg !== 'undefined') { // Sâo removidos os elementos gráficos da lista na tela, caso haja.
                lista.elem_svg.texto_inicio.remove();
                lista.elem_svg.seta_inicio.remove();
                lista.elem_svg.texto_nulo_1.remove();
                if (typeof lista.elem_svg.texto_fim !== 'undefined') {
                    lista.elem_svg.texto_fim.remove();
                    lista.elem_svg.seta_fim.remove();
                }
                if (typeof lista.elem_svg.texto_nulo_2 !== 'undefined') {
                    lista.elem_svg.texto_nulo_2.remove();
                }
            }

            pausa = false;
            velocidade = 3;
            automatico = true;
            avancar = false;
            tipo_lista = $('#tipo-lista').find(':selected').val();
            $('#valor_inserir_elemento').val('');
            $('#posicao_inserir_meio').val('');
            $($('input[name=posicao_inserir_elemento]').get(0)).prop('checked', true);
        }

        function set_ddl() {
            var url = new URL(window.location.href);
            try {
                var o = url.searchParams.get("tipo");
                $('#tipo-lista').val(o);
            }
            catch{
                1;
            }
        }

		/*
			Função que remove todos os elementos existentes e faz com que o elemento que representa o primeiro elemento da lista aponte novamente para NULL
		*/
        function limparTela() {
            var aux_lista; // Variável auxiliar para percorrer os elementos da lista e auxiliar na remoção

            if (lista != null) {
                aux_lista = lista.primeiro;
                while (aux_lista != null) { // Percorre toda a lista removendo todos os retângulos, números e setas de todos os elementos
                    aux_lista.elem_svg.retangulo1.remove();
                    aux_lista.elem_svg.retangulo2.remove();
                    aux_lista.elem_svg.texto.remove();
                    aux_lista.elem_svg.seta_direita.remove();
                    if (typeof aux_lista.elem_svg.seta_esquerda !== 'undefined') {
                        aux_lista.elem_svg.seta_esquerda.remove();
                    }
                    aux_lista = aux_lista.prox_no;
                }
                lista.primeiro = null;
                lista.quant_nos = 0;

                moverPonteiroLista('inicio', 'PRIM_OU_FIM_APONTAM_NULO');

                if (tipo_lista == 'fila') {
                    lista.fim = null;
                    moverPonteiroLista('fim', 'PRIM_OU_FIM_APONTAM_NULO');
                }

                if (typeof lista.elem_svg.texto_nulo_2 !== 'undefined') {
                    lista.elem_svg.texto_nulo_2.style('display', 'none');
                }

                ocultarPonteiros();
                desalocarVariaveisTemporarias();
                limparMemoriaNos();

                if (memoria_variaveis != null) {
                    memoria_primeiro = localizarMemoriadeVariavel('primeiro');
                    preencherMemoria('NULL', memoria_primeiro, null);
                    if (memoria_variaveis.length == 3) {
                        preencherMemoria('NULL', memoria_primeiro + 4, null);
                        preencherMemoria('0', memoria_primeiro + 8, null);
                    }
                    else {
                        preencherMemoria('0', memoria_primeiro + 4, null);
                    }
                }

                $('#codigo').html('');
            }

        }

		/*
			Bloqueia os botões referentes à manipulação da lista. É chamada quando não há lista criada ou é trocado o tipo de lista.
		*/
        function bloquearBotoes() {
            $('#adicionar').attr('disabled', 'disabled');
            $('#remover').attr('disabled', 'disabled');
            $('#pesquisar').attr('disabled', 'disabled');
            $('#gerar').attr('disabled', 'disabled');
            $('#limpar').attr('disabled', 'disabled');
        }

		/*
			Desbloqueia os botões referentes à manipulação da lista. É chamada quando é criada uma lista.
		*/
        function desbloquearBotoes() {
            $('#adicionar').removeAttr('disabled');
            $('#remover').removeAttr('disabled');
            $('#pesquisar').removeAttr('disabled');
            $('#gerar').removeAttr('disabled');
            $('#limpar').removeAttr('disabled');
        }

		/*
			Função responsável por exibir caixas de diálogo personalizadas no sistema.
		*/
        function abrirDialogo(tipo, funcao) {
            switch (tipo) {
                case 'gerar_aleatorio':
                    nome_div = 'lista_aleatoria';
                    nome_botao_confirmar = 'Gerar lista aleatória';
                    titulo_dialogo = 'Gerar lista aleatória';
                    break;
                case 'inserir_elemento':
                    nome_div = 'inserir_elemento';
                    nome_botao_confirmar = 'Inserir elemento';
                    titulo_dialogo = 'Inserir elemento';
                    break;
                case 'remocao':
                case 'pesquisa':
                    nome_div = 'informar_valor';
                    if (tipo == 'remocao') {
                        nome_botao_confirmar = 'Remover';
                        titulo_dialogo = 'Remover elemento';
                    }
                    else {
                        nome_botao_confirmar = 'Pesquisar';
                        titulo_dialogo = 'Pesquisar elemento';
                    }
                    break;
                case 'mensagem':
                    nome_div = 'mensagem';
                    nome_botao_confirmar = 'Ok';
                    titulo_dialogo = 'Mensagem';
            }

            botoes = new Array();
            botoes.push({
                text: nome_botao_confirmar,
                click: function () {
                    dialogo.dialog('close');
                    funcao.call();
                }
            });
            if (tipo != 'mensagem') {
                botoes.push({
                    text: 'Cancelar',
                    click: function () {
                        dialogo.dialog('close');
                    }
                });
            }
            dialogo = $('#' + nome_div).dialog({
                autoOpen: false,
                height: 220,
                width: 350,
                modal: true,
                title: titulo_dialogo,
                closeText: 'Fechar',
                buttons: botoes
            });

            $('#' + nome_div).dialog('open');
        }

        /*-------------------------------------------------------------------------------*/

        /*--------------------FUNÇÕES DE CONTROLE DOS ELEMENTOS GRÁFICOS-----------------*/
		/*
			Função que desloca todos os nós a partir de no_inicial para a esquerda ou direita, conforme a variável direcao.
		*/
        function deslocarNos(no_inicial, direcao) {
            var aux_lista; //Variável auxiliar para percorrer a lista
            var no_ant; // Variável para determinar o nó anterior ao nó que será inserido

            i = 0;
            aux_lista = lista.primeiro;
            while (i < no_inicial) {
                no_ant = aux_lista;
                aux_lista = aux_lista.prox_no;
                i++;
            }

            j = i;
            while (j < lista.quant_nos) {
                if (direcao == 'direita') {
                    aux_lista.x += dist_padrao;
                }
                else if (direcao == 'esquerda') {
                    aux_lista.x -= dist_padrao;
                }
                aux_lista.elem_svg.retangulo1.animate(500).move(aux_lista.x, aux_lista.y);

                if (tipo_lista != 'lde') {
                    aux_lista.elem_svg.retangulo2.animate(500).move(aux_lista.x, aux_lista.y); // Os dois retângulos são movidos para 10 pixels abaixo da parte inferior dos outros nós, e para a posição que ocupará no eixo X (posição do nó que ocupava anteriormente a posição, ou posição inicial no caso de uma inserção no início)
                    aux_lista.elem_svg.texto.animate(500).move(aux_lista.x + 10, aux_lista.y + 5); // O texto é movido para a nova posição do nó
                }
                else {
                    aux_lista.elem_svg.retangulo2.animate(500).move(aux_lista.x + (larg_no * 0.18), aux_lista.y);
                    aux_lista.elem_svg.texto.animate(500).move(aux_lista.x + 15, aux_lista.y + 5); // O texto é movido para a nova posição do nó
                }


                //aux_lista.elem_svg.texto.animate(500).move(aux_lista.x + 10,aux_lista.y + 5);

                if (tipo_lista != 'lde') {
                    aux_lista.elem_svg.seta_direita.animate(500).move(aux_lista.x + larg_no, Math.floor((aux_lista.y + (alt_no / 2))));
                }
                else {
                    aux_lista.elem_svg.seta_direita.animate(500).move(aux_lista.x + larg_no, Math.floor((aux_lista.y + (alt_no / 2) + (alt_no / 4))));
                    aux_lista.elem_svg.seta_esquerda.animate(500).move(aux_lista.x - 20, Math.floor((aux_lista.y + (alt_no / 2) - (alt_no / 4))));
                }
                no_ant = aux_lista;
                aux_lista = aux_lista.prox_no;
                j++;
            }

            var medidas_pont_atual = lista.elem_svg.pont_atual.bbox();
            var medidas_pont_ant = lista.elem_svg.pont_anterior.bbox();
            var medidas_texto_nulo = lista.elem_svg.texto_nulo_1.bbox();

            if (no_ant != null) {
                var pos_x_texto_nulo, pos_y_texto_nulo;
                if (tipo_lista != 'lde') {
                    pos_y_texto_nulo = pos_y + (alt_no / 2) - (medidas_texto_nulo.height / 2);
                }
                else {
                    pos_y_texto_nulo = pos_y + (alt_no / 2) + (alt_no / 4) - (medidas_texto_nulo.height / 2);
                }
                if (direcao == 'direita') {
                    if (no_inicial == lista.quant_nos) {
                        pos_x_texto_nulo = no_ant.x + (dist_padrao * 2);
                    }
                    else {
                        pos_x_texto_nulo = no_ant.x + (dist_padrao);
                    }

                    lista.elem_svg.texto_nulo_1.animate(500).move(pos_x_texto_nulo, pos_y_texto_nulo);
                    lista.elem_svg.pont_atual.animate(500).move(lista.elem_svg.pont_atual.x() + dist_padrao, lista.elem_svg.pont_atual.y());
                    lista.elem_svg.seta_pont_atual.animate(500).move(lista.elem_svg.pont_atual.x() + dist_padrao + (medidas_pont_atual.width) / 2, pos_y + alt_no + 5);

                    if (no_inicial == 0) {
                        lista.elem_svg.pont_anterior.animate(500).move(lista.elem_svg.pont_anterior.x() + dist_padrao, lista.elem_svg.pont_anterior.y());
                        lista.elem_svg.seta_pont_anterior.animate(500).move(lista.elem_svg.pont_anterior.x() + dist_padrao + (medidas_pont_ant.width) / 2, pos_y + alt_no + 5);
                    }

                }
                else if (direcao == 'esquerda') {
                    lista.elem_svg.texto_nulo_1.animate(500).move(no_ant.x + dist_padrao, pos_y_texto_nulo);

                    if (tipo_lista == 'fila') {
                        var medidas_texto_fim = lista.elem_svg.texto_fim.bbox();
                        if (lista.quant_nos > 1) {
                            lista.elem_svg.texto_fim.animate(500).move(medidas_texto_fim.x - dist_padrao, medidas_texto_fim.y)
                            lista.elem_svg.seta_fim.animate(500).move(medidas_texto_fim.x - dist_padrao + (medidas_texto_fim.width / 2), medidas_texto_fim.y + medidas_texto_fim.height)
                        }
                    }
                }
            }
        }

		/*
			Função que remove todas as cores dos nós
		*/
        function removerCores() {
            var aux_lista;

            if (lista != null) {
                $('.conteudo-area-memoria').css('border', '3px solid #000'); // Retorna as bordas das áreas de memória que estejam vermelhas para a cor preta
                aux_lista = lista.primeiro;
                while (aux_lista != null) {
                    aux_lista.elem_svg.retangulo1.fill('#FFFFFF');
                    aux_lista.elem_svg.retangulo1.stroke('#000');
                    aux_lista.elem_svg.retangulo2.stroke('#000');
                    aux_lista = aux_lista.prox_no;
                }
            }
        }

		/*
			Função responsável por controlar o movimento dos ponteiros 'ant' e 'pos' na lista.
		*/
        function moverPonteiroAuxiliar(ponteiro, x, y, animacao) {
            if (ponteiro == 'pos' || ponteiro == 'ant') {
                if (ponteiro == 'pos') {
                    var ponteiro = lista.elem_svg.pont_atual;
                    var seta_ponteiro = lista.elem_svg.seta_pont_atual;
                }
                else {
                    var ponteiro = lista.elem_svg.pont_anterior;
                    var seta_ponteiro = lista.elem_svg.seta_pont_anterior;
                }

                var medidas_ponteiro = ponteiro.bbox();
                meio_ponteiro = x + Math.floor(medidas_ponteiro.width / 2);

                if (animacao == true) {
                    ponteiro.style('display', 'inline').animate(500).move(x, y + 20);
                    seta_ponteiro.style('display', 'inline').animate(500).move(meio_ponteiro, y + 5);
                }
                else {
                    ponteiro.style('display', 'inline').move(x, y + 20);
                    seta_ponteiro.style('display', 'inline').move(meio_ponteiro, y + 5);
                }
            }
        }

		/*
			Função destinada a controlar a movimentação dos ponteiros de primeiro e último elemento da lista, suas setas e os textos NULL. O texto NULL
			localizado no final da lista também é movimentado na função deslocarNos.
		*/
        function moverPonteiroLista(ponteiro, estado, x, animacao) {
            if (ponteiro == 'inicio' || ponteiro == 'fim') {
                if (ponteiro == 'inicio') {
                    var texto_ponteiro = lista.elem_svg.texto_inicio;
                    var seta_ponteiro = lista.elem_svg.seta_inicio;
                    var texto_nulo = lista.elem_svg.texto_nulo_1;
                }
                else {
                    var texto_ponteiro = lista.elem_svg.texto_fim;
                    var seta_ponteiro = lista.elem_svg.seta_fim;
                    var texto_nulo = lista.elem_svg.texto_nulo_2;
                }

                var medidas_texto_nulo_1 = lista.elem_svg.texto_nulo_1.bbox();
                var largura_seta = 30;
                var y_texto_ponteiro = pos_y - 80;

                if (typeof animacao !== 'undefined' && animacao == true) {
                    texto_ponteiro = texto_ponteiro.animate(500);
                    seta_ponteiro = seta_ponteiro.animate(500);
                    texto_nulo = texto_nulo.animate(500);
                }

                if (estado == 'PRIM_OU_FIM_APONTAM_NULO') { // Ok
                    var medidas_texto_prim = lista.elem_svg.texto_inicio.bbox();
                    if (ponteiro == 'inicio') {

                        var pos_x_seta = Math.floor(pos_inicial + medidas_texto_prim.width + 10);
                        var pos_y_seta = Math.floor(y_texto_ponteiro + (medidas_texto_prim.height) / 2);
                        texto_ponteiro.move(pos_inicial, y_texto_ponteiro);
                        seta_ponteiro.plot('M' + pos_x_seta + ' ' + pos_y_seta + ' L' + (pos_x_seta + largura_seta) + ' ' + pos_y_seta);
                        texto_nulo.move(pos_x_seta + largura_seta + 10, y_texto_ponteiro);
                    }
                    else {
                        if (typeof texto_ponteiro !== 'undefined') {
                            var medidas_texto_fim = lista.elem_svg.texto_fim.bbox();
                            var pos_x_seta = Math.floor(pos_inicial + medidas_texto_prim.width + 10 + largura_seta + 10 + medidas_texto_nulo_1.width + 10 + largura_seta);
                            var pos_y_seta = Math.floor(y_texto_ponteiro + (medidas_texto_fim.height) / 2);
                            texto_ponteiro.move(pos_x_seta + 10, y_texto_ponteiro);
                            seta_ponteiro.plot('M' + pos_x_seta + ' ' + pos_y_seta + ' L' + (pos_x_seta - largura_seta) + ' ' + pos_y_seta);
                        }
                    }
                }
            }
        }

        function ocultarPonteiros() { //Oculta os ponteiros "pos" e "ant" e suas setas
            lista.elem_svg.pont_anterior.style('display', 'none');
            lista.elem_svg.pont_atual.style('display', 'none');
            lista.elem_svg.seta_pont_anterior.style('display', 'none');
            lista.elem_svg.seta_pont_atual.style('display', 'none');
        }

        /*--------------------------------------------------------------------------------*/

        /*--------------------------FUNÇÕES DE CONTROLE DOS BOTÕES------------------------*/

		/*
			Controle das alterações do local de inserção, no diálogo específico
		*/
        $('input[name=posicao_inserir_elemento]').change(
            function () {
                if ($(this).val() == 'meio') {
                    $('.insercao-meio').css('display', 'inline');
                }
                else {
                    $('.insercao-meio').css('display', 'none');
                }
            }
        );

		/*
			Controle do botão de pausa
		*/
        $('#pausar').click( // Controle do botão que permite pausar a execução da operação
            function () {
                if (pausa == true) {
                    pausa = false;
                    $(this).html('Pausar');
                }
                else {
                    pausa = true;
                    $(this).html('Continuar');
                }
            }
        );

		/*
			Controle da caixa de seleção de avanço automático
		*/
        $('#avanc_auto').change( // Controle da checkbox que permite escolher o modo automático ou manual para avançar as linhas de código
            function () {
                if (!$(this).prop('checked')) {
                    automatico = false;
                    $('#avancar').removeAttr('disabled');
                    $('#pausar').attr('disabled', 'disabled');
                }
                else {
                    automatico = true;
                    $('#avancar').attr('disabled', 'disabled');
                    $('#pausar').removeAttr('disabled');
                }
            }
        );

		/*
			Controle do botão de avanço manual
		*/
        $('#avancar').click(function () { // Controle do botão que permite avançar para a próxima linha de código quando o avanço automático está desabilitado.
            avancar = true;
        });

		/*
			Controle da seleção de velocidade
		*/
        $('#velocidade').change(function () {
            velocidade = parseInt($(this).val());
        });

		/*
			Controle do botão de criação da lista
		*/
        $('#criar').click(
            function () {
                limparTela();
                tipo_lista = $('#tipo-lista').find(':selected').val();

                lista = new Lista();
                lista.elem_svg = new ElementosSVGLista();

                var texto_primeiro, texto_quantidade;

                switch (tipo_lista) {
                    case 'lse':
                    case 'lse_ord':
                    case 'lde':
                        texto_primeiro = 'l->prim';
                        texto_quantidade = 'l->qtd';
                        break;
                    case 'pilha':
                        texto_primeiro = 'p->topo';
                        texto_quantidade = 'p->qtd';
                        break;
                    case 'fila':
                        texto_primeiro = 'f->prim';
                        texto_quantidade = 'f->qtd';
                        break;
                }

                lista.elem_svg.texto_inicio = svg.plain(texto_primeiro);
                lista.elem_svg.seta_inicio = svg.path('').stroke('#000').attr('stroke-width', 2).marker('end', marker_seta);
                lista.elem_svg.texto_nulo_1 = svg.plain('NULL');

                if (tipo_lista == 'lde' || tipo_lista == 'fila') {
                    lista.elem_svg.texto_nulo_2 = svg.plain('NULL');
                    var medidas_texto_nulo_2 = lista.elem_svg.texto_nulo_2.bbox();
                    pos_inicial = 10 + medidas_texto_nulo_2.width + 25;
                }
                else {
                    pos_inicial = pos_inicial_padrao;
                }

                moverPonteiroLista('inicio', 'PRIM_OU_FIM_APONTAM_NULO');
                if (tipo_lista == 'fila') {
                    lista.elem_svg.texto_fim = svg.plain('f->fim');
                    lista.elem_svg.seta_fim = svg.path('').stroke('#000').attr('stroke-width', 2).marker('end', marker_seta);
                    moverPonteiroLista('fim', 'PRIM_OU_FIM_APONTAM_NULO');
                }

                gerarAreasdeMemoria();
                memoria_variaveis = new Array();
                var memoria_primeiro, memoria_quantidade;
                if (tipo_lista != 'fila') {
                    memoria_primeiro = alocarMemoria('var_temp', 2);
                    memoria_quantidade = memoria_primeiro + 4;
                }
                else {
                    memoria_primeiro = alocarMemoria('var_temp', 3);
                    var memoria_fim = memoria_primeiro + 4;
                    memoria_quantidade = memoria_fim + 4;
                }

                preencherMemoria('NULL', memoria_primeiro, texto_primeiro);
                memoria_variaveis.push({ variavel: 'primeiro', endereco: memoria_primeiro });

                if (tipo_lista == 'fila') {
                    preencherMemoria('NULL', memoria_fim, 'f->fim');
                    memoria_variaveis.push({ variavel: 'fim', endereco: memoria_fim });
                }
                preencherMemoria('0', memoria_quantidade, texto_quantidade);
                memoria_variaveis.push({ variavel: 'quantidade', endereco: memoria_quantidade });

                lista.elem_svg.pont_anterior = svg.plain('ant').style('display', 'none').style('font-size: 14px;fill:#F00;');
                lista.elem_svg.seta_pont_anterior = svg.path('M0 15 L0 0').style('display', 'none').stroke('#F00').attr('stroke-width', 2).marker('end', marker_seta_vermelha);

                lista.elem_svg.pont_atual = svg.plain('pos').style('display', 'none').style('font-size: 14px; fill:#F00;');
                lista.elem_svg.seta_pont_atual = svg.path('M0 15 L0 0').style('display', 'none').stroke('#F00').attr('stroke-width', 2).marker('end', marker_seta_vermelha);

                $('#adicionar').removeAttr('disabled');
                $('#remover').removeAttr('disabled');
                $('#pesquisar').removeAttr('disabled');
                $('#gerar').removeAttr('disabled');
                $(this).attr('disabled', 'disabled');

                desbloquearBotoes();
            }
        );

		/*
			Controle do botão de criação do elemento
		*/
        $('#adicionar').click(
            function () {
                $('#valor_inserir_elemento').val('');
                $('#posicao_inserir_meio').val('');
                $('.insercao-meio').css('display', 'none');
                $($('input[name=posicao_inserir_elemento]').get(0)).prop('checked', true);
                if (tipo_lista == 'lse' || tipo_lista == 'lde') {
                    $('.op_lista_desordenada').css('display', 'block');
                }
                else {
                    $('.op_lista_desordenada').css('display', 'none');
                }
                abrirDialogo('inserir_elemento', function () {
                    val = $('#valor_inserir_elemento').val();
                    pos = null;
                    if (val !== null && val !== 'undefined' && val != '') {
                        if (val != '' && parseInt(val) >= 0 && parseInt(val) <= 999) {
                            if (tipo_lista != 'pilha' && tipo_lista != 'fila' && tipo_lista != 'lse_ord') {
                                if ($('input[name=posicao_inserir_elemento]:checked').val() == 'inicio') {
                                    pos = 0;
                                }
                                else if ($('input[name=posicao_inserir_elemento]:checked').val() == 'meio') {
                                    pos = $('#posicao_inserir_meio').val();
                                }
                                else {
                                    pos = lista.quant_nos;
                                }
                            }
                            removerCores();
                            if (pos !== '') {
                                if (pos <= lista.quant_nos) {
                                    inserirElemento(val, pos);
                                }
                                else {
                                    alert("A posição deve ser menor que a última posição da lista.");
                                }
                            }
                        }
                        else {
                            alert("Deve ser informado um valor de 0 a 999.");
                        }
                    }
                });
            }
        );

		/*
			Controle do botão de pesquisa de nós
		*/
        $('#pesquisar').click(
            function () {
                $('#valor-elemento').val('');
                abrirDialogo('pesquisa', function () {
                    val = $('#valor-elemento').val();
                    if (val !== null && val !== 'undefined' && val != '') {
                        removerCores();

                        if (tipo_lista == 'lse_ord') {
                            carregarCodigo('pesquisa_ordenada');
                        }
                        else {
                            carregarCodigo('pesquisa_desordenada');
                        }

                        pesquisarElemento(val, 'valor');
                    }
                });
            }
        );

		/*
			Controle do botão de remoção de elementos
		*/
        $('#remover').click(
            function () {
                $('#valor-elemento').val('');
                var iniciar_remocao = function () {
                    val = $('#valor-elemento').val();
                    if (val != '' || tipo_lista == 'pilha' || tipo_lista == 'fila') {
                        removerCores();
                        carregarCodigo('remocao');
                        removerElemento(val);
                    }
                };
                if (tipo_lista != 'pilha' && tipo_lista != 'fila') {
                    abrirDialogo('remocao', iniciar_remocao);
                }
                else {
                    iniciar_remocao.call();
                }
            }
        );

		/*
			Controle do botão de geração de lista aleatória
		*/
        $('#gerar').click(
            async function () {
                var i = 0;
                limparTela();
                limparMemoriaNos();
                if (tipo_lista == 'lse' || tipo_lista == 'lde') {
                    $('.op_lista_desordenada').css('display', 'block');
                }
                else {
                    $('.op_lista_desordenada').css('display', 'none');
                }
                abrirDialogo('gerar_aleatorio', function () {
                    qnt = $('#txt_quant_elem').val();
                    if (qnt != '' && (qnt > 0 && qnt <= 7)) {
                        qnt = parseInt(qnt);

                        var elementos = new Array();
                        while (i < qnt) {
                            aleatorio = Math.floor((Math.random() * 999) + 1);
                            elementos.push(aleatorio);
                            i++;
                        }

                        if ($('#chk_pos_aleatorias').prop('checked')) {
                            inserirElemento(elementos, 'aleatorio');
                        }
                        else {
                            inserirElemento(elementos);
                        }
                        //await sleep(1000);
                    }
                    else {
                        alert('A quantidade deve ser um número entre 1 e 7');
                    }
                });
            }
        );

		/*
			Controle do botão de limpeza da tela
		*/
        $('#limpar').click(
            function () {
                limparTela();
            }
        );

		/*
			Controle das alterações do tipo da lista
		*/
        $('#tipo-lista').change(
            function () {
                var o = $('#tipo-lista').val();
                if (o === 'BB' || o === 'AVL') {
                    window.location.href = '/arvore.html?tipo=' + o;
                }
                limparTela();
                inicializarTela();
                tipo_lista = $(this).find(':selected').val();
            }
        );

        /*--------------------------------------------------------------------------------*/

        /*--------------------------FUNÇÕES DE MANIPULAÇÃO DOS NÓS------------------------*/

		/*
			Função de inserção de elemento
		*/
        async function inserirElemento(valores, pos) {
            var novo_no; // Variável que armazena o nó criado
            var aux_lista; //Variável auxiliar para percorrer a lista
            var pos_x; //Variável utilizada para determinar a posição no eixo x onde o elemento será inserido.
            var vetor = false; // Variável utilizada para indicar se o que foi recebido foi um único valor ou um vetor de valores
            var no_ant; // Variável para determinar o nó anterior ao nó que será inserido
            var memoria_contador_i, memoria_ponteiro_ant, memoria_ponteiro_pos;

            if (lista.quant_nos < max_nos) {
                var memoria_primeiro = localizarMemoriadeVariavel('primeiro');
                var memoria_quantidade = localizarMemoriadeVariavel('quantidade');
                var medidas_texto_prim = lista.elem_svg.texto_inicio.bbox(); // Obtém as medidas do texto que indica a variável que contém o primeiro elemento da lista
                if (tipo_lista == 'fila') {
                    var memoria_fim = localizarMemoriadeVariavel('fim');
                    var medidas_texto_fim = lista.elem_svg.texto_fim.bbox(); // Obtém as medidas do texto que indica a variável que contém o último elemento da fila
                }

                bloquearBotoes(); // Bloqueia os botões de manipulação dos elementos para evitar que o usuário realize novas operações durante a execução da atual
                $('#tipo-lista').attr('disabled', 'disabled'); // A caixa de escolha do tipo de lista é bloqueada, para evitar que o usuário realize alterações durante uma operação

                qnt = 1; // A função pode receber um único elemento ou um vetor de elementos para a inserção. Por padrão, é definido que trata-se de um único elemento.
                if (Array.isArray(valores)) { // Verifica-se se é um vetor ou uma variável comum
                    qnt = valores.length; // Caso seja uma variável comum, é atribuído à variável qnt o número de elementos do vetor.
                    vetor = true; // A variável que sinaliza que trata-se de um vetor é definida como true
                }

                j = 0;
                while (j < qnt) { // Repete enquanto houver itens a serem inseridos
                    if (vetor == true) {
                        valor = valores[j]; // Se for um vetor, é obtido do vetor o número a ser inserido no momento
                        if (pos == 'aleatorio') {
                            posicao = Math.floor((Math.random() * lista.quant_nos)) // Se o usuário tiver solicitado geração de elementos em posições aleatórias, a posição será gerada aleatoriamente.
                        }
                        else {
                            posicao = lista.quant_nos; // Senão, a inserção será sempre no final
                        }
                    }
                    else { // Se não for um vetor
                        valor = parseInt(valores); //Conversão do valor em inteiro
                        posicao = parseInt(pos); //Conversão da posição em inteiro
                    }

                    removerCores();
                    if (no_recente != null) { // Retorna a borda vermelha do último nó utilizado para a cor preta, caso não seja a primeira execução
                        no_recente.elem_svg.retangulo1.stroke('#000');
                        no_recente.elem_svg.retangulo2.stroke('#000');
                    }

                    //pos_x = 0;

                    if (tipo_lista == 'pilha') { // Se o tipo da lista for pilha, a inserção sempre será no início
                        posicao = 0;
                    }
                    else if (tipo_lista == 'fila') { // Se a lista for uma fila, a inserção será sempre no final
                        posicao = lista.quant_nos;
                    }

                    if (posicao < 0 || (posicao > lista.quant_nos)) { // Se a função tiver recebido uma posição inválida, a execução é interrompida retornando false
                        return false;
                    }

                    if ((lista.primeiro == null || posicao == 0) && tipo_lista != 'fila' && tipo_lista != 'lse_ord') { // Se a inserção for no início e o tipo da lista não for fila nem lista ordenada, carrega-se o código correspondente
                        carregarCodigo('insercao_inicio_desordenada');
                    }
                    else if (tipo_lista == 'fila') { // Se a lista for uma fila, carrega-se o código de inserção no fim
                        carregarCodigo('insercao_fim');
                    }
                    else { // Em qualquer outro caso, carrega-se o código de inserção no meio
                        carregarCodigo('insercao_meio_desordenada');
                    }

                    ocultarPonteiros(); // Oculta ponteiros "ant" e "pos", para o caso de terem sido utilizados na operação anterior
                    desalocarVariaveisTemporarias(); // Remove as variáveis temporárias utilizadas em operações anteriores da memória

                    marcarLinha(1); // Linha de criação do nó
                    svg_novo_no = new ElementosSVGNo(); // É criado o objeto que contém os elementos SVG pertencentes ao nó
                    svg_novo_no.retangulo1 = svg.rect(larg_no, alt_no); // É criado o retângulo mais externo do nó
                    svg_novo_no.retangulo1.move(meio_x, pos_y - 90); // O retângulo mais externo do nó é movido para o meio da tela na horizontal, e 90 pixels acima da área onde ficam os nós já inseridos, na vertical
                    if (tipo_lista != 'lde') { // Se o tipo de lista não for "lista duplamente encadeada"
                        svg_novo_no.retangulo2 = svg.rect(larg_no - (larg_no * 0.3), alt_no); // É criado o retângulo mais interno do nó, feito para que apareça a linha que indica o ponteiro para o próximo elemento, com 70% do tamanho do retângulo mais externo
                        svg_novo_no.retangulo2.move(meio_x, pos_y - 90); // O retângulo mais interno é movido para a posição inicial, igual à do retângulo mais externo
                    }
                    else {
                        svg_novo_no.retangulo2 = svg.rect(larg_no - (larg_no * 0.35), alt_no); // É criado o retângulo mais interno do nó, feito para que apareça a linha que indica o ponteiro para o próximo elemento, com 65% do tamanho do retângulo mais externo
                        svg_novo_no.retangulo2.move(meio_x + (larg_no * 0.18), pos_y - 90); // O retângulo mais interno é movido para a posição inicial acrescida de 18% da largura do retângulo mais externo, para que fique no meio do nó e dê o efeito das duas linhas que indicam os ponteiros anterior e próximo
                    }

                    var borda_memoria = '3px solid #F00'; // É definido o padrão da borda vermelha das áreas de memória recém-alocadas, para evitar repetições
                    var qnt_memoria_no = (tipo_lista != 'lde' ? 2 : 3);
                    var area_valor = alocarMemoria('no', qnt_memoria_no); // É alocada a área de memória para o novo nó
                    $('#memoria-' + area_valor + ' .conteudo-area-memoria').css('border-top', borda_memoria); // São inseridas as bordas vermelhas em volta da primeira área alocada, que armazena o valor do elemento
                    $('#memoria-' + area_valor + ' .conteudo-area-memoria').css('border-left', borda_memoria);
                    $('#memoria-' + area_valor + ' .conteudo-area-memoria').css('border-right', borda_memoria);

                    area_endereco_prox = area_valor + 4; // É definida a próxima área utilizada, que armazena o ponteiro para o próximo elemento

                    $('#memoria-' + area_endereco_prox + ' .conteudo-area-memoria').css('border-left', borda_memoria); // São inseridas as bordas vermelhas em volta da segunda área alocada
                    $('#memoria-' + area_endereco_prox + ' .conteudo-area-memoria').css('border-right', borda_memoria);

                    if (tipo_lista == 'lde') { // Caso a lista seja duplamente encadeada, é necessária uma terceira área de memória para o ponteiro para o elemento anterior
                        area_endereco_ant = area_endereco_prox + 4; // É determinada a área de memória para o ponteiro anterior
                        $('#memoria-' + area_endereco_ant + ' .conteudo-area-memoria').css('border-left', borda_memoria); // São inseridas as bordas vermelhas em volta da terceira área alocada, incluindo a parte de baixo
                        $('#memoria-' + area_endereco_ant + ' .conteudo-area-memoria').css('border-right', borda_memoria);
                        $('#memoria-' + area_endereco_ant + ' .conteudo-area-memoria').css('border-bottom', borda_memoria);
                    }
                    else {
                        $('#memoria-' + area_endereco_prox + ' .conteudo-area-memoria').css('border-bottom', borda_memoria); // Caso a lista não seja duplamente encadeada, é inserida a borda vermelha na parte de baixo da segunda área alocada
                    }

                    svg_novo_no.retangulo1.fill('#FFF').stroke('#F00').attr('stroke-width', 2).animate(250).fill('#0C0').animate(250).fill('#FFF'); // O retângulo mais externo recebe borda vermelha, para associar com a área de memória alocada e preenchimento verde, que se torna branco logo em seguida
                    svg_novo_no.retangulo2.fill('transparent').stroke('#F00').attr('stroke-width', 2); // Preenchimento transparente para que a cor do retângulo externo apareça e bordas vermelhas
                    await sleep(1000); // Pausa de 1 segundo (o tempo pode variar de acordo com a velocidade selecionada pelo usuário)

                    marcarLinha(2); // Linha do if que verifica que o espaço de memória foi alocado. Não possui função prática no sistema, serve somente para representação.
                    await sleep(1000);

                    marcarLinha(3); // Linha de atribuição do valor ao nó
                    svg_novo_no.texto = svg.plain(valor); // Criação do elemento de texto com o valor do nó

                    if (tipo_lista != 'lde') { // Se a lista não for duplamente encadeada
                        svg_novo_no.texto.move(meio_x + 10, pos_y - 85); // A posição do texto dentro do nó será de 10 pixels à direita da borda esquerda do nó, e 5 abaixo da borda superior)
                    }
                    else { // Se a lista for duplamente encadeada
                        svg_novo_no.texto.move(meio_x + 15, pos_y - 85); // A posição do texto dentro do nó será de 15 pixels à direita da borda esquerda do nó, e 5 abaixo da borda superior)
                    }

                    preencherMemoria(valor, area_valor, 'no->valor'); // O valor do nó é inserido dentro da área reservada para ele na memória (primeira área)
                    await sleep(1000);

                    var medidas_texto_nulo_1 = lista.elem_svg.texto_nulo_1.bbox(); // São obtidos os dados de posição e medidas do primeiro texto "NULL"
                    if ((lista.primeiro == null || posicao == 0) && tipo_lista != 'lse_ord' && tipo_lista != 'fila') { // Se a inserção for no início (estando a lista vazia ou não) e a lista não for ordenada
                        novo_no = new No(valor, null); // É criado o objeto que representa o nó
                        novo_no.x = pos_inicial; // A posição do novo nó é definida como sendo a posição inicial a partir do qual os elementos do nó são inseridos. Esse valor é definido na variável "pos_inicial", definida no início do código
                        novo_no.y = pos_y; // A altura do nó é definida como a altura padrão dos nós, também definida no início do código
                        novo_no.prox_no = lista.primeiro; // O ponteiro de próximo nó do novo nó aponta internamente para o nó que atualmente ocupa a primeira posição, ou para NULL, se a lista estiver vazia

                        if (lista.primeiro == null) { // Se a lista estiver vazia
                            var pos_x_texto_nulo = novo_no.x + dist_padrao; // Uma variável é criada para definir a nova posição no eixo X do primeiro texto "NULL". Nesse caso, ele será movido para a posição seguinte à do novo nó, em posição equivalente à de um "segundo" nó

                            if (tipo_lista != 'lde') {
                                var pos_y_texto_nulo = pos_y + (alt_no / 2) - (medidas_texto_nulo_1.height / 2); // Outra variável é criada para definir a nova posição no eixo Y do primeiro texto "NULL". A posição será na metade da altura do nó
                            }
                            else {
                                var pos_y_texto_nulo = pos_y + (alt_no / 2) + (alt_no / 4) - (medidas_texto_nulo_1.height / 2); // Outra variável é criada para definir a nova posição no eixo Y do primeiro texto "NULL". A posição será na metade da altura do nó mais 1/4 da altura. O acréscimo de 1/4 ocorre para que o texto fique na direção da seta de próximo no caso da lista duplamente encadeada
                            }
                            lista.elem_svg.texto_nulo_1.animate(500).move(pos_x_texto_nulo, pos_y_texto_nulo); // O primeiro texto "NULL" é movido para a posição definida nas variáveis

                            lista.elem_svg.seta_inicio.animate(500).plot('M' + (medidas_texto_prim.x + medidas_texto_prim.width + 10) + ' ' + (medidas_texto_prim.y + (medidas_texto_prim.height / 2)) + ' L' + (pos_x_texto_nulo + Math.floor(medidas_texto_nulo_1.width / 2)) + ' ' + (pos_y_texto_nulo - 5)); // A seta que vem do ponteiro que indica o primeiro elemento passa a apontar para a nova posição onde se encontra o texto NULL

                            if (tipo_lista == 'lde') { // Se a lista for duplamente encadeada
                                var medidas_texto_nulo_2 = lista.elem_svg.texto_nulo_2.bbox(); // São obtidos os dados de posição e medidas do segundo texto "NULL", utilizado no início da lista duplamente encadeada, para que o ponteiro anterior do primeiro elemento também aponte para "NULL"
                                var pos_x_texto_nulo_2 = 10; // A posição no eixo X para o segundo texto "NULL" é definida como sendo a 10 pixels da borda esquerda
                                var pos_y_texto_nulo_2 = pos_y + (alt_no / 2) - (alt_no / 4) - (medidas_texto_nulo_2.height / 2); // A posição no eixo Y para o segundo texto "NULL" é definida como sendo na metade da altura do nó menos 1/4
                                lista.elem_svg.texto_nulo_2.style('display', 'inline').move(pos_x_texto_nulo_2, pos_y_texto_nulo_2); // O segundo texto "NULL" é exibido e movido para a posição definida na variável anterior no eixo X, e na mesma altura 
                            }
                        }
                        else { // Se a inserção for no início, mas a lista não estiver vazia
                            deslocarNos(0, 'direita'); // Os nós existentes são deslocados para a direita, juntamente o NULL que está no final
                            lista.elem_svg.seta_inicio.animate(500).plot('M' + (medidas_texto_prim.x + medidas_texto_prim.width / 2) + ' ' + (medidas_texto_prim.y + medidas_texto_prim.height) + ' L' + (lista.primeiro.x + (larg_no / 2)) + ' ' + (pos_y - 5)); // A seta do ponteiro do primeiro elemento tem a extremidade do final deslocada para acompanhar a nova posição do primeiro nó
                        }

                        marcarLinha(4); // A linha que define para onde o ponteiro prox do novo nó irá apontar (apontará para o primeiro elemento atual) é marcada
                    }
                    else {
                        if (tipo_lista != 'fila') {
                            var x_pont_anterior = medidas_texto_nulo_1.x; // É criada a variável que define a posição no eixo X do ponteiro vermelho "ant", que indica para qual elemento a variável temporária "ant" está apontando. Deve apontar inicialmente para o texto "NULL"
                            var y_pont_anterior = pos_y + alt_no; // É criada a variável que define a posição no eixo Y do ponteiro "ant"
                            var medidas_pont_ant = lista.elem_svg.pont_anterior.bbox(); // São obtidos os dados de posição e medidas do texto do ponteiro "ant"
                            if (tipo_lista != 'lse_ord') { // Se a lista não for ordenada
                                marcarLinha(8); // É marcada antes a linha que cria a variável i, contador utilizado para que seja possível localizar a posição onde o usuário deseja inserir o elemento. Somente é necessária se a lista for desordenada, já que, caso seja ordenada, a posição não é conhecida inicialmente
                                memoria_contador_i = alocarMemoria('var_temp', 1);
                                preencherMemoria('0', memoria_contador_i, 'i');
                                memoria_variaveis.push({ variavel: 'i', endereco: memoria_contador_i });
                                await sleep(1000);
                            }
                            else { // Se a lista for ordenada
                                if (lista.primeiro == null) { // Se a lista estiver vazia
                                    y_pont_anterior = medidas_texto_nulo_1.y + medidas_texto_nulo_1.height; // O texto do ponteiro "ant" ficará 20 pixels abaixo do primeiro texto "NULL", que nesse momento está na parte superior da tela
                                }
                            }

                            marcarLinha(9); // É marcada a linha que declara o ponteiro "ant" no código e o faz apontar para NULL
                            moverPonteiroAuxiliar('ant', x_pont_anterior, y_pont_anterior, false); // É chamada a função que move um ponteiro auxiliar ("ant", nesse caso) para a posição especificada

                            memoria_ponteiro_ant = alocarMemoria('var_temp', 1);
                            preencherMemoria('NULL', memoria_ponteiro_ant, 'ant');
                            memoria_variaveis.push({ variavel: 'ant', endereco: memoria_ponteiro_ant });

                            await sleep(1000);

                            marcarLinha(10); // É marcada a linha do código que cria o ponteiro "pos" e o faz apontar para o primeiro elemento da lista

                            if (lista.primeiro != null) { // Se a lista não estiver vazia
                                moverPonteiroAuxiliar('pos', lista.primeiro.x, lista.primeiro.y + alt_no, false); // O ponteiro "pos" é movido para o primeiro elemento da lista
                            }
                            else { // Se a lista estiver vazia
                                moverPonteiroAuxiliar('pos', medidas_texto_nulo_1.x + medidas_pont_ant.width + 5, y_pont_anterior, false); // O ponteiro "pos" é movido para o texto "NULL"
                            }

                            memoria_ponteiro_pos = alocarMemoria('var_temp', 1);
                            preencherMemoria((lista.primeiro != null ? '&' + lista.primeiro.memoria : 'NULL'), memoria_ponteiro_pos, 'pos');
                            memoria_variaveis.push({ variavel: 'pos', endereco: memoria_ponteiro_pos });

                            await sleep(1000);

                            aux_lista = lista.primeiro; // A variável interna auxiliar de busca criada no início da função aponta para o primeiro elemento

                            var i = 0; // A variável que conta os índices para localizar o elemento que está atualmente na posição onde o novo elemento será inserido é criada e inicializada com 0
                            var condicao; // É criada uma variável para determinar a condição que deve manter o loop no while. Essa variável foi criada por existirem duas possibilidades de entrada nesse trecho do código, que são quando a inserção não é no início ou quando a lista é ordenada
                            if (tipo_lista != 'lse_ord') { // Se a lista não for ordenada
                                marcarLinha(11); // A linha marcada será a que corresponde à linha do while com o texto "while (i < posicao)"
                                condicao = (i < posicao); // A condição de verificação será "enquanto i for menor que a posição desejada"
                            }
                            else { // Se a lista for ordenada
                                marcarLinha(17); // A linha marcada será a que corresponde à linha do while com o texto "while (pos != null && v < pos->valor) {"
                                condicao = (aux_lista != null && aux_lista.valor < valor); // A condição de verificação será "enquanto a lista não tiver chegado ao fim nem tiver sido encontrado valor maior que o do novo elemento a ser inserido"
                            }
                            await sleep(1000);
                            no_ant = null; // A variável interna que aponta para o elemento anterior ao que será criado é criada e aponta, inicialmente, para NULL

                            while (condicao) { // Enquanto a condição definida na variável "condicao" for verdadeira
                                marcarLinha(12); // A linha que atribui à variável "ant" o valor da variável "pos" é marcada
                                moverPonteiroAuxiliar('pos', aux_lista.x + medidas_pont_ant.width + 5, aux_lista.y + alt_no, true); // O ponteiro "pos" é movido alguns pixels para a direita, para que o ponteiro "ant" ocupe seu lugar
                                moverPonteiroAuxiliar('ant', aux_lista.x, aux_lista.y + alt_no, true); // O ponteiro "ant" é movido para o início do nó, onde antes estava o ponteiro "pos"
                                no_ant = aux_lista; // A variável que armazena o nó que está na posição anterior à do nó que será inserido recebe o elemento que está na posição atual
                                preencherMemoria((no_ant.memoria != null ? '&' + no_ant.memoria : 'NULL'), memoria_ponteiro_ant, null);
                                await sleep(1000);

                                marcarLinha(13); // A linha que faz a variável "pos" do código apontar para o próximo elemento é marcada
                                aux_lista = aux_lista.prox_no; // A variável aux_lista passa a apontar para o próximo elemento
                                if (aux_lista !== null) { // Se o final da lista não tiver sido alcançado
                                    moverPonteiroAuxiliar('pos', aux_lista.x, aux_lista.y + alt_no, true); // O ponteiro "pos" é movido para o elemento seguinte
                                }
                                else { // Se o final da lista foi alcançado
                                    moverPonteiroAuxiliar('pos', medidas_texto_nulo_1.x, pos_y + alt_no, true); // O ponteiro "pos" passa a apontar para NULL
                                }
                                preencherMemoria((aux_lista != null ? '&' + aux_lista.memoria : 'NULL'), memoria_ponteiro_pos, null);
                                await sleep(1000);

                                i++;

                                if (tipo_lista != 'lse_ord') { // Se a lista não for ordenada
                                    marcarLinha(14); // A linha "i++" do código é marcada para indicar o incremento da variável i
                                    preencherMemoria(i, memoria_contador_i, null);
                                    await sleep(1000);

                                    marcarLinha(11); // A linha marcada será a que corresponde à linha do while com o texto "while (i < posicao)"
                                    condicao = (i < posicao); // A condição de verificação será "enquanto i for menor que a posição desejada"
                                    await sleep(1000);
                                }
                                else { // Se a lista for ordenada
                                    marcarLinha(17); // A linha marcada será a que corresponde à linha do while com o texto "while (pos != null && v < pos->valor) {"
                                    condicao = (aux_lista != null && aux_lista.valor < valor); // A condição de verificação será "enquanto a lista não tiver chegado ao fim nem tiver sido encontrado valor maior que o do novo elemento a ser inserido"
                                    await sleep(1000);
                                }
                            }

                            if (tipo_lista == 'lse_ord') { // Se a lista for ordenada
                                posicao = i; // A variável "posicao" recebe o valor da posição encontrada no loop, já que até então a posição não era conhecida
                                marcarLinha(39); // A linha que verifica se a inserção é no início é marcada
                                await sleep(1000);
                            }
                        }
                        else {
                            aux_lista = null;
                            no_ant = lista.fim;
                        }

                        novo_no = new No(valor, aux_lista); // O objeto do nó é criado, passando o valor do nó, o elemento seguinte e o anterior

                        if (no_ant != null) { // Se a inserção não for no início

                            novo_no.prox_no = aux_lista; // O ponteiro de próximo elemento do novo nó aponta para o elemento que atualmente ocupa a posição que será ocupada pelo novo elemento

                            novo_no.x = no_ant.x + dist_padrao; // O novo nó ficará posicionado na posição seguinte à do último elemento no eixo X
                            novo_no.y = pos_y; // O novo nó ficará posicionado na posição padrão para os elementos no eixo Y
                            deslocarNos(posicao, 'direita'); // Todos os nós que estejam depois da posição do novo nó são deslocados para a direita

                            var x_seta_elem_ant = no_ant.x + larg_no; // O início no eixo X da seta "prox" do elemento anterior é obtido para que a seta possa ser modificada
                            var y_seta_elem_ant;

                            if (tipo_lista != 'lde') { // Se a lista não for duplamente encadeada
                                y_seta_elem_ant = Math.floor((no_ant.y + (alt_no / 2))); // O início no eixo Y da seta "prox" do elemento anterior será no meio da altura do elemento
                            }
                            else {
                                y_seta_elem_ant = Math.floor((no_ant.y + (alt_no / 2) + (alt_no / 4))); // O início no eixo Y da seta "prox" do elemento anterior será no meio da altura do elemento acrescido de 1/4 da altura
                            }
                        }
                        else {
                            novo_no.x = pos_inicial;
                            novo_no.y = pos_y;
                            novo_no.prox_no = lista.primeiro;

                            if (lista.primeiro == null) {
                                x_texto_nulo = novo_no.x + dist_padrao;
                                y_texto_nulo = pos_y + (alt_no / 2) - (medidas_texto_nulo_1.height / 2);
                                lista.elem_svg.texto_nulo_1.animate(500).move(x_texto_nulo, y_texto_nulo);

                                if (tipo_lista != 'fila') {
                                    lista.elem_svg.seta_inicio.animate(500).plot('M' + (medidas_texto_prim.x + medidas_texto_prim.width + 10) + ' ' + (medidas_texto_prim.y + (medidas_texto_prim.height / 2)) + ' L' + (x_texto_nulo + Math.floor(medidas_texto_nulo_1.width / 2)) + ' ' + (y_texto_nulo - 5));
                                }
                                else { // Se o tipo da lista for uma fila (já que a fila é a única que possui o ponteiro de último elemento)
                                    lista.elem_svg.seta_inicio.animate(500).plot('M' + (medidas_texto_prim.x + medidas_texto_prim.width + 10) + ' ' + (medidas_texto_prim.y + (medidas_texto_prim.height / 2)) + ' L' + (x_texto_nulo) + ' ' + (y_texto_nulo - 5)); // A seta que vem do ponteiro que indica o primeiro elemento passa a apontar para a nova posição onde se encontra o texto NULL (possui uma pequena diferença em relação à seta de outras estruturas, pois aponta para o início do NULL, para que as extremidades das setas de início e fim não se encontrem)
                                    lista.elem_svg.seta_fim.animate(500).plot('M' + (medidas_texto_fim.x - 10) + ' ' + (medidas_texto_fim.y + (medidas_texto_fim.height / 2)) + ' L' + (x_texto_nulo + medidas_texto_nulo_1.width) + ' ' + (y_texto_nulo - 5)); // A seta que vem do ponteiro que indica o último elemento passa a apontar para a nova posição onde se encontra o texto NULL
                                }

                                if (tipo_lista == 'lse_ord') {
                                    x_pont_anterior = x_texto_nulo;
                                    y_pont_anterior = pos_y + alt_no;

                                    moverPonteiroAuxiliar('ant', x_pont_anterior, y_pont_anterior, true);
                                    moverPonteiroAuxiliar('pos', x_pont_anterior + medidas_pont_ant.width + 5, y_pont_anterior, true);
                                }
                            }
                            if (lista.primeiro != null && posicao == 0) {
                                deslocarNos(0, 'direita');
                                lista.elem_svg.seta_inicio.animate(500).plot('M' + (medidas_texto_prim.x + medidas_texto_prim.width / 2) + ' ' + (medidas_texto_prim.y + medidas_texto_prim.height) + ' L' + (lista.primeiro.x + (larg_no / 2)) + ' ' + (pos_y - 5));
                            }

                            if (tipo_lista != 'fila') {
                                marcarLinha(4);
                            }
                        }
                    }

                    if (posicao > 0 || tipo_lista == 'fila') { // Se a inserção não for no início ou a lista for uma fila
                        marcarLinha(15); // Linha que define que para onde o ponteiro prox do novo nó apontará.
                        await sleep(500, true);
                    }

                    /*Os elementos do nó são deslocados para baixo, juntamente com suas setas*/
                    svg_novo_no.retangulo1.animate(500).move(novo_no.x, pos_y + (alt_no + 10));

                    if (tipo_lista != 'lde') {
                        svg_novo_no.retangulo2.animate(500).move(novo_no.x, pos_y + (alt_no + 10)); // Os dois retângulos são movidos para 10 pixels abaixo da parte inferior dos outros nós, e para a posição que ocupará no eixo X (posição do nó que ocupava anteriormente a posição, ou posição inicial no caso de uma inserção no início)
                        svg_novo_no.texto.animate(500).move(novo_no.x + 10, novo_no.y + (alt_no + 10) + 5); // O texto é movido para a nova posição do nó
                    }
                    else {
                        svg_novo_no.retangulo2.animate(500).move(novo_no.x + (larg_no * 0.18), pos_y + (alt_no + 10));
                        svg_novo_no.texto.animate(500).move(novo_no.x + 15, novo_no.y + (alt_no + 10) + 5); // O texto é movido para a nova posição do nó
                    }
                    /*----------------------------------------------------------------------*/

                    await sleep(1000, true); // Pausa de 1 segundo que deve ser pulada caso esteja em modo manual, já que essa movimentação é unicamente visual, e não há linha no código que seja correspondente. Para que seja possível pular no modo manual, é definido o segundo parâmetro (pular), como true.

                    var x_seta_prox = novo_no.x + larg_no; // Define o início da seta do novo elemento para o próximo elemento no eixo X
                    var y_seta_prox;  // Define o fim da seta do novo elemento para o próximo elemento no eixo Y
                    if (tipo_lista != 'lde') { // Se a lista não for duplamente encadeada, o fim da seta "prox" será no meio da altura do nó seguinte
                        y_seta_prox = Math.floor((novo_no.y + (alt_no / 2)));
                    }
                    else { // Senão, o fim será na parte de baixo do nó seguinte
                        y_seta_prox = Math.floor(novo_no.y + (alt_no / 2) + (alt_no / 4));
                    }

                    svg_novo_no.seta_direita = svg.path('M' + x_seta_prox + ' ' + (y_seta_prox + (alt_no + 10))).stroke('#000').attr('stroke-width', 2).marker('end', marker_seta);
                    svg_novo_no.seta_direita.animate(500).plot('M' + x_seta_prox + ' ' + (y_seta_prox + (alt_no + 10)) + ' L' + (x_seta_prox + 20) + ' ' + (pos_y + alt_no));

                    preencherMemoria((novo_no.prox_no != null ? '&' + novo_no.prox_no.memoria : 'NULL'), area_endereco_prox, 'no->prox'); // A área da memória onde está o ponteiro para o nó seguinte do novo nó é preenchida com o endereço do nó que ficará na posição seguinte ou com NULL caso não haja elemento posterior.

                    await sleep(1000);

                    if (tipo_lista == 'lde') { // Se for uma lista duplamente encadeada
                        if (posicao == 0) { // Se a inserção for no início
                            marcarLinha(50); // A linha que que verifica se a lista está vazia é marcada
                            await sleep(1000);
                            if (lista.primeiro != null) { // Se a lista não está vazia
                                marcarLinha(51); // A linha que define o ponteiro "ant" do elemento que atualmente ocupa a primeira posição é marcada
                                lista.primeiro.elem_svg.seta_esquerda.animate(500).plot('M' + lista.primeiro.x + ' ' + (pos_y + (alt_no / 2) - (alt_no / 4)) + ' L' + (lista.primeiro.x - 20) + ' ' + (pos_y + alt_no + 10));
                                lista.primeiro.no_ant = novo_no;

                                preencherMemoria('&' + area_valor, lista.primeiro.memoria + 8, 'no->ant');  // A área da memória onde está o ponteiro para o nó anterior do primeiro elemento atual é preenchida com o endereço do novo nó.
                                await sleep(1000);
                            }
                        }
                    }

                    if (tipo_lista != 'fila') { // Se não for uma fila
                        if (lista.primeiro == null || posicao == 0) { // Se a inserção for no início
                            marcarLinha(5); // A linha que indica para onde o ponteiro do primeiro elemento deve apontar é marcada
                            lista.elem_svg.seta_inicio.animate(500).plot('M' + (medidas_texto_prim.x + medidas_texto_prim.width / 2) + ' ' + (medidas_texto_prim.y + medidas_texto_prim.height) + ' L' + (medidas_texto_prim.x + medidas_texto_prim.width / 2) + ' ' + (pos_y + (alt_no + 10) - 5)); // A seta do início passa a apontar para o novo elemento
                            lista.primeiro = novo_no;  // O ponteiro interno do primeiro elemento é definido
                            preencherMemoria('&' + area_valor, memoria_primeiro, null); // A área de memória correspondente ao ponteiro do primeiro elemento é preenchida com o endereço do novo primeiro elemento da lista
                            await sleep(1000);
                        }
                        else {
                            marcarLinha(16); // A linha que define para onde o ponteiro "prox" do elemento anterior deve apontar é marcada (apontará para o novo nó)
                            no_ant.elem_svg.seta_direita.animate(500).plot('M' + x_seta_elem_ant + ' ' + y_seta_elem_ant + ' L' + (x_seta_elem_ant + 20) + ' ' + (y_seta_prox + (alt_no + 10)));
                            no_ant.prox_no = novo_no; // O ponteiro interno do nó anterior para o próximo nó é definido						
                            preencherMemoria('&' + area_valor, no_ant.memoria + 4, 'no->prox'); // A área de memória onde se encontra o ponteiro "prox" do nó anterior é atualizada com o endereço do novo elemento						
                            await sleep(1000);
                        }
                    }
                    else { // Se for uma fila
                        marcarLinha(37); // A linha que verifica se a fila está vazia é marcada. A verificação é feita devido a todas as inserções na fila serem feitas no final, e, caso seja a primeira inserção, é necessário que o ponteiro do primeiro elemento também aponte para o novo elemento.
                        await sleep(1000);
                        if (lista.primeiro == null) { // Se a inserção for no início
                            marcarLinha(5); // A linha que indica para onde o ponteiro do primeiro elemento deve apontar é marcada
                            lista.elem_svg.texto_inicio.animate(500).move(novo_no.x - medidas_texto_prim.width, novo_no.y - 50); // O texto 'f->prim' é movido para antes do nó, para que seja possível que os ponteiros 'prim' e 'fim' fiquem no mesmo nó
                            lista.elem_svg.seta_inicio.animate(500).plot('M' + (novo_no.x - (medidas_texto_prim.width / 2)) + ' ' + ((novo_no.y - 50) + (medidas_texto_prim.height)) + ' L' + (novo_no.x) + ' ' + (novo_no.y - 5 + (alt_no + 10))); // A seta que vem do ponteiro que indica o primeiro elemento passa a apontar para a nova posição onde se encontra o primeiro elemento (possui uma pequena diferença em relação à seta de outras estruturas, pois aponta para o início do elemento, para que as extremidades das setas de início e fim não se encontrem)
                            lista.primeiro = novo_no; // O ponteiro interno do primeiro elemento é definido
                            preencherMemoria('&' + area_valor, memoria_primeiro, null);
                            await sleep(1000);

                            marcarLinha(33); // A linha que verifica se o último elemento é diferente de NULL é marcada (somente para representação, já que se a inserção é no início em uma fila, o fim está vazio)
                            await sleep(1000);

                            marcarLinha(36); // A linha que indica para onde o ponteiro do último elemento deve apontar é marcada
                            lista.elem_svg.texto_fim.animate(500).move(novo_no.x + larg_no, novo_no.y - 50); // O texto 'f->fim' é movido para depois do nó, para que seja possível que os ponteiros 'prim' e 'fim' fiquem no mesmo nó
                            lista.elem_svg.seta_fim.animate(500).plot('M' + (novo_no.x + larg_no + (medidas_texto_fim.width / 2)) + ' ' + ((novo_no.y - 50) + (medidas_texto_fim.height)) + ' L' + (novo_no.x + larg_no) + ' ' + (novo_no.y - 5)); // A seta que vem do ponteiro que indica o último elemento passa a apontar para a nova posição onde se encontra o primeiro elemento (possui uma pequena diferença em relação à seta de outras estruturas, pois aponta para o fim do elemento, para que as extremidades das setas de início e fim não se encontrem)
                        }
                        else {
                            marcarLinha(33); // A linha que verifica se o último elemento é diferente de NULL é marcada (somente para representação, já que se o primeiro é nulo, o último também é nulo)
                            await sleep(1000);

                            marcarLinha(34); // A linha que define para onde o ponteiro "prox" do último elemento deve apontar é marcada (apontará para o novo nó)*/
                            no_ant.elem_svg.seta_direita.animate(500).plot('M' + x_seta_elem_ant + ' ' + y_seta_elem_ant + ' L' + (x_seta_elem_ant + 20) + ' ' + (y_seta_prox + (alt_no + 10)));
                            no_ant.prox_no = novo_no; // O ponteiro interno do nó anterior para o próximo nó é definido
                            preencherMemoria('&' + area_valor, no_ant.memoria + 4, 'no->prox'); // A área de memória onde se encontra o ponteiro "prox" do nó anterior é atualizada com o endereço do novo elemento
                            await sleep(1000);

                            marcarLinha(36); // A linha que define para onde o ponteiro 'f->fim' deve apontar é marcada (apontará para o novo elemento)
                            if (lista.quant_nos == 1) { // Se a lista só tiver um elemento
                                lista.elem_svg.texto_inicio.animate(500).move(pos_inicial, pos_y - 50); // O texto 'f->fim' é movido para posição normal, acima do elemento. Essa movimentação acontece por conta de que quando a lista tem somente um elemento, 'f->prim' e 'f->fim' se encontram, e é necessário um deslocamento para o lado em cada um para que não fiquem sobrepostos. Nesse ponto, o deslocamento é desfeito.
                                lista.elem_svg.seta_inicio.animate(500).plot('M' + (pos_inicial + (medidas_texto_prim.width / 2)) + ' ' + ((pos_y - 50) + (medidas_texto_prim.height)) + ' L' + (pos_inicial + (medidas_texto_prim.width / 2)) + ' ' + (pos_y - 5)); // A seta também retorna para sua posição normal
                            }
                            lista.elem_svg.texto_fim.animate(500).move(novo_no.x, pos_y - 50); // Após o reposicionamento, caso necessário, do ponteiro 'f->prim', o ponteiro 'f->fim' é deslocado para cima do novo nó
                            lista.elem_svg.seta_fim.animate(500).plot('M' + (novo_no.x + (medidas_texto_fim.width / 2)) + ' ' + ((pos_y - 50) + (medidas_texto_fim.height)) + ' L' + (novo_no.x + (medidas_texto_fim.width / 2)) + ' ' + (novo_no.y - 5)); // A seta que vem do ponteiro que indica o último elemento passa a apontar para a nova posição onde se encontra o primeiro elemento (possui uma pequena diferença em relação à seta de outras estruturas, pois aponta para o fim do elemento, para que as extremidades das setas de início e fim não se encontrem)
                        }
                        lista.fim = novo_no; // O ponteiro interno para o último elemento é definido
                        preencherMemoria('&' + area_valor, memoria_fim, null);
                    }

                    if (tipo_lista == 'lde') {
                        marcarLinha(44); // A linha que define para onde ponteiro "ant" do novo nó deve apontar é marcada
                        var y_seta_ant = Math.floor((pos_y + (alt_no / 2) - (alt_no / 4))); // É calculada a altura onde deve ficar a ponta da seta para o elemento anterior do novo nó
                        svg_novo_no.seta_esquerda = svg.path('M' + novo_no.x + ' ' + (pos_y + (alt_no / 2) - (alt_no / 4) + (alt_no + 10))).stroke('#000').attr('stroke-width', 2).marker('end', marker_seta);
                        svg_novo_no.seta_esquerda.animate(500).plot('M' + novo_no.x + ' ' + (pos_y + (alt_no / 2) - (alt_no / 4) + (alt_no + 10)) + ' L' + (novo_no.x - 20) + ' ' + y_seta_ant);
                        novo_no.no_ant = no_ant;

                        preencherMemoria((no_ant != null ? ('&' + no_ant.memoria) : 'NULL'), area_valor + 8, 'no->ant'); // A área da memória onde está o ponteiro para o nó anterior do novo nó é preenchida com o endereço do nó que ficará na posição anterior ou com NULL caso não haja elemento anterior.
                        await sleep(1000);

                        if (posicao > 0) {
                            marcarLinha(52); // A linha que verifica se o ponteiro pra o próximo nó é diferente de nulo é marcada
                            await sleep(1000);
                            if (novo_no.prox_no != null) {
                                marcarLinha(18); // A linha que define para onde ponteiro "ant" do nó seguinte deve apontar é marcada
                                novo_no.prox_no.elem_svg.seta_esquerda.animate(500).plot('M' + (novo_no.prox_no.x) + ' ' + (pos_y + (alt_no / 2) - (alt_no / 4)) + ' L' + (novo_no.prox_no.x - 20) + ' ' + (pos_y + alt_no + 10));
                                preencherMemoria('&' + area_valor, novo_no.prox_no.memoria + 8, 'no->ant'); // A área da memória onde está o ponteiro para o nó anterior do novo nó é preenchida com o endereço do nó que ficará na posição anterior ou com NULL caso não haja elemento anterior.
                                await sleep(1000);
                            }
                        }
                    }

                    /*Os elementos do nó são deslocados para cima, juntamente com suas setas*/
                    svg_novo_no.retangulo1.animate(500).move(novo_no.x, pos_y);

                    if (tipo_lista != 'lde') {
                        svg_novo_no.retangulo2.animate(500).move(novo_no.x, pos_y);
                        svg_novo_no.texto.animate(500).move(novo_no.x + 10, novo_no.y + 5);
                    }
                    else {
                        svg_novo_no.retangulo2.animate(500).move(novo_no.x + (larg_no * 0.18), pos_y);
                        svg_novo_no.texto.animate(500).move(novo_no.x + 15, novo_no.y + 5);
                        svg_novo_no.seta_esquerda.animate(500).plot('M' + novo_no.x + ' ' + (y_seta_ant) + ' L' + (novo_no.x - 20) + ' ' + y_seta_ant);
                        if (novo_no.prox_no != null) {
                            novo_no.prox_no.elem_svg.seta_esquerda.animate(500).plot('M' + novo_no.prox_no.x + ' ' + (y_seta_ant) + ' L' + (novo_no.prox_no.x - 20) + ' ' + y_seta_ant);
                        }
                    }
                    /*----------------------------------------------------------------------*/

                    if (posicao == 0) {
                        if (tipo_lista == 'fila') { // Se for uma fila e a inserção for no início
                            lista.elem_svg.seta_inicio.animate(500).plot('M' + (novo_no.x - (medidas_texto_prim.width / 2)) + ' ' + ((novo_no.y - 50) + (medidas_texto_prim.height)) + ' L' + (novo_no.x) + ' ' + (novo_no.y - 5)); // A seta que vem do ponteiro que indica o primeiro elemento passa a apontar para a nova posição onde se encontra o primeiro elemento (possui uma pequena diferença em relação à seta de outras estruturas, pois aponta para o início do elemento, para que as extremidades das setas de início e fim não se encontrem)
                        }
                        else {
                            lista.elem_svg.seta_inicio.animate(500).plot('M' + (pos_inicial + (medidas_texto_prim.width / 2)) + ' ' + ((pos_y - 80) + (medidas_texto_prim.height)) + ' L' + (pos_inicial + (medidas_texto_prim.width / 2)) + ' ' + (pos_y - 5)); // A seta do ponteiro do início da lista retorna para sua posição normal
                        }
                    }

                    svg_novo_no.seta_direita.animate(500).plot('M' + x_seta_prox + ' ' + (y_seta_prox) + ' L' + (x_seta_prox + 20) + ' ' + y_seta_prox);

                    if (lista.primeiro != null && posicao > 0) {
                        no_ant.elem_svg.seta_direita.animate(500).plot('M' + x_seta_elem_ant + ' ' + y_seta_elem_ant + ' L' + (x_seta_elem_ant + 20) + ' ' + y_seta_elem_ant);
                    }

                    novo_no.elem_svg = svg_novo_no; // O objeto contendo as referências para os elementos SVG do nó é armazenado no nó
                    novo_no.memoria = area_valor; // A área de memória alocada para o nó é armazenada no nó

                    await sleep(1000);

                    marcarLinha(6);
                    lista.quant_nos++;
                    preencherMemoria(lista.quant_nos, memoria_quantidade, null);
                    await sleep(1000);

                    marcarLinha(7);
                    await sleep(1000, true);

                    no_recente = novo_no;
                    j++;
                }
                desbloquearBotoes();
                $('#tipo-lista').removeAttr('disabled'); // A caixa de escolha do tipo de lista é desbloqueada
            }
            else {
                alert('O número máximo de elementos na lista é 7.');
            }
        }

		/*
			Função responsável por iniciar a remoção de elementos
		*/
        async function removerElemento(valor) {
            var no_ant; // Variável para determinar o nó anterior ao nó que será inserido
            bloquearBotoes(); // Os botões de manipulação da lista são bloqueados
            $('#tipo-lista').attr('disabled', 'disabled'); // A caixa de escolha do tipo de lista é bloqueada, para evitar que o usuário realize alterações durante uma operação
            marcarLinha(21); // A linha que verifica se a lista está vazia é marcada
            await sleep(1000);

            if (lista.primeiro != null) { // Se a lista não estiver vazia
                ocultarPonteiros(); // Os ponteiros 'ant' e 'pos' são ocultados
                desalocarVariaveisTemporarias(); // Remove as variáveis temporárias utilizadas em operações anteriores da memória

                if (tipo_lista != 'pilha' && tipo_lista != 'fila') { // Se a estrutura não for uma pilha nem uma fila
                    pesquisa = pesquisarElemento(valor, 'remocao'); // É realizada a pesquisa pelo elemento utilizando a mesma função utilizada na busca
                    pesquisa.then(async function (elemento) { // Por ser uma função assíncrona usando 'promises', o callback deve ser através da função 'then' do objeto 'promise' retornado.
                        removerDesenhoNo(elemento);
						/* A continuação da remoção é realizada através da função removerDesenhoNo, que recebe o retorno recebido da função de pesquisa, que pode ser um objeto contendo o nó localizado, a posição e o nó anterior ou false, caso o elemento não seja localizado.
						 Não é necessário tratar de quando o elemento não é localizado aqui, porque tudo é feito na própria função de pesquisa.*/
                    });
                }
                else { // Se for uma pilha ou fila
                    marcarLinha(45); // A linha que armazena o elemento que atualmente ocupa a primeira posição em uma variável temporária é marcada
                    var memoria_variavel_temp = alocarMemoria('var_temp', 1);
                    preencherMemoria('&' + lista.primeiro.memoria, memoria_variavel_temp, 'temp');
                    memoria_variaveis.push({ variavel: 'temp', endereco: memoria_variavel_temp });
                    await sleep(1000);
                    removerDesenhoNo(lista.primeiro); // Quando se trata de uma pilha ou fila, não é necessária nenhuma pesquisa, já que ambas as estruturas possuem remoção exclusiva no início.
                }
            }
            else { // Se a lista estiver vazia
                marcarLinha(30); // A linha do "else" é marcada
                await sleep(1000);

                marcarLinha(31) // A linha que imprime a mensagem "Lista vazia" é marcada, para representar a mensagem exibida
                alert('Lista vazia'); // É exibida a mensagem informando que a lista está vazia
                await sleep(1000);

                marcarLinha(32) // É marcada a linha de retorno da função para indicar que a execução terminou
                await sleep(1000);

                desbloquearBotoes(); // Os botões são desbloqueados, já que a execução terminou.
                $('#tipo-lista').removeAttr('disabled'); // A caixa de escolha do tipo de lista é desbloqueada
            }
        }

		/*
			Função responsável por concluir a remoção de elementos
		*/
        async function removerDesenhoNo(elemento) {
            if (elemento != false) { // Se tiver sido localizado o elemento
                var medidas_texto_prim = lista.elem_svg.texto_inicio.bbox(); // São obtidas as medidas do texto que indica o primeiro elemento da lista
                var medidas_texto_fim; // A variável destinada à obtenção das medidas do texto que indica o último elemento da lista é criada, para o caso de se tratar de uma fila
                var no_ant, no, pos;

                if (tipo_lista != 'pilha' && tipo_lista != 'fila') { // Se a estrutura não for uma fila nem pilha
                    no_ant = elemento['ant']; // As variáveis locais recebem os valores vindos da pesquisa
                    no = elemento['no'];
                    pos = elemento['pos'];
                }
                else { // Se for uma pilha ou fila
                    no_ant = null; // A inserção será sempre no início, logo o nó anterior será nulo
                    no = lista.primeiro; // O nó a ser removido será sempre o primeiro
                    pos = 0; // A posição de remoção será sempre a primeira
                }

                if (tipo_lista != 'pilha' && tipo_lista != 'fila') {
                    marcarLinha(39); // A linha que verifica se o elemento anterior é nulo é marcada
                    await sleep(1000);
                }

                if (pos > 0) { // Se a remoção não for no início
                    marcarLinha(53); // A linha do "else" é marcada, indicando que a remoção não é no início
                    await sleep(1000);

                    marcarLinha(41); // A linha que faz o ponteiro "prox" do elemento anterior apontar para o elemento seguinte ao atual é marcada
                    var y_seta_prox, y_seta_ant; // São criadas as variáveis para determinar a altura das setas durante o deslocamento para baixo do nó a ser removido

                    /*Movimentação do nó a ser removido para baixo*/
                    no.elem_svg.retangulo1.animate(500).move(no.x, no.y + alt_no + 10);

                    if (tipo_lista != 'lde') {
                        no.elem_svg.retangulo2.animate(500).move(no.x, no.y + (alt_no + 10)); // Os dois retângulos são movidos para 10 pixels abaixo da parte inferior dos outros nós, e para a posição que ocupará no eixo X (posição do nó que ocupava anteriormente a posição, ou posição inicial no caso de uma inserção no início)
                        no.elem_svg.texto.animate(500).move(no.x + 10, no.y + (alt_no + 10) + 5); // O texto é movido para a nova posição do nó
                    }
                    else {
                        no.elem_svg.retangulo2.animate(500).move(no.x + (larg_no * 0.18), no.y + (alt_no + 10));
                        no.elem_svg.texto.animate(500).move(no.x + 15, no.y + (alt_no + 10) + 5); // O texto é movido para a nova posição do nó
                    }

                    /*---------------------------------------------*/
                    moverPonteiroAuxiliar('pos', no.x, no.y + (alt_no * 2) + 10, true); // O ponteiro "pos" é movido para baixo para que não seja sobreposto pelo nó

                    if (tipo_lista != 'lde') { // Se não for uma lista duplamente encadeada
                        y_seta_prox = pos_y + alt_no + 10 + (alt_no / 2); // A altura da seta "prox" do elemento anterior será na metade da altura do elemento seguinte ao atual
                        no_ant.elem_svg.seta_direita.animate(500).plot('M' + (no_ant.x + larg_no) + ' ' + (pos_y + (alt_no / 2)) + ' L' + (no_ant.x + larg_no + 20) + ' ' + y_seta_prox); // A ponta da seta "prox" do elemento anterior é movida baixo para acompanhar o nó a ser removido
                        no.elem_svg.seta_direita.animate(500).plot('M' + (no.x + larg_no) + ' ' + (pos_y + alt_no + 10 + (alt_no / 2)) + ' L' + (no.x + larg_no + 20) + ' ' + (pos_y + (alt_no))); // O início da seta "prox" do elemento a ser removido é deslocada para baixo e termina na parte de baixo do nó seguinte, para que não se sobreponha à seta do elemento anterior.
                        await sleep(1000);

                        no_ant.elem_svg.seta_direita.animate(500).plot('M' + (no_ant.x + larg_no) + ' ' + (pos_y + (alt_no / 2)) + ' L' + (no_ant.x + larg_no + dist_padrao + 20) + ' ' + (pos_y + (alt_no / 2))); // A seta "prox" do elemento anterior é movida para o elemento seguinte ao atual
                        preencherMemoria((no.prox_no != null ? '&' + no.prox_no.memoria : 'NULL'), no_ant.memoria + 4, 'no->prox'); // A área de memória do ponteiro "prox" do elemento anterior é atualizada para que aponte para o elemento seguinte ao atual.
                    }
                    else { // Se for uma lista duplamente encadeada
                        y_seta_prox = no.y + alt_no + 10 + (alt_no / 2) + (alt_no / 4); // A posição no eixo Y onde deve começar a seta "prox" do nó a ser removido e onde deve terminar a seta "ant" do nó anterior é determinada
                        y_seta_ant = no.y + alt_no + 10 + (alt_no / 2) - (alt_no / 4); // A posição no eixo Y onde deve começar a seta "ant" do nó a ser removido é determinada
                        no_ant.elem_svg.seta_direita.animate(500).plot('M' + (no_ant.x + larg_no) + ' ' + (pos_y + (alt_no / 2) + (alt_no / 4)) + ' L' + (no_ant.x + larg_no + 20) + ' ' + y_seta_prox); // A seta para o próximo nó do nó anterior tem seu fim deslocado para baixo
                        no.elem_svg.seta_esquerda.animate(500).plot('M' + (no.x) + ' ' + (y_seta_ant) + ' L' + (no.x - 20) + ' ' + (pos_y)); // A seta "ant" do nó a ser removido tem seu início deslocado para baixo
                        no.elem_svg.seta_direita.animate(500).plot('M' + (no.x + larg_no) + ' ' + (y_seta_prox) + ' L' + (no.x + larg_no + 20) + ' ' + (pos_y + (alt_no))); // A seta "ant" do nó a ser removido tem seu início deslocado para baixo
                        if (no.prox_no != null) { // Se a remoção não for no final
                            no.prox_no.elem_svg.seta_esquerda.animate(500).plot('M' + (no.prox_no.x) + ' ' + ((pos_y + (alt_no / 2) - (alt_no / 4)) + ' L' + (no.prox_no.x - 20) + ' ' + (no.y + alt_no + 10))); // A seta "ant" do nó seguinte tem a ponta deslocada para baixo acompanhando o elemento a ser removido
                        }
                        await sleep(1000);
                        no_ant.elem_svg.seta_direita.animate(500).plot('M' + (no_ant.x + larg_no) + ' ' + (pos_y + (alt_no / 2) + (alt_no / 4)) + ' L' + (no_ant.x + larg_no + dist_padrao + 20) + ' ' + (pos_y + (alt_no / 2) + (alt_no / 4)));
                        preencherMemoria((no.prox_no != null ? '&' + no.prox_no.memoria : 'NULL'), no_ant.memoria + 4, 'no->prox'); // A área de memória do ponteiro "prox" do elemento anterior é atualizada para que aponte para o elemento seguinte ao atual.
                    }
                    no_ant.prox_no = no.prox_no; // A referência interna para o próximo nó do elemento anterior é atualizada e passa a apontar para o nó seguinte ao nó que está sendo removido.
                    await sleep(1000);
                }
                else if (pos == 0) {
                    marcarLinha(40); // A linha que faz o ponteiro para o primeiro elemento apontar para o elemento seguinte ao que está sendo removido é marcada
                    lista.primeiro = no.prox_no; // A referência interna para o primeiro elemento é atualizada e passa a apontar para o elemento seguinte ao que está sendo removido
                    if (lista.quant_nos == 1) { // Se o elemento que está sendo removido for o único restante
                        moverPonteiroLista('inicio', 'PRIM_OU_FIM_APONTAM_NULO', null, true); // O ponteiro para o primeiro elemento passa a apontar para NULL
                    }
                    else { // Se a lista ainda possuir mais de 1 elemento
                        var y_seta_prox = no.y + alt_no + 10 + (alt_no / 2); // A altura onde começará a seta para o próximo elemento é calculada

                        if (lista.quant_nos == 2 && tipo_lista == 'fila') { // Se for uma fila e restarem no momento 2 elementos
                            medidas_texto_fim = lista.elem_svg.texto_fim.bbox(); // São calculadas as medidas do texto do ponteiro para o último elemento
                            lista.elem_svg.seta_inicio.animate(500).plot('M' + (medidas_texto_prim.x + medidas_texto_prim.width / 2) + ' ' + (medidas_texto_prim.y + medidas_texto_prim.height) + ' L' + (pos_inicial + dist_padrao) + ' ' + (pos_y - 5)); // A ponta da seta do ponteiro do primeiro elemento passa a apontar para o segundo elemento
                            lista.elem_svg.texto_fim.animate(500).move(lista.primeiro.x + larg_no, pos_y - 50); // O texto e a seta do ponteiro do último elemento são deslocados para que fiquem à direita do segundo nó
                            lista.elem_svg.seta_fim.animate(500).plot('M' + (lista.primeiro.x + larg_no + (medidas_texto_fim.width / 2)) + ' ' + ((pos_y - 50) + (medidas_texto_fim.height)) + ' L' + (lista.primeiro.x + larg_no) + ' ' + (pos_y - 5)); // A seta que vem do ponteiro que indica o último elemento passa a apontar para a nova posição onde se encontra o primeiro elemento (possui uma pequena diferença em relação à seta de outras estruturas, pois aponta para o fim do elemento, para que as extremidades das setas de início e fim não se encontrem)
                        }
                        else { // Se não for uma lista com quantidade de nós igual a 2
                            lista.elem_svg.seta_inicio.animate(500).plot('M' + (medidas_texto_prim.x + medidas_texto_prim.width / 2) + ' ' + (medidas_texto_prim.y + medidas_texto_prim.height) + ' L' + (pos_inicial + dist_padrao + (larg_no / 2)) + ' ' + (pos_y - 5)); // A ponta da seta do primeiro elemento é deslocada para o meio do segundo elemento
                        }

                        /*O nó a ser removido é movimentado para baixo*/
                        no.elem_svg.retangulo1.animate(500).move(no.x, no.y + alt_no + 10);

                        if (tipo_lista != 'lde') {
                            no.elem_svg.retangulo2.animate(500).move(no.x, no.y + (alt_no + 10)); // Os dois retângulos são movidos para 10 pixels abaixo da parte inferior dos outros nós, e para a posição que ocupará no eixo X (posição do nó que ocupava anteriormente a posição, ou posição inicial no caso de uma inserção no início)
                            no.elem_svg.texto.animate(500).move(no.x + 10, no.y + (alt_no + 10) + 5); // O texto é movido para a nova posição do nó
                        }
                        else {
                            no.elem_svg.retangulo2.animate(500).move(no.x + (larg_no * 0.18), no.y + (alt_no + 10));
                            no.elem_svg.texto.animate(500).move(no.x + 15, no.y + (alt_no + 10) + 5); // O texto é movido para a nova posição do nó
                        }

                        /*--------------------------------------------*/
                        if (tipo_lista != 'fila' && tipo_lista != 'pilha') {
                            moverPonteiroAuxiliar('pos', no.x, no.y + (alt_no * 2) + 10, true); // O ponteiro "pos" é movido para baixo para que não seja sobreposto pelo nó
                        }

                        if (tipo_lista != 'lde') { // Se a lista não for duplamente encadeada
                            no.elem_svg.seta_direita.animate(500).plot('M' + (no.x + larg_no) + ' ' + (y_seta_prox) + ' L' + (no.x + larg_no + 20) + ' ' + (pos_y + (alt_no / 2))); // A seta para o próximo elemento do elemento a ser removido tem seu início deslocado para baixo para acompanhar o nó
                        }
                        else { // Se for uma lista duplamente encadeada
                            no.elem_svg.seta_direita.animate(500).plot('M' + (no.x + larg_no) + ' ' + (y_seta_prox + (alt_no / 4)) + ' L' + (no.x + larg_no + 20) + ' ' + (pos_y + alt_no));  // A seta para o próximo elemento do elemento a ser removido tem seu início deslocado para baixo para acompanhar o nó, e sua extremidade aponta para a parte de baixo do nó seguinte ao que está sendo removido
                            no.elem_svg.seta_esquerda.animate(500).plot('M' + (no.x) + ' ' + (y_seta_prox - (alt_no / 4)) + ' L' + (no.x - 20) + ' ' + (pos_y)); // A seta "ant" do nó a ser removido tem seu início deslocado para baixo
                            if (no.prox_no != null) { // Se o nó seguinte não for nulo
                                no.prox_no.elem_svg.seta_esquerda.animate(500).plot('M' + (no.prox_no.x) + ' ' + (pos_y + (alt_no / 2) - (alt_no / 4)) + ' L' + (no.prox_no.x - 20) + ' ' + (pos_y + alt_no + 10)); // A seta "ant" do nó seguinte ao que será removido tem seu fim deslocado para baixo
                            }
                        }
                    }

                    primeiro = 'NULL';
                    if (lista.primeiro != null) {
                        primeiro = '&' + lista.primeiro.memoria;
                    }
                    preencherMemoria(primeiro, localizarMemoriadeVariavel('primeiro'), null);

                    await sleep(1000);
                }

                if (tipo_lista == 'lde') {
                    marcarLinha(48); // A linha que verifica se o próximo elemento não é nulo é marcada
                    await sleep(1000);
                    if (no.prox_no != null) { // Se o próximo elemento não for nulo
                        marcarLinha(49); // A linha onde o ponteiro "ant" do elemento seguinte passa a apontar para o elemento anterior ao que está sendo removido é marcada.
                        no.prox_no.elem_svg.seta_esquerda.animate(500).plot('M' + (no.prox_no.x) + ' ' + (pos_y + (alt_no / 2) - (alt_no / 4)) + ' L' + (no.prox_no.x - dist_padrao - 20) + ' ' + (pos_y + (alt_no / 2) - (alt_no / 4))); // A seta "ant" do elemento seguinte passa a apontar para o elemento anterior ao que está sendo removido.
                        preencherMemoria((no_ant != null ? ('&' + no_ant.memoria) : 'NULL'), no.prox_no.memoria + 8, 'no->ant'); // A área de memória correspondente ao endereço do ponteiro "ant" do nó seguinte passa a apontar para o elemento anterior ao que está sendo removido
                        no.prox_no.no_ant = no_ant; // A referência interna para o nó anterior do elemento seguinte ao que está sendo removido é atualizada e passa a apontar para o nó anterior ao nó que está sendo removido.
                        await sleep(1000);
                    }
                }

                if (tipo_lista == 'fila') { // Se for uma fila
                    marcarLinha(46); // A linha que verifica se a fila ficará vazia após a remoção é marcada
                    await sleep(1000);
                    if (lista.quant_nos == 1) { // Se a lista ficará vazia
                        marcarLinha(47); // A linha que iguala f->fim a f->prim é marcada
                        moverPonteiroLista('fim', 'PRIM_OU_FIM_APONTAM_NULO', null, true); // O ponteiro de último elemento passa a pontar para NULL
                        lista.fim = null; // A referência interna para o último elemento passa a apontar para null
                        preencherMemoria('NULL', localizarMemoriadeVariavel('fim'), null);
                        await sleep(1000);
                    }
                    else if (lista.quant_nos == 2) {
                        lista.elem_svg.seta_inicio.animate(500).plot('M' + (medidas_texto_prim.x + medidas_texto_prim.width / 2) + ' ' + (medidas_texto_prim.y + medidas_texto_prim.height) + ' L' + (lista.primeiro.x) + ' ' + (pos_y - 5)); // A seta do ponteiro do primeiro elemento passa a apontar para o início do segundo nó (agora primeiro elemento)
                        lista.elem_svg.texto_fim.animate(500).move(lista.primeiro.x + larg_no, pos_y - 50); // O texto do ponteiro do final da lista é movido para depois do novo primeiro elemento
                        lista.elem_svg.seta_fim.animate(500).plot('M' + (lista.primeiro.x + larg_no + (medidas_texto_fim.width / 2)) + ' ' + ((pos_y - 50) + (medidas_texto_fim.height)) + ' L' + (lista.primeiro.x + larg_no) + ' ' + (pos_y - 5)); // A seta que vem do ponteiro que indica o último elemento passa a apontar para a nova posição onde se encontra o primeiro elemento
                        lista.fim = lista.primeiro; // A referência interna para o último elemento passa a apontar para o primeiro elemento, já que nesse caso serão iguais
                        preencherMemoria('&' + lista.fim.memoria, localizarMemoriadeVariavel('fim'), null);
                        await sleep(1000);
                    }
                }

                marcarLinha(42); // A linha que realiza a liberação da memória ocupada pelo nó é marcada

                /*Os elementos gráficos referentes ao nó são removidos*/
                no.elem_svg.retangulo1.remove();
                no.elem_svg.retangulo2.remove();
                no.elem_svg.texto.remove();
                no.elem_svg.seta_direita.remove();
                if (tipo_lista == 'lde') {
                    no.elem_svg.seta_esquerda.remove();
                }
                /*------------------------------------------------------*/

                ocultarPonteiros(); // Os ponteiros "ant" e "pos" são ocultados
                liberarMemoria(no.memoria, 'no'); // A área de memória ocupada pelo nó removido é esvaziada

                lista.quant_nos--; // A quantidade de nós é decrementada
                deslocarNos(pos, 'esquerda'); // Os nós seguintes são deslocados para a esquerda

                if (lista.quant_nos > 0 && !(lista.quant_nos == 1 && tipo_lista == 'fila')) { // Se o elemento removido não for o único restante na lista e não se tratar de uma fila com um único elemento
                    lista.elem_svg.seta_inicio.animate(500).plot('M' + (medidas_texto_prim.x + medidas_texto_prim.width / 2) + ' ' + (medidas_texto_prim.y + medidas_texto_prim.height) + ' L' + (medidas_texto_prim.x + medidas_texto_prim.width / 2) + ' ' + (pos_y - 5)); // A seta de início volta a apontar para baixo, onde estará o novo primeiro elemento
                }
                else if (lista.quant_nos == 1 && tipo_lista == 'fila') { // Se for uma fila com somente 1 elemento
                    lista.elem_svg.texto_inicio.animate(500).move(pos_inicial - medidas_texto_prim.width, pos_y - 50); // O texto do ponteiro para o primeiro elemento é movido para antes do primeiro elemento
                    lista.elem_svg.seta_inicio.animate(500).plot('M' + (pos_inicial - (medidas_texto_prim.width / 2)) + ' ' + ((pos_y - 50) + (medidas_texto_prim.height)) + ' L' + (pos_inicial) + ' ' + (pos_y - 5)); // A seta que vem do ponteiro que indica o primeiro elemento passa a apontar para a nova posição onde se encontra o primeiro elemento (possui uma pequena diferença em relação à seta de outras estruturas, pois aponta para o início do elemento, para que as extremidades das setas de início e fim não se encontrem)
                    lista.elem_svg.texto_fim.animate(500).move(pos_inicial + larg_no, pos_y - 50); // O texto do ponteiro para o último elemento é movido para depois do primeiro elemento
                    lista.elem_svg.seta_fim.animate(500).plot('M' + (pos_inicial + larg_no + (medidas_texto_fim.width / 2)) + ' ' + ((pos_y - 50) + (medidas_texto_fim.height)) + ' L' + (pos_inicial + larg_no) + ' ' + (pos_y - 5)); // A seta que vem do ponteiro que indica o último elemento passa a apontar para a nova posição onde se encontra o primeiro elemento (possui uma pequena diferença em relação à seta de outras estruturas, pois aponta para o fim do elemento, para que as extremidades das setas de início e fim não se encontrem)
                }
                if (no_ant != null) { // Se não for uma remoção no início
                    if (tipo_lista != 'lde') { // Se não for uma lista duplamente encadeada
                        no_ant.elem_svg.seta_direita.animate(500).plot('M' + (no_ant.x + larg_no) + ' ' + (pos_y + (alt_no / 2)) + ' L' + (no_ant.x + larg_no + 20) + ' ' + (pos_y + (alt_no / 2))); // A seta para o próximo elemento retorna para seu estado normal, começando e terminando no meio de cada elemento
                    }
                    else { // Se for uma lista duplamente encadeada
                        no_ant.elem_svg.seta_direita.animate(500).plot('M' + (no_ant.x + larg_no) + ' ' + (pos_y + (alt_no / 2) + (alt_no / 4)) + ' L' + (no_ant.x + larg_no + 20) + ' ' + (pos_y + (alt_no / 2) + (alt_no / 4))); // A seta para o próximo elemento ficará deslocada 1/4 para baixo a partir do meio do elemento, estado normal da seta da lista duplamente encadeada
                    }
                }
                if (tipo_lista == 'lde' && no.prox_no != null) { // Se for uma lista duplamente encadeada e houver elemento após o elemento removido
                    no.prox_no.elem_svg.seta_esquerda.animate(500).plot('M' + (no.x) + ' ' + (pos_y + (alt_no / 2) - (alt_no / 4)) + ' L' + (no.x - 20) + ' ' + (pos_y + (alt_no / 2) - (alt_no / 4)));
                }
                await sleep(1000);

                marcarLinha(43); // A linha onde ocorre o incremento da quantidade de elementos é marcada, para que ocorra a alteração visual da quantidade
                preencherMemoria(lista.quant_nos, localizarMemoriadeVariavel('quantidade'), null);
                await sleep(1000);

                marcarLinha(27); // A linha de retorno da função é chamada, representando o fim da operação
                await sleep(1000, true);
            }
            desbloquearBotoes(); // Os botões de manipulação da lista são desbloqueados
            $('#tipo-lista').removeAttr('disabled'); // A caixa de escolha do tipo de lista é desbloqueada
        }

		/*
			Função responsável por realizar busca de elementos, tanto para pesquisas quanto para remoções. No caso da remoção, retorna um objeto contendo o elemento localizado, o elemento anterior e a posição onde o elemento foi encontrado.
		*/
        async function pesquisarElemento(valor, tipo_pesquisa) {
            var aux_lista; //Variável auxiliar para percorrer a lista
            var no_ant; // Variável para determinar o nó anterior ao nó que será inserido
            var i;
            var memoria_contador_i;

            if (tipo_pesquisa != 'remocao') { // Se a pesquisa for somente para busca, e não remoção
                ocultarPonteiros(); // Os ponteiros "ant" e "pos" são ocultados
                desalocarVariaveisTemporarias(); // Remove as variáveis temporárias utilizadas em operações anteriores da memória
                bloquearBotoes(); // Os botões de manipulação da lista são bloqueados
                $('#tipo-lista').attr('disabled', 'disabled'); // A caixa de escolha do tipo de lista é bloqueada, para evitar que o usuário realize alterações durante uma operação
                marcarLinha(21); // Linha que verifica se o nó foi alocado na memória. Serve somente para representação.
                await sleep(1000);
            }

            if (lista.quant_nos > 0) { // Se a lista não estiver vazia
                valor = parseInt(valor); //Conversão do valor em inteiro

                no_ant = null; // A variável referente ao elemento anterior recebe o valor NULL

                var medidas_texto_nulo = lista.elem_svg.texto_nulo_1.bbox(); // São obtidas as medidas do primeiro texto "NULL"
                if (tipo_pesquisa == 'remocao' && tipo_lista != 'lde') { // Se for uma remoção e não for uma lista duplamente encadeada
                    marcarLinha(9); // A linha que cria o ponteiro "ant" é marcada					
                    x_pont_anterior = medidas_texto_nulo.x; // A posição x do ponteiro "ant" é calculada
                    y_pont_anterior = pos_y + alt_no; // A posição y do ponteiro "ant" é calculada
                    moverPonteiroAuxiliar('ant', x_pont_anterior, y_pont_anterior, false); // O ponteiro "ant" é movido para o primeiro texto NULL

                    var memoria_ponteiro_ant = alocarMemoria('var_temp', 1);
                    preencherMemoria('NULL', memoria_ponteiro_ant, 'ant');
                    memoria_variaveis.push({ variavel: 'ant', endereco: memoria_ponteiro_ant });
                    await sleep(1000);
                }

                marcarLinha(10); // A linha de criação e associação do ponteiro "pos" ao primeiro elemento é marcada
                aux_lista = lista.primeiro; // A variável aux_lista recebe o primeiro elemento
                moverPonteiroAuxiliar('pos', lista.primeiro.x, (pos_y + alt_no), false); // O ponteiro "pos" é movido para o primeiro elemento

                var memoria_ponteiro_pos = alocarMemoria('var_temp', 1);
                preencherMemoria((aux_lista != null ? '&' + aux_lista.memoria : 'NULL'), memoria_ponteiro_pos, 'pos');
                memoria_variaveis.push({ variavel: 'pos', endereco: memoria_ponteiro_pos });

                await sleep(1000);

                i = 0; // Apesar de não ser utilizado em alguns casos, o contador é mantido para uso interno
                if (tipo_pesquisa != 'remocao') { // Se a operação não for remoção, não é necessário manter o contador, pois a condição de busca é "enquanto não chegar ao fim da lista", não havendo posição especíica a ser alcançada
                    marcarLinha(8); // A linha de criação do contador i é marcada
                    var memoria_contador_i = alocarMemoria('var_temp', 1);
                    preencherMemoria('0', memoria_contador_i, 'i');
                    memoria_variaveis.push({ variavel: 'i', endereco: memoria_contador_i });
                    preencherMemoria(i, memoria_contador_i, null);
                    await sleep(1000);
                }

                marcarLinha(23); // A linha do while é marcada
                await sleep(1000);
                while (aux_lista != null) { // Enquanto não chegar ao fim da lista, o loop é repetido
                    marcarLinha(24); // A linha onde é feita a comparação do valor buscado com o elemento atual é marcada
                    await sleep(1000);
                    if (((tipo_pesquisa == 'valor' || tipo_pesquisa == 'remocao') && aux_lista.valor == valor) || (tipo_pesquisa == 'posicao' && i == valor)) { // Se o elemento atual for o elemento procurado
                        aux_lista.elem_svg.retangulo1.fill('#00CC00'); // O elemento localizado é pintado de verde

                        if (tipo_pesquisa != 'remocao') { // Se não for uma remoção
                            marcarLinha(26); // É marcada a linha referente à mensagem sobre a localização do elemento
                            alert('Elemento encontrado na posição ' + i); // A mensagem é exibida informando onde o elemento foi localizado.
                            await sleep(1000);

                            marcarLinha(27); // A linha do retorno da função é marcada
                            await sleep(1000);
                            desbloquearBotoes(); // Os botões são desbloqueados
                            $('#tipo-lista').removeAttr('disabled'); // A caixa de escolha do tipo de lista é desbloqueada
                            return true;
                        }

                        var elemento = {
                            'ant': no_ant,
                            'no': aux_lista,
                            'pos': i
                        } // É criado o objeto contendo os dados do objeto localizado para ser retornado para uso na remoção
                        return elemento; // A função retorna o objeto criado, contendo nó localizado, nó anterior e posição onde foi encontrado
                    }
                    no_ant = aux_lista; // A variável no_ant recebe o elemento atual

                    if (tipo_pesquisa == 'remocao' && tipo_lista != 'lde') { // Se for uma remoção e não for uma lista duplamente encadeada
                        marcarLinha(12); // A linha referente à atribuição do elemento atual ao ponteiro ant é marcada
                        var medidas_pont_ant = lista.elem_svg.pont_anterior.bbox(); // São obtidas as medidas do texto "ant"
                        moverPonteiroAuxiliar('ant', aux_lista.x, (pos_y + alt_no), true); // O ponteiro "ant" é movido para o elemento atual
                        moverPonteiroAuxiliar('pos', aux_lista.x + (medidas_pont_ant.width), (pos_y + alt_no), true); // O ponteiro "pos" é movido para o próximo elemento

                        preencherMemoria('&' + no_ant.memoria, memoria_ponteiro_ant, null);
                        await sleep(1000);
                    }

                    marcarLinha(13); // A linha que faz com que o ponteiro "pos" aponte para o próximo elemento é marcada
                    aux_lista = aux_lista.prox_no; // A variável aux_lista passa a apontar para o próximo elemento

                    if (aux_lista !== null) { // Se o próximo elemento não for nulo
                        moverPonteiroAuxiliar('pos', aux_lista.x, (pos_y + alt_no), true); // O ponteiro "pos" é movido para o elemento seguinte
                    }
                    else {
                        moverPonteiroAuxiliar('pos', lista.elem_svg.texto_nulo_1.x(), (pos_y + alt_no), true); // O ponteiro "pos" é movido para o elemento seguinte
                    }
                    preencherMemoria((aux_lista != null ? '&' + aux_lista.memoria : 'NULL'), memoria_ponteiro_pos, null);

                    await sleep(1000);

                    i++;
                    if (tipo_pesquisa != 'remocao') {
                        marcarLinha(14); // A linha que representa o incremento do contador i é marcada
                        preencherMemoria(i, memoria_contador_i, null);
                        await sleep(1000);
                    }

                    marcarLinha(23); // A linha referente ao while é marcada
                    await sleep(1000);
                }

                marcarLinha(29); // A linha referente à mensagem que informa que o elemento não foi encontrado é marcada
                alert('Elemento não encontrado'); // É exibida uma mensagem informando que o elemento não foi encontrado
                await sleep(1000);

                marcarLinha(35); // A linha referente ao retorno da função é marcada
                if (tipo_pesquisa != 'remocao') { // Se a pesquisa não for de remoção
                    desbloquearBotoes(); // Os botões de manipulação da lista são desbloqueados. Caso a pesquisa seja de remoção, o desbloqueio só será feito no final da remoção, na função própria
                    $('#tipo-lista').removeAttr('disabled'); // A caixa de escolha do tipo de lista é desbloqueada
                }
                await sleep(1000);
                return false;
            }
            else {
                marcarLinha(30); // A linha referente ao else é marcada
                await sleep(1000);

                marcarLinha(31); // A linha referente à mensagem sobre a lista vazia é marcada
                alert('Lista vazia'); // A mensagem informando que a lista está vazia é exibida
                await sleep(1000);

                marcarLinha(32); // A linha referente ao retorno da função é marcada
            }

            if (tipo_pesquisa != 'remocao') { // Se a pesquisa não for de remoção
                desbloquearBotoes(); // Os botões de manipulação da lista são desbloqueados
                $('#tipo-lista').removeAttr('disabled'); // A caixa de escolha do tipo de lista é desbloqueada
            }
        }

        /*--------------------------------------------------------------------------------*/

        /*--------------------------FUNÇÕES DE CONTROLE DO CÓDIGO-------------------------*/

        function carregarCodigo(tipo) {
            var ref_lista, ref_inicio; // Variáveis que representam o nome da variável que aponta para a lista e para o início da lista
            switch (tipo_lista) {
                case 'lse':
                case 'lse_ord':
                case 'lde':
                    ref_lista = 'l';
                    ref_tipo = 'Lista';
                    ref_inicio = 'l->prim';
                    break;
                case 'pilha':
                    ref_lista = 'p';
                    ref_tipo = 'Pilha';
                    ref_inicio = 'p->topo';
                    break;
                case 'fila':
                    ref_lista = 'f';
                    ref_tipo = 'Fila';
                    ref_inicio = 'f->prim';
                    break;
            }

            $('#codigo').html('');
            $('#codigo').append('<p class="funcao">');
            inserirLinha('typedef struct no {', 0);
            inserirLinha('int valor;', 1);
            inserirLinha('No* prox;', 1);
            if (tipo_lista == 'lde') {
                inserirLinha('No* ant;', 1);
            }
            inserirLinha('} No;', 0);
            $('#codigo').append('</p>');
            $('#codigo').append('<p class="funcao">');
            if (tipo_lista == 'lse' || tipo_lista == 'lse_ord' || tipo_lista == 'lde') {
                inserirLinha('typedef struct lista {', 0);
                inserirLinha('int qtd;', 1);
                inserirLinha('No* prim;', 1);
                inserirLinha('} Lista;', 0);
            }
            else if (tipo_lista == 'pilha') {
                inserirLinha('typedef struct pilha {', 0);
                inserirLinha('int qtd;', 1);
                inserirLinha('No* topo;', 1);
                inserirLinha('} Pilha;', 0);
            }
            else if (tipo_lista == 'fila') {
                inserirLinha('typedef struct fila {', 0);
                inserirLinha('int qtd;', 1);
                inserirLinha('No* prim;', 1);
                inserirLinha('No* fim;', 1);
                inserirLinha('} Fila;', 0);
            }
            $('#codigo').append('</p>');
            $('#codigo').append('<p class="funcao">');
            switch (tipo) {
                case 'insercao_inicio_desordenada':
                    if (tipo_lista == 'lse' || tipo_lista == 'lde' || tipo_lista == 'lse_ord') {
                        inserirLinha('int inserir_inicio (Lista* l, int v) {', 0);
                    }
                    else if (tipo_lista == 'pilha') {
                        inserirLinha('int push (Pilha* p, int v) {', 0);
                    }
                    inserirLinha('No* no = (No*) malloc(sizeof(No));', 1, 1);
                    inserirLinha('if (no != NULL) {', 1, 2);
                    inserirLinha('no->valor= v;', 2, 3);

                    if (tipo_lista == 'pilha') {
                        inserirLinha('no->prox = p->topo;', 2, 4);
                        inserirLinha('p->topo = no;', 2, 5);
                        inserirLinha('p->qtd++;', 2, 6);
                    }
                    else {
                        inserirLinha('no->prox = l->prim;', 2, 4);
                        if (tipo_lista == 'lde') {
                            inserirLinha('if (l->prim != NULL) {', 2, 50);
                            inserirLinha('l->prim->ant = no;', 3, 51);
                            inserirLinha('}', 2);
                            inserirLinha('l->prim = no;', 2, 5);
                            inserirLinha('no->ant = NULL;', 2, 44);
                        }
                        else {
                            inserirLinha('l->prim = no;', 2, 5);
                        }
                        inserirLinha('l->qtd++;', 2, 6);
                    }
                    inserirLinha('return 1;', 2, 7);
                    inserirLinha('}', 1);
                    inserirLinha('else {', 1);
                    inserirLinha('return 0', 2);
                    inserirLinha('}', 1);
                    inserirLinha('}', 0);
                    $('#codigo').append('</p>');
                    break;
                case 'insercao_meio_desordenada':
                    if (tipo_lista != 'lse_ord') {
                        inserirLinha('int inserir_meio (' + ref_tipo + '* ' + ref_lista + ', int v, int posicao) {', 0);
                    }
                    else {
                        inserirLinha('int inserir_ordenado (' + ref_tipo + '* ' + ref_lista + ', int v) {', 0);
                    }
                    inserirLinha('No* no = (No*) malloc(sizeof(No));', 1, 1);
                    inserirLinha('if (no != NULL) {', 1, 2);
                    inserirLinha('no->valor= v;', 2, 3);

                    if (tipo_lista != 'lse_ord') {
                        inserirLinha('int i = 0;', 2, 8);
                    }

                    inserirLinha('No* ant = NULL;', 2, 9);
                    inserirLinha('No* pos = ' + ref_inicio + ';', 2, 10);

                    if (tipo_lista != 'lse_ord') {
                        inserirLinha('while (i < posicao) {', 2, 11);
                    }
                    else {
                        inserirLinha('while (pos != null && v > pos->valor) {', 2, 17);
                    }

                    inserirLinha('ant = pos;', 3, 12);
                    inserirLinha('pos = pos->prox;', 3, 13);

                    if (tipo_lista != 'lse_ord') {
                        inserirLinha('i++;', 3, 14);
                    }

                    inserirLinha('}', 2);

                    if (tipo_lista == 'lse_ord') {
                        inserirLinha('if (ant == NULL) {', 2, 39);
                        inserirLinha('no->prox = ' + ref_inicio + ';', 3, 4);
                        inserirLinha(ref_inicio + ' = no;', 3, 5);
                        inserirLinha('}', 2);
                        inserirLinha('else {', 2);
                        inserirLinha('no->prox = pos;', 3, 15);
                        inserirLinha('ant->prox = no;', 3, 16);
                        inserirLinha('}', 2);
                    }
                    else {
                        inserirLinha('no->prox = pos;', 2, 15);
                    }

                    if (tipo_lista != 'lse_ord') {
                        inserirLinha('ant->prox = no;', 2, 16);
                    }

                    if (tipo_lista == 'lde') {
                        inserirLinha('no->ant = ant;', 2, 44);
                        inserirLinha('if (pos != NULL) {', 2, 52);
                        inserirLinha('pos->ant = no;', 3, 18);
                        inserirLinha('}', 2);
                    }

                    inserirLinha(ref_lista + '->qtd++;', 2, 6);
                    inserirLinha('return 1;', 2, 7);
                    inserirLinha('}', 1);
                    inserirLinha('else {', 1);
                    inserirLinha('return 0', 2);
                    inserirLinha('}', 1);
                    inserirLinha('}', 0);
                    $('#codigo').append('</p>');
                    break;
                case 'insercao_fim': //Exclusivamente para fila
                    inserirLinha('int inserir (Fila* f, int v) {', 0);
                    inserirLinha('No* no = (No*) malloc(sizeof(No));', 1, 1);
                    inserirLinha('if (no != NULL) {', 1, 2);
                    inserirLinha('no->valor= v;', 2, 3);
                    inserirLinha('no->prox = NULL;', 2, 15);
                    inserirLinha('if (f->prim == NULL) {', 2, 37);
                    inserirLinha('f->prim = no;', 3, 5);
                    inserirLinha('}', 2);
                    inserirLinha('if (f->fim != NULL) {', 2, 33);
                    inserirLinha('f->fim->prox = no;', 3, 34);
                    inserirLinha('}', 2);
                    inserirLinha('f->fim = no;', 2, 36);
                    inserirLinha('f->qtd++;', 2, 6);
                    inserirLinha('return 1;', 2, 7);
                    inserirLinha('', 0);
                    inserirLinha('else {', 1);
                    inserirLinha('return 0;', 2);
                    inserirLinha('}', 1);
                    inserirLinha('}', 0);
                    $('#codigo').append('</p>');
                    break;
                case 'remocao':
                case 'pesquisa_desordenada':
                case 'pesquisa_ordenada':
                    if (tipo == 'pesquisa_desordenada' || tipo == 'pesquisa_ordenada') {
                        inserirLinha('int busca (' + ref_tipo + '* ' + ref_lista + ', int v) {', 0);
                    }
                    else if (tipo == 'remocao') {
                        if (tipo_lista == 'lse' || tipo_lista == 'lde') {
                            inserirLinha('int remover (Lista* l, int v) {', 0);
                        }
                        else if (tipo_lista == 'lse_ord') {
                            inserirLinha('int remover_ordenado (Lista* l, int v) {', 0);
                        }
                        else if (tipo_lista == 'pilha') {
                            inserirLinha('int pop (Pilha* p) {', 0);
                        }
                        else if (tipo_lista == 'fila') {
                            inserirLinha('int remover (Fila* f) {', 0);
                        }
                    }
                    $('#codigo').append('<p></p>');
                    inserirLinha('if (' + ref_inicio + ' != NULL) {', 1, 21);

                    pilha_ou_fila = (tipo_lista == 'pilha' || tipo_lista == 'fila');
                    if (!(pilha_ou_fila && tipo == 'remocao')) {
                        if (tipo == 'remocao' && tipo_lista != 'lde') {
                            inserirLinha('No* ant = NULL;', 2, 9);
                        }
                        inserirLinha(ref_tipo + '* pos = ' + ref_inicio, 2, 10);

                        if (tipo != 'remocao') {
                            inserirLinha('int i = 0;', 2, 8);
                        }

                        if (tipo != 'pesquisa_ordenada') {
                            inserirLinha('while (pos != NULL) {', 2, 23);
                        }
                        else {
                            inserirLinha('while (pos != NULL && v < pos->valor) {', 2, 23);
                        }
                        inserirLinha('if (pos->valor == v) {', 3, 24);
                        if (tipo == 'pesquisa_desordenada' || tipo == 'pesquisa_ordenada') {
                            inserirLinha('printf("Elemento encontrado na posição %d", i);', 4, 26);
                        }
                        else if (tipo == 'remocao') {
                            ref_ant = 'ant';
                            if (tipo_lista == 'lde') {
                                ref_ant = 'pos->ant';
                            }
                            inserirLinha('if (' + ref_ant + ' == NULL) {', 4, 39);
                            inserirLinha('l->prim = pos->prox;', 5, 40);
                            inserirLinha('}', 4);
                            inserirLinha('else {', 4, 53);
                            inserirLinha(ref_ant + '->prox = pos->prox;', 5, 41);
                            inserirLinha('}', 4);
                            if (tipo_lista == 'lde') {
                                inserirLinha('if (pos->prox != NULL) {', 4, 48);
                                inserirLinha('pos->prox->ant = pos->ant;', 5, 49);
                                inserirLinha('}', 4);
                            }
                            inserirLinha('free(pos);', 4, 42);
                            inserirLinha('l->qtd--;', 4, 43);
                        }
                        inserirLinha('return 1;', 4, 27);
                        inserirLinha('}', 3);

                        if (tipo == 'remocao' && tipo_lista != 'lde') {
                            inserirLinha('ant = pos;', 3, 12);
                        }

                        inserirLinha('pos = pos->prox;', 3, 13);

                        if (tipo != 'remocao') {
                            inserirLinha('i++;', 3, 14);
                        }

                        inserirLinha('}', 2);
                        inserirLinha('printf("Elemento nao encontrado");', 2, 29);
                        inserirLinha('return 0;', 2, 35);
                    }
                    else {
                        inserirLinha(ref_tipo + '* temp = ' + ref_inicio + ';', 2, 45);
                        inserirLinha(ref_inicio + ' = ' + ref_inicio + '->prox;', 2, 40);
                        if (tipo_lista == 'fila') {
                            inserirLinha('if (f->prim == NULL)) {', 2, 46);
                            inserirLinha('f->fim = ' + ref_inicio, 3, 47);
                            inserirLinha('}', 2);
                        }
                        inserirLinha('free(temp);', 2, 42);
                        inserirLinha(ref_lista + '->qtd--;', 2, 43);
                        inserirLinha('return 1;', 2, 27);
                    }

                    inserirLinha('}', 1);
                    inserirLinha('else {', 1, 30);
                    inserirLinha('printf("Lista vazia");', 2, 31);
                    inserirLinha('return 0;', 2, 32);
                    inserirLinha('}', 1);
                    inserirLinha('}', 0);
                    break;
            }
            hljs.highlightBlock(document.getElementById('codigo'));
        }

        function inserirLinha(texto_codigo, nivel_indentacao, numero) {
            var i, indentacao = '';
            for (i = 1; i <= nivel_indentacao; i++) {
                indentacao += '&emsp;&emsp;';
            }
            $('#codigo').append('<p' + (typeof numero !== 'undefined' ? ' id="linha-' + numero + '"' : '') + '>' + indentacao + texto_codigo + '</p>');
        }

        function marcarLinha(numero) {
            posicao_caixa_codigo = document.getElementById('codigo').getBoundingClientRect();
            posicao_linha = document.getElementById('linha-' + numero).getBoundingClientRect();
            altura_cont_codigo = document.getElementById('codigo').scrollHeight;
            altura_caixa_codigo = posicao_caixa_codigo.top;
            altura_linha = posicao_linha.top - altura_caixa_codigo;

            mover_scroll = function (altura_scroll) {
                document.getElementById('codigo').scrollTo({
                    top: altura_scroll,
                    left: 0,
                    behavior: 'smooth'
                });
            }

            if (altura_linha >= posicao_caixa_codigo.height * 0.8) {
                mover_scroll($('#codigo').scrollTop() + (altura_linha - posicao_caixa_codigo.height) + posicao_caixa_codigo.height * (0.2));
            }
            else if (altura_linha <= 0) {
                mover_scroll($('#codigo').scrollTop() - Math.abs(altura_linha) - posicao_caixa_codigo.height * (0.2));
            }


            $('#codigo p').removeClass('marcado');
            $('#codigo p#linha-' + numero).addClass('marcado');
        }
    }
);