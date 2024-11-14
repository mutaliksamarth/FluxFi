import prisma from "../../../../../packages/db/src";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransaction";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export default async function TransferPage() {
    try {
        const session = await getServerSession(authOptions);
        const userId = Number(session?.user?.id);

        if (!userId) {
            throw new Error("User not authenticated");
        }

        // Fetch balance and transactions in parallel
        const [balance, transactions] = await Promise.all([
            prisma.balance.findFirst({
                where: { userId },
                select: { amount: true, locked: true }
            }),
            prisma.onRampTransaction.findMany({
                where: { userId },
                select: {
                    startTime: true,
                    amount: true,
                    status: true,
                    provider: true
                },
                orderBy: { startTime: 'desc' }
            })
        ]);

        const formattedTransactions = transactions.map(({ startTime, amount, status, provider }) => ({
            time: startTime,
            amount,
            status,
            provider
        }));

        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                    Transfer
                </h1>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <section>
                        <AddMoney />
                    </section>
                    <section className="space-y-6">
                        <BalanceCard 
                            amount={balance?.amount ?? 0} 
                            locked={balance?.locked ?? 0} 
                        />
                        <OnRampTransactions 
                            transactions={formattedTransactions} 
                        />
                    </section>
                </div>
            </main>
        );
    } catch (error) {
        console.error('Transfer page error:', error);
        return (
            <div className="p-4 text-red-600">
                Unable to load transfer information. Please try again later.
            </div>
        );
    }
}