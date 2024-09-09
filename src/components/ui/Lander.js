"use client";

import { useWallet } from "@/components/auth/providers/WalletProvider.js";
import { useWalletUI } from "@/components/auth/providers/WalletUIProvider.js";
import { OpenWallet } from "@/components/ui/buttons/OpenWallet.js";
import Login from "@/components/ui/buttons/Login.js";
import PopUp from "@/components/ui/modals/PopUpModal.js";
import Loading from "@/components/ui/graphics/Loading.js";
import SelectWallet from "@/components/ui/buttons/SelectWallet.js";

export default function Lander() {
	const { wallet, publicKey } = useWallet();
	const { hasLoaded } = useWalletUI();

	return (
		<>
			<PopUp />
			{hasLoaded ? (
				<div className="fixed inset-0 text-center flex flex-col items-center justify-center w-full px-8">
					<h1 className="sm:text-2xl text-lg font-bold">
						Welcome to Next.js Web3
					</h1>
					<div className="h-5" />
					{!wallet && <SelectWallet />}
					<div className="flex">
						{wallet && publicKey && <OpenWallet />}
						<div className="w-2" />
						{wallet && <Login />}
					</div>
					<div className="h-5" />
					<p className="sm:text-base text-xs">
						This is a live demo of the next-web3 repository
					</p>
				</div>
			) : (
				<Loading />
			)}
		</>
	);
}
