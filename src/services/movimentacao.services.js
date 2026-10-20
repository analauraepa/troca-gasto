import { Movimentacao } from "../models/Movimentacao.js";
import * as bancoService from "./banco.services.js"

//Cria um array de objetos apartir dos dados salvos no localStorage, caso não haja dados, cria um array vazio
const dados = JSON.parse(localStorage.getItem("movimentacoes")) || [];

// Recria as movimentações salvas como instâncias do modelo.
export let movimentacoes = dados.map(movimentacao => new Movimentacao(
    movimentacao.descricao,
    movimentacao.tipo,
    Number(movimentacao.valor),
    movimentacao.data,
    movimentacao.banco,
    movimentacao.recorrente
));

//Transforma o array movimentacoes em texto e salva no localStorage
export function salvarMovimentacoes(){
    localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
}

// Adiciona uma movimentação, opcionalmente vinculada à conta fixa que a originou.
export function adicionarMovimentacao(
    descricao,
    tipo,
    valor,
    data,
    banco
) {
    movimentacoes.push(new Movimentacao(
        descricao,
        tipo,
        Number(valor),
        data,
        banco,
        false
    ));
    movimentacoes.sort((a, b) => new Date(converterData(b.data)) - new Date(converterData(a.data)));
    salvarMovimentacoes();

    const bancoCorrespondente = bancoService.bancos.find(b => b.nome === banco);

    if (!bancoCorrespondente) {
        console.error('Banco não encontrado:', banco);
        return;
    }

    bancoCorrespondente.atualizarSaldo(movimentacoes);
    bancoService.salvarBancos();
}

//Edita as informações de uma movimentação existente no array movimentação, atualiza o saldo do banco correspondente e salva no localStorage
export function editarMovimentacao(index, descricao, valor, data){
    const bancoCorrespondente = bancoService.bancos.find(b => b.nome === movimentacoes[index].banco);
    
    movimentacoes[index].descricao = descricao;
    movimentacoes[index].valor = Number(valor);
    movimentacoes[index].data = data;
    movimentacoes.sort((a, b) => new Date(converterData(b.data)) - new Date(converterData(a.data)));
    salvarMovimentacoes();
    
    bancoCorrespondente.atualizarSaldo(movimentacoes);
    bancoService.salvarBancos();
}

//Remove um banco existente no array bancos, atualiza o saldo do banco correspondente e salva no localStorage
export function excluirMovimentacao(index){
    const bancoCorrespondente = bancoService.bancos.find(b => b.nome === movimentacoes[index].banco);
    
    movimentacoes.splice(index,1)
    movimentacoes.sort((a, b) => new Date(converterData(b.data)) - new Date(converterData(a.data)));
    salvarMovimentacoes();

    bancoCorrespondente.atualizarSaldo(movimentacoes);
    bancoService.salvarBancos();
}

//Remove as movimentações de um banco que está para ser excluído
export function atualizarMovimentacoesExclusao(banco){
    movimentacoes = movimentacoes.filter(m => m.banco !== banco);
    salvarMovimentacoes();
}

//Atualiza as movimentações após o banco correspondente ter seu nome editado
export function atualizarMovimentacoesEdicao(bancoAntigo, bancoNovo){
    movimentacoes.forEach((movimentacao) => {
        if (movimentacao.banco === bancoAntigo){
            movimentacao.banco = bancoNovo;
        }
    });
    salvarMovimentacoes();
}

//Converte datas no formato DD/MM/AAAA (formato exibido para o usuário) para AAAA-MM-DD (formado suportado por Date())
function converterData(data){
    const d = data.split('/')[0];
    const m = data.split('/')[1];
    const a = data.split('/')[2];
    return `${a}-${m}-${d}`
}