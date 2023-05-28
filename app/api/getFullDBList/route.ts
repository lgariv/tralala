// import { db } from "@vercel/postgres";

// const client = await db.connect();

// export { client };

import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const client = await db.connect();

	const todos = await client.sql`SELECT * FROM todos ORDER BY id ASC;`;
	return NextResponse.json({ todos });
}