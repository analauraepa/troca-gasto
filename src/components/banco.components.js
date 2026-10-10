// Itera sobre o array de bancos e cria os elementos HTML correspondentes para cada banco, adicionando-os ao divBancos.
export function carregarBancos(divBancos, bancos) {
    divBancos.innerHTML = '';
    bancos.forEach((banco,index) => {
        divBancos.innerHTML += `
        <div class="card" data-index="${index}">
            <div class="bank-top"><span class="bank-name">${banco.nome}</span><div class="actions">
                <button class="mini" aria-label="Editar" data-bs-toggle="modal" data-bs-target="#modal-editar-banco"><i class="fa-solid fa-pencil" style="color: #3f7d5b;"></i></button>
                <button class="mini" aria-label="Excluir" data-bs-toggle="modal" data-bs-target="#modal-excluir-banco"><i class="fa-solid fa-trash" style="color: #c85b5b;"></i></button>
            </div></div>
            <div class="small" style="margin-top:12px">Saldo</div>
            <div class="bank-balance">R$ ${banco.saldo.toFixed(2)}</div>
        </div>
        `
    });
}

export function carregarBancosOptions(selectBancos, bancos){
    selectBancos.innerHTML = '';
    bancos.forEach((banco) => {
        selectBancos.innerHTML = `
        <option value="${banco.nome}">${banco.nome}</option>
        `
    });
}