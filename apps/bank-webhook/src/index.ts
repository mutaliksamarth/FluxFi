import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json())
//@ts-ignore
app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    try {
       

        const transaction = await db.onRampTransaction.findFirst({
            where: {
            token: paymentInformation.token,
            status: "Processing"
            }
        });

        if (!transaction) {
            return res.status(400).json({
            message: "Transaction not found or not in processing state"
            });
        }
        
        if (transaction?.status !== "Processing") {
            return res.status(400).json({
                message: "Transaction is not in processing state"
            });
        }
        
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token,
                    status: "Processing" // Ensure the status is still "Processing"
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003);