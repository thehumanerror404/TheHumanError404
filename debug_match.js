
const roleAliases = require('./src/data/role_aliases_maximal.json');
const roastsData = require('./src/data/roasts.json');

function resolveRoleAlias(input) {
    if (!input) return input;
    const normalizedInput = input.toLowerCase().trim();
    for (const [canonicalRole, aliases] of Object.entries(roleAliases)) {
        if (canonicalRole.toLowerCase() === normalizedInput) {
            return canonicalRole;
        }
        if (Array.isArray(aliases)) {
            for (const alias of aliases) {
                if (alias.toLowerCase() === normalizedInput) {
                    return canonicalRole;
                }
            }
        }
    }
    return input;
}

function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
}

function findBestMatch(input, options) {
    if (!input) return 'Default';
    let bestMatch = 'Default';
    let minDistance = Infinity;
    const normalizedInput = input.toLowerCase().trim();
    for (const option of options) {
        if (option === 'Default') continue;
        const normalizedOption = option.toLowerCase();
        if (normalizedOption === normalizedInput) return option;
        if (normalizedOption.includes(normalizedInput) || normalizedInput.includes(normalizedOption)) {
            const lengthDiff = Math.abs(normalizedOption.length - normalizedInput.length);
            if (lengthDiff < minDistance) {
                minDistance = lengthDiff;
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
    if (minDistance > 5 && minDistance > normalizedInput.length * 0.6) {
        return 'Default';
    }
    return bestMatch;
}

const input = "Supervisor";
const resolved = resolveRoleAlias(input);
console.log(`Input: ${input}`);
console.log(`Resolved: ${resolved}`);

const keys = Object.keys(roastsData);
console.log(`"Team Leader" in keys: ${keys.includes("Team Leader")}`);

const match = findBestMatch(resolved, keys);
console.log(`Best Match: ${match}`);
