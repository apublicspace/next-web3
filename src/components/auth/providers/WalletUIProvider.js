"use client";

import { createContext, useContext, useState, useEffect } from "react";

const WalletUIContext = createContext();

export const useWalletUI = () => useContext(WalletUIContext);

export default function WalletUIProvider({ children }) {
	const [hasLoaded, setHasLoaded] = useState(false);
	const [isSelectWalletModalOpen, setIsSelectWalletModalOpen] = useState(false);
	const [isWalletInfoModalOpen, setIsWalletInfoModalOpen] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setHasLoaded(true);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<WalletUIContext.Provider
			value={{
				hasLoaded,
				isSelectWalletModalOpen,
				setIsSelectWalletModalOpen,
				isWalletInfoModalOpen,
				setIsWalletInfoModalOpen
			}}
		>
			{children}
		</WalletUIContext.Provider>
	);
}
