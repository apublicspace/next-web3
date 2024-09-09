import AuthServer from "@/components/auth/server.js";

const server = new AuthServer();

export async function GET() {
	try {
		const response = server.certificate();
		return new Response(response, {
			headers: { "Content-Type": "application/json" }
		});
	} catch (e) {
		console.error(e);
		return new Response(e, {
			status: e.status,
			headers: { "Content-Type": "application/json" }
		});
	}
}

export async function POST(req) {
	try {
		const request = await req.json();

		if (request.execute === "prepare") {
			const response = server.prepare(request);
			return new Response(response, {
				headers: { "Content-Type": "application/json" }
			});
		}

		if (request.execute === "token") {
			const response = server.token(request);
			return new Response(response, {
				headers: { "Content-Type": "application/json" }
			});
		}

		if (request.execute === "authenticate") {
			const response = server.authenticate();
			return new Response(response, {
				headers: { "Content-Type": "application/json" }
			});
		}

		if (request.execute === "terminate") {
			const response = server.terminate();
			return new Response(response, {
				headers: { "Content-Type": "application/json" }
			});
		}
	} catch (e) {
		console.error(e);
		return new Response(e, {
			status: e.status,
			headers: { "Content-Type": "application/json" }
		});
	}
}
