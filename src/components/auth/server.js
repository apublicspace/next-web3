import { cookies } from "next/headers";
import { uint8Array } from "@/components/utils/encodings.js";
import Auth from "@publicspace/crypto";
import Utils from "@publicspace/crypto";
import bs58 from "bs58";

export default class AuthServer {
	certificate() {
		let cookie = cookies().get("token") && cookies().get("token").value;
		const authorized = Auth.certificate({ token: cookie, type: "ed25519" });
		const responseMessage = JSON.parse(Utils.response({ data: authorized }));
		if (!responseMessage.ok) {
			cookies().delete("token");
			return JSON.stringify(responseMessage);
		}
		const publicKeyBytes = new uint8Array(
			Object.values(responseMessage.data.publicKey)
		);
		const publicKey = bs58.encode(publicKeyBytes);
		const signatureBytes = new uint8Array(
			Object.values(responseMessage.data.signature)
		);
		const signature = bs58.encode(signatureBytes);
		responseMessage.data.publicKey = publicKey;
		responseMessage.data.signature = signature;
		return JSON.stringify(responseMessage);
	}

	prepare(request) {
		const message = Auth.prepare({
			domain: request.domain,
			publicKey: request.publicKey
		});
		const responseMessage = Utils.response({ data: message });
		return responseMessage;
	}

	token(request) {
		const publicKey = bs58.decode(request.publicKey);
		const signature = uint8Array(request.signature);
		const tokenObject = Auth.token({
			domain: request.domain,
			publicKey,
			statement: request.statement,
			signature,
			expires: 3000000
		});
		cookies().set("token", tokenObject);
		const responseMessage = Utils.response({ data: tokenObject });
		return responseMessage;
	}

	authenticate() {
		let cookie = cookies().get("token") && cookies().get("token").value;
		const authorized = Auth.certificate({ token: cookie, type: "ed25519" });
		const responseMessage = JSON.parse(Utils.response({ data: authorized }));
		if (!responseMessage.ok) {
			cookies().delete("token");
			return JSON.stringify(responseMessage);
		}
		const publicKeyBytes = new uint8Array(
			Object.values(responseMessage.data.publicKey)
		);
		const publicKey = bs58.encode(publicKeyBytes);
		const signatureBytes = new uint8Array(
			Object.values(responseMessage.data.signature)
		);
		const signature = bs58.encode(signatureBytes);
		responseMessage.data.publicKey = publicKey;
		responseMessage.data.signature = signature;
		return JSON.stringify(responseMessage);
	}

	terminate() {
		cookies().delete("token");
		const responseMessage = JSON.stringify("success");
		return responseMessage;
	}
}
