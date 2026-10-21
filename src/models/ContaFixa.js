export class ContaFixa {
    constructor(
        descricao,
        valor,
        dataVencimento,
        categoria,
        ativa = true,
        mesesPagos = []
    ) {
        this.descricao = descricao;
        this.valor = Number(valor);
        this.dataVencimento = dataVencimento;
        this.categoria = categoria;
        this.ativa = ativa;
        this.mesesPagos = Array.isArray(mesesPagos) ? mesesPagos : [];
    }
}