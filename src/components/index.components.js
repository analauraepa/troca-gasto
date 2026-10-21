
// função responsável por aplicar as convenções brasileiras:
// ponto para separar milhares e vírgula para centavos
const formatarMoeda = valor => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
}).format(Number(valor)); //linha necessária para confirmar que o tipo é number

// mostra o saldo total e aplica a cor correspondente ao sinal do valor
export function exibirSaldoTotal(elemento, total) {
    const saldoTotal = document.createElement('strong');
    const valor = Number(total);

    saldoTotal.textContent = formatarMoeda(valor);
    saldoTotal.classList.add(valor >= 0 ? 'in' : 'out');

    elemento.replaceChildren(saldoTotal);
}

// exibe o total calculado das faturas no elemento indicado
export function exibirTotalFaturasCartoes(elemento, total) {
    // encerra a função se a página não tiver o elemento de exibição
    if (!elemento) return;

    elemento.textContent = formatarMoeda(total);
}

// mostra o mês da fatura por extenso a partir de uma chave no formato aaaa-mm
export function exibirMesFaturasCartoes(elemento, mes) {
    // encerra a função se a página não tiver o elemento do mês
    if (!elemento || !mes) return;

    // separa o ano e o mês para criar uma data local
    const [ano, numeroMes] = mes.split('-').map(Number);
    const dataMes = new Date(ano, numeroMes - 1, 1);

    // escreve o mês no formato usado no brasil, como outubro de 2026
    elemento.textContent = new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric'
    }).format(dataMes);
}

// mostra receitas, despesas e resultado nos elementos (um objeto) encontrados na página
// totais (também um objeto) recebe os valores calculados no service
export function exibirTotaisMovimentacoes(elementos, totais) {

    // cada elemento é opcional porque esta função também é chamada em outras páginas
    // cada if é para verificar se o elemento existe
    if (elementos.receitas) {
        elementos.receitas.textContent = formatarMoeda(totais.receitas);
    }

    if (elementos.despesas) {
        elementos.despesas.textContent = formatarMoeda(totais.despesas);
    }

    if (elementos.resultado) {
        elementos.resultado.textContent = formatarMoeda(totais.resultado);
        elementos.resultado.classList.toggle('in', totais.resultado >= 0);
        elementos.resultado.classList.toggle('out', totais.resultado < 0);
    }
}

// mostra o total combinado das contas fixas que ainda estão pendentes.
export function exibirTotalContasPendentes(elemento, total) {
    if (elemento) {
        elemento.textContent = formatarMoeda(total);
    }
}

// renderiza as próximas contas fixas e informa se cada uma foi paga neste mês

export function exibirProximasContas(elemento, contas) {
    // elemento será a área do html que as contas deverão aparecer
    if (!elemento) return;

    // remove os itens anteriores para evitar duplicação quando o resumo for atualizado
    elemento.replaceChildren();

    // contas é a lista da função obterProximasContas de services com (até) 5 contas mais antigas
    if (contas.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.className = 'small';
        mensagem.textContent = 'Nenhuma conta fixa ativa cadastrada.';
        elemento.append(mensagem);
        return;
    }

    // usa-se um objeto temporario sendo conta os dados cadastrados, dataVencimento sendo projetada pelo mês de ref
    // e paga é o status da conta
    // basicamente a formação daquela tabela visual da página inicial
    contas.forEach(({ conta, dataVencimento, paga }) => {

        //criação de elementos html
        const linha = document.createElement('div');
        linha.className = 'bill';

        const topo = document.createElement('div');
        topo.className = 'row-top';

        const detalhes = document.createElement('div');
        const descricao = document.createElement('div');
        descricao.className = 'row-title';
        descricao.textContent = conta.descricao;

        const dataECategoria = document.createElement('div');
        dataECategoria.className = 'small';
        const dataFormatada = new Intl.DateTimeFormat('pt-BR').format(dataVencimento);
        dataECategoria.textContent = `Vencimento ${dataFormatada} · ${conta.categoria}`;

        detalhes.append(descricao, dataECategoria);

        const valorEStatus = document.createElement('div');
        valorEStatus.style.textAlign = 'right';

        const valor = document.createElement('strong');
        valor.textContent = formatarMoeda(conta.valor);

        const etiqueta = document.createElement('span');
        // mostra tag da conta se ela foi paga e editar a classe
        etiqueta.className = `badge ${paga ? '' : 'yellow'}`.trim();
        etiqueta.textContent = paga ? 'paga neste mês' : 'pendente neste mês';

        const containerEtiqueta = document.createElement('div');
        containerEtiqueta.append(etiqueta);
        valorEStatus.append(valor, containerEtiqueta);

        topo.append(detalhes, valorEStatus);
        linha.append(topo);
        elemento.append(linha);
    });
}

// renderiza as movimentações mais recentes dentro do resumo.
export function exibirUltimasMovimentacoes(elemento, movimentacoes) {
    if (!elemento) return;

    // refaz a lista para manter a tela sincronizada com os dados atuais.
    elemento.replaceChildren();

    if (movimentacoes.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.className = 'small';
        mensagem.textContent = 'Nenhuma movimentação cadastrada.';
        elemento.append(mensagem);
        return;
    }

    movimentacoes.forEach(movimentacao => {
        const linha = document.createElement('div');
        linha.className = 'list-row';

        const detalhes = document.createElement('div');
        const descricao = document.createElement('div');
        descricao.className = 'row-title';
        descricao.textContent = movimentacao.descricao;

        const informacoes = document.createElement('div');
        informacoes.className = 'small';
        informacoes.textContent = `${movimentacao.data} · ${movimentacao.banco}`;
        detalhes.append(descricao, informacoes);

        const valor = document.createElement('strong');
        const entrada = movimentacao.tipo === 'entrada';
        valor.className = entrada ? 'in' : 'out';
        valor.textContent = `${entrada ? '+' : '−'}${formatarMoeda(movimentacao.valor)}`;

        const valorAlinhado = document.createElement('div');
        valorAlinhado.style.textAlign = 'right';
        valorAlinhado.append(valor);

        linha.append(detalhes, valorAlinhado);
        elemento.append(linha);
    });
}
