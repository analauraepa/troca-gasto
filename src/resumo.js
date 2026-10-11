import './style.css';
import './bootstrap.scss';

import * as resumoService from './services/resumo.service.js';
import { exibirSaldoTotal } from './components/resumo.components.js';

const containerSaldoTotal = document.querySelector('.saldo-total');
const entradaResumo = document.querySelector('.receitas');
const saidaResumo = document.querySelector('.saidas');
const totalResumo = document.querySelector('.total');

function atualizaSaldo(){
    if (containerSaldoTotal) {
        exibirSaldoTotal(containerSaldoTotal, resumoService.calcularTotalSaldo());
    }
    if (entradaResumo) {
        entradaResumo.textContent = `R$ ${resumoService.recResumo()}`;
    }
    if (saidaResumo) {
        saidaResumo.textContent = `R$ ${resumoService.saiResumo()}`;
    }
    if (totalResumo) {
        totalResumo.textContent = `R$ ${resumoService.recResumo() - resumoService.saiResumo()}`;
    }
}

atualizaSaldo()