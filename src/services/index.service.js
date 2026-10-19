// importa os dados salvos usados para montar a página inicial.
import { bancos } from "./banco.services.js";
import { movimentacoes } from "./movimentacao.services.js";
import { contasFixas } from "./contaFixa.services.js";
import { consultar_fatura_mes } from "./faturas.services.js";

// calcula o saldo atual combinado de todas as contas bancárias.
export function calcularTotalSaldo() {
    return bancos.reduce((total, banco) => total + Number(banco.saldo), 0);
}

// soma as parcelas de todos os cartões que pertencem ao mês informado
export function calcularTotalFaturasCartoes(mes = obterMesAtual()) {
    // consulta as parcelas que formam a fatura do mês escolhido
    const parcelasDoMes = consultar_fatura_mes(mes);

    // soma os valores em centavos para evitar imprecisão em operações com dinheiro
    const totalEmCentavos = parcelasDoMes.reduce(
        (total, parcela) => total + Math.round(Number(parcela.valor) * 100),
        0
    );

    // converte o resultado de centavos para reais
    return totalEmCentavos / 100;
}

// devolve o mês atual no formato aaaa-mm usado pelo serviço de faturas
export function obterMesAtual() {
    // obtém a data atual do navegador
    const dataAtual = new Date();

    // monta o ano e o mês, adicionando zero à esquerda quando necessário
    return `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}`;
}

// soma as movimentações cadastradas como entrada e os saldos iniciais positivos dos bancos.
export function calcularReceitasTotais() {

    // variável responsável de guardar o saldo inicial de bancos que são positivos e 
    // somar com o total de receitas
    const saldoInicialPositivo = bancos
        .filter(banco => Number(banco.saldoInicial) > 0)
        .reduce((total, banco) => total + Number(banco.saldoInicial), 0);

    
    // variável que guarda todos as movimentações que são entradas
    // e somas todas com o reduce
    const entradas = movimentacoes
        .filter(movimentacao => movimentacao.tipo === 'entrada')
        .reduce((total, movimentacao) => total + Number(movimentacao.valor), 0);

    return saldoInicialPositivo + entradas;
}

// soma movimentações cadastradas com o tipo saída e com os bancos que tem saldo
// inicial negativo
export function calcularSaidasTotais() {

    // variável que guarda o total do saldo dos
    // bancos que tem saldo negativo
    const saldoInicialNegativo = bancos
        .filter(banco => Number(banco.saldoInicial) < 0)
        .reduce((total, banco) => total + Math.abs(Number(banco.saldoInicial)), 0);

    
    // variável que guarda o total de movimentações
    // do tipo saída
    const saidas = movimentacoes
        .filter(movimentacao => movimentacao.tipo === 'saida')
        .reduce((total, movimentacao) => total + Number(movimentacao.valor), 0);

    return saldoInicialNegativo + saidas;
}

// função responsável por retornar até cinco movimentações
//  recentes sem mudar a ordem original dos dados
export function obterUltimasMovimentacoes(limite = 5) {

    
    return movimentacoes

        // cria objetos temporários com a movimentação e o indice,
        // recebe como parâmetro a lista de objetos da pagina de movimentações
        // e o param. indice é entendido para o javascript como a posição atual do objeto na lista
        .map((movimentacao, indice) => ({ movimentacao, indice }))

    
        .sort((a, b) => {
            // a e b apontam para dois objetos, faz a diferença de milisegundos
            //  e retorna um valor positivo caso b seja mais recente que a,
            //  caso valor negativo a é mais recente doq b
            const diferencaDatas = obterTimestamp(b.movimentacao.data) - obterTimestamp(a.movimentacao.data);

            // a função sort ao receber um valor POSITIVO (b mais recente que a)
            // põe b antes a, ao receber um valor NEGATIVO mantém a antes de b (a mais recente que b)
            // caso as datas sejam as mesma ele ordena pelo indice (a add primeiro na frente)
            return diferencaDatas || a.indice - b.indice;
        })

        // corta a lista até o limite informado, que por padrão é cinco.
        .slice(0, Math.max(0, limite))

        // retorna sem o atributo temporário do índice
        .map(({ movimentacao }) => movimentacao);
}

function obterTimestamp(data) {

    // converte datas dd/mm/aaaa, com auxílio do regex, antes de criar a data usada na ordenação
    // da função para obter as ultimas movimentações
    const partesData = String(data).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    // muda para o formato aaaa-mm-dd para que fique no formato da class date
    // do JS
    const dataOrdenacao = partesData
        ? `${partesData[3]}-${partesData[2]}-${partesData[1]}`

        // caso não esteja no formato dd/mm/aaaa,
        // deixa o valor da data que foi inserida
        : data;

    // variável que transforma data formatada em um novo objeto JS
    // e pega a quantidade de milisegundos que se passaram desde 1 de jan de 1970 com getTime()
    // (quanto maior mais nova é)
    const timestamp = new Date(dataOrdenacao).getTime();

    // verifica se o JS conseguiu entender a data
    return Number.isNaN(timestamp) ? 0 : timestamp;
}



// soma o valor das contas fixas ativas que ainda não foram pagas neste mês
export function calcularContasPendTotais() {


    // pega a data de hoje e transforma em uma string formato aaaa-mm
    // o +1 é necessario pq o índice inicial é zero
    // o .padStart(2,'0') garante que o mês tenha dois dígitos
    const dataAtual = new Date();
    const mesAtual = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}`;

    // retorna a soma das contas fixas ATIVAS e contas que a lista de meses pagos não tem o mes atual
    return contasFixas
        .filter(contaFixa => contaFixa.ativa && !(contaFixa.mesesPagos || []).includes(mesAtual))
        .reduce((total, contaFixa) => total + Number(contaFixa.valor), 0);
}

// devolve as contas ativas ordenadas pelo dia de vencimento do mês de referência e
// mantém as pagas na lista para que o resumo também possa mostrar seu estado
export function obterProximasContasFixas(limite = 5, referencia = new Date()) {

    // variáveis para guardar o mês da data de referência aaaa-mm para comparar mesesPagos
    const mesAtual = `${referencia.getFullYear()}-${String(referencia.getMonth() + 1).padStart(2, '0')}`;

    // para guardar quantos dias há no mês
    const diasNoMes = new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0).getDate();

    return contasFixas
        // filtra as ativas
        .filter(contaFixa => contaFixa.ativa)


        .map(contaFixa => {
            // separa a data no formato dd/mm/aaaa para obter o dia da conta
            const partesData = String(contaFixa.dataVencimento).split('/');


            const diaInformado = partesData.length === 3
                // se tiver for tamanho 3 guarda o dia
                ? Number(partesData[0])
                
                // se não for formato dd/mm/aaaa, faz o split com '-' e pega o ultimo indice
                : Number(String(contaFixa.dataVencimento).split('-')[2]);


            // garante que o dia seja pelo menos 1 ou dentro dos dias dos meses
            //  e garante que nn passe do ultimo dia do mês
            const diaVencimento = Math.min(Math.max(diaInformado || 1, 1), diasNoMes);

            // projeta o dia de vencimento no mês de referência e guarda os dados em um objeto
            return {
                conta: contaFixa,
                dataVencimento: new Date(referencia.getFullYear(), referencia.getMonth(), diaVencimento),
                paga: (contaFixa.mesesPagos || []).includes(mesAtual)
            };
        })

        // faz uma ordenação por data de vencimento, 
        // => se for POSITIVO, b é mais antigo do que A, logo B tem maior prioridade
        // => se for NEGATIVO, a é mais antiga do que B, logo A tem maior prioridade
        .sort((a, b) => a.dataVencimento - b.dataVencimento)
        .slice(0, Math.max(0, limite));
}