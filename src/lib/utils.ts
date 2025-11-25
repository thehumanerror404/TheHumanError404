import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import roastsData from '@/data/roasts.json';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Resolves a role alias to its canonical role name
 * @param input - The user input
 * @returns The input (aliases disabled)
 */
export function resolveRoleAlias(input: string): string {
    return input;
}

/**
 * Gets all searchable terms (canonical roles only) for autocomplete
 * @returns Array of all role names
 */
export function getAllRoleTerms(): string[] {
    return Object.keys(roastsData);
}

export function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

export function findBestMatch(input: string, options: string[]): string {
    if (!input) return 'Default';

    let bestMatch = 'Default';
    let minDistance = Infinity;
    const normalizedInput = input.toLowerCase().trim();

    for (const option of options) {
        if (option === 'Default') continue;

        const normalizedOption = option.toLowerCase();

        // Immediate return for exact match
        if (normalizedOption === normalizedInput) return option;

        // High priority for substring matches
        if (normalizedOption.includes(normalizedInput) || normalizedInput.includes(normalizedOption)) {
            // If one contains the other, it's a very strong candidate. 
            // We prefer the one with the smallest length difference (most specific match)
            const lengthDiff = Math.abs(normalizedOption.length - normalizedInput.length);
            if (lengthDiff < minDistance) {
                minDistance = lengthDiff; // Treat length diff as distance for substrings
                bestMatch = option;
            }
            continue;
        }

        const distance = levenshteinDistance(normalizedInput, normalizedOption);
        if (distance < minDistance) {
            minDistance = distance;
            bestMatch = option;
        }
    }

    // If the best match is still pretty far (e.g., more than 60% of the string length), fallback to Default
    // unless we found a substring match (which we handled above, but let's be careful).
    // Actually, for "closest one" logic, we might just want to return the best match regardless, 
    // but "Default" exists for a reason.

    // Let's say if distance > 5 and distance > input.length * 0.6, use Default.
    if (minDistance > 5 && minDistance > normalizedInput.length * 0.6) {
        return 'Default';
    }

    return bestMatch;
}
