import Logo from "@/components/ui/graphics/Logo.js";
import WalletNavigation from "@/components/ui/groups/WalletNavigation.js";
import ToggleTheme from "@/components/ui/buttons/ToggleTheme.js";

export default function Navigation({ wallet = true }) {
	return (
		<div className="fixed top-0 flex items-center justify-between w-full p-4 h-14 z-50">
			<div className="mr-5 w-[180px] sm:w-[200px]">
				<Logo />
			</div>
			<div className="flex">
				{wallet && <WalletNavigation />}
				<ToggleTheme />
			</div>
		</div>
	);
}
