// Imports do CSS, Bootstrap, ícones e datepicker.
import './style.css';
import './bootstrap.scss';
import Modal from 'bootstrap/js/dist/modal';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import Datepicker from 'vanillajs-datepicker/Datepicker';
import ptBR from 'vanillajs-datepicker/locales/pt-BR';
import 'vanillajs-datepicker/css/datepicker-bs5.css';

// Imports para os serviços, componentes e controller da página.
import { iniciarContaFixaController } from './controllers/contaFixa.controller.js';
import { bancos } from './services/banco.services.js';
import { adicionarContaFixa, contasFixas } from './services/contaFixa.services.js';
import { carregarBancosOptions } from './components/banco.components.js';
import { carregarContasFixas } from './components/contaFixa.components.js';

// Aqui vai ativar os ícones do Font Awesome usados na lista.
library.add(faTrash, faPencil);
dom.watch();

// Elementos principais da página.
const lista = document.querySelector('#lista-contas-fixas'); //lista de contas fixas
const selectBanco = document.querySelector('#conta-fixa-banco'); //bancos existentes
const formulario = document.querySelector('#form-conta-fixa'); //Para criar uma nova conta fixa
const formularioEditar = document.querySelector('#form-editar-conta-fixa'); //para editar 
const vencimentoEditar = document.querySelector('#editar-conta-vencimento'); //Editar vencimento
const selectBancoEditar = document.querySelector('#editar-conta-banco'); //Editar banco

// Exibe as contas e preenche os seletores com os bancos cadastrados.
carregarContasFixas(lista, contasFixas);
carregarBancosOptions(selectBanco, bancos);
carregarBancosOptions(selectBancoEditar, bancos);

// Configura os campos de vencimento no formato DD/MM/AAAA.
Object.assign(Datepicker.locales, ptBR);
const opcoesDatepicker = {
    language: 'pt-BR',
    format: 'dd/mm/yyyy',
    autohide: true
};

new Datepicker(document.querySelector('#conta-fixa-vencimento'), opcoesDatepicker);
const datepickerEditar = new Datepicker(vencimentoEditar, opcoesDatepicker);

// Prepara o modal de cadastro.
const modalContaFixa = new Modal(document.querySelector('#modal-conta-fixa'));

//Prepara o modal de edição
const modalEditarContaFixa = new Modal(document.querySelector('#modal-editar-conta-fixa'));

//Prepara o modal de excluir.
const modalExcluirContaFixa = new Modal(document.querySelector('#modal-excluir-conta-fixa'));
const btnExcluirContaFixa = document.querySelector('#btn-excluir-conta-fixa');

// Cadastra a conta fixa e atualiza a lista de contas existentes.
formulario.addEventListener('submit', event => {
    event.preventDefault();

    if (!formulario.reportValidity()) return;

    adicionarContaFixa(
        document.querySelector('#conta-fixa-descricao').value.trim(),
        document.querySelector('#conta-fixa-valor').value,
        document.querySelector('#conta-fixa-vencimento').value,
        document.querySelector('#conta-fixa-categoria').value.trim(),
        document.querySelector('#conta-fixa-banco').value,
        document.querySelector('#conta-fixa-cartao').value
    );

    carregarContasFixas(lista, contasFixas);
    formulario.reset();
    modalContaFixa.hide();
});

// Inicia os eventos de edição das contas fixas.
iniciarContaFixaController({
    lista,
    formularioEditar,
    datepickerEditar,
    selectBancoEditar,
    modalEditarContaFixa,
    modalExcluirContaFixa,
    btnExcluirContaFixa
});