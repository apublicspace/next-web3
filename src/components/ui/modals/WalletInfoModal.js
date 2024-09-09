"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/components/auth/providers/WalletProvider.js";
import { useWalletUI } from "@/components/auth/providers/WalletUIProvider.js";
import { FaCopy, FaCloud } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { IoCopySharp, IoCheckmarkSharp } from "react-icons/io5";
import TimeRemaining from "@/components/ui/actions/TimeRemaining.js";
import Image from "next/image";

export default function WalletInfoModal() {
	const { wallet, publicKey } = useWallet();
	const { isWalletInfoModalOpen, setIsWalletInfoModalOpen } = useWalletUI();

	const [copied, setCopied] = useState(false);
	const [copiedKeyNumber, setCopiedKeyNumber] = useState(1);
	const [copiedSignature, setCopiedSignature] = useState(false);
	const [copiedKeySignatureNumber, setCopiedSignatureKeyNumber] = useState(1);

	const [devnet, setDevnet] = useState(false);
	const [solBalance, setSolBalance] = useState((0).toFixed(4));
	const [usdBalance, setUsdBalance] = useState((0).toFixed(2));
	const [airdropTransaction, setAirdropTransaction] = useState("");

	const copy = () => {
		navigator.clipboard.writeText(publicKey);
		setCopied(true);
		setCopiedKeyNumber(copiedKeyNumber + 1);
	};

	const copySignature = () => {
		navigator.clipboard.writeText(airdropTransaction);
		setCopiedSignature(true);
		setCopiedSignatureKeyNumber(copiedKeyNumber + 1);
	};

	const requestAirdrop = async () => {
		if (devnet) {
			setAirdropTransaction("Transacting airdrop on devnet...");
			const response = await fetch("/api/methods/solana", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					network: "devnet",
					method: "requestAirdrop",
					publicKey,
					amount: 0.1
				})
			});
			const res = await response.json();
			if (!res.ok || !res.data?.confirmed) {
				setAirdropTransaction("Failed to transact airdrop on devnet");
			} else {
				setAirdropTransaction(res.data.transaction);
			}
		}
	};

	const getBalance = async () => {
		const network = !devnet ? "mainnet" : devnet && "devnet";
		const response = await fetch("/api/methods/solana", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ network, method: "getBalance", publicKey })
		});
		const res = await response.json();
		if (res.ok) {
			const sol = res.data.balance;
			setSolBalance(sol.toFixed(4));
			try {
				if (!devnet) {
					const response = await fetch("/api/prices/solana", {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					const res = await response.json();
					if (res.ok) {
						setUsdBalance(`$${(res.data.usd * sol).toFixed(2)}`);
					} else {
						setUsdBalance(`$${(0).toFixed(2)}`);
					}
				} else {
					setUsdBalance(`$${(0).toFixed(2)}`);
				}
			} catch (e) {
				setUsdBalance(`$${(0).toFixed(2)}`);
			}
		} else {
			setSolBalance((0).toFixed(4));
			setUsdBalance(`$${(0).toFixed(2)}`);
		}
	};

	useEffect(() => {
		if (devnet) {
			requestAirdrop();
		}
	}, [devnet]);

	useEffect(() => {
		getBalance();
	}, [airdropTransaction]);

	useEffect(() => {
		setSolBalance((0).toFixed(4));
		setUsdBalance(`$${(0).toFixed(2)}`);
		getBalance();
	}, [isWalletInfoModalOpen, devnet]);

	useEffect(() => {
		const walletInfoModal = document.getElementById("wallet");
		if (isWalletInfoModalOpen) {
			walletInfoModal.showModal();
		} else {
			walletInfoModal.close();
		}
	}, [isWalletInfoModalOpen]);

	useEffect(() => {
		let timeout;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			setCopied(false);
		}, 3000);
		return () => clearTimeout(timeout);
	}, [copiedKeyNumber]);

	useEffect(() => {
		let timeout;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			setCopiedSignature(false);
		}, 3000);
		return () => clearTimeout(timeout);
	}, [copiedKeySignatureNumber]);

	return (
		<dialog id="wallet" className="modal modal-bottom sm:modal-middle">
			<div className="modal-box p-4 outline outline-1 outline-base-100 bg-base-300">
				<form method="dialog">
					<button
						className="btn btn-sm btn-circle btn-ghost focus:outline-none focus:ring-0 absolute right-2 top-2"
						onClick={() => setIsWalletInfoModalOpen(false)}
					>
						✕
					</button>
				</form>
				<div className="flex flex-col items-start">
					<div className="flex items-center justify-center">
						<div className="avatar online">
							<div className="w-[30px] rounded-full">
								<Image
									src={wallet.icon}
									alt="icon"
									width={32}
									height={32}
									className="rounded-lg"
								/>
							</div>
						</div>
						<div className="w-3" />
						<h3 className="font-bold text-md">{`${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`}</h3>
					</div>
					<div className="h-6" />
					<div className="flex flex-col items-center justify-center w-full text-center">
						<h1 className="text-5xl font-bold overflow-hidden">
							{!devnet ? usdBalance : "-"}
						</h1>
						<div className="h-2" />
						<h3 className="text-2xl overflow-hidden">{solBalance} SOL</h3>
					</div>
					<div className="h-8" />
					<div className="flex w-full">
						<div className="w-full select-none" onClick={copy}>
							<div className="w-full flex flex-col justify-between h-32 rounded-lg outline outline-1 outline-secondary bg-secondary bg-opacity-10 hover:bg-opacity-20 transition-colors duration-500 cursor-pointer text-secondary">
								<div className="text-3xl p-3">
									{!copied ? <FaCopy /> : <FaCheckCircle />}
								</div>
								<div className="text-2xl font-semibold p-3">Copy</div>
							</div>
						</div>
						<div className="w-8" />
						<a
							href={
								!devnet
									? `https://explorer.solana.com/address/${publicKey}`
									: `https://explorer.solana.com/address/${publicKey}?cluster=devnet`
							}
							target={"_blank"}
							rel="noopener noreferrer"
							className="w-full select-none"
						>
							<div className="w-full flex flex-col justify-between h-32 rounded-lg outline outline-1 outline-secondary bg-secondary bg-opacity-10 hover:bg-opacity-20 transition-colors duration-500 cursor-pointer text-secondary">
								<div className="text-3xl p-3">
									<FaCloud />
								</div>
								<div className="text-2xl font-semibold p-3">View</div>
							</div>
						</a>
					</div>
					<div className="h-4" />
					<div className="w-full select-none" onClick={requestAirdrop}>
						<div
							className={`w-full flex flex-col justify-between h-32 rounded-lg outline outline-1 transition-colors duration-500 ${!devnet ? "outline-base-100 text-neutral bg-base-200" : "hover:bg-opacity-20 outline-secondary bg-secondary text-secondary cursor-pointer bg-opacity-10"}`}
						>
							<div className="text-3xl font-bold p-3">$</div>
							<div className="text-2xl font-semibold p-3">Request Airdrop</div>
						</div>
					</div>
					{devnet && <div className="h-4" />}
					{devnet && (
						<div
							className="text-[11px] w-full rounded-lg text-left px-[11px] h-[40px] flex items-center outline outline-1 outline-base-100 cursor-pointer hover:bg-base-200 group duration-300 transition-colors"
							onClick={copySignature}
						>
							<code className="text-nowrap overflow-scroll mr-[28px] py-2">
								{airdropTransaction}
							</code>
							<div className="absolute right-5 h-[32.5px] text-neutral group-hover:text-neutral-content transition-colors px-[10px] flex items-center justify-center rounded-r-lg">
								{!copiedSignature ? <IoCopySharp /> : <IoCheckmarkSharp />}
							</div>
						</div>
					)}
					<div className="h-8" />
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center justify-start w-full text-left text-xs">
							<TimeRemaining />
						</div>
						<div
							className="flex items-center justify-center cursor-pointer"
							onClick={() => setDevnet(!devnet)}
						>
							<p
								className={`text-xs select-none ${devnet ? "text-accent" : ""}`}
							>
								Devnet
							</p>
							<div className="w-3" />
							<input
								type="checkbox"
								className="toggle toggle-accent toggle-sm"
								checked={devnet}
								onChange={() => setDevnet(!devnet)}
							/>
						</div>
					</div>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button
					onClick={() => setIsWalletInfoModalOpen(false)}
					className="cursor-default"
				>
					close
				</button>
			</form>
		</dialog>
	);
}
