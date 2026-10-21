import { ContaFixa } from "../models/ContaFixa.js";

// Lê as contas persistidas no navegador.
const dadosSalvos = JSON.parse(localStorage.getItem('contasFixas')) || [];

// Recria instâncias do modelo a partir dos dados persistidos.
export let contasFixas = dadosSalvos.map(conta => new ContaFixa(
    conta.descricao,
    conta.valor,
    conta.dataVencimento,
    conta.categoria,
    conta.ativa,
    conta.mesesPagos || []
));

// Persiste a lista atualizada no localStorage.
export function salvarContasFixas() {
    localStorage.setItem('contasFixas', JSON.stringify(contasFixas));
}

// Cria a conta, insere no início da lista e salva.
export function adicionarContaFixa(
    descricao,
    valor,
    dataVencimento,
    categoria,
    ativa = true
) {
    contasFixas.unshift(
        new ContaFixa(
            descricao,
            valor,
            dataVencimento,
            categoria,
            ativa
        )
    );
    salvarContasFixas();
}

// Atualiza os dados da conta selecionada e salva a lista.
export function editarContaFixa(
    index,
    descricao,
    valor,
    dataVencimento,
    categoria,
    ativa
) {
    const conta = contasFixas[index];
    if (!conta) return false;

    conta.descricao = descricao;
    conta.valor = Number(valor);
    conta.dataVencimento = dataVencimento;
    conta.categoria = categoria;
    conta.ativa = ativa;

    salvarContasFixas();
    return true;
}

// Remove a conta selecionada e salva a lista atualizada.
export function excluirContaFixa(index) {
    if (!contasFixas[index]) return false;

    contasFixas.splice(index, 1);
    salvarContasFixas();
    return true;
}

export function marcarPagamentoContaFixa(index, mes) {
    const conta = contasFixas[index];
    if (!conta) return false;

    // Impede registrar um segundo pagamento da mesma conta no mesmo mês.
    if (conta.mesesPagos.includes(mes)) return false;

    conta.mesesPagos.push(mes);
    salvarContasFixas();
    return true;
}