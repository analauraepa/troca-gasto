export function carregarContasFixas(lista, contasFixas) {
    lista.innerHTML = '';

    const dataAtual = new Date();
    const mesAtual = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}`;

    contasFixas.forEach((conta, index) => {
    const vencimento = `Vence em ${conta.dataVencimento}`;

        const pagaNesteMes = (conta.mesesPagos || []).includes(mesAtual);

        lista.innerHTML += `
            <div class="list-row item-conta-fixa" data-index="${index}">
                <div>
                    <div class="row-title">${conta.descricao}</div>
                    <div class="small">
                        ${vencimento} · ${conta.categoria}
                        <span class="badge ${conta.ativa ? '' : 'red'}">
                            ${conta.ativa ? 'ativa' : 'inativa'}
                        </span>
                        <span class="badge ${pagaNesteMes ? '' : 'yellow'}">
                            ${pagaNesteMes ? 'paga neste mês' : 'pendente neste mês'}
                        </span>
                    </div>
                </div>
                <div style="text-align:right">
                    <strong>R$ ${Number(conta.valor).toFixed(2)}</strong>
                    <div class="actions" style="margin-top:6px">
                        <button class="mini" type="button" aria-label="Editar ${conta.descricao}" data-bs-toggle="modal" data-bs-target="#modal-editar-conta-fixa">
                            <i class="fa-solid fa-pencil" style="color: #3f7d5b;"></i>
                        </button>
                        <button class="mini" type="button" aria-label="Excluir ${conta.descricao}" data-bs-toggle="modal" data-bs-target="#modal-excluir-conta-fixa">
                            <i class="fa-solid fa-trash" style="color: #c85b5b;"></i>
                        </button>
                        ${pagaNesteMes ? '' : `
                            <button
                                class="btn fixed-bill-payment"
                                type="button"
                                data-action="confirmar-pagamento"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-pagamento-conta-fixa">
                                Confirmar pagamento
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    });
}

//Aqui vai atualizar resumo das contas fixas existentes, cada vez que for adicionado uma nova conta.
export function atualizarResumoContasFixas(
    elementoTotal,
    elementoAtivas,
    elementoPagas,
    contasFixas
) {
    const mesAtual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

    const contasAtivas = contasFixas.filter( conta => conta.ativa);
    const totalMensal = contasAtivas.reduce(( total, conta) => total + Number(conta.valor), 0 );
    const contasPagas = contasFixas.filter( conta =>(conta.mesesPagos || []).includes(mesAtual));

    elementoTotal.textContent = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(totalMensal);

    elementoAtivas.textContent = String(contasAtivas.length);
    elementoPagas.textContent = String(contasPagas.length);
}
