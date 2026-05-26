import "./globals.css";

export const metadata = {
  title: "SpendScan — Free AI Tool Spend Audit",
  description: "Find out if you're overpaying for AI tools. Get an instant audit of your Cursor, Claude, ChatGPT, and Copilot spend.",
  openGraph: {
    title: "SpendScan — Free AI Tool Spend Audit",
    description: "Find out if you're overpaying for AI tools. Instant, free.",
    url: "https://yourdomain.com",
    siteName: "SpendScan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendScan — Free AI Tool Spend Audit",
    description: "Are you overpaying for AI tools? Find out in 60 seconds.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}