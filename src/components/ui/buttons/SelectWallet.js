"use client";

import { useWalletUI } from "@/components/auth/providers/WalletUIProvider.js";
import SelectWalletModal from "@/components/ui/modals/SelectWalletModal.js";

export default function SelectWallet() {
	const { setIsSelectWalletModalOpen } = useWalletUI();

	return (
		<>
			<button
				className="btn btn-primary w-40 text-lg"
				onClick={() => setIsSelectWalletModalOpen(true)}
			>
				Select Wallet
			</button>
			<SelectWalletModal />
		</>
	);
}
