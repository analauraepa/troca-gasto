'use client';

import { useQuery } from "@tanstack/react-query";

import { getFatura } from "@/services/fatura.service";
import { loginTestUser } from "@/config/test-user";

export const faturaKey = ['faturas'];

export function useFatura() {
    return useQuery({
        queryKey: faturaKey,

        queryFn: async () => {
            await loginTestUser();
            const fatura = await getFatura();
            return fatura?.records ?? [];
        }
    });
}