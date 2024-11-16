import prisma from "@repo/db/client";
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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-8">
                        {/* Header Section */}
                        <header>
                            <h1 className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
                                {session.user.name}'s Wallet
                            </h1>
                        </header>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Column - Balance and Transactions */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <BalanceCard 
                                        amount={balance?.amount ?? 0} 
                                        locked={balance?.locked ?? 0} 
                                    />
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <OnRampTransactions 
                                        transactions={formattedTransactions} 
                                    />
                                </div>
                            </div>

                            {/* Right Column - Add Money */}
                            <div className="lg:col-span-5">
                                <div className="sticky top-8">
                                    <AddMoney />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    } catch (error) {
        console.error('Transfer page error:', error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md w-full mx-auto p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
                            Error Loading Transfer Page
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Unable to load transfer information. Please try again later.
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 
                                text-white rounded-lg transition-colors duration-200"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}