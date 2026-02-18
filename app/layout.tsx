import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoiceApp — Sales Invoice Management",
  description:
    "A modern web application for managing sales invoices with CRUD operations, filtering, file uploads, and dashboard analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "12px",
                fontSize: "14px",
                padding: "12px 16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
