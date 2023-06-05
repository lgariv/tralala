import Modal from "@/components/Modal";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
	title: "Tralala",
	description: "Generated by Lavie",
};

const commonTexts = {
	signIn: {
		start: {
			title: "מתחברים פה",
			subtitle: "כדי להמשיך ל-{{applicationName}}",
		},
	},
	socialButtonsBlockButton: "התחבר באמצעות חשבון {{provider|titleize}}",
	userButton: {
		action__manageAccount: "ניהול החשבון",
		action__signOut: "התנתק",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider localization={commonTexts}>
			<html lang="he">
				<head>
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/favicon.ico"
					/>
					<link rel="shortcut icon" href="/favicon.ico" />
					<link rel="manifest" href="/site.webmanifest" />
				</head>
				<body className="bg-[#F5F6F8]">
					{children}
					<Modal />
				</body>
			</html>
		</ClerkProvider>
	);
}
