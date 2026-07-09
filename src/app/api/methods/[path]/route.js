import {
	useSolana,
	useConnection
} from "@/components/blockchains/solana/core.js";
import Utils from "@0xver/crypto";

const mainnet = process.env.SOLANA_MAINNET_RPC_API;
const devnet = process.env.SOLANA_DEVNET_RPC_API;

export async function POST(req, { params }) {
	try {
		const request = await req.json();

		if (params.path === "solana") {
			const network = request.network;
			const api =
				network === "mainnet" ? mainnet : network === "devnet" && devnet;
			const { NetworkConnection } = useSolana();
			const connection = NetworkConnection({ api });
			const {
				getBalance,
				requestAirdrop,
				getLatestBlockhash,
				confirmTransaction
			} = useConnection(connection);

			if (request.method === "getBalance") {
				const data = await getBalance({ publicKey: request.publicKey });
				return new Response(Utils.response({ data }), {
					headers: { "Content-Type": "application/json" }
				});
			}

			if (request.method === "requestAirdrop") {
				const data = await requestAirdrop({
					publicKey: request.publicKey,
					solAmount: request.amount
				});
				return new Response(Utils.response({ data }), {
					headers: { "Content-Type": "application/json" }
				});
			}

			if (request.method === "getLatestBlockhash") {
				const data = await getLatestBlockhash();
				return new Response(Utils.response({ data }), {
					headers: { "Content-Type": "application/json" }
				});
			}

			if (request.method === "confirmTransaction") {
				const data = await confirmTransaction({
					transactionSignature: request.transactionSignature,
					blockhash: request.blockhash,
					lastValidBlockHeight: request.lastValidBlockHeight
				});
				return new Response(Utils.response({ data }), {
					headers: { "Content-Type": "application/json" }
				});
			}
		}
	} catch (e) {
		console.error(e);
		return new Response(e, {
			status: e.status,
			headers: { "Content-Type": "application/json" }
		});
	}
}
