// Operações sobre as contas fixas.
import {
    contasFixas,
    editarContaFixa,
    excluirContaFixa,
    marcarPagamentoContaFixa
} from '../services/contaFixa.services.js';
import { adicionarMovimentacao } from '../services/movimentacao.services.js';
import { adicionar_compra } from '../services/compra.services.js';
import { bancos } from '../services/banco.services.js';
import { cartoes } from '../services/cartao.services.js';

// Registra os eventos da lista e dos formulários de contas fixas.
export function iniciarContaFixaController({
    lista, // Lista das contas fixas.
    formularioEditar, // Formulário do modal de edição.
    datepickerEditar, // Datepicker do dia de vencimento.
    modalEditarContaFixa, // Modal de editar contas.
    modalExcluirContaFixa, // Modal para excluir contas.
    btnExcluirContaFixa, // Botão de confirmação da exclusão.
    atualizarPainel, // Atualiza a lista e o resumo.
    formularioPagamento, //Formulário para pagamento.
    modalPagamentoContaFixa, //modal para o formulário de pagamento.
    selectBancoPagamento, //Selecionar um banco existente no modal de pegamento.
    selectCartaoPagamento //Selecionar um cartão existente no modal de pagamento.
}) {
    // Identifica a conta selecionada e preenche o formulário de edição.
    lista.addEventListener('click', event => {
        const botaoEditar = event.target.closest(
            '[data-bs-target="#modal-editar-conta-fixa"]'
        );

        // Ignora os cliques que não foram do botão de editar.
        if (!botaoEditar) return;

        // Encontra a linha e pega o seu índice no array de contas existentes.
        const linha = botaoEditar.closest('.item-conta-fixa');
        if (!linha) return;

        const index = Number(linha.dataset.index);
        const conta = contasFixas[index];
        if (!conta) return;

        // Guarda o índice para usá-lo quando o formulário for enviado.
        formularioEditar.dataset.index = index;

        // Preenche os campos com os dados atuais da conta.
        document.querySelector('#editar-conta-descricao').value = conta.descricao;
        document.querySelector('#editar-conta-valor').value = conta.valor;
        datepickerEditar.setDate(conta.dataVencimento);
        document.querySelector('#editar-conta-categoria').value = conta.categoria;
        document.querySelector('#editar-conta-ativa').value = String(conta.ativa);
    });

    // Valida os dados modificados, salva e atualiza a visualização da página.
    formularioEditar.addEventListener('submit', event => {
        // Evita que a página recarregue quando for enviado.
        event.preventDefault();

        // Interrompe o salvamento se algum campo obrigatório for inválido.
        if (!formularioEditar.reportValidity()) return;

        // Recupera o índice guardado ao abrir o formulário.
        const index = Number(formularioEditar.dataset.index);

        // Envia os novos valores ao serviço.
        const editou = editarContaFixa(
            index,
            document.querySelector('#editar-conta-descricao').value.trim(),
            document.querySelector('#editar-conta-valor').value,
            document.querySelector('#editar-conta-vencimento').value,
            document.querySelector('#editar-conta-categoria').value.trim(),
            document.querySelector('#editar-conta-ativa').value === 'true'
        );

        // Não atualiza a interface da página se não encontrou a conta.
        if (!editou) return;

        // Atualiza lista e resumo, limpa o formulário e fecha o modal.
        atualizarPainel();
        formularioEditar.reset();
        modalEditarContaFixa.hide();
    });

    // Pega qual conta foi escolhida para exclusão.
    lista.addEventListener('click', event => {
        const botaoExcluir = event.target.closest(
            '[data-bs-target="#modal-excluir-conta-fixa"]'
        );

        if (!botaoExcluir) return;
        const linha = botaoExcluir.closest('.item-conta-fixa');
        if (!linha) return;

        btnExcluirContaFixa.dataset.index = linha.dataset.index;
    });

    // Exclui a conta confirmada e atualiza a lista e o resumo.
    btnExcluirContaFixa.addEventListener('click', () => {
        const index = Number(btnExcluirContaFixa.dataset.index);
        const excluiu = excluirContaFixa(index);
        if (!excluiu) return;

        atualizarPainel();
        modalExcluirContaFixa.hide();
    });

    // Guarda os controles do modal que determinam método, destino e resultado do pagamento.
    const grupoBanco = document.querySelector('#grupo-banco-pagamento');
    const grupoCartao = document.querySelector('#grupo-cartao-pagamento');
    const resumoPagamento = document.querySelector('#resumo-pagamento-conta-fixa');
    const erroPagamento = document.querySelector('#erro-pagamento-conta-fixa');
    const elementoModalPagamento = document.querySelector('#modal-pagamento-conta-fixa');

    lista.addEventListener('click', event => {
        // Associa o modal à conta clicada e limpa seleções/erros de uma abertura anterior.
        const botao = event.target.closest('[data-action="confirmar-pagamento"]');
        if (!botao) return;

        const linha = botao.closest('.item-conta-fixa');
        if (!linha) return;

        const index = Number(linha.dataset.index);
        const conta = contasFixas[index];
        if (!conta) return;

        elementoModalPagamento.dataset.index = String(index);
        resumoPagamento.textContent =
            `${conta.descricao} — ${Number(conta.valor).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}`;

        erroPagamento.hidden = true;
        formularioPagamento.reset();
        grupoBanco.hidden = true;
        grupoCartao.hidden = true;
        selectBancoPagamento.required = false;
        selectCartaoPagamento.required = false;
    });

    formularioPagamento
        .querySelectorAll('[name="metodo-pagamento"]')
        .forEach(radio => {
            radio.addEventListener('change', () => {
                if (!radio.checked) return;

                // Exibe e exige somente o seletor correspondente ao método escolhido.
                const usarBanco = radio.value === 'banco';
                const usarCartao = radio.value === 'cartao';

                grupoBanco.hidden = !usarBanco;
                grupoCartao.hidden = !usarCartao;
                selectBancoPagamento.required = usarBanco;
                selectCartaoPagamento.required = usarCartao;
                selectBancoPagamento.value = '';
                selectCartaoPagamento.value = '';
            });
        });

    formularioPagamento.addEventListener('submit', event => {
        event.preventDefault();

        if (!formularioPagamento.reportValidity()) return;

        const index = Number(elementoModalPagamento.dataset.index);
        const conta = contasFixas[index];

        if (!conta) {
            erroPagamento.textContent = 'Não foi possível localizar a conta fixa.';
            erroPagamento.hidden = false;
            return;
        }

        const metodo = new FormData(formularioPagamento).get('metodo-pagamento');
        const data = new Date();
        const mesAtual = `${data.getFullYear()}-${String(
            data.getMonth() + 1
        ).padStart(2, '0')}`;

        if ((conta.mesesPagos || []).includes(mesAtual)) {
            erroPagamento.textContent = 'Esta conta já foi paga neste mês.';
            erroPagamento.hidden = false;
            return;
        }

        try {
            // Se a escolha for o Banco gera saída no extrato, se for cartão gera compra parcelada em uma vez na fatura.
            if (metodo === 'banco') {
                const banco = bancos.find(
                    item => item.nome === selectBancoPagamento.value
                );

                if (!banco) {
                    erroPagamento.textContent = 'Selecione um banco válido.';
                    erroPagamento.hidden = false;
                    return;
                }

                const dataMovimentacao =
                    new Intl.DateTimeFormat('pt-BR').format(data);

                adicionarMovimentacao(
                    `Conta fixa: ${conta.descricao}`,
                    'saida',
                    conta.valor,
                    dataMovimentacao,
                    banco.nome
                );
            } else if (metodo === 'cartao') {
                const cartao = cartoes.find(
                    item => item.nome === selectCartaoPagamento.value
                );

                if (!cartao) {
                    erroPagamento.textContent = 'Selecione um cartão válido.';
                    erroPagamento.hidden = false;
                    return;
                }

                const dataCompra = [
                    data.getFullYear(),
                    String(data.getMonth() + 1).padStart(2, '0'),
                    String(data.getDate()).padStart(2, '0')
                ].join('-');

                adicionar_compra(
                    `Conta fixa: ${conta.descricao}`,
                    conta.valor,
                    dataCompra,
                    cartao.nome,
                    1
                );
            } else {
                erroPagamento.textContent = 'Selecione banco ou cartão.';
                erroPagamento.hidden = false;
                return;
            }

            if (!marcarPagamentoContaFixa(index, mesAtual)) {
                erroPagamento.textContent =
                    'Não foi possível registrar o pagamento.';
                erroPagamento.hidden = false;
                return;
            }

            // Atualiza o estado da conta apenas após registrar o lançamento financeiro.
            atualizarPainel();
            formularioPagamento.reset();
            modalPagamentoContaFixa.hide();
        } catch (error) {
            erroPagamento.textContent =
                error instanceof Error
                    ? error.message
                    : 'Ocorreu um erro ao registrar o pagamento.';
            erroPagamento.hidden = false;
        }
    });
}