import { Banco } from "../models/Banco.js"
import * as movimentacaoService from "./movimentacao.services.js"

//Cria um array de objetos apartir dos dados salvos no localStorage, caso não haja dados, cria um array vazio
const dados = JSON.parse(localStorage.getItem("bancos")) || [];

// restaura o saldo inicial e o saldo atual de cada banco salvo
export let bancos = dados.map(banco => {
    // usa o saldo atual como inicial caso o registro antigo não tenha saldoInicial
    const saldoInicial = Number(banco.saldoInicial ?? banco.saldo);

    // cria a instância do banco com o saldo inicial
    const bancoRestaurado = new Banco(banco.nome, saldoInicial);

    // preserva o saldo atual salvo, que pode ser diferente do saldo inicial
    bancoRestaurado.saldo = Number(banco.saldo ?? saldoInicial);
    return bancoRestaurado;
});

//Transforma o array bancos em texto e salva no localStorage
export function salvarBancos() {
    localStorage.setItem("bancos", JSON.stringify(bancos));
}

//Adiciona um novo banco ao array bancos e salva no localStorage
export function adicionarBanco(nome,saldo = 0) {
    bancos.push(new Banco(nome, Number(saldo)));
    salvarBancos();
}

//Edita o nome de um banco existente no array bancos e salva no localStorage
export function editarBanco(nome,index) {
    const bancoAntigo = bancos[index].nome
    movimentacaoService.atualizarMovimentacoesEdicao(bancoAntigo,nome);
    bancos[index].nome = nome;
    salvarBancos();
}

//Remove um banco existente no array bancos (bem como suas movimentções) e salva no localStorage
export function removerBanco(index) {
    const banco = bancos[index].nome;
    movimentacaoService.atualizarMovimentacoesExclusao(banco);
    bancos.splice(index,1)
    salvarBancos();
}

export function nomeRepetido(nome) {
    return bancos.some(banco => banco.nome === nome);
}