import './style.css';
import './bootstrap.scss';
import 'bootstrap/js/dist/dropdown';

import { iniciarResumoController } from './controllers/resumo.controller.js';

iniciarResumoController({
    saldoTotal: document.querySelector('#card-saldo-total'),
    receitas: document.querySelector('.receitas'),
    despesas: document.querySelector('.saidas'),
    resultado: document.querySelector('.total')
});