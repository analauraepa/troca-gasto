export function carregarMovimentacoes(listaMovimentacoes, movimentacoes){
    listaMovimentacoes.innerHTML = ''
    movimentacoes.forEach((movimentacao,index) => {
        listaMovimentacoes.innerHTML += `
        <tr class="item-movimentacao" data-index=${index}>
            <td><strong>${movimentacao.descricao}</strong></td>
            <td>${movimentacao.data}</td><td>${movimentacao.banco}</td>
            <td class="${movimentacao.tipo === 'entrada' ? 'in' : 'out'}"><strong>${movimentacao.tipo === 'entrada' ? '+' : '-'}R$ ${movimentacao.valor.toFixed(2)}</strong></td>
            <td><button class="mini" aria-label="Editar" data-bs-toggle="modal" data-bs-target="#modal-editar-movimentacao"><i class="fa-solid fa-pencil" style="color: #3f7d5b;"></i></button>
            <button class="mini" aria-label="Excluir" data-bs-toggle="modal" data-bs-target="#modal-excluir-movimentacao"><i class="fa-solid fa-trash" style="color: #c85b5b;"></i></button></td>
          </tr>
        `
    });
}