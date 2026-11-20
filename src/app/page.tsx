'use client'

import Link from "next/link";

import { useExtrato } from '@/hooks/useExtrato';
import { useFatura } from '@/hooks/useFatura';

import contasJson from "@/data/contas.data.json";
import type { Conta } from "@/types/conta.type";

const contas: Conta[] = contasJson;

export default function ResumoPage() {
    const { data: extratos = [], isLoading: loadingExtrato } = useExtrato();
    const { data: faturas = [], isLoading: loadingFatura } = useFatura();

    if (loadingExtrato || loadingFatura) {
        return <p>Carregando...</p>
    }

    const balanco = extratos.reduce((acc, extrato) => acc + extrato.valor, 0);

    const entradas = extratos.filter((extrato) => extrato.valor > 0).reduce((acc,extrato) => acc + extrato.valor, 0)

    const saidas = extratos.filter((extrato) => extrato.valor < 0).reduce((acc,extrato) => acc + extrato.valor, 0)

    const faturasMes = faturas.reduce((acc,fatura) => acc + fatura.valor, 0);

    return (
        <>
            <section className="flex flex-wrap items-end justify-between gap-6 rounded-3xl bg-teal-950 p-6 text-white sm:p-8">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Olá, Usuário!</h1>
                <div className="sm:text-right">
                    <p className="text-sm font-medium text-teal-200">Balanço do mês</p>
                    <p className="text-3xl font-extrabold text-lime-300 sm:text-5xl">{balanco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                </div>
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {/* Gráfico mockado */}
                <section className="hidden rounded-3xl bg-white p-6 ring-1 ring-slate-200 md:block lg:col-span-2">
                    <h2 className="mb-5 font-bold text-teal-950">Entradas, saídas e fatura</h2>
                    <div
                        className="relative h-72 border-b border-slate-300"
                        style={{ backgroundImage: "repeating-linear-gradient(to top,transparent 0,transparent calc(12.5% - 1px),#e2e8f0 calc(12.5% - 1px),#e2e8f0 12.5%)" }}
                    >
                        <div className="absolute inset-0 flex items-end">
                            <div className="flex h-full flex-1 items-end justify-center gap-1">
                                <div className="w-5 rounded-t bg-emerald-400 sm:w-7" style={{ height: "37%" }}/>
                                <div className="w-5 rounded-t bg-rose-400 sm:w-7" style={{ height: "75%" }}/>
                            </div>
                            <div className="flex h-full flex-1 items-end justify-center gap-1">
                                <div className="w-5 rounded-t bg-emerald-400 sm:w-7" style={{ height: "62%" }}/>
                                <div className="w-5 rounded-t bg-rose-400 sm:w-7" style={{ height: "37%" }}/>
                            </div>
                            <div className="flex h-full flex-1 items-end justify-center gap-1">
                                <div className="w-5 rounded-t bg-emerald-400 sm:w-7" style={{ height: "12%" }}/>
                                <div className="w-5 rounded-t bg-rose-400 sm:w-7" style={{ height: "25%" }}/>
                            </div>
                            <div className="flex h-full flex-1 items-end justify-center gap-1">
                                <div className="w-5 rounded-t bg-emerald-400 sm:w-7" style={{ height: "75%" }}/>
                                <div className="w-5 rounded-t bg-rose-400 sm:w-7" style={{ height: "25%" }}/>
                            </div>
                            <div className="flex h-full flex-1 items-end justify-center gap-1">
                                <div className="w-5 rounded-t bg-emerald-400 sm:w-7" style={{ height: "25%" }}/>
                                <div className="w-5 rounded-t bg-rose-400 sm:w-7" style={{ height: "37%" }}/>
                            </div>
                            <div className="flex h-full flex-1 items-end justify-center gap-1">
                                <div className="w-5 rounded-t bg-emerald-400 sm:w-7" style={{ height: "37%" }}/>
                                <div className="w-5 rounded-t bg-rose-400 sm:w-7" style={{ height: "75%" }}/>
                            </div>
                            <div className="flex h-full flex-1 items-end justify-center gap-1">
                                <div className="w-5 rounded-t bg-emerald-400 sm:w-7" style={{ height: "37%" }}/>
                                <div className="w-5 rounded-t bg-rose-400 sm:w-7" style={{ height: "75%" }}/>
                            </div>
                        </div>
                        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 200" preserveAspectRatio="none" aria-hidden="true">
                            <polyline points="50,125 150,50 250,110 350,0 450,100 550,45 650,100" fill="none" stroke="#134e4a" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
                        </svg>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-slate-600">
                        <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-400"/>Entradas</li>
                        <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-rose-400"/>Saídas</li>
                        <li className="flex items-center gap-2"><span className="h-1 w-4 rounded bg-teal-900"/>Fatura</li>
                    </ul>
                </section>

                <aside className="grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:gap-4">
                    <Link href="/extrato" className="col-span-2 rounded-3xl bg-white p-5 ring-1 ring-slate-200 transition hover:ring-teal-700 sm:p-6 lg:col-span-1">
                        <h2 className="font-bold text-teal-950">Balanço do mês</h2>
                        <p className="mt-4 flex justify-between text-sm text-slate-600">
                            <span>Entradas</span>
                            <span className="font-bold text-emerald-600">{entradas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                        </p>
                        <p className="mt-2 flex justify-between text-sm text-slate-600">
                            <span>Saídas</span>
                            <span className="font-bold text-rose-600">{saidas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                        </p>
                    </Link>

                    <Link href="/fatura" className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 transition hover:ring-teal-700 sm:p-6">
                        <h2 className="font-bold text-teal-950">Fatura do mês</h2>
                        <p className="mt-3 text-2xl font-extrabold text-teal-900 sm:text-3xl">{faturasMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    </Link>

                    <Link href="/contas" className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 transition hover:ring-teal-700 sm:p-6">
                        <h2 className="font-bold text-teal-950">Contas a pagar</h2>
                        <p className="mt-3 text-2xl font-extrabold text-teal-900 sm:text-3xl">{contas.filter((conta) => conta.pago === false).reduce((acc,conta) => acc + conta.valor,0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    </Link>
                </aside>
            </div>
        </>
    );
}