import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Airline Operations Simulator",
    description: "Manage and operate a complex airline network.",
};

import { Sidebar } from "@/components/Sidebar";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
                <Providers>
                    <div className="flex h-screen overflow-hidden">
                        <Sidebar />
                        <div className="flex-col flex-1 overflow-hidden">
                            <header className="h-14 border-b flex items-center px-4 shrink-0 md:hidden">
                                <h1 className="font-bold text-lg text-primary">AeroOps</h1>
                            </header>
                            <div className="flex-1 overflow-auto">
                                {children}
                            </div>
                        </div>
                    </div>
                    <Toaster position="top-right" richColors />
                </Providers>
            </body>
        </html>
    );
}
