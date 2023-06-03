import { NextResponse } from "next/server";
import { Client } from "pg";
import { currentUser } from "@clerk/nextjs";
// import { useBoardStore } from "@/store/BoardStore";

const client = new Client({
	connectionString: process.env.POSTGRES_URL + "?sslmode=require",
	ssl: {
		rejectUnauthorized: false,
	},
});

client.connect((err) => {
	if (err) {
		console.error("connection error", err.stack);
	} else {
		console.log("connected");
	}
});

// client.query("LISTEN table_changes");

// const tableChanged = useBoardStore((state) => state.tableChanged);

// client.on("notification", (msg) => {
// 	console.log(msg.channel); // foo
// 	console.log(msg.payload); // bar!
// 	// tableChanged();
// });

export async function GET(request: Request) {
	const user = await currentUser();
	if (user && Number(JSON.stringify(user["createdAt"])) > 1685830147735) return NextResponse.json({ todos: {rows: []} });
	const todos = await client.query('SELECT * FROM todos ORDER BY id ASC');
	return NextResponse.json({ todos });
}

export async function POST(request: Request) {
	const body = await request.json();
	if (body["requestType"].includes("updatePosition")) {
		const todoID: string = body["id"];
		const todoTitle: string = body["title"];
		const todoOldColumn: string = body["oldStatus"];
		const todoNewColumn: string = body["status"];
		const todoOldPos: number = body["oldPosition"];
		const todoNewPos: number = body["position"];

		try {
			await client.query(`
				UPDATE todos SET pos = pos - 1 WHERE pos > '${todoOldPos}' AND status = '${todoOldColumn}';
			`);
		} catch (error) {
			return NextResponse.json({ error });
		}
		try {
			await client.query(`
				UPDATE todos SET pos = pos + 1 WHERE pos >= '${todoNewPos}' AND status = '${todoNewColumn}';
			`);
		} catch (error) {
			return NextResponse.json({ error });
		}
		try {
			await client.query(`
				UPDATE todos SET title = '${todoTitle}', status = '${todoNewColumn}', pos = '${todoNewPos}' WHERE id = '${todoID}';
			`);
		} catch (error) {
			return NextResponse.json({ error });
		}

		const todos = await client.query("SELECT * FROM todos ORDER BY id ASC");
		return NextResponse.json({ todos });
	} else if (body["requestType"].includes("update")) {		
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
		const todoOldColumn: string = body["oldStatus"];
		const todoOldPos: number = body["oldPosition"];

		try {
			client.query(`
				UPDATE todos SET pos = pos - 1 WHERE pos > '${todoOldPos}' AND status = '${todoOldColumn}';
			`);
		} catch (error) {
			return NextResponse.json({ error });
		}
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
		const todoSender: string = body["sender"];

		try {
			client.query(`INSERT INTO todos (title, status, name, sender) VALUES ('${todoTitle}', '${todoColumn}', '${todoName}', '${todoSender}');`);
		} catch (error) {
			return NextResponse.json({ error });
		}

		const todos = await client.query(`SELECT * FROM todos;`);
		return NextResponse.json({ todos });
	}
}
