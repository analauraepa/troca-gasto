'use client';

import { useQuery } from '@tanstack/react-query';

import { getExtrato } from '@/services/extrato.service';
import { loginTestUser } from '@/config/test-user';

export const extratoKey = ['movimentacoes'];

export function useExtrato() {
    return useQuery({
        queryKey: extratoKey,

        queryFn: async () => {
            await loginTestUser();
            const extrato = await getExtrato();
            return extrato?.records ?? [];
        },
    });
}