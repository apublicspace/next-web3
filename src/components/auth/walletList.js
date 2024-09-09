import phantom from "@/assets/icons/phantom-icon.png";
import solflare from "@/assets/icons/solflare-icon.png";
import brave from "@/assets/icons/brave-icon.png";

export const walletList = [
	{
		name: "Phantom",
		icon: phantom.src,
		provider: "phantom.solana",
		runtime: "svm"
	},
	{
		name: "Solflare",
		icon: solflare.src,
		provider: "solflare",
		runtime: "svm"
	},
	{
		name: "Brave",
		icon: brave.src,
		provider: "braveSolana",
		runtime: "svm"
	}
];
