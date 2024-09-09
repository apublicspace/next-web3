import Utils from "@publicspace/crypto";

export async function GET(req, { params }) {
	try {
		const response = await fetch(
			`${process.env.COINGECKO_API}/price?ids=${params.path}&vs_currencies=usd`
		);
		const res = await response.json();
		const data = res[params.path];
		if (!data) {
			return new Response(Utils.response({ data: "Error: bad path" }), {
				headers: { "Content-Type": "application/json" }
			});
		}
		return new Response(Utils.response({ data }), {
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
