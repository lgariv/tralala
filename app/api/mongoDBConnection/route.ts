import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Create a MongoClient
const client = new MongoClient(process.env.MONGODB_URI!);

export async function POST(request: Request) {
	const body = await request.json();

	// User sign-in
	try {
		const usersCollection = client.db("usersDB").collection("users");
		const user = await usersCollection.findOne({
			username: body.username,
			password: body.password, // You should hash the password for security
        });
        
		if (user) {
			return NextResponse.json({ message: "Sign-in successful", user });
		} else {
			return NextResponse.json({ error: "Invalid credentials" });
		}
	} catch (error) {
		return NextResponse.json({ error: "Sign-in failed" });
	}
}
