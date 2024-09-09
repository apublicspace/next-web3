"use client";

import { useState } from "react";
import { useWallet } from "@/components/auth/providers/WalletProvider.js";
import useSolana from "@/components/blockchains/solana/useSolana.js";

export default function Donate() {
	const { wallet, publicKey } = useWallet();
	const { transferInstructions, createTransactionV0, signAndSendTransaction } =
		useSolana();
	const amount = 0.1;
	const defaultButton = `Donate ${amount} SOL`;
	const [button, setButton] = useState(defaultButton);
	const [disableButton, setDisableButton] = useState(false);
	const [completedTransaction, setCompletedTransaction] = useState(null);

	const handleButton = (format) => {
		if (format === "blockhash") {
			setButton("Getting latest blockhash...");
			setDisableButton(true);
		} else if (format === "transacting") {
			setButton("Transacting...");
		} else if (format === "success") {
			setButton("Success");
			setTimeout(() => {
				setButton(defaultButton);
				setDisableButton(false);
			}, 3000);
		} else if (format === "error") {
			setButton("Error occured");
			setTimeout(() => {
				setButton(defaultButton);
				setDisableButton(false);
			}, 3000);
		}
	};

	async function runFrontendTransaction() {
		const instructions = transferInstructions({
			from: publicKey,
			to: process.env.NEXT_PUBLIC_TEST_KEY,
			amount
		});
		handleButton("blockhash");
		const getLatestBlockhashResponse = await fetch("/api/methods/solana", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ network: "devnet", method: "getLatestBlockhash" })
		});
		const getLatestBlockhash = await getLatestBlockhashResponse.json();
		if (getLatestBlockhash.ok) {
			const blockhash = getLatestBlockhash.data.blockhash;
			const lastValidBlockHeight = getLatestBlockhash.data.lastValidBlockHeight;
			const transactionV0 = createTransactionV0({
				publicKey,
				blockhash,
				instructions: [instructions]
			});
			const transaction = await signAndSendTransaction({
				provider: wallet.provider,
				transactionData: transactionV0
			});
			handleButton("transacting");
			const transactionSignature = transaction.signature;
			const confirmTransactionResponse = await fetch("/api/methods/solana", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					network: "devnet",
					method: "confirmTransaction",
					transactionSignature,
					blockhash,
					lastValidBlockHeight
				})
			});
			const confirmTransaction = await confirmTransactionResponse.json();
			if (confirmTransaction.ok && confirmTransaction.data.confirmed) {
				const transactionSignature = confirmTransaction.data.transaction;
				setCompletedTransaction(transactionSignature);
				console.log({ transaction: transactionSignature });
				handleButton("success");
			} else {
				console.error("Error: confirmTransaction failed");
				handleButton("error");
			}
		} else {
			console.error("Error: getLatestBlockhash failed");
			handleButton("error");
		}
	}

	return (
		<>
			<button
				className={`btn btn-xs btn-primary text-xs ${disableButton ? "btn-disabled" : ""}`}
				onClick={runFrontendTransaction}
			>
				{button}
			</button>
		</>
	);
}
