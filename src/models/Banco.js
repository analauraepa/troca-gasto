export class Banco {
    constructor(nome, saldo) {
        this.nome = nome;
        this.saldoInicial = saldo;
        this.saldo = saldo;
    }

    atualizarSaldo(movimentacoes) {
        const x = movimentacoes.filter(m => m.banco === this.nome).filter(m => m.tipo === 'entrada').reduce((acc, m) => acc + m.valor, 0);
        const y = movimentacoes.filter(m => m.banco === this.nome).filter(m => m.tipo === 'saida').reduce((acc, m) => acc + m.valor, 0);
        this.saldo = this.saldoInicial + x - y;

    }
}