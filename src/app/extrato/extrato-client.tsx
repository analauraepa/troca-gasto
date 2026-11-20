'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from "react";

import ExtratoCard from "@/components/ExtratoCard";
import { useExtrato, extratoKey } from '@/hooks/useExtrato';

import { uploadExtrato, deleteExtrato } from "@/services/extrato.service";

export default function BancosClient() {
    const queryClient = useQueryClient();
    const {
        data: extratos = [],
        isLoading,
        error
    } = useExtrato();

    const [deleting, setDeleting] = useState(false);
    const [uploading, setUploading] = useState(false);

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
        setUploading(true);
        const novosExtratos = await uploadExtrato(file);

        queryClient.setQueryData(extratoKey,novosExtratos);

        } catch (err) {
        console.error(err);
        alert('Não foi possível enviar o extrato. Verifique o formato do arquivo e o banco de origem.');

        } finally {
        setUploading(false);
        event.target.value = '';
        }
    }

    async function handleDelete() {
        if (!window.confirm('Deseja remover este banco?')) return;

        try {
        setDeleting(true);
        await deleteExtrato();

        queryClient.setQueryData(extratoKey, []);

        } catch (err) {
        console.error(err);
        alert('Não foi possível excluir o banco.');

        } finally {
        setDeleting(false);
        }
    }

    const balanco = extratos.reduce((acc, extrato) => acc + extrato.valor,0);

    if (isLoading) {
        return <p>Carregando extrato...</p>;
    }
    
    if (error) {
        return <p>Não foi possível carregar o extrato.</p>;
    }

        
    return (
        <>
            <section className="flex flex-wrap items-end justify-between gap-6 rounded-3xl bg-gradient-to-br from-teal-900 to-teal-700 p-5 text-white shadow-sm">
                <h1 className="text-3xl font-extrabold">Meu extrato</h1>
                <div className="sm:text-right">
                    <p className="mt-6 text-sm text-white/75">Balanço do mês</p>
                    <p className="text-3xl font-extrabold">{balanco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                </div>
            </section>

            <div className="mb-3 mt-10 flex items-center gap-2">
                <h2 className="text-lg font-bold text-teal-950">Movimentações</h2>
                <label htmlFor="uploadExtrato" aria-label="Atualizar" className="cursor-pointer rounded-lg p-1 text-teal-800 hover:text-teal-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"/></svg>
                </label>
                <input type="file" id="uploadExtrato" accept=".csv" className="hidden" onChange={handleUpload} disabled={uploading}/>
                {extratos.length !== 0 && (
                    <button type="button" aria-label="Remover" onClick={handleDelete} disabled={deleting} className="cursor-pointer rounded-lg p-1 text-teal-800  hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-50">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/></svg>
                    </button>
                )}
            </div>
            
            {extratos.length === 0 ? (<p className="mt-4 text-gray-500">Ops! Não há nenhuma movimentação para exibir. Faça o upload de um extrato Nubank no formato .csv</p>) : (<>
                <ul className="space-y-2">
                    {extratos.map((extrato) => (
                        <ExtratoCard key={extrato.identificador} {...extrato}/>
                    ))}
                </ul>
            </>)}
        </>
    );
}