export class ContaFixa {
    constructor(
        descricao,
        valor,
        dataVencimento,
        categoria,
        banco,
        cartao,
        ativa = true,
        mesesPagos = []
    ) {
        this.descricao = descricao;
        this.valor = Number(valor);
        this.dataVencimento = dataVencimento;
        this.categoria = categoria;
        this.banco = banco;
        this.cartao = cartao;
        this.ativa = ativa;
        this.mesesPagos = Array.isArray(mesesPagos) ? mesesPagos : [];
    }
}