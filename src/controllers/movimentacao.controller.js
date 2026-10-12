import * as movimentacoesService from '../services/movimentacao.services.js';
import * as bancoService from '../services/banco.services.js';

import { carregarMovimentacoes } from '../components/movimentacao.components.js';
import { carregarBancos } from '../components/banco.components.js';

export function iniciarMovimentacaoController({
    listaMovimentacoes,
    divBancos,
    formAddEntrada,
    formAddSaida,
    formEditMovimentacao,
    modalAdicionarEntrada,
    modalAdicionarSaida,
    modalEditMovimentacao,
    modalExcluirMovimentacao,
    btnExcluirMovimentacao,
    atualizarResumo
}) {
    const inputDescricaoEntrada = formAddEntrada.querySelector('#add-descricao-entrada');
    const inputValorEntrada = formAddEntrada.querySelector('#add-valor-entrada');
    const inputDataEntrada = formAddEntrada.querySelector('#add-data-entrada');
    const inputBancoEntrada = formAddEntrada.querySelector('#add-banco-entrada');

    const inputDescricaoSaida = formAddSaida.querySelector('#add-descricao-saida');
    const inputValorSaida = formAddSaida.querySelector('#add-valor-saida');
    const inputDataSaida = formAddSaida.querySelector('#add-data-saida');
    const inputBancoSaida = formAddSaida.querySelector('#add-banco-saida');

    const inputEditDescricao = formEditMovimentacao.querySelector('#edit-descricao-movimentacao');
    const inputEditValor = formEditMovimentacao.querySelector('#edit-valor-movimentacao');
    const inputEditData = formEditMovimentacao.querySelector('#edit-data-movimentacao');

    //Recarrega os elementos dinâmicos da interface: bancos, movimentações e saldo total
    function atualizarInterface() {
        carregarMovimentacoes(listaMovimentacoes,movimentacoesService.movimentacoes);
        carregarBancos(divBancos, bancoService.bancos);
        atualizarResumo?.();
    }

    //Cada card de movimentação possui um atributo data-index que armazena o índice daquela movimentação no array de movimentações
    //Quando o usuário clica em um card da listaMovimentacoes, envia o data-index do card para os modais de exclusão e edição
    //Dessa forma o modal sabe qual movimentação deve ser editada/excluída
    listaMovimentacoes.addEventListener('click', (event) => {
        const card = event.target.closest('.item-movimentacao');
        if (!card) return;
        const index = card.dataset.index;

        if (event.target.closest('.fa-pencil')) {
            document.querySelector('#modal-editar-movimentacao').dataset.index = index;

            document.querySelector('#edit-descricao-movimentacao').placeholder = movimentacoesService.movimentacoes[index].descricao;
            document.querySelector('#edit-valor-movimentacao').placeholder = movimentacoesService.movimentacoes[index].valor.toFixed(2);
            document.querySelector('#edit-data-movimentacao').placeholder = movimentacoesService.movimentacoes[index].data;
        }

        if (event.target.closest('.fa-trash')) {
            document.querySelector('#modal-excluir-movimentacao').dataset.index = index;
        }
    });

    //Valida o preenchimento do formulário, adiciona uma movimentação ao array de movimentações e atualiza a interface
    formAddEntrada.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!formAddEntrada.checkValidity()) {
            [inputDescricaoEntrada,inputValorEntrada,inputDataEntrada,inputBancoEntrada].forEach(validarCampoSubmit);
            inputDataSaida.value === '' ? document.querySelector('#feedback-data-entrada').classList.remove('hide') : document.querySelector('#feedback-data-entrada').classList.add('hide');
            return;
        }

        const descricao = inputDescricaoEntrada.value.trim();
        const valor = Number(inputValorEntrada.value);
        const data = inputDataEntrada.value;
        const banco = inputBancoEntrada.value;

        movimentacoesService.adicionarMovimentacao(descricao, 'entrada', valor, data, banco);

        atualizarInterface();
        formAddEntrada.reset();
        modalAdicionarEntrada.hide();
    });

    //Valida o preenchimento do formulário, adiciona uma movimentação ao array de movimentações e atualiza a interface
    formAddSaida.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!formAddSaida.checkValidity()) {
            [inputDescricaoSaida,inputValorSaida,inputBancoSaida].forEach(validarCampoSubmit);
            inputDataSaida.value === '' ? document.querySelector('#feedback-data-saida').classList.remove('hide') : document.querySelector('#feedback-data-saida').classList.add('hide');
            return;
        }

        const descricao = inputDescricaoSaida.value.trim();
        const valor = Number(inputValorSaida.value);
        const data = inputDataSaida.value;
        const banco = inputBancoSaida.value;

        movimentacoesService.adicionarMovimentacao(descricao, 'saida', valor, data, banco);

        atualizarInterface();
        formAddSaida.reset();
        modalAdicionarSaida.hide();
    });

    //Valida o preenchimento do formulário, edita uma movimentação já existente e atualiza a interface
    formEditMovimentacao.addEventListener('submit', (event) => {
        event.preventDefault();

        const index = Number(document.querySelector('#modal-editar-movimentacao').dataset.index);
        const descricao = inputEditDescricao.value.trim() || movimentacoesService.movimentacoes[index].descricao;
        const valor = Number(inputEditValor.value) || movimentacoesService.movimentacoes[index].valor;
        const data = inputEditData.value || movimentacoesService.movimentacoes[index].data;

        movimentacoesService.editarMovimentacao(index,descricao,valor,data);

        atualizarInterface();
        formEditMovimentacao.reset();
        modalEditMovimentacao.hide();
    });

    //Exclui a movimentação selecionada e atualiza a interface
    btnExcluirMovimentacao.addEventListener('click', () => {
        const index = Number(document.querySelector('#modal-excluir-movimentacao').dataset.index);

        movimentacoesService.excluirMovimentacao(index);

        atualizarInterface();
        modalExcluirMovimentacao.hide();
    });

    //Adiciona um eventListener a um campo e, quando o valor do campo muda, verifica se o campo está válido
    function validarCampo(campo) {
        campo.addEventListener('input', () => {
            if (campo.value === '') {
                campo.classList.add('red');
                campo.nextElementSibling.classList.remove('hide');
            } else {
                campo.classList.remove('red');
                campo.nextElementSibling.classList.add('hide');
            }
        });
    }

    //Verifica se o campo é válido, mas sem eventListener; esta função é chamada quando o user clica no botão submit
    function validarCampoSubmit(campo) {
        if (campo.value === '') {
            campo.classList.add('red');
            campo.nextElementSibling.classList.remove('hide');
        } else {
            campo.classList.remove('red');
            campo.nextElementSibling.classList.add('hide');
        }
    }

    //Verifica se foi inserida uma data; esta validação é feita em uma função separada pois o elemento datePicker não suporta o event 'input'
    function validarData(campo) {
        campo.addEventListener('changeDate', () => {
            if (campo.value === '') {
                campo.classList.add('red');
                campo.nextElementSibling.classList.remove('hide');
            } else {
                campo.classList.remove('red');
                campo.nextElementSibling.classList.add('hide');
            }
        });
    }

    //Chama as funções de validação para os campos dos formulários de adicionar entrada/saída
    [
    inputDescricaoEntrada,
    inputValorEntrada,
    inputDataEntrada,
    inputBancoEntrada,
    inputDescricaoSaida,
    inputValorSaida,
    inputBancoSaida
    ].forEach(validarCampo);

    [inputDataEntrada,inputDataSaida].forEach(validarData);
}