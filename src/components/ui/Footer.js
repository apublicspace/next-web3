"use client";

import { useState, useEffect } from "react";

export default function Footer() {
	const [matchWalletUIHasLoaded, setMatchWalletUIHasLoaded] = useState(false);
	const [url, setUrl] = useState("");
	const [displayUrl, setDisplayUrl] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setMatchWalletUIHasLoaded(true);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const currentUrl = window.location.href;
			setUrl(currentUrl);
			const { hostname, port } = new URL(currentUrl);
			const isLocalhost = hostname.includes("localhost");
			const name = isLocalhost
				? `${hostname}:${port}`
				: hostname.replace("www.", "");
			setDisplayUrl(name);
		}
	}, []);

	return (
		matchWalletUIHasLoaded &&
		displayUrl && (
			<div className="fixed bottom-0 flex items-center justify-center w-full p-5 text-sm">
				Server:&nbsp;
				<a
					href={`${url}/user/status`}
					target="_blank"
					rel="noopener noreferrer"
					className="underline"
				>
					{displayUrl}/user/status
				</a>
			</div>
		)
	);
}
