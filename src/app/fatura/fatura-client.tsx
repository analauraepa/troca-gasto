'use client';

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import FaturaCard from "@/components/FaturaCard";
import { useFatura, faturaKey } from "@/hooks/useFatura";

import { uploadFatura, deleteFatura } from "@/services/fatura.service";

export default function FaturaClient() {
    const queryClient = useQueryClient()
    const { 
        data: faturas = [],
        isLoading,
        error
    } = useFatura();

    const [deleting, setDeleting] = useState(false);
    const [uploading, setUploading] = useState(false);

    async function handleUpload(event:React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            setUploading(true);
            const novasFaturas = await uploadFatura(file);

            queryClient.setQueryData(faturaKey,novasFaturas);

        }  catch (err) {
            console.error(err);
            alert('Não foi possível enviar a fatura. Verifique o formato do arquivo e o banco de origem.');

        } finally {
            setUploading(false);
            event.target.value = '';
        }
    }

    async function handleDelete() {
        if (!window.confirm('Deseja remover este cartão?')) return;

        try {
            setDeleting(true);
            await deleteFatura();

            queryClient.setQueryData(faturaKey,[]);

        } catch (err) {
            console.error(err);
            alert('Não foi possível excluir o banco.')

        } finally {
            setDeleting(false);
        }
    }

    const faturasMes = faturas.reduce((acc, fatura) => acc + fatura.valor, 0);

    if (isLoading) {
        return <p>Carregando fatura...</p>;
    }

    if (error) {
        return <p>Não foi possível carregar a fatura.</p>
    }

    return (
        <>
            <section className="flex flex-wrap items-end justify-between gap-6 rounded-3xl bg-gradient-to-br from-teal-900 to-teal-700 p-5 text-white shadow-sm">
                <h1 className="text-3xl font-extrabold">Minha fatura</h1>
                <div className="sm:text-right">
                    <p className="mt-6 text-sm text-white/75">Acumulado do mês</p>
                    <p className="text-3xl font-extrabold">{faturasMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                </div>
            </section>

            <div className="mb-3 mt-10 flex items-center gap-2">
                <h2 className="text-lg font-bold text-teal-950">Movimentações</h2>
                <label htmlFor="uploadExtrato" aria-label="Atualizar" className="cursor-pointer rounded-lg p-1 text-teal-800 hover:text-teal-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"/></svg>
                </label>
                <input type="file" id="uploadExtrato" accept=".csv" className="hidden" onChange={handleUpload} disabled={uploading}/>
                {faturas.length !== 0 && (
                    <button type="button" aria-label="Remover" onClick={handleDelete} disabled={deleting} className="cursor-pointer rounded-lg p-1 text-teal-800  hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-50">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/></svg>
                    </button>
                )}
            </div>
            
            {faturas.length === 0 ? (<p className="mt-4 text-gray-500">Ops! Não há nenhuma movimentação para exibir. Faça o upload de uma fatura Nubank no formato .csv</p>) : (<>
                <ul className="space-y-2">
                    {faturas.map((fatura, id) => (
                        <FaturaCard key={id} {...fatura}/>
                    ))}
                </ul>
            </>)}
        </>
    );
}

