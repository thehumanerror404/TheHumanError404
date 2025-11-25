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

    return <HomeClient aboutContent={aboutContent} />;
}
