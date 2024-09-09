export function uint8Array(signature) {
	if (signature && typeof signature === "object" && "data" in signature) {
		return new Uint8Array(signature.data);
	} else {
		const length = Object.keys(signature).length;
		const array = new Uint8Array(length);
		for (let i = 0; i < length; i++) {
			array[i] = signature[i];
		}
		return array;
	}
}
