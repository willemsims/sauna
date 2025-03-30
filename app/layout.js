import { Inter } from "next/font/google";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";
import GoogleAnalytics from '@/components/GoogleAnalytics';
import SchemaMarkup from '@/components/SchemaMarkup';

const font = Inter({ subsets: ["latin"] });

export const viewport = {
	// Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
	themeColor: config.colors.main,
	width: "device-width",
	initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();

export default function RootLayout({ children }) {
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": config.appName,
		"url": config.siteUrl,
		"logo": `${config.siteUrl}/logo.png`,
		"sameAs": [
			config.social?.twitter,
			config.social?.facebook,
			config.social?.instagram
		].filter(Boolean)
	};

	return (
		<html
			lang="en"
			data-theme="saunatourist"
			className={font.className}
		>
			<head />
			<body>
				{/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
				<ClientLayout>
					{/* Add Google Analytics */}
					<GoogleAnalytics GA_MEASUREMENT_ID={config.analytics.googleAnalyticsId} />
					<SchemaMarkup schema={organizationSchema} />
					{children}
				</ClientLayout>
			</body>
		</html>
	);
}
