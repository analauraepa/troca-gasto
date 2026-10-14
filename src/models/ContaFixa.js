export class ContaFixa {
    constructor(descricao, valor, diaVencimento, categoria, pagamento, ativa = true){
        this.descricao = descricao;
        this.valor = Number(valor);
        this.diaVencimento = Number(diaVencimento);
        this.categoria = categoria;
        this.pagamento = pagamento;
        this.ativa = ativa;
    }
} //Aqui tem tudo o que uma conta fixa possui.