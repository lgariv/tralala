import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const client = await db.connect();

	const todos = await client.sql`SELECT * FROM todos ORDER BY id ASC;`;
	return NextResponse.json({ todos });
}

export async function POST(request: Request) {
	const client = await db.connect();
    const body = await request.json();
	const todoID: string = body["id"];
    const todoTitle: string = body["title"];
    const todoColumn: string = body["status"];

	try {
        await client.sql`
			UPDATE todos
			SET title = ${todoTitle}, status = ${todoColumn}
			WHERE id = ${todoID};
		`;
	} catch (error) {
		return NextResponse.json({ error });
	}

	const todos = await client.sql`SELECT * FROM todos;`;
	return NextResponse.json({ todos });
	// return new Response(JSON.stringify("success"), {
	// 	status: 200,
	// 	headers: {
	// 		"Access-Control-Allow-Origin": "*",
	// 		"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	// 		"Access-Control-Allow-Headers": "Content-Type, Authorization",
	// 	},
	// });
}