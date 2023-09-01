import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient, ObjectId } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGODB_URI!);

export const options: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: {
					label: "Username:",
					type: "text",
					placeholder: "Username",
				},
				password: {
					label: "Password:",
					type: "password",
					placeholder: "Password",
				},
			},
			async authorize(credentials): Promise<User | null> {
				try {
					await mongoClient.connect();
					const usersCollection = mongoClient
						.db("usersDB")
						.collection("users");
					const user = await usersCollection.findOne({
						username: credentials?.username,
						password: credentials?.password, // You should hash the password for security
					});

					if (user) {
						// Map the data to your User type
						const mappedUser: User = {
							id: user._id.toString(), // Convert ObjectId to string
							username: user.username,
							nickname: user.nickname,
							role: user.role,
							// Map other properties as needed
						};
						return Promise.resolve(mappedUser); // Resolve with the user object
					} else {
						return Promise.resolve(null); // Resolve with null if user is not found
					}
				} catch (error) {
					console.error("Sign-in error:", error);
					return Promise.resolve(null); // Resolve with null in case of an error
				} finally {
					await mongoClient.close();
				}
			},
		}),
	],
	session: {
		// The maxAge defines the duration for which the session (token) is valid in seconds.
		// Set maxAge to 1 week (7 days * 24 hours * 60 minutes * 60 seconds)
		maxAge: 7 * 24 * 60 * 60, // 604800 seconds
	},
	callbacks: {
		async session({ session, user, token }) {
			let userFromDB: User | null | undefined = undefined; // Initialize as undefined

			try {
				await mongoClient.connect();
				const usersCollection = mongoClient
					.db("usersDB")
					.collection("users");
				userFromDB = await usersCollection.findOne<User | null | undefined>({
					_id: new ObjectId(token.sub),
				});
			} catch (error) {
				console.error("Session error:", error);
				return Promise.resolve(session); // Resolve with null in case of an error
			} finally {
				await mongoClient.close();
			}

			if (userFromDB !== null) {
				session.user = JSON.parse(JSON.stringify(userFromDB));
			}

			return Promise.resolve(session);
		},
	},
};
