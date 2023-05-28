import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const client = await db.connect();

	try {
		// await client.sql`CREATE TYPE name_type AS ENUM('todo', 'inprogress', 'done');`;
		await client.sql`
			CREATE TABLE todos (
				id uuid DEFAULT gen_random_uuid(),
				title VARCHAR NOT NULL,
				status name_type NOT NULL,
				name VARCHAR NOT NULL
			);
		`;
		const names = ["Take my dog out", "inprogress", "Lavie"];
		await client.sql`INSERT INTO todos (title, status, name) VALUES (${names[0]}, ${names[1]}, ${names[2]});`;
	} catch (error) {
		return NextResponse.json({ error });
	}

	const todos = await client.sql`SELECT * FROM todos;`;
	// await client.sql`DROP TABLE todos;`;
	return NextResponse.json({ todos });
}