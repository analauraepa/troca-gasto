export class Movimentacao {
    constructor(descricao, tipo, valor, data, banco, recorrente) {
        this.descricao = descricao;
        this.tipo = tipo;
        this.valor = valor;
        this.data = data;
        this.banco = banco;
        this.recorrente = recorrente;
    }
}