const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

const roastsPath = path.join(__dirname, "src/data/roasts.json");
const aliasesPath = path.join(__dirname, "src/data/role_aliases_maximal.json");
const newRoastsDir = path.join(__dirname, "new_roasts");
const outputPath = path.join(__dirname, "src/data/roasts_expanded.json");

// Load base data
const roastsData = require(roastsPath);
const roleAliases = require(aliasesPath);

// Build a map of "lowercase name/alias" -> "Canonical Role Name"
const roleMap = {};

// 1. Add canonical roles from roasts.json (just in case they aren't in aliases file)
Object.keys(roastsData).forEach(role => {
    roleMap[role.toLowerCase()] = role;
});

// 2. Add canonical roles and aliases from role_aliases_maximal.json
Object.entries(roleAliases).forEach(([canonical, aliases]) => {
    roleMap[canonical.toLowerCase()] = canonical;
    if (Array.isArray(aliases)) {
        aliases.forEach(alias => {
            roleMap[alias.toLowerCase()] = canonical;
        });
    }
});

async function processFiles() {
    const files = fs.readdirSync(newRoastsDir)
        .filter(f => f.endsWith(".docx"))
        .sort(); // Ensure 01, 02, etc. order

    let currentRole = null;

    // We want to avoid duplicates, but also maybe we want to clean up the existing lists if they were polluted?
    // For now, let's assume roasts.json is the "clean" base.
    // If we want to re-generate roasts_expanded.json completely, we should start with roasts.json content.
    // The previous run modified roastsData in memory and wrote it. 
    // Since we are reloading roasts.json (which hasn't changed), we are starting fresh from the base.

    // However, if roasts.json ALREADY contains the new roasts (because I overwrote it? No, I wrote to roasts_expanded.json),
    // then we are good.
    // Wait, did I overwrite roasts.json?
    // The previous script wrote to `outputPath` (roasts_expanded.json).
    // `roastsPath` points to `src/data/roasts.json`.
    // So `roastsData` here is the original clean data (presumably).

    // BUT, if the user wants to keep the "bad" roasts_expanded.json as a base? No, we want to fix it.
    // So we start from roasts.json.

    for (const file of files) {
        console.log(`Processing ${file}...`);
        const filePath = path.join(newRoastsDir, file);

        try {
            const result = await mammoth.extractRawText({ path: filePath });
            const text = result.value;
            // Split by newlines
            const lines = text.split('\n').map(l => l.trim()).filter(l => l);

            for (const line of lines) {
                const lowerLine = line.toLowerCase();

                // 1. Check for garbage / headers
                if (lowerLine.startsWith("professions") && lowerLine.match(/\d+/)) {
                    console.log(`  Skipping header: ${line}`);
                    continue;
                }

                // 2. Check if line is a role (canonical or alias)
                if (roleMap[lowerLine]) {
                    currentRole = roleMap[lowerLine];
                    console.log(`  Found role: ${currentRole} (from "${line}")`);

                    // Initialize array if not exists
                    if (!roastsData[currentRole]) {
                        roastsData[currentRole] = [];
                    }
                    continue;
                }

                // 3. If we have a current role, treat line as a roast
                if (currentRole) {
                    // Filter out short noise or things that look like page numbers
                    if (line.length < 10) continue;

                    // Add to roasts if unique
                    if (!roastsData[currentRole].includes(line)) {
                        roastsData[currentRole].push(line);
                    }
                }
            }
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }

    fs.writeFileSync(outputPath, JSON.stringify(roastsData, null, 4));
    console.log(`Wrote updated roasts to ${outputPath}`);
}

processFiles();
