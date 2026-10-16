

// mostra o saldo total e aplica a cor correspondente ao sinal do valor
export function exibirSaldoTotal(elemento, total) {
    const saldoTotal = document.createElement('strong');
    const valor = Number(total);

    saldoTotal.textContent = `R$ ${valor}`;
    saldoTotal.classList.add(valor >= 0 ? 'in' : 'out');

    elemento.replaceChildren(saldoTotal);
}

// mostra receitas, despesas e resultado nos elementos (um objeto) encontrados na página
// totais (também um objeto) recebe os valores calculados no service
export function exibirTotaisMovimentacoes(elementos, totais) {

    // cada elemento é opcional porque esta função também é chamada em outras páginas
    // cada if é para verificar se o elemento existe
    if (elementos.receitas) {
        elementos.receitas.textContent = `R$ ${Number(totais.receitas).toFixed(2)}`;
    }

    if (elementos.despesas) {
        elementos.despesas.textContent = `R$ ${Number(totais.despesas).toFixed(2)}`;
    }

    if (elementos.resultado) {
        elementos.resultado.textContent = `R$ ${Number(totais.resultado).toFixed(2)}`;
        elementos.resultado.classList.toggle('in', totais.resultado >= 0);
        elementos.resultado.classList.toggle('out', totais.resultado < 0);
    }
}

// mostra o total combinado das contas fixas que ainda estão pendentes.
export function exibirTotalContasPendentes(elemento, total) {
    if (elemento) {
        elemento.textContent = `R$ ${Number(total).toFixed(2)}`;
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
    // basicamente a formação daquela tabela visual da aba de resumo
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
        valor.textContent = `R$ ${Number(conta.valor).toFixed(2)}`;

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
        valor.textContent = `${entrada ? '+' : '−'}R$ ${Number(movimentacao.valor).toFixed(2)}`;

        const valorAlinhado = document.createElement('div');
        valorAlinhado.style.textAlign = 'right';
        valorAlinhado.append(valor);

        linha.append(detalhes, valorAlinhado);
        elemento.append(linha);
    });
}
