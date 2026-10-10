import './style.css'
import './bootstrap.scss';
import 'bootstrap/js/dist/dropdown';
import Modal from 'bootstrap/js/dist/modal';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';

import { carregarBancos, carregarBancosOptions } from './components/banco.components.js';
import { carregarMovimentacoes } from './components/movimentacao.components.js';

import * as bancoService from './services/banco.services.js';
import * as movimentacoesService from './services/movimentacao.services.js';

const divBancos = document.querySelector('#banks');
const selectBancosEntrada = document.querySelector('#add-banco-entrada');
const selectBancosSaida = document.querySelector('#add-banco-saida');
const listaMovimentacoes = document.querySelector('#lista-movimentacoes')

const formAddBanco = document.querySelector('#form-adicionar-banco');
const formEditBanco = document.querySelector('#form-editar-banco');
const formAddEntrada = document.querySelector('#form-adicionar-entrada');
const formAddSaida = document.querySelector('#form-adicionar-saida');

const inputNomeBanco = document.querySelector('#add-nome-banco');
const inputEditBanco = document.querySelector('#edit-nome-banco');

const modalAdicionarBanco = new Modal(document.querySelector('#modal-adicionar-banco'));
const modalEditarBanco = new Modal(document.querySelector('#modal-editar-banco'));
const modalExcluirBanco = new Modal(document.querySelector('#modal-excluir-banco'));

const modalAdicionarEntrada = new Modal(document.querySelector('#modal-adicionar-entrada'));
const modalAdicionarSaida = new Modal(document.querySelector('#modal-adicionar-saida'));
const modalexcluirMovimentacao = new Modal(document.querySelector('#modal-excluir-movimentacao'));

const btnExcluirBanco = document.querySelector('#btn-excluir-banco');
const btnExcluirMovimentacao = document.querySelector('#btn-excluir-movimentacao');

library.add(faTrash, faPencil);
dom.watch();

/* COMEÇO CÓDIGO GABRIEL */

carregarBancos(divBancos, bancoService.bancos);
carregarBancosOptions(selectBancosEntrada, bancoService.bancos);
carregarBancosOptions(selectBancosSaida, bancoService.bancos);
carregarMovimentacoes(listaMovimentacoes, movimentacoesService.movimentacoes);

divBancos.addEventListener('click', (event) => {
    const card = event.target.closest('.item-movimentacao');
    if (event.target.closest('.fa-pencil')) {
        const index = card.getAttribute('data-index');
        document.querySelector('#modal-editar-movimentacao').setAttribute('data-index', index);
    }

    if (event.target.closest('.fa-trash')) {
        const index = card.getAttribute('data-index');
        document.querySelector('#modal-excluir-movimentacao').setAttribute('data-index', index);
    }
});

listaMovimentacoes.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (event.target.closest('.fa-pencil')) {
        const index = card.getAttribute('data-index');
        document.querySelector('#modal-editar-banco').setAttribute('data-index', index);
    }

    if (event.target.closest('.fa-trash')) {
        const index = card.getAttribute('data-index');
        document.querySelector('#modal-excluir-banco').setAttribute('data-index', index);
    }
});

formAddBanco.addEventListener('submit', (event) => {
    event.preventDefault();

    if (formAddBanco.checkValidity()) {
        const nome = document.querySelector('#add-nome-banco').value;
        const saldo = parseFloat(document.querySelector('#add-saldo-banco').value) || 0;
        
        if (bancoService.nomeRepetido(nome)) {
            inputNomeBanco.classList.add('red');
            inputNomeBanco.nextElementSibling.textContent = 'O nome do banco já existe.';
            inputNomeBanco.nextElementSibling.classList.remove('hide');
        } else {
            bancoService.adicionarBanco(nome, saldo);
            carregarBancos(divBancos, bancoService.bancos);
            carregarBancosOptions(selectBancosEntrada, bancoService.bancos);
            carregarBancosOptions(selectBancosSaida, bancoService.bancos);
            formAddBanco.reset();
            modalAdicionarBanco.hide();
        }

    } else {
        inputNomeBanco.classList.add('red');
        inputNomeBanco.nextElementSibling.textContent = 'Insira o nome do banco.';
        inputNomeBanco.nextElementSibling.classList.remove('hide');
    }
});

formEditBanco.addEventListener('submit', (event) => {
    event.preventDefault();

    if (formEditBanco.checkValidity()) {
        const nome = document.querySelector('#edit-nome-banco').value;
        const index = Number(document.querySelector('#modal-editar-banco').getAttribute('data-index'));

        if (bancoService.nomeRepetido(nome)) {
            inputEditBanco.classList.add('red');
            inputEditBanco.nextElementSibling.textContent = 'O nome do banco já existe.';
            inputEditBanco.nextElementSibling.classList.remove('hide');
        } else {
            bancoService.editarBanco(nome, index);
            carregarBancos(divBancos, bancoService.bancos);
            carregarBancosOptions(selectBancosEntrada, bancoService.bancos);
            carregarBancosOptions(selectBancosSaida, bancoService.bancos);
            formEditBanco.reset();
            modalEditarBanco.hide();
        }
        
    } else {
        inputEditBanco.classList.add('red');
        inputEditBanco.nextElementSibling.textContent = 'Insira o nome do banco.';
        inputEditBanco.nextElementSibling.classList.remove('hide');
    }
});

formAddEntrada.addEventListener('submit', (event) => {
    event.preventDefault();

    if (formAddEntrada.checkValidity()) {
        const descricao = document.querySelector('#add-descricao-entrada').value || 'Nova movimentação';
        const valor = document.querySelector('#add-valor-entrada').value || 0;
        const data = document.querySelector('#add-data-entrada').value || '2026-10-10';
        const banco = document.querySelector('#add-banco-entrada').value;

        movimentacoesService.adicionarMovimentacao(descricao,'entrada',valor,data,banco);
        carregarMovimentacoes(listaMovimentacoes,movimentacoesService.movimentacoes);
        carregarBancos(divBancos, bancoService.bancos);
        formAddEntrada.reset();
        modalAdicionarEntrada.hide();
    }
});

formAddSaida.addEventListener('submit', (event) => {
    event.preventDefault();

    if (formAddSaida.checkValidity()) {
        const descricao = document.querySelector('#add-descricao-saida').value || 'Nova movimentação';
        const valor = document.querySelector('#add-valor-saida').value || 0;
        const data = document.querySelector('#add-data-saida').value || '2026-10-10';
        const banco = document.querySelector('#add-banco-saida').value;

        movimentacoesService.adicionarMovimentacao(descricao,'saida',valor,data,banco);
        carregarMovimentacoes(listaMovimentacoes,movimentacoesService.movimentacoes);
        carregarBancos(divBancos, bancoService.bancos);
        formAddSaida.reset();
        modalAdicionarSaida.hide();
    }
});

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

btnExcluirBanco.addEventListener('click', () => {
    const index = Number(document.querySelector('#modal-excluir-banco').getAttribute('data-index'));
    bancoService.removerBanco(index);
    carregarBancos(divBancos, bancoService.bancos);
    carregarBancosOptions(selectBancosEntrada, bancoService.bancos);
    carregarBancosOptions(selectBancosSaida, bancoService.bancos);
    modalExcluirBanco.hide();
});

btnExcluirMovimentacao.addEventListener('click', () => {
    const index = Number(document.querySelector('#modal-excluir-movimentacao').getAttribute('data-index'));
    movimentacoesService.excluirMovimentacao(index);
    carregarBancos(divBancos, bancoService.bancos);
    carregarMovimentacoes(listaMovimentacoes, movimentacoesService.movimentacoes);
    modalexcluirMovimentacao.hide();
});

/* FIM CÓDIGO GABRIEL */