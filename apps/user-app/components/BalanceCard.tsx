import { Card } from "@repo/ui/card";

const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount / 100);
};

export const BalanceCard = ({amount, locked}: {
    amount: number;
    locked: number;
}) => {
    return (
        <Card title="Balance Details" >
            <div className="space-y-4 bg-transparent">
                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 
                    hover:bg-purple-50/50 dark:hover:bg-purple-900/30 
                    hover:border-purple-200 dark:hover:border-purple-700
                    transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center 
                                border border-green-200 dark:border-green-800">
                                <span className="text-green-600 dark:text-green-400">₹</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Unlocked Balance
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {formatAmount(amount)}
                        </div>
                    </div>
                </div>

                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 
                    hover:bg-purple-50/50 dark:hover:bg-purple-900/30 
                    hover:border-purple-200 dark:hover:border-purple-700
                    transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center 
                                border border-yellow-200 dark:border-yellow-800">
                                <span className="text-yellow-600 dark:text-yellow-400">🔒</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Locked Balance
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                            {formatAmount(locked)}
                        </div>
                    </div>
                </div>

                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 
                    hover:bg-purple-50/50 dark:hover:bg-purple-900/30 
                    hover:border-purple-200 dark:hover:border-purple-700
                    transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center 
                                border border-purple-200 dark:border-purple-800">
                                <span className="text-purple-600 dark:text-purple-400">Σ</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Total Balance
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                            {formatAmount(amount + locked)}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};