export function carregarContasFixas(lista, contasFixas) {
    lista.innerHTML = '';

    contasFixas.forEach((conta, index) => {
        const vencimento = typeof conta.dataVencimento === 'string'
            ? `Vence em ${conta.dataVencimento}`
            : `Vence dia ${conta.dataVencimento}`;

        lista.innerHTML += `
            <div class="list-row item-conta-fixa" data-index="${index}">
                <div>
                    <div class="row-title">${conta.descricao}</div>
                    <div class="small">
                        ${vencimento} · ${conta.categoria}
                        ${conta.banco ? `· Banco: ${conta.banco}` : ''}
                        ${conta.cartao ? `· Cartão: ${conta.cartao}` : ''}
                        <span class="badge ${conta.ativa ? '' : 'red'}">
                            ${conta.ativa ? 'ativa' : 'inativa'}
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
                    </div>
                </div>
            </div>
        `;
    });
}
