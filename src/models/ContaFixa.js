export class ContaFixa {
    constructor(descricao, valor, dataVencimento, categoria, banco, cartao, ativa = true) {
    this.descricao = descricao;
    this.valor = Number(valor);
    this.dataVencimento = dataVencimento;
    this.categoria = categoria;
    this.banco = banco;
    this.cartao = cartao;
    this.ativa = ativa;
}
} //Aqui tem tudo o que uma conta fixa possui.