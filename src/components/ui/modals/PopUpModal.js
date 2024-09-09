"use client";

import { useState, useEffect } from "react";
import { IoCopySharp, IoCheckmarkSharp } from "react-icons/io5";
import Logo from "@/components/ui/graphics/Logo.js";

export default function Modal() {
	const [isModalOpen, setIsModalOpen] = useState("");
	const [copied, setCopied] = useState(false);
	const [copiedKeyNumber, setCopiedKeyNumber] = useState(1);

	const toggleModal = () => {
		const modal = document.getElementById("modal");
		if (!isModalOpen) {
			modal.showModal();
		}
		setIsModalOpen(!isModalOpen);
	};

	const copy = () => {
		navigator.clipboard.writeText(
			"git clone https://github.com/apublicspace/next-web3.git"
		);
		setCopied(true);
		setCopiedKeyNumber(copiedKeyNumber + 1);
	};

	useEffect(() => {
		let timeout;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			setCopied(false);
		}, 3000);
		return () => clearTimeout(timeout);
	}, [copiedKeyNumber]);

	useEffect(() => {
		const modal = document.getElementById("modal");
		if (!localStorage.getItem("wallet")) {
			modal.showModal();
		}
	}, []);

	return (
		<dialog id="modal" className="modal">
			<div className="modal-box p-8 outline outline-1 outline-base-100 bg-base-300">
				<form method="dialog">
					<button
						className="btn btn-sm btn-circle btn-ghost focus:outline-none focus:ring-0 absolute right-2 top-2"
						onClick={toggleModal}
					>
						✕
					</button>
				</form>
				<div className="flex flex-col items-center text-center">
					<h3 className="font-bold text-2xl">Next.js Web3 Demo</h3>
					<div className="h-[2px]" />
					<p className="text-[12px] text-center">Code by Sam Larsen</p>
					<div className="h-6" />
					<p className="text-sm">
						This is a live demo of the next-web3 repository for web3
						applications with DaisyUI and TailwindCSS styling
					</p>
					<div className="h-9" />
					<div className="w-full h-[1px] bg-base-100 px-0" />
					<div className="h-8" />
					<p className="font-bold">Clone the Project</p>
					<div className="h-2" />
					<div
						className="text-[11px] w-full rounded-lg text-left px-[11px] flex items-center outline outline-1 outline-base-100 cursor-pointer hover:bg-base-200 group duration-300 transition-colors"
						onClick={copy}
					>
						<code className="text-nowrap overflow-scroll flex items-center justify-center w-full mr-[22px] py-2">
							git clone https://github.com/apublicspace/next-web3.git
						</code>
						<div className="absolute right-8 h-[32.5px] text-neutral group-hover:text-neutral-content transition-colors px-[10px] flex items-center justify-center rounded-r-lg">
							{!copied ? <IoCopySharp /> : <IoCheckmarkSharp />}
						</div>
					</div>
					<div className="h-4" />
					<a
						href="https://github.com/apublicspace/next-web3"
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn-neutral btn-sm"
					>
						Visit the GitHub
					</a>
					<div className="h-8" />
					<div className="h-3" />
					<div className="w-[119px]">
						<Logo />
					</div>
					<div className="h-[5px]" />
					<p className="text-[8px] text-center cursor-default select-none">
						Powered by Public Space
					</p>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button onClick={toggleModal} className="cursor-default">
					close
				</button>
			</form>
		</dialog>
	);
}
