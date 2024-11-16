"use client";
import React, { useEffect, useState } from 'react';
import { Card } from '@repo/ui/card';
import { formatDistance } from 'date-fns';

interface User {
    id: number;
    name: string | null; // Make name nullable to match DB schema
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

// New TransactionCard component
interface TransactionCardProps {
  transfer: P2PTransfer;
  currentUserId: number;
  className?: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transfer, currentUserId, className }) => {
  const isReceived = transfer.toUserId === currentUserId;
  const displayUser = isReceived ? transfer.fromUser : transfer.toUser;
  
  return (
    <Card className={`p-6 mb-4 hover:shadow-lg transition-shadow ${className}`} title={''}>
      <div className="flex items-center space-x-4">
        {displayUser.avatar && (
          <img
            src={displayUser.avatar}
            alt={displayUser.name || 'User avatar'}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div className="flex-grow">
          <p className="text-xl font-semibold">
            {isReceived ? 'Received from' : 'Sent to'} {displayUser.name}
          </p>
          <p className="text-2xl font-bold mt-2">
            {isReceived ? '+' : '-'}{transfer.amount.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {formatDistance(new Date(transfer.timestamp), new Date(), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TransactionCard;

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
            <Card title="" className="p-4 max-w-md mx-auto">
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100" />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card title='' className="">
                <p className="text-purple-500 text-center">{error}</p>
            </Card>
        );
    }

    return (
        <Card title="" className="">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                
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
                                className={`p-4 rounded-lg border transition-all duration-200 
                                    ${isOutgoing 
                                        ? 'bg-gradient-to-r from-violet-50/40 to-fuchsia-50/40 hover:from-violet-50/60 hover:to-fuchsia-50/60 dark:from-violet-950/30 dark:to-fuchsia-950/30' 
                                        : 'bg-gradient-to-r from-sky-50/40 to-indigo-50/40 hover:from-sky-50/60 hover:to-indigo-50/60 dark:from-sky-950/30 dark:to-indigo-950/30'
                                    }
                                    shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] 
                                    hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)]
                                    transform hover:-translate-y-[2px]
                                    border-gray-100 dark:border-gray-800/60`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center 
                                                ${isOutgoing 
                                                    ? 'bg-gradient-to-br from-purple-400 to-pink-500 text-white' 
                                                    : 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white'
                                                }
                                                transform transition-transform duration-200 hover:scale-110`}
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
