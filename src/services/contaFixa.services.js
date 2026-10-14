import { ContaFixa } from "../models/ContaFixa.js";

const dadosSalvos = JSON.parse(localStorage.getItem('contasFixas')) || [];
//Aqui vai carregar as contas do localstorage, caso não exista nenhuma será um array vazio.
//JSON.parse serve para converter o texto em um array de contas.

export let contasFixas = dadosSalvos.map(conta => new ContaFixa(conta.descricao, conta.valor, conta.diaVencimento, conta.categoria, conta.pagamento, conta.ativa));
//Aqui tá sendo usado o map para percorrer todos os dados salvos e criar um novo array. (para criar contas na classe ContaFixa)

export function salvarContasFixas(){
    localStorage.setItem('contasFixas', JSON.stringify(contasFixas));
}//JSON.stringify converte contasFixas em texto e salva no navegador com a chave contasFixas.

export function adicionarContaFixa(descricao, valor, diaVencimento, categoria, pagamento, ativa = true){
    contasFixas.unshift( 
        new ContaFixa (descricao, valor, diaVencimento, categoria, pagamento, ativa)
    );
    salvarContasFixas();
}// a função recebe dados de uma nova conta e adiciona no inicio do array de contas(a nova aparecerá primeiro), depois salva e atualiza no localstorage.