import {
	clusterApiUrl,
	Connection,
	PublicKey,
	TransactionMessage,
	VersionedTransaction,
	SystemProgram,
	LAMPORTS_PER_SOL
} from "@solana/web3.js";

export function useSolana() {
	const NetworkConnection = ({ api }) => {
		return new Connection(api || clusterApiUrl("mainnet-beta"), "confirmed");
	};

	const FormatPublicKey = ({ publicKey }) => {
		return new PublicKey(publicKey);
	};

	const SystemProgramTransfer = ({ fromPublicKey, toPublicKey, solAmount }) => {
		return SystemProgram.transfer({
			fromPubkey: new PublicKey(fromPublicKey),
			toPubkey: new PublicKey(toPublicKey),
			lamports: solAmount * LAMPORTS_PER_SOL
		});
	};

	const TransactionMessageV0 = ({
		payerPublicKey,
		recentBlockhash,
		instructions
	}) => {
		return new TransactionMessage({
			payerKey: new PublicKey(payerPublicKey),
			recentBlockhash,
			instructions
		}).compileToV0Message();
	};

	const CreateVersionedTransaction = ({ message, deserialize = false }) => {
		if (deserialize === false) {
			return new VersionedTransaction(message);
		} else if (deserialize === true) {
			return VersionedTransaction.deserialize(Buffer.from(message, "base64"));
		}
	};

	return {
		NetworkConnection,
		FormatPublicKey,
		SystemProgramTransfer,
		TransactionMessageV0,
		CreateVersionedTransaction
	};
}

export function useConnection(connection) {
	const { FormatPublicKey } = useSolana();

	const getBalance = async ({ publicKey }) => {
		const lamports = await connection.getBalance(
			FormatPublicKey({ publicKey })
		);
		const sol = lamports / LAMPORTS_PER_SOL;
		return { balance: sol };
	};

	const requestAirdrop = async ({ publicKey, solAmount }) => {
		const { blockhash, lastValidBlockHeight } =
			await connection.getLatestBlockhash("confirmed");
		const signature = await connection.requestAirdrop(
			FormatPublicKey({ publicKey }),
			solAmount * LAMPORTS_PER_SOL
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
		confirmTransaction
	};
}

export function useProvider(provider) {
	const signMessage = async (message) => {
		const encodedMessage = new TextEncoder().encode(message);
		return await provider.signMessage(encodedMessage);
	};

	const signTransaction = async (txData) => {
		return await provider.signTransaction(txData);
	};

	const signAndSendTransaction = async (txData) => {
		return await provider.signAndSendTransaction(txData);
	};

	return {
		signMessage,
		signTransaction,
		signAndSendTransaction
	};
}
