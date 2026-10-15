export function carregar_cartoes(divCartoes, cartoes) {
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
            <div class="small">Limite disponível: R$ ${cartao.calcular_limite_disponivel().toFixed(2)}</div>
            <div class="small" style="margin-top:4px">Vencimento: ${cartao.data_vencimento || 'Não informado'}</div>
        </div>
        `
    });
}

export function carregar_cartoes_options(selectCartoes, cartoes){
    selectCartoes.innerHTML = '';
    cartoes.forEach((cartao) => {
        selectCartoes.innerHTML += `
        <option value="${cartao.nome}">${cartao.nome}</option>
        `
    });
}
