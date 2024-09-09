"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/components/auth/providers/WalletProvider.js";
import { useWalletUI } from "@/components/auth/providers/WalletUIProvider.js";
import Image from "next/image";
import web3 from "@/assets/icons/web3-icon.png";

export default function SelectWalletModal() {
	const { providerDetected, wallets, wallet, setWallet, publicKey, logout } =
		useWallet();
	const { isSelectWalletModalOpen, setIsSelectWalletModalOpen } = useWalletUI();
	const walletsMaxIndex = wallets.length !== 0 ? wallets.length - 1 : 0;
	const [learn, setLearn] = useState(false);

	const selectWallet = (selectedWallet) => {
		if (publicKey) {
			logout();
		}
		localStorage.setItem("wallet", selectedWallet.name);
		setWallet(selectedWallet);
		setIsSelectWalletModalOpen(false);
	};

	useEffect(() => {
		setLearn(false);
		const selectWalletModal = document.getElementById("wallets");
		if (isSelectWalletModalOpen) {
			selectWalletModal.showModal();
		} else {
			selectWalletModal.close();
		}
	}, [isSelectWalletModalOpen]);

	return (
		<dialog id="wallets" className="modal modal-bottom sm:modal-middle">
			<div className="modal-box p-4 outline outline-1 outline-base-100 bg-base-300">
				<form method="dialog">
					<button
						className="btn btn-sm btn-circle btn-ghost focus:outline-none focus:ring-0 absolute right-2 top-2"
						onClick={() => setIsSelectWalletModalOpen(false)}
					>
						✕
					</button>
				</form>
				{!learn ? (
					<div className="flex flex-col items-start">
						<h3 className="font-bold text-md">Select a wallet</h3>
						<div className="h-6" />
						<button
							className="btn btn-base-100 btn-lg px-3 transition-color duration-300 w-full text-base"
							onClick={() => setLearn(true)}
						>
							<div className="flex items-center justify-between w-full">
								<div className="flex items-center justify-center">
									<Image
										src={web3}
										alt="icon"
										width={40}
										height={40}
										className="rounded-lg"
									/>
									<div className="w-3" />
									What's a web3 wallet?
								</div>
								<div className="text-xs font-light">Learn</div>
							</div>
						</button>
						<div className="h-6" />
						<div className="w-full h-[1px] bg-base-100 px-0" />
						<div className="h-6" />
						{wallets.map((data, index) => (
							<button
								key={index}
								className={`btn btn-base-100 btn-lg transition-color duration-300 w-full mb-1 px-3 flex justify-between items-center ${walletsMaxIndex === 0 ? "rounded-t-lg rounded-b-lg" : index === 0 ? "rounded-t-lg rounded-l-none rounded-r-none rounded-b-none" : index === walletsMaxIndex ? "rounded-t-none rounded-b-lg" : "rounded-l-none rounded-r-none"}`}
								disabled={data.detected ? false : true}
								onClick={() => selectWallet(data)}
							>
								<div className="flex items-center text-base">
									<Image
										src={data.icon}
										alt="icon"
										width={40}
										height={40}
										className="rounded-lg"
									/>
									<div className="w-3" />
									{data.name}
								</div>
								<div className="text-xs font-light">
									{data.name === wallet?.name
										? "Currently Selected"
										: data.detected
											? "Detected"
											: "Not Installed"}
								</div>
							</button>
						))}
						<div className="h-2" />
					</div>
				) : (
					<div className="flex flex-col items-start">
						<h3 className="font-bold text-md">What's a web3 wallet?</h3>
						<div className="h-6" />
						<div className="flex flex-col items-center justify-center w-full">
							<p className="text-left text-sm">
								A Web3 wallet is a localized digital software that allows users
								to interact with decentralized applications, called dApps, and
								blockchain networks, such as Solana, directly from their web
								browser or mobile device.
							</p>
							<div className="h-6" />
							<p className="text-left text-sm">
								Web3 wallets operate like cash in your pocket, only the assets
								are digital. No third party can tamper with these assets. Unlike
								traditional digital assets, which are usually hosted by a third
								party, the digital assets in your wallet are controlled solely
								by you.
							</p>
							<div className="h-6" />
							<p className="text-left text-sm">
								A web3 wallet provides users with a secure way to store private
								keys, sign transactions, and connect to various decentralized
								platforms, making them essential for engaging with the
								decentralized web (web3). Popular examples include Phantom,
								Solflare, and Brave.
							</p>
						</div>
						<div className="h-7" />
						{!providerDetected ? (
							<button className="btn btn-base-100 btn-lg px-3 transition-color duration-300 w-full text-base">
								<a
									href="https://phantom.app"
									target="_blank"
									rel="noopener noreferrer"
									className="w-full text-left text-base flex items-center"
								>
									<div className="flex items-center justify-between w-full">
										<div className="flex items-center justify-center">
											<Image
												src={phantom}
												alt="icon"
												width={40}
												height={40}
												className="rounded-lg"
											/>
											<div className="w-3" />
											Download Phantom
										</div>
										<div className="text-xs font-light">Get Started</div>
									</div>
								</a>
							</button>
						) : (
							<button
								className="btn btn-base-100 btn-lg px-3 transition-color duration-300 w-full text-base"
								onClick={() => setLearn(false)}
							>
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center justify-center">
										Select a wallet
									</div>
									<div className="text-xs font-light">Get Started</div>
								</div>
							</button>
						)}
						<div className="h-2" />
					</div>
				)}
			</div>
			<form method="dialog" className="modal-backdrop">
				<button
					onClick={() => setIsSelectWalletModalOpen(false)}
					className="cursor-default"
				>
					close
				</button>
			</form>
		</dialog>
	);
}
