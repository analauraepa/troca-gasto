

// Exibe o saldo total e aplica sua cor conforme o valor.
export function exibirSaldoTotal(elemento, total) {
    const saldoTotal = document.createElement('strong');
    const valor = Number(total);

    saldoTotal.textContent = `R$ ${valor}`;
    saldoTotal.classList.add(valor >= 0 ? 'in' : 'out');

    elemento.replaceChildren(saldoTotal);
}

// Exibe receitas, despesas e resultado, aplicando a cor ao resultado.
export function exibirTotaisMovimentacoes(elementos, totais) {
    if (elementos.receitas) {
        elementos.receitas.textContent = `R$ ${Number(totais.receitas)}`;
    }

    if (elementos.despesas) {
        elementos.despesas.textContent = `R$ ${Number(totais.despesas)}`;
    }

    if (elementos.resultado) {
        elementos.resultado.textContent = `R$ ${Number(totais.resultado)}`;
        elementos.resultado.classList.toggle('in', totais.resultado >= 0);
        elementos.resultado.classList.toggle('out', totais.resultado < 0);
    }
}