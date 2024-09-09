import { NextResponse } from "next/server";

export function middleware(request) {
	const { pathname } = request.nextUrl;
	const response = NextResponse.next();
	response.headers.set("x-current-path", pathname);
	return response;
}

export const config = {
	matcher: ["/((?!api|_next|.*\\..*).*)"]
};
