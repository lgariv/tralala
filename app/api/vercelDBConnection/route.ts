import { NextResponse } from "next/server";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

type Dict = {
	title: string,
	status?: string,
	pos?: number,
	name?: string,
	sender?: string,
}
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI!, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});
const database = client.db("tralala");
const collection = database.collection("todos");
const triggerCollection = database.collection("updated");

const connectToDB = async function connectToDB() {
	try {
		// ConnectToDB the client to the server	(optional starting in v4.7)
		await client.connect();
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
connectToDB().catch(console.dir);

export async function GET(request: Request) {
	try {
		const filter = {};
		const coll = client.db("tralala").collection("todos");
		const cursor = coll.find(filter);
		const todos = await cursor.toArray();
		return NextResponse.json({ todos: { rows: todos } });
	} catch (e) {
		return NextResponse.json({ todos: { rows: [] } });
	}
}

export async function POST(request: Request) {
	const body = await request.json();
	if (body["requestType"].includes("updatePosition")) {
		const todoID: string = body["_id"];
		const todoTitle: string = body["title"];
		const todoOldColumn: string | null | undefined = body["oldStatus"];
		const todoNewColumn: string | null | undefined = body["status"];
		const todoOldPos: number | null | undefined = body["oldPosition"];
		const todoNewPos: number | null | undefined = body["position"];
		const todoNewPerformer: string | null | undefined = body["taskPerformer"];
		const todoNewSubmitter: string | null | undefined = body["taskSubmitter"];
		
		if (todoOldPos!=null && todoOldColumn!=null && todoNewPos!=null && todoNewColumn!=null) {
			try {
				// Update the "pos" values using the $inc and $gt operators
				await collection.updateMany(
					{ pos: { $gt: todoOldPos }, status: todoOldColumn },
					{ $inc: { pos: -1 } }
				);
			} catch (error) {
				return NextResponse.json({ error });
			}
			try {
				// Update the "pos" values using the $inc and $gte operators
				await collection.updateMany(
					{ pos: { $gte: todoNewPos }, status: todoNewColumn },
					{ $inc: { pos: 1 } }
				);
			} catch (error) {
				return NextResponse.json({ error });
			}
		}
		try {
			const dict: Dict = {
				title: todoTitle,
			};
			if (todoNewColumn!=null) dict["status"] = todoNewColumn;
			if (todoNewPos!=null) dict["pos"] = todoNewPos;
			if (todoNewPerformer!=null) dict["name"] = todoNewPerformer;
			if (todoNewSubmitter != null) dict["sender"] = todoNewSubmitter;

			// Update the document matching the given todoID
			await collection.updateOne(
				{ _id: new ObjectId(todoID) },
				{
					$set: dict,
				}
			);

			const newTriggerDocument = {
				time: Date()
			};
			await triggerCollection.insertOne(newTriggerDocument);

			const filter = {};
			const coll = client.db("tralala").collection("todos");
			const cursor = coll.find(filter);
			const todos = await cursor.toArray();
			return NextResponse.json({ todos: { rows: todos } });
		} catch (error) {
			return NextResponse.json({ error });
		}
	} else if (body["requestType"].includes("update")) {		
		const todoID: string = body["_id"];
		const todoTitle: string = body["title"];
		const todoColumn: string = body["status"];

		try {
			await collection.updateOne(
				{ _id: new ObjectId(todoID) },
				{
					$set: {
						title: todoTitle,
						status: todoColumn,
					},
				}
			);

			const newTriggerDocument = {
				time: Date(),
			};
			await triggerCollection.insertOne(newTriggerDocument);

			const filter = {};
			const coll = client.db("tralala").collection("todos");
			const cursor = coll.find(filter);
			const todos = await cursor.toArray();
			return NextResponse.json({ todos: { rows: todos } });
		} catch (error) {
			return NextResponse.json({ error });
		}
	} else if (body["requestType"].includes("delete")) {
		const todoID: string = body["_id"];
		const todoOldColumn: string = body["oldStatus"];
		const todoOldPos: number = body["oldPosition"];

		try {
			await collection.updateMany(
				{ pos: { $gt: todoOldPos }, status: todoOldColumn },
				{ $inc: { pos: -1 } }
			);
		} catch (error) {
			return NextResponse.json({ error });
		}
		try {
			await collection.deleteOne({ _id: new ObjectId(todoID) });

			const newTriggerDocument = {
				time: Date(),
			};
			await triggerCollection.insertOne(newTriggerDocument);

			const filter = {};
			const coll = client.db("tralala").collection("todos");
			const cursor = coll.find(filter);
			const todos = await cursor.toArray();
			return NextResponse.json({ todos: { rows: todos } });
		} catch (error) {
			return NextResponse.json({ error });
		}
	} else if (body["requestType"].includes("create")) {
		const todoTitle: string = body["title"];
		const todoColumn: string = body["status"];
		const todoName: string = body["name"];
		const todoSender: string = body["sender"];

		try {
			// Retrieve the highest "pos" value for the specified "status" field
			const highestPos = await collection
				.aggregate([
					{ $match: { status: todoColumn } },
					{ $group: { _id: null, maxPos: { $max: "$pos" } } },
				])
				.toArray();

			let newPos: number;
			if (highestPos.length > 0) {
				// Increment the highest "pos" value by 1
				newPos = highestPos[0].maxPos + 1;
			} else {
				// If no documents with the specified "status" exist, set the initial value to 0
				newPos = 0;
			}

			// Create the new document with the incremented "pos" value and specified "status"
			const newDocument = {
				title: todoTitle,
				name: todoName,
				sender: todoSender,
				status: todoColumn,
				pos: newPos,
			};
			await collection.insertOne(newDocument);

			const newTriggerDocument = {
				time: Date(),
			};
			await triggerCollection.insertOne(newTriggerDocument);

			const filter = {};
			const coll = client.db("tralala").collection("todos");
			const cursor = coll.find(filter);
			const todos = await cursor.toArray();
			return NextResponse.json({ todos: { rows: todos } });
		} catch (error) {
			return NextResponse.json({ error });
		}
	}
}
