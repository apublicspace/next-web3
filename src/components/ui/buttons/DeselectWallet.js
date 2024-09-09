"use client";

import { useWallet } from "@/components/auth/providers/WalletProvider.js";

export default function DeselectWallet() {
	const { wallet, setWallet, publicKey } = useWallet();

	const deselectWallet = () => {
		localStorage.removeItem("wallet");
		setWallet(null);
	};

	return (
		<>
			<button
				className={`btn btn-xs text-xs ${publicKey ? "btn-secondary" : "btn-neutral"}`}
				onClick={deselectWallet}
			>
				Quit {wallet.name}
			</button>
		</>
	);
}
