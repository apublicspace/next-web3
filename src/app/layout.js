import { headers } from "next/headers";
import { Inter } from "next/font/google";
import WalletProvider from "@/components/auth/providers/WalletProvider.js";
import WalletUIProvider from "@/components/auth/providers/WalletUIProvider.js";
import Navigation from "@/components/ui/Navigation.js";
import Footer from "@/components/ui/Footer.js";
import favicon from "@/assets/favicon.png";
import "@/styles/globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Next Web3",
	description: "Next.js web3 application with DaisyUI and TailwindCSS styling",
	icons: {
		icon: favicon.src
	}
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	minimumScale: 1
};

export default function RootLayout({ children }) {
	const currentPath = headers().get("x-current-path");

	const useFullWalletContextPaths = ["/"];
	const usePartialWalletContextPaths = [];

	const useFullWalletContext = useFullWalletContextPaths.includes(currentPath);
	const usePartialWalletContext =
		usePartialWalletContextPaths.includes(currentPath);

	const FullWalletContext = ({ content }) => {
		return (
			<WalletProvider>
				<WalletUIProvider>
					<Navigation />
					<main>{content}</main>
				</WalletUIProvider>
			</WalletProvider>
		);
	};

	const PartialWalletContext = ({ content }) => {
		return (
			<>
				<WalletProvider>
					<WalletUIProvider>
						<Navigation />
					</WalletUIProvider>
				</WalletProvider>
				<main>{content}</main>
			</>
		);
	};

	const NoWalletContext = ({ content }) => {
		return (
			<>
				<Navigation wallet={false} />
				<main>{content}</main>
			</>
		);
	};

	return (
		<html lang="en" className="bg-base-300">
			<body className={inter.className}>
				{useFullWalletContext ? (
					<FullWalletContext content={children} />
				) : usePartialWalletContext ? (
					<PartialWalletContext content={children} />
				) : (
					<NoWalletContext content={children} />
				)}
				<Footer />
			</body>
		</html>
	);
}
