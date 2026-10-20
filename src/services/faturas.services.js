import {compras} from './compra.services.js';

const CHAVE_PARCELAS = 'estado_parcelas';

function carregar_estado_parcelas() {
    return JSON.parse(localStorage.getItem(CHAVE_PARCELAS)) || {};
}

function salvar_estado_parcelas(estados) {
    localStorage.setItem(CHAVE_PARCELAS, JSON.stringify(estados));
}

// Gera as parcelas de uma compra, distribuindo-as por mês.
export function gerar_parcelas_compra(compra) {
    const quantidade = Number(compra.quantidade_de_parcelas);
    const valorTotal = Number(compra.valor);

    if (
        !Number.isInteger(quantidade) ||
        quantidade < 1 ||
        !Number.isFinite(valorTotal) ||
        valorTotal <= 0
    ) {
        throw new Error('Dados da compra inválidos.');
    }

    // Trabalha em centavos para evitar erros de arredondamento.
    const totalCentavos = Math.round(valorTotal * 100);
    const valorBase = Math.floor(totalCentavos / quantidade);
    const resto = totalCentavos % quantidade;

    // A data recebida do formulário está no formato AAAA-MM-DD.
    const [ano, mes] = compra.data.split('-').map(Number);

    if (!ano || !mes || mes < 1 || mes > 12) {
        throw new Error('Data da compra inválida.');
    }

    const estados = carregar_estado_parcelas();

    return Array.from({ length: quantidade}, (_, indice) => {
        const dataMes = new Date(
            ano,
            mes - 1 + indice,
            1
        );

        const anoParcela = dataMes.getFullYear();
        const mesParcela = String(
            dataMes.getMonth() + 1).padStart(2, '0');

        const centavos = valorBase + (indice === quantidade - 1 ? resto : 0);

        return {
            id: `${compra.id}-${indice + 1}`,
            compra_id: compra.id,
            descricao: compra.descricao,
            cartao: compra.cartao,
            numero: indice + 1,
            total_parcelas: quantidade,
            valor: centavos / 100,
            mes_referencia: `${anoParcela}-${mesParcela}`,

            paga: estados[`${compra.id}-${indice + 1}`] ?? false,
        };
    });
}

// Retorna as parcelas de todas as compras registradas.
export function listar_parcelas() {
    console.log('Compras carregadas:', compras);

    return compras.flatMap(compra =>
        gerar_parcelas_compra(compra)
    );
}

export function consultar_fatura_mes(mes) {
    if (!/^\d{4}-\d{2}$/.test(mes)) {
        throw new Error('Informe o mês no formato AAAA-MM.');
    }

    const parcelas = listar_parcelas();

    return parcelas.filter(parcela => 
        parcela.mes_referencia === mes
    );
}

export function alterar_estado_parcela(id) {
    const estados = carregar_estado_parcelas();
    estados[id] = (!estados[id] ?? false);
    salvar_estado_parcelas(estados);

    return estados[id];
}
