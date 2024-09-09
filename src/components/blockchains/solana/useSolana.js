import {
	clusterApiUrl,
	Connection,
	PublicKey,
	TransactionMessage,
	VersionedTransaction,
	SystemProgram,
	LAMPORTS_PER_SOL
} from "@solana/web3.js";

export default function useSolana(api) {
	const rpc = api || clusterApiUrl("mainnet-beta");
	const connection = new Connection(rpc, "confirmed");

	const getBalance = async ({ publicKey }) => {
		const lamports = await connection.getBalance(new PublicKey(publicKey));
		const sol = lamports / LAMPORTS_PER_SOL;
		return { balance: sol };
	};

	const requestAirdrop = async ({ publicKey, amount }) => {
		const { blockhash, lastValidBlockHeight } =
			await connection.getLatestBlockhash("confirmed");
		const signature = await connection.requestAirdrop(
			new PublicKey(publicKey),
			amount * LAMPORTS_PER_SOL
		);
		const confirmation = await connection.confirmTransaction({
			signature,
			blockhash,
			lastValidBlockHeight
		});
		if (confirmation?.value?.err) {
			return { transaction: signature, confirmed: false };
		}
		return { transaction: signature, confirmed: true };
	};

	const getLatestBlockhash = async () => {
		const { blockhash, lastValidBlockHeight } =
			await connection.getLatestBlockhash("confirmed");
		return { blockhash, lastValidBlockHeight };
	};

	const signMessage = async ({ provider, message }) => {
		const encodedMessage = new TextEncoder().encode(message);
		return await provider.signMessage(encodedMessage);
	};

	const transferInstructions = ({ from, to, amount }) => {
		return SystemProgram.transfer({
			fromPubkey: new PublicKey(from),
			toPubkey: new PublicKey(to),
			lamports: amount * LAMPORTS_PER_SOL
		});
	};

	const createTransactionV0 = ({ publicKey, blockhash, instructions }) => {
		const messageV0 = new TransactionMessage({
			payerKey: new PublicKey(publicKey),
			recentBlockhash: blockhash,
			instructions
		}).compileToV0Message();
		return new VersionedTransaction(messageV0);
	};

	const signTransaction = async ({ provider, transactionData }) => {
		return await provider.signTransaction(transactionData);
	};

	const sendTransaction = async ({ signedTransaction }) => {
		return await connection.sendTransaction(signedTransaction);
	};

	const signAndSendTransaction = async ({ provider, transactionData }) => {
		return await provider.signAndSendTransaction(transactionData);
	};

	const confirmTransaction = async ({
		transactionSignature,
		blockhash,
		lastValidBlockHeight
	}) => {
		const confirmation = await connection.confirmTransaction({
			signature: transactionSignature,
			blockhash,
			lastValidBlockHeight
		});
		if (confirmation?.value?.err) {
			return { transaction: transactionSignature, confirmed: false };
		}
		return { transaction: transactionSignature, confirmed: true };
	};

	return {
		getBalance,
		requestAirdrop,
		getLatestBlockhash,
		signMessage,
		transferInstructions,
		createTransactionV0,
		signTransaction,
		sendTransaction,
		signAndSendTransaction,
		confirmTransaction
	};
}
