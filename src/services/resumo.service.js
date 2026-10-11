//importando o array de objetos do localstorage
import { bancos } from "./banco.services.js";
import { movimentacoes } from "./movimentacao.services.js";

// função para saldo de todas as contas
export function calcularTotalSaldo() {
    let total = 0
    bancos.forEach(banco => {
        total += Number(banco.saldo)
    });

    return total
}

// funcao para filtrar as entradas
export function recResumo(){
    let totalIn = 0
    movimentacoes.forEach(mov =>{
        if (mov.tipo == 'entrada'){
            totalIn += Number(mov.valor)
        }
    })
    return totalIn
}

// funçao para filtrar as saídas

export function saiResumo(){
    let totalOut = 0
    movimentacoes.forEach(mov =>{
        if (mov.tipo == 'saida'){
            totalOut += Number(mov.valor)
        }
    })
    return totalOut
}
