import './style.css';
import './bootstrap.scss';

import Modal from 'bootstrap/js/dist/modal';
import Datepicker from 'vanillajs-datepicker/Datepicker';
import ptBR from 'vanillajs-datepicker/locales/pt-BR';
import 'vanillajs-datepicker/css/datepicker-bs5.css';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';

import { iniciar_cartao_controller } from './controllers/cartao.controller.js';
import * as cartaoService from './services/cartao.services.js';
import { carregar_cartoes } from './components/cartao.components.js';

library.add(faTrash, faPencil);
dom.watch();
Object.assign(Datepicker.locales, ptBR);

const opcoesDataVencimento = {
    language: 'pt-BR',
    format: 'dd/mm/yyyy',
    autohide: true,
};

const data_adicionar = document.querySelector('#adicionar-data-vencimento');
const data_editar = document.querySelector('#editar-data-vencimento');

if (data_adicionar) new Datepicker(data_adicionar, { ...opcoesDataVencimento });
if (data_editar) new Datepicker(data_editar, { ...opcoesDataVencimento });

const divCartoes = document.querySelector('#cartoes');
const modal_adicionar = new Modal(document.querySelector('#modal-adicionar-cartao'));
const modal_editar = new Modal(document.querySelector('#modal-editar-cartao'));
const modal_excluir = new Modal(document.querySelector('#modal-excluir-cartao'));

const valor_limite_total = document.querySelector('#limite-total-cartoes');
function atualizar_limite_total() {
    valor_limite_total.textContent = new Intl.NumberFormat('pt-BR', 
        { style: 'currency', currency: 'BRL',
         }).format(cartaoService.calcular_limite_total());
    }

carregar_cartoes(divCartoes, cartaoService.cartoes);
atualizar_limite_total();

iniciar_cartao_controller({
    atualizar_limite_total,
    divCartoes,
    form_adicionar_cartao: document.querySelector('#form-adicionar-cartao'),
    form_editar_cartao: document.querySelector('#form-editar-cartao'),
    modal_adicionar_cartao: modal_adicionar,
    modal_editar_cartao: modal_editar,
    modal_excluir_cartao: modal_excluir,
    btn_excluir_cartao: document.querySelector('#btn-excluir-cartao'),
});