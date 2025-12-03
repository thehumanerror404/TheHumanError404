import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL('https://thehumanerror404.com'),
    title: {
        default: "The Human Error 404 | Is Your Job Safe?",
        template: "%s | The Human Error 404"
    },
    description: "Analyze your career's survival odds in the age of AI. A dystopian reality check for the modern workforce.",
    keywords: ["AI job replacement", "career analysis", "AI taking jobs", "The Human Error 404", "job obsolescence", "future of work", "AI impact"],
    authors: [{ name: "The Human Error 404" }],
    creator: "The Human Error 404",
    publisher: "The Human Error 404",
    openGraph: {
        title: "The Human Error 404 | Is Your Job Safe?",
        description: "Analyze your career's survival odds in the age of AI. A dystopian reality check for the modern workforce.",
        url: 'https://thehumanerror404.com',
        siteName: 'The Human Error 404',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: '/og-image.png', // We should ensure this exists or use a default
                width: 1200,
                height: 630,
                alt: 'The Human Error 404 - AI Job Analysis',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "The Human Error 404 | Is Your Job Safe?",
        description: "Analyze your career's survival odds in the age of AI. Will you survive?",
        images: ['/og-image.png'], // Same here
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
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
