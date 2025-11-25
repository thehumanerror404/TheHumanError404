'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { resolveRoleAlias, findBestMatch } from '@/lib/utils';
import { getGeminiMatch } from '../actions';
import safeRoles from '@/data/safe_roles.json';
import roastsData from '@/data/roasts.json';

export default function AnalysisPage() {
    const [text, setText] = useState('Calculating how hard you’re about to cry…');
    const [showCursor, setShowCursor] = useState(true);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const analyzeJob = async () => {
            const storedJob = localStorage.getItem('jobTitle');
            if (!storedJob) {
                router.push('/');
                return;
            }

            // Start progress bar
            const progressInterval = setInterval(() => {
                setProgress(p => Math.min(p + 1, 90));
            }, 50);

            try {
                // Determine role and safety (logic duplicated/shared with ResultPage)
                const resolvedJob = resolveRoleAlias(storedJob);
                let bestMatchKey = 'Default';

                try {
                    const geminiMatch = await getGeminiMatch(resolvedJob);
                    if (geminiMatch && geminiMatch !== 'Default') {
                        bestMatchKey = geminiMatch;
                    } else {
                        const jobKeys = Object.keys(roastsData);
                        bestMatchKey = findBestMatch(resolvedJob, jobKeys);
                    }
                } catch (error) {
                    console.error("Gemini match failed", error);
                    const jobKeys = Object.keys(roastsData);
                    bestMatchKey = findBestMatch(resolvedJob, jobKeys);
                }

                const isSafe = safeRoles.includes(bestMatchKey);

                // Store result for ResultPage to ensure consistency
                localStorage.setItem('analysisResult', JSON.stringify({
                    matchedRole: bestMatchKey,
                    isSafe: isSafe
                }));

                // Wait for a minimum time to show the first message
                setTimeout(() => {
                    clearInterval(progressInterval);
                    setProgress(100);

                    // Show final message
                    if (isSafe) {
                        setText('lol jk you’re a king');
                    } else {
                        setText('…and the answer is VERY.');
                    }

                    // Redirect after showing the final message
                    setTimeout(() => {
                        router.push('/result');
                    }, 2500);
                }, 3000);

            } catch (error) {
                console.error("Analysis failed", error);
                router.push('/result');
            }
        };

        analyzeJob();
    }, [router]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--md-sys-color-background)]">
            <Card className="w-full max-w-md p-8 bg-[var(--md-sys-color-surface-container)]">
                <div className="space-y-6 text-[var(--md-sys-color-on-surface)]">
                    <div className="flex items-center justify-between border-b border-[var(--md-sys-color-outline-variant)] pb-4">
                        <span className="font-bold tracking-wider text-sm">ANALYSIS IN PROGRESS</span>
                        <span className="animate-pulse text-[var(--md-sys-color-primary)]">●</span>
                    </div>

                    <div className="h-32 flex items-center justify-center text-center">
                        <p className="text-lg font-medium text-[var(--md-sys-color-on-surface)] animate-in fade-in zoom-in duration-500">
                            {text}
                            <span className="animate-pulse text-[var(--md-sys-color-primary)]">|</span>
                        </p>
                    </div>

                    <div className="w-full bg-[var(--md-sys-color-surface-container-highest)] h-1 mt-4 rounded-full overflow-hidden">
                        <div
                            className="bg-[var(--md-sys-color-primary)] h-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </Card>
        </main>
    );
}
