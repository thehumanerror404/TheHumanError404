import fs from 'fs';
import path from 'path';
import HomeClient from '@/components/HomeClient';

export default function Home() {
    // Read the ABOUT markdown file
    const aboutPath = path.join(process.cwd(), 'src', 'data', 'ABOUT.md');
    let aboutContent = '';

    try {
        aboutContent = fs.readFileSync(aboutPath, 'utf8');
    } catch (error) {
        console.error('Error reading ABOUT file:', error);
        aboutContent = '# Error\nCould not load content.';
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "The Human Error 404",
                        "applicationCategory": "EntertainmentApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "description": "Analyze your career's survival odds in the age of AI. A dystopian reality check for the modern workforce.",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "ratingCount": "1024"
                        }
                    })
                }}
            />
            <HomeClient aboutContent={aboutContent} />
        </>
    );
}
