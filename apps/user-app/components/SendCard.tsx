"use client";
import { p2pTransfer } from "@/app/lib/actions/p2pTransfer";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { Input } from "@repo/ui/textinput";
import { set } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [transferStatus,setTransferStatus] = useState("Send Money");

    const resetForm = () => {
        setNumber("");
        setAmount("");
    };

    const handleTransfer = async () => {
        setTransferStatus("Sending...");
        if (!number || !amount) {
            toast.error("Please fill in all fields");
            setTransferStatus("Send Money");
            return;
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            setTransferStatus("Send Money");
            return;
        }

        try {
            setIsLoading(true);
            const response = await p2pTransfer(number, Number(amount) * 100);
            handleTransferSuccess(response);
        } catch (error) {
            handleTransferError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTransferSuccess = (response: any) => {
        if (response.success) {
            setTransferStatus("Transfer Successful");
            setTimeout(() => {setTransferStatus("Send Money")}, 2000);
            toast.success("Transfer completed successfully!");
            resetForm();
        } else if (response.error === "INSUFFICIENT_BALANCE") {
            setTransferStatus("Insufficient balance") 
            setTimeout(()  => {setTransferStatus("Send Money")}, 2000);

        } else {
            setTransferStatus("Transfer failed");
            setTimeout(() => {setTransferStatus("Send Money")}, 2000);                  
        }
    };

    const handleTransferError = (error: any) => {
        toast.error(error instanceof Error ? error.message : "Transfer failed. Please try again.");
    };



    if (isLoading) {
        return (
            <Card title="" className="p-4 max-w-md mx-auto">
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100" />
                </div>
            </Card>
        );
    }

    return (
        <div className="w-full">
            <Card title="Send Money">
                    
               
                <div className="space-y-6">
                    <div className="space-y-2 transition-all duration-200">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Input
                                placeholder="Enter phone number"
                                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                type="tel"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2 transition-all duration-200">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Amount
                        </label>
                        <div className="relative">
                            <Input
                                placeholder="Enter amount"
                                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                value={amount}
                                type="number"
                                min="0"
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    
                    <Center>
                        <Button 
                            className={`w-full px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium
                                transition-all duration-200 
                                dark:bg-purple-500 dark:hover:bg-purple-600`}
                            onClick={handleTransfer}
                            
                            disabled={isLoading}
                        >
                            {transferStatus}
                        </Button>
                    </Center>
                </div>
            </Card>
        </div>
    );
}