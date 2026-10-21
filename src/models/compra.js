export class Compra {
    constructor(
        descricao,
        valor,
        data,
        cartao,
        quantidade_de_parcelas,
    ){
        this.id = crypto.randomUUID();
        this.descricao = descricao;
        this.valor = Number(valor);
        this.data = data;
        this.cartao = cartao;
        this.quantidade_de_parcelas = Number(quantidade_de_parcelas);
    }
}