// para inserir no elemento do html o total

export function exibirSaldoTotal(elemento, total) {
    const saldototal = document.createElement('strong');
    saldototal.textContent = `R$ ${Number(total)}`

    if (Number(total) >= 0) {
        saldototal.classList.add('in')
    } else {
        saldototal.classList.add('out')
    }

    elemento.replaceChildren(saldototal);

    
}