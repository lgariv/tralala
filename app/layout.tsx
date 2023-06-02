import Modal from "@/components/Modal";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
	title: "Tralala",
	description: "Generated by Lavie",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<head>
					<link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
					<link rel="shortcut icon" href="/favicon.ico" />
				</head>
				<body className="bg-[#F5F6F8]">
					{children}
					<Modal />
				</body>
			</html>
		</ClerkProvider>
	);
}
