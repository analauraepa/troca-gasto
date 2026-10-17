export class Cartao {
    constructor(nome, valor_fatura, limite_total, data){
        this.nome = nome;
        this.valor_fatura = valor_fatura;
        this.limite_total = limite_total;
        this.data_vencimento = data;
    }
}