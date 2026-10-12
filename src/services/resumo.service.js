//importando o array de objetos do localstorage
import { bancos } from "./banco.services.js";
import { movimentacoes } from "./movimentacao.services.js";

// Calcula o saldo atual combinado das contas.
export function calcularTotalSaldo() {
    return bancos.reduce((total, banco) => total + Number(banco.saldo), 0);
}

// Soma todas as movimentações do tipo entrada
export function calcularReceitasTotais() {
    return movimentacoes
        .filter(movimentacao => movimentacao.tipo === 'entrada')
        .reduce((total, movimentacao) => total + Number(movimentacao.valor), 0);
}

// Soma todas as movimentações do tipo saída
export function calcularSaidasTotais() {
    return movimentacoes
        .filter(movimentacao => movimentacao.tipo === 'saida')
        .reduce((total, movimentacao) => total + Number(movimentacao.valor), 0);
}
