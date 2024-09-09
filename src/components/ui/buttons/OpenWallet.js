"use client";

import { useWallet } from "@/components/auth/providers/WalletProvider.js";
import { useWalletUI } from "@/components/auth/providers/WalletUIProvider.js";
import WalletInfoModal from "@/components/ui/modals/WalletInfoModal.js";

export function OpenWallet() {
	const { setIsWalletInfoModalOpen } = useWalletUI();

	return (
		<button
			onClick={() => setIsWalletInfoModalOpen(true)}
			className="btn btn-primary w-36 text-lg"
		>
			Open Wallet
		</button>
	);
}

export function WalletKey() {
	const { publicKey } = useWallet();
	const { setIsWalletInfoModalOpen } = useWalletUI();

	return (
		<>
			<button
				className="btn btn-xs btn-primary text-xs"
				onClick={() => setIsWalletInfoModalOpen(true)}
			>
				{`${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`}
			</button>
			<WalletInfoModal />
		</>
	);
}
