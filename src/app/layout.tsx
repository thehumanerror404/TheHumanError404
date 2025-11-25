import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "The Human Error 404",
    description: "Your job is obsolete.",
};

import { Roboto } from "next/font/google";

const roboto = Roboto({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={roboto.className}>{children}</body>
        </html>
    );
}
