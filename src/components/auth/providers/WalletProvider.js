"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { walletList } from "@/components/auth/walletList.js";
import AuthClient from "@/components/auth/client.js";

const client = new AuthClient({ route: "/user/status" });

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export default function WalletProvider({ children }) {
	const [providerDetected, setProviderDetected] = useState(false);
	const [wallets, setWallets] = useState([]);
	const [wallet, setWallet] = useState(null);
	const [publicKey, setPublicKey] = useState(null);
	const [expires, setExpires] = useState(null);

	const connect = async () => {
		const provider = wallet.provider;
		if (provider) {
			await provider.connect();
			if (provider.isConnected) {
				return true;
			}
			return false;
		}
	};

	const login = async () => {
		const runtime = wallet.runtime;
		const provider = wallet.provider;
		if (runtime === "svm" && (await connect())) {
			const message = await client.prepare({
				publicKey: provider.publicKey.toString()
			});
			const encoded = new TextEncoder().encode(message.data);
			const signed = await provider.signMessage(encoded);
			await client.token({
				publicKey: provider.publicKey.toString(),
				statement: message.data,
				signature: signed.signature
			});
			const certificate = await client.certificate();
			if (certificate.ok) {
				setPublicKey(certificate.data.publicKey);
				if (certificate.data.expires !== "never") {
					setExpires(certificate.data.expires);
				}
			}
		}
	};

	const logout = async () => {
		await client.terminate();
		setPublicKey(null);
		setExpires(null);
	};

	useEffect(() => {
		if (!providerDetected) {
			async function getWallets() {
				const walletListArray = [];
				const indexWallets = (active) =>
					walletList.forEach(({ name, icon, provider, runtime }) => {
						const walletProvider = provider
							.split(".")
							.reduce((acc, prop) => acc?.[prop], window);
						if (walletProvider && active) {
							walletListArray.push({
								name,
								icon,
								provider: walletProvider,
								runtime,
								detected: true
							});
							if (name === localStorage.getItem("wallet")) {
								setWallet({
									name,
									icon,
									provider: walletProvider,
									runtime
								});
							}
						}
						if (!walletProvider && !active) {
							walletListArray.push({
								name,
								icon,
								provider: null,
								runtime,
								detected: false
							});
						}
					});
				indexWallets(true);
				if (walletListArray.length > 0) {
					setProviderDetected(true);
				}
				indexWallets(false);
				setWallets(walletListArray);
			}
			getWallets();
		} else {
			async function authenticate() {
				const auth = await client.authenticate();
				if (auth?.ok === true) {
					const runtime = wallet.runtime;
					const cert = await client.certificate();
					if (runtime === "svm") {
						setPublicKey(cert.data.publicKey);
					}
					if (cert.data.expires !== "never") {
						setExpires(cert.data.expires);
					}
				}
			}
			authenticate();
		}
	}, [providerDetected]);

	return (
		<WalletContext.Provider
			value={{
				providerDetected,
				wallets,
				wallet,
				setWallet,
				publicKey,
				expires,
				connect,
				login,
				logout
			}}
		>
			{children}
		</WalletContext.Provider>
	);
}
