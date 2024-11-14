"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { Input } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnrampTransaction"

const SUPPORTED_BANKS = [
 { name: "HDFC Bank", redirectUrl: "https://netbanking.hdfcbank.com" },
 { name: "Axis Bank", redirectUrl: "https://www.axisbank.com/" }
];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [value, setValue] = useState(0);

    return (
        <Card title="Add Money">
            <div className="py-2 text-left">
                Amount
                </div>
                <Input
                    placeholder={"Amount"}
                    onChange={(e) => {
                        setValue(Number(e.target.value));
                    }}
                />
            
            <div className="py-2 text-left">Bank</div>
            <Select 
                onSelect={(value) => {
                    const selectedBank = SUPPORTED_BANKS.find(x => x.name === value);
                    setRedirectUrl(selectedBank?.redirectUrl || "");
                    setProvider(selectedBank?.name || "");
                }} 
                options={SUPPORTED_BANKS.map(x => ({
                    key: x.name,
                    value: x.name
                }))} 
            />
            <Center>
                <div className="py-4">
                <Button onClick={async () => {
                    await createOnRampTransaction(provider, value);
                    window.location.href = redirectUrl || "";
                }}>
                    Add Money
                </Button>
                </div>
            </Center>
        </Card>
    );
};