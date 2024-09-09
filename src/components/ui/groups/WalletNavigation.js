"use client";

import { useWallet } from "@/components/auth/providers/WalletProvider.js";
import { useWalletUI } from "@/components/auth/providers/WalletUIProvider.js";
import { WalletKey } from "@/components/ui/buttons/OpenWallet.js";
import DeselectWallet from "@/components/ui/buttons/DeselectWallet.js";

export default function WalletNavigation() {
	const { wallet, publicKey } = useWallet();
	const { hasLoaded } = useWalletUI();

	return (
		<>
			{hasLoaded && (publicKey ? <WalletKey /> : wallet && <DeselectWallet />)}
			{wallet && <div className="w-3" />}
		</>
	);
}
