"use client";

import { useWallet } from "@/components/auth/providers/WalletProvider.js";
import {
	useSolana,
	useProvider
} from "@/components/blockchains/solana/core.js";
import { ActionConfig, useAction } from "@dialectlabs/blinks-core";
import { Blink } from "@dialectlabs/blinks";
import "@dialectlabs/blinks/index.css";

export default function BlinkComponent({ url }) {
	const { wallet, publicKey } = useWallet();
	const { NetworkConnection, CreateVersionedTransaction } = useSolana();
	const { signTransaction } = useProvider(wallet?.provider);

	const connection = NetworkConnection({
		api: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_API
	});

	const adapter = new ActionConfig(connection, {
		connect: async () => {
			try {
				return publicKey;
			} catch (e) {
				console.error("Connect error:", e);
			}
		},
		signTransaction: async (message) => {
			try {
				const transactionMessage = CreateVersionedTransaction({
					message,
					deserialize: true
				});
				const signedTransaction = await signTransaction(transactionMessage);
				const transactionSignature =
					await connection.sendTransaction(signedTransaction);
				return { signature: transactionSignature };
			} catch (e) {
				console.error("Transaction error:", e);
			}
		}
	});

	const { action } = useAction({ url, adapter });

	return (
		action && <Blink action={action} websiteText={new URL(url).hostname} />
	);
}
