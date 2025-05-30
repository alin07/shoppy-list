import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shoppy-list",
  description: "A grocery shopping list generated from recipe urls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
