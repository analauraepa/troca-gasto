export class Banco {
    constructor(nome, saldo) {
        this.nome = nome;
        this.saldoInicial = saldo;
        this.saldo = saldo;
    }

    //Realiza um somatório de todas as entradas, um somatório de todas as saídas e calcula o saldo atual 
    atualizarSaldo(movimentacoes) {
        const somaEntradas = movimentacoes.filter(m => m.banco === this.nome).filter(m => m.tipo === 'entrada').reduce((acc, m) => acc + m.valor, 0);
        const somaSaídas = movimentacoes.filter(m => m.banco === this.nome).filter(m => m.tipo === 'saida').reduce((acc, m) => acc + m.valor, 0);
        this.saldo = this.saldoInicial + somaEntradas - somaSaídas;

    }
}