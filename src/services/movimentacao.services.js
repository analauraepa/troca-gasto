import { Movimentacao } from "../models/Movimentacao.js";
import * as bancoService from "./banco.services.js"

const dados = JSON.parse(localStorage.getItem("movimentacoes")) || [];

export let movimentacoes = dados.map(movimentacao => new Movimentacao(movimentacao.descricao, movimentacao.tipo, Number(movimentacao.valor), movimentacao.data, movimentacao.banco, movimentacao.recorrente));

export function salvarMovimentacoes(){
    localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
}

export function adicionarMovimentacao(descricao, tipo, valor, data, banco){
    movimentacoes.push(new Movimentacao(descricao,tipo,Number(valor),data,banco,false));
    movimentacoes.sort((a, b) => new Date(b.data) - new Date(a.data));
    salvarMovimentacoes();

    const bancoCorrespondente = bancoService.bancos.find(b => b.nome === banco);

    if (!bancoCorrespondente) {
        console.error('Banco não encontrado:', banco);
        return;
    }

    bancoCorrespondente.atualizarSaldo(movimentacoes);
    bancoService.salvarBancos();
}

export function editarMovimentacao(index, descricao, valor, data){
    movimentacoes[index].descricao = descricao;
    movimentacoes[index].valor = Number(valor);
    movimentacoes[index].data = data;
    movimentacoes.sort((a, b) => new Date(b.data) - new Date(a.data));
    salvarMovimentacoes();
    
    const bancoCorrespondente = bancoService.bancos.find(b => b.nome === movimentacoes[index].banco);
    bancoCorrespondente.atualizarSaldo(movimentacoes);
    bancoService.salvarBancos();
}

export function excluirMovimentacao(index){
    const bancoCorrespondente = bancoService.bancos.find(b => b.nome === movimentacoes[index].banco);
    
    movimentacoes.splice(index,1)
    movimentacoes.sort((a, b) => new Date(b.data) - new Date(a.data));
    salvarMovimentacoes();

    bancoCorrespondente.atualizarSaldo(movimentacoes);
    bancoService.salvarBancos();
}