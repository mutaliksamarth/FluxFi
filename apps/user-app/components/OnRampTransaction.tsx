import { Card } from "@repo/ui/card";
import { formatDistance } from 'date-fns';

interface Transaction {
    time: Date;
    amount: number;
    status: string;
    provider: string;
}

const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount / 100);
};

export const OnRampTransactions = ({
    transactions
}: {
    transactions: Transaction[]
}) => {
    if (!transactions.length) {
        return (
            <Card title="Recent Transactions">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    
                </h2>
                <div className="py-8">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        No recent transactions
                    </p>
                </div>
            </Card>
        );
    }

    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    return (
        <Card title="Recent Transactions">
           
            <div className="space-y-2">
                {sortedTransactions.map((t, index) => (
                    <div
                        key={`${t.time.getTime()}-${index}`}
                        className="p-2 rounded-lg border transition-all duration-200
                            hover:bg-purple-50 dark:hover:bg-purple-900
                            border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center 
                                    bg-green-100 dark:bg-green-800">
                                    <span className="text-xs text-green-600 dark:text-green-400">↓</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Via {t.provider}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDistance(new Date(t.time), new Date(), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                    + {formatAmount(t.amount)}
                                </p>
                                <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                                    
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};