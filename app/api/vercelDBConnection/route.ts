import { NextResponse } from "next/server";
import { Client } from "pg";
// import { currentUser } from "@clerk/nextjs";
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
	// const user = await currentUser();
	// if (user && Number(JSON.stringify(user["createdAt"])) > 1685921561999) return NextResponse.json({ todos: {rows: []} });
	const todos = await client.query('SELECT * FROM todos ORDER BY id ASC');
	return NextResponse.json({ todos });
}

export async function POST(request: Request) {
	const body = await request.json();
	if (body["requestType"].includes("updatePosition")) {
		const todoID: string = body["id"];
		const todoTitle: string = body["title"];
		const todoOldColumn: string | null | undefined = body["oldStatus"];
		const todoNewColumn: string | null | undefined = body["status"];
		const todoOldPos: number | null | undefined = body["oldPosition"];
		const todoNewPos: number | null | undefined = body["position"];
		const todoNewPerformer: string | null | undefined = body["taskPerformer"];
		const todoNewSubmitter: string | null | undefined = body["taskSubmitter"];

		if (todoOldPos!=null && todoOldColumn!=null && todoNewPos!=null && todoNewColumn!=null) {
			try {
				console.log("old happened");
				await client.query(`
					UPDATE todos SET pos = pos - 1 WHERE pos > '${todoOldPos}' AND status = '${todoOldColumn}';
				`);
			} catch (error) {
				return NextResponse.json({ error });
			}
			try {
				console.log("new happened");
				await client.query(`
					UPDATE todos SET pos = pos + 1 WHERE pos >= '${todoNewPos}' AND status = '${todoNewColumn}';
				`);
			} catch (error) {
				return NextResponse.json({ error });
			}
		}
		try {
			var query = `UPDATE todos SET title = '${todoTitle}'`;
			if (todoNewColumn!=null) query += `, status = '${todoNewColumn}'`;
			if (todoNewPos!=null) query += `, pos = '${todoNewPos}'`;
			if (todoNewPerformer!=null) query += `, name = '${todoNewPerformer}'`;
			if (todoNewSubmitter!=null) query += `, sender = '${todoNewSubmitter}'`;
			query += ` WHERE id = '${todoID}';`
			console.log(query);
			await client.query(query);
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
