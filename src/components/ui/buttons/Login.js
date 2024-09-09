"use client";

import { useWallet } from "@/components/auth/providers/WalletProvider.js";

export default function Login() {
	const { providerDetected, wallet, publicKey, login, logout } = useWallet();

	return (
		<>
			{!publicKey && wallet && (
				<button onClick={login} className="btn btn-secondary w-40 text-lg">
					Login
				</button>
			)}
			{publicKey && providerDetected && (
				<button onClick={logout} className="btn btn-secondary w-36 text-lg">
					Logout
				</button>
			)}
		</>
	);
}
