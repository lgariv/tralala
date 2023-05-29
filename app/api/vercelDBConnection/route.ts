import { NextResponse } from "next/server";
import pg from "pg";

const { Client } = pg;

const client = new Client({
	connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

client.connect((err) => {
	if (err) {
		console.error("connection error", err.stack);
	} else {
		console.log("connected");
	}
});

export async function GET(request: Request) {
	const todos = await client.query('SELECT * FROM todos ORDER BY id ASC');
	return NextResponse.json({ todos });
}

export async function POST(request: Request) {
	const body = await request.json();
	if (body["requestType"].includes("update")) {
		const todoID: string = body["id"];
		const todoTitle: string = body["title"];
		const todoColumn: string = body["status"];

		try {
			await client.query(`
				UPDATE todos
				SET title = '${todoTitle}', status = '${todoColumn}'
				WHERE id = '${todoID}';
			`);
		} catch (error) {
			return NextResponse.json({ error });
		}

		const todos = await client.query("SELECT * FROM todos ORDER BY id ASC");
		return NextResponse.json({ todos });
	} else if (body["requestType"].includes("delete")) {
		const todoID: string = body["id"];

		try {
			client.query(`
				DELETE FROM todos
				WHERE id = '${todoID}';
			`);
		} catch (error) {
			return NextResponse.json({ error });
		}

		const todos = await client.query(`SELECT * FROM todos;`);
		return NextResponse.json({ todos });
	} else if (body["requestType"].includes("create")) {
		const todoTitle: string = body["title"];
		const todoColumn: string = body["status"];
		const todoName: string = body["name"];

		try {
			client.query(`INSERT INTO todos (title, status, name) VALUES ('${todoTitle}', '${todoColumn}', '${todoName}');`);
		} catch (error) {
			return NextResponse.json({ error });
		}

		const todos = await client.query(`SELECT * FROM todos;`);
		return NextResponse.json({ todos });
	}
}
