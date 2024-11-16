import { P2PTransactions } from "../../../components/p2ptransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

export default async function DashboardPage() {
    // Get user session and ID
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    // Fetch P2P transfers for the current user
    const transfers = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        },
        include: {
            fromUser: true,
            toUser: true
        },
        orderBy: {
            timestamp: 'desc'
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Transaction History
                </h1>
                <div className="space-y-4">
                    <P2PTransactions 
                        transfers={transfers} 
                        currentUserId={userId} 
                    />
                </div>
            </div>
        </div>
    );
}