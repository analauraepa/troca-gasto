import * as bancoService from '../services/banco.services.js';
import * as movimentacoesService from '../services/movimentacao.services.js';

import { carregarBancos, carregarBancosOptions, carregarSaldoTotal } from '../components/banco.components.js';
import { carregarMovimentacoes } from '../components/movimentacao.components.js';

export function iniciarBancoController({
    divBancos,
    cardSaldoTotal,
    selectBancosEntrada,
    selectBancosSaida,
    listaMovimentacoes,
    formAddBanco,
    formEditBanco,
    modalAdicionarBanco,
    modalEditarBanco,
    modalExcluirBanco,
    btnExcluirBanco
}){
    const inputNomeBanco = formAddBanco.querySelector('#add-nome-banco');
    const inputEditBanco = formEditBanco.querySelector('#edit-nome-banco');

    //Recarrega os elementos dinâmicos da interface: bancos, movimentações e saldo total
    function atualizarInterface() {
        carregarBancos(divBancos, bancoService.bancos);
        carregarSaldoTotal(cardSaldoTotal, bancoService.bancos);

        carregarBancosOptions(selectBancosEntrada,bancoService.bancos);
        carregarBancosOptions(selectBancosSaida,bancoService.bancos);

        carregarMovimentacoes(listaMovimentacoes,movimentacoesService.movimentacoes);
    }

    //Cada card de banco possui um atributo data-index que armazena o índice daquele banco no array de bancos
    //Quando o usuário clica em um card da divBancos, envia o data-index do card para os modais de exclusão e edição
    //Dessa forma o modal sabe qual banco deve ser editado/excluído
    divBancos.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (!card) return;
        const index = card.dataset.index;

        if (event.target.closest('.fa-pencil')) {
            document.querySelector('#modal-editar-banco').dataset.index = index;
        }

        if (event.target.closest('.fa-trash')) {
            document.querySelector('#modal-excluir-banco').dataset.index = index;
        }
    });

    //Valida o preenchimento do formulário, adiciona um banco ao array de bancos e atualiza a interface
    formAddBanco.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!formAddBanco.checkValidity()) {
            inputNomeBanco.classList.add('red');
            inputNomeBanco.nextElementSibling.textContent ='Insira o nome do banco.';
            inputNomeBanco.nextElementSibling.classList.remove('hide');
            return;
        }

        const nome = inputNomeBanco.value.trim();
        const saldo = Number(document.querySelector('#add-saldo-banco').value) || 0;
        
        //Verifica se o nome escolhido já existe
        if (bancoService.nomeRepetido(nome)) {
            inputNomeBanco.classList.add('red');
            inputNomeBanco.nextElementSibling.textContent ='O nome do banco já existe.';
            inputNomeBanco.nextElementSibling.classList.remove('hide');
            return;
        }

        bancoService.adicionarBanco(nome, saldo);

        atualizarInterface();
        formAddBanco.reset();
        modalAdicionarBanco.hide();
    });

    //Valida o preenchimento do formulário, edita um banco já existente e atualiza a interface
    formEditBanco.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!formEditBanco.checkValidity()) {
            inputEditBanco.classList.add('red');
            inputEditBanco.nextElementSibling.textContent ='Insira o nome do banco.';
            inputEditBanco.nextElementSibling.classList.remove('hide');
            return;
        }

        const nome = inputEditBanco.value.trim();
        const index = Number(document.querySelector('#modal-editar-banco').dataset.index);

        //Verifica se o nome escolhido já existe; o nome atual não acusa duplicidade
        const nomeAtual = bancoService.bancos[index]?.nome;

        if (nome !== nomeAtual && bancoService.nomeRepetido(nome)) {
            inputEditBanco.classList.add('red');
            inputEditBanco.nextElementSibling.textContent = 'O nome do banco já existe.';
            inputEditBanco.nextElementSibling.classList.remove('hide');
            return;
        }

        bancoService.editarBanco(nome, index);

        atualizarInterface();
        formEditBanco.reset();
        modalEditarBanco.hide();
    });

    //Exclui o banco selecionado e atualiza a interface
    btnExcluirBanco.addEventListener('click', () => {
        const index = Number(document.querySelector('#modal-excluir-banco').dataset.index);
        bancoService.removerBanco(index);
        atualizarInterface();
        modalExcluirBanco.hide();
    });

    //Valida o formulário antes do usuário clicar o botão submit
    inputNomeBanco.addEventListener('input', () => {
        if (inputNomeBanco.value === '') {
            inputNomeBanco.classList.add('red');
            inputNomeBanco.nextElementSibling.textContent = 'Insira o nome do banco.';
            inputNomeBanco.nextElementSibling.classList.remove('hide');
        } else {
            inputNomeBanco.classList.remove('red');
            inputNomeBanco.nextElementSibling.classList.add('hide');
        }
    });

    //Valida o formulário antes do usuário clicar o botão submit
    inputEditBanco.addEventListener('input', () => {
        if (inputEditBanco.value === '') {
            inputEditBanco.classList.add('red');
            inputEditBanco.nextElementSibling.textContent = 'Insira o nome do banco.';
            inputEditBanco.nextElementSibling.classList.remove('hide');
        } else {
            inputEditBanco.classList.remove('red');
            inputEditBanco.nextElementSibling.classList.add('hide');
        }
    });
}