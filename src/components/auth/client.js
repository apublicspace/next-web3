export default class AuthClient {
	constructor({ route }) {
		this.route = route;
	}

	async prepare({ publicKey }) {
		const response = await fetch(this.route, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				execute: "prepare",
				domain: window.location.host,
				publicKey: publicKey
			})
		});
		return response.json();
	}

	async token({ publicKey, statement, signature }) {
		const response = await fetch(this.route, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				execute: "token",
				domain: window.location.host,
				publicKey: publicKey,
				statement: statement,
				signature: signature
			})
		});
		return response.json();
	}

	async certificate() {
		const response = await fetch(this.route, {
			method: "GET"
		});
		return response.json();
	}

	async authenticate() {
		const response = await fetch(this.route, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				execute: "authenticate"
			})
		});
		return response.json();
	}

	async terminate() {
		const response = await fetch(this.route, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				execute: "terminate"
			})
		});
		return response.json();
	}
}
