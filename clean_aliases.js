const fs = require('fs');

function cleanAliases(inputFile, outputFile) {
    console.log('Reading aliases file...');
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    const cleanedData = {};
    let totalRemoved = 0;

    for (const [canonicalRole, aliases] of Object.entries(data)) {
        if (!Array.isArray(aliases)) {
            cleanedData[canonicalRole] = aliases;
            continue;
        }

        const originalCount = aliases.length;
        const cleanedAliases = [];
        const seen = new Set();

        for (const alias of aliases) {
            if (typeof alias !== 'string') continue;

            const aliasLower = alias.toLowerCase().trim();

            // Skip if already seen (case-insensitive duplicate)
            if (seen.has(aliasLower)) continue;

            // Skip Roman numeral variants (ending with i, ii, iii, iv, v)
            if (/\s+(i|ii|iii|iv|v)$/.test(aliasLower)) continue;

            // Skip no-space versions
            const canonicalNoSpace = canonicalRole.toLowerCase().replace(/[\s-]/g, '');
            if (aliasLower === canonicalNoSpace && !/\s/.test(aliasLower)) continue;

            // Skip if it's just the canonical role itself (case-insensitive)
            if (aliasLower === canonicalRole.toLowerCase()) continue;

            // Skip abbreviations that are just 1-2 letters (too generic)
            // unless they're well-known
            if (aliasLower.length <= 2) {
                const knownAbbrevs = ['pm', 'ceo', 'cto', 'cfo', 'coo', 'vp', 'hr', 'qa', 'ux', 'ui', 'se', 'fe', 'be', 'ml', 'ai', 'db', 'it'];
                if (!knownAbbrevs.includes(aliasLower)) continue;
            }

            // Skip seniority level prefixes - these are not real aliases
            if (aliasLower.startsWith('jr ') || aliasLower.startsWith('junior ')) continue;
            if (aliasLower.startsWith('sr ') || aliasLower.startsWith('senior ')) continue;
            if (aliasLower.startsWith('lead ') || aliasLower.startsWith('principal ')) continue;

            // Add to cleaned list
            cleanedAliases.push(alias);
            seen.add(aliasLower);
        }

        const removed = originalCount - cleanedAliases.length;
        totalRemoved += removed;

        cleanedData[canonicalRole] = cleanedAliases;

        if (removed > 0) {
            console.log(`${canonicalRole}: ${originalCount} -> ${cleanedAliases.length} (removed ${removed})`);
        }
    }

    // Save cleaned data
    fs.writeFileSync(outputFile, JSON.stringify(cleanedData, null, 2), 'utf8');

    console.log(`\n✓ Cleaned aliases saved to ${outputFile}`);
    console.log(`Total aliases removed: ${totalRemoved}`);
    console.log(`\nTo use the cleaned file, run:`);
    console.log(`  move src\\data\\role_aliases_maximal.json src\\data\\role_aliases_maximal.backup.json`);
    console.log(`  move src\\data\\role_aliases_clean.json src\\data\\role_aliases_maximal.json`);
}

cleanAliases(
    'src/data/role_aliases_maximal.json',
    'src/data/role_aliases_clean.json'
);
