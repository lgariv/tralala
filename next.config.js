/** @type {import('next').NextConfig} */
const nextConfig = {
	// output: "standalone",
	experimental: {
		serverActions: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "",
			},
		],
	},
};

module.exports = nextConfig;
