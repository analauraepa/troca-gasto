export function carregar_cartoes(divCartoes, cartoes, calcular_limite_disponivel) {
    divCartoes.innerHTML = '';
    cartoes.forEach((cartao, index) => {
        divCartoes.innerHTML += `
        <div class="card" data-index="${index}">
            <div class="cartao-top"><span class="cartao-name">${cartao.nome}</span><div class="actions">
                <button class="mini" aria-label="Editar" data-bs-toggle="modal" data-bs-target="#modal-editar-cartao"><i class="fa-solid fa-pencil" style="color: #3f7d5b;"></i></button>
                <button class="mini" aria-label="Excluir" data-bs-toggle="modal" data-bs-target="#modal-excluir-cartao"><i class="fa-solid fa-trash" style="color: #c85b5b;"></i></button>
            </div></div>
            <div class="small" style="margin-top:12px">Fatura total</div>
            <div class="cartao-balance">R$ ${cartao.valor_fatura.toFixed(2)}</div>
            <div class="small">Limite total: R$ ${cartao.limite_total.toFixed(2)}</div>
            <div class="small">Limite disponível: R$ ${calcular_limite_disponivel(cartao).toFixed(2)}</div>
            <div class="small" style="margin-top:4px">Vencimento: ${cartao.data_vencimento || 'Não informado'}</div>
        </div>
        `
    });
}

//Para conseguir selecionar um cartão em contas fixas.
export function carregar_cartoes_options(select, cartoes) {
    select.innerHTML = '<option value="">Selecione um cartão</option>';

    cartoes.forEach(cartao => {
        const option = document.createElement('option');
        option.value = cartao.nome;
        option.textContent = cartao.nome;
        select.append(option);
    });
}

export function carregar_compras_cartao(
    listaCompras,
    compras,
    listarParcelas,
    aoAlterarParcela
) {
    listaCompras.replaceChildren();

    compras.forEach((compra) => {
        const parcelas = listarParcelas()
            .filter(parcela => parcela.compra_id === compra.id);

        const totalParcelas = parcelas.length;

        const parcelasPagas = parcelas.filter(
            parcela => parcela.paga
        ).length;

        const progresso = totalParcelas > 0
            ? (parcelasPagas / totalParcelas) * 100
            : 0;

        const valorTotal = Number(compra.valor);

        const valorParcela = totalParcelas > 0
            ? parcelas.reduce(
                (soma, parcela) => soma + Number(parcela.valor),
                0
            ) / totalParcelas
            : valorTotal;

        // Card da compra
        const card = document.createElement('div');
        card.className = 'card installment';

        // Descrição e resumo
        const topo = document.createElement('div');
        topo.className = 'between';

        const informacoes = document.createElement('div');

        const descricao = document.createElement('div');
        descricao.className = 'row-title';
        descricao.textContent = compra.descricao;

        const resumo = document.createElement('div');
        resumo.className = 'small';

        resumo.textContent =
            `${valorTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}` +
            ` · ${totalParcelas}x de ${valorParcela.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}` +
            ` · ${compra.cartao} · ${compra.data}`;

        informacoes.append(descricao, resumo);
        topo.appendChild(informacoes);
        card.appendChild(topo);

        // Barra de progresso
        const barra = document.createElement('div');
        barra.className = 'progress';

        const preenchimento = document.createElement('span');
        preenchimento.style.width = `${progresso}%`;

        barra.appendChild(preenchimento);
        card.appendChild(barra);

        // Botões das parcelas
        const chips = document.createElement('div');
        chips.className = 'chips';

        parcelas.forEach((parcela) => {
            const chip = document.createElement('button');

            chip.type = 'button';
            chip.className = 'chip';
            chip.textContent = parcela.paga ? 'paga ✓' : 'futura';

            chip.style.border = 'none';
            chip.style.cursor = 'pointer';
            chip.style.fontFamily = 'inherit';

            chip.title = parcela.paga
                ? 'Parcela já paga'
                : 'Consultar esta parcela futura';

            chip.addEventListener('click', () => {
                if (parcela.paga) return;

                // Apenas consulta o mês da parcela.
                // Não altera o estado de pagamento.
                aoAlterarParcela(parcela.id, parcela.mes_referencia);
            });

            chips.appendChild(chip);
        });

        card.appendChild(chips);
        listaCompras.appendChild(card);
    });
}

export function carregar_cartoes_no_select(select, cartoes) {
    if (!select) return;

    // Remove as opções anteriores, mantendo a opção inicial.
    select.innerHTML = '<option value="">Selecione um cartão</option>';

    cartoes.forEach((cartao, index) => {
        const opcao = document.createElement('option');
        opcao.value = index;
        opcao.textContent = cartao.nome;
        select.appendChild(opcao);
    });
}