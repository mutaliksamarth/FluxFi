"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

interface TransferResponse {
    success: boolean;
    error?: string;
    message?: string;
}

export async function p2pTransfer(to: string, amount: number): Promise<TransferResponse> {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            success: false,
            error: "UNAUTHORIZED",
            message: "User not authenticated."
        };
    }

    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
        return {
            success: false,
            error: "USER_NOT_FOUND",
            message: "Recipient user not found."
        };
    }

    try {
        await prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

            const fromBalance = await tx.balance.findUnique({
                where: { userId: Number(from) },
            });

            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error('INSUFFICIENT_BALANCE');
            }

            await tx.balance.update({
                where: { userId: Number(from) },
                data: { amount: { decrement: amount } },
            });

            await tx.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } },
            });

            await tx.p2pTransfer.create({
                data: {
                    fromUserId: Number(from),
                    toUserId: toUser.id,
                    amount,
                    timestamp: new Date(),
                },
            });
        });

        return {
            success: true,
            message: "Transfer completed successfully."
        };
    } catch (error: any) {
        if (error.message === 'INSUFFICIENT_BALANCE') {
            return {
                success: false,
                error: "INSUFFICIENT_BALANCE",
                message: "Insufficient funds."
            };
        }
        return {
            success: false,
            error: "TRANSFER_FAILED",
            message: "Transfer failed due to an unexpected error."
        };
    }
}