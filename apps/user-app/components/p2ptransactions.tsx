"use client";
import React, { useEffect, useState } from 'react';
import { Card } from '@repo/ui/card';
import { formatDistance } from 'date-fns';

interface User {
    id: number;
    name: string;
    avatar?: string;
}

interface P2PTransfer {
    id: number;
    amount: number;
    timestamp: Date;
    fromUserId: number;
    fromUser: User;
    toUserId: number;
    toUser: User;
}

interface P2PTransactionsProps {
    transfers: P2PTransfer[];
    currentUserId: number;
}

const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount / 100);
};

export function P2PTransactions({ transfers, currentUserId }: P2PTransactionsProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [sortedTransfers, setSortedTransfers] = useState<P2PTransfer[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (transfers && transfers.length > 0) {
            const sorted = [...transfers].sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setSortedTransfers(sorted);
        }
        setIsLoading(false);
    }, [transfers]);

    if (isLoading) {
        return (
            <Card className="p-4 max-w-md mx-auto">
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100" />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-4 max-w-md mx-auto">
                <p className="text-purple-500 text-center">{error}</p>
            </Card>
        );
    }

    return (
        <Card className="p-4 max-w-md mx-auto bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Transaction History
            </h2>
            <div className="space-y-2">
                {sortedTransfers.length === 0 ? (
                    <div className="py-4">
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            No transactions yet
                        </p>
                    </div>
                ) : (
                    sortedTransfers.map((transfer) => {
                        const isOutgoing = transfer.fromUserId === currentUserId;
                        const otherUser = isOutgoing ? transfer.toUser : transfer.fromUser;

                        return (
                            <div
                                key={transfer.id}
                                className={`p-2 rounded-lg border transition-all duration-200
                                    hover:bg-purple-50 dark:hover:bg-purple-900
                                    border-gray-200 dark:border-gray-700`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-800"
                                        >
                                            <span className="text-xs">
                                                {isOutgoing ? '↑' : '↓'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {otherUser?.name || 'Unknown User'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDistance(
                                                    new Date(transfer.timestamp),
                                                    new Date(),
                                                    { addSuffix: true }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                            {isOutgoing ? '- ' : '+ '}
                                            {formatAmount(transfer.amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
}
