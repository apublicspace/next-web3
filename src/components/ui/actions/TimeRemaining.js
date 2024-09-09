"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/components/auth/providers/WalletProvider.js";

export default function TimeRemaining() {
	const { expires, logout } = useWallet();

	const [timeRemaining, setTimeRemaining] = useState(
		Math.round((expires - Date.now()) / 1000)
	);

	useEffect(() => {
		if (timeRemaining === 0 || timeRemaining < 0) {
			logout();
			return;
		} else if (timeRemaining > 0) {
			const intervalId = setInterval(() => {
				setTimeRemaining((currentTime) => Math.max(0, currentTime - 1));
			}, 1000);
			return () => clearInterval(intervalId);
		}
	}, [timeRemaining]);

	const minutes = Math.floor(timeRemaining / 60);
	const seconds =
		timeRemaining % 60 < 10 ? "0" + (timeRemaining % 60) : timeRemaining % 60;

	return (
		<>
			Auto logout in {minutes}:{seconds}
		</>
	);
}
