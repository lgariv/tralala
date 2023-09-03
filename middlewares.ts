import { withAuth } from "next-auth/middleware";

export default withAuth({
	callbacks: {
		authorized({ token }) {
			// Allow access to the main '/' route if the user is authenticated
			return !!token;
		},
	},
});

export const config = { matcher: ["/"] };
