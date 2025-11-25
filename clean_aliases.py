import json
import re

def clean_aliases(input_file, output_file):
    """
    Clean the role aliases file by removing:
    1. Roman numeral variants (i, ii, iii, iv, v)
    2. No-space versions (e.g., "softwareengineer")
    3. Duplicates (case-insensitive)
    4. Keep only meaningful aliases
    """
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    cleaned_data = {}
    total_removed = 0
    
    for canonical_role, aliases in data.items():
        if not isinstance(aliases, list):
            cleaned_data[canonical_role] = aliases
            continue
        
        original_count = len(aliases)
        cleaned_aliases = []
        seen = set()
        
        for alias in aliases:
            # Skip if not a string
            if not isinstance(alias, str):
                continue
            
            alias_lower = alias.lower().strip()
            
            # Skip if already seen (case-insensitive duplicate)
            if alias_lower in seen:
                continue
            
            # Skip Roman numeral variants (ending with i, ii, iii, iv, v)
            if re.search(r'\s+(i|ii|iii|iv|v)$', alias_lower):
                continue
            
            # Skip no-space versions (all lowercase, no spaces, same as canonical with spaces removed)
            canonical_no_space = canonical_role.lower().replace(' ', '').replace('-', '')
            if alias_lower == canonical_no_space and ' ' not in alias_lower:
                continue
            
            # Skip if it's just the canonical role itself (case-insensitive)
            if alias_lower == canonical_role.lower():
                continue
            
            # Skip abbreviations that are just 1-2 letters (too generic)
            # unless they're well-known like "pm", "ceo", etc.
            if len(alias_lower) <= 2:
                # Keep well-known abbreviations
                known_abbrevs = ['pm', 'ceo', 'cto', 'cfo', 'coo', 'vp', 'hr', 'qa', 'ux', 'ui', 'se', 'fe', 'be']
                if alias_lower not in known_abbrevs:
                    continue
            
            # Skip "jr" and "sr" prefixed versions - these are seniority levels, not aliases
            if alias_lower.startswith('jr ') or alias_lower.startswith('junior '):
                continue
            if alias_lower.startswith('sr ') or alias_lower.startswith('senior '):
                continue
            if alias_lower.startswith('lead ') or alias_lower.startswith('principal '):
                continue
            
            # Add to cleaned list
            cleaned_aliases.append(alias)
            seen.add(alias_lower)
        
        removed = original_count - len(cleaned_aliases)
        total_removed += removed
        
        if cleaned_aliases:
            cleaned_data[canonical_role] = cleaned_aliases
        else:
            # If no aliases left, just use empty array
            cleaned_data[canonical_role] = []
        
        print(f"{canonical_role}: {original_count} -> {len(cleaned_aliases)} (removed {removed})")
    
    # Save cleaned data
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Cleaned aliases saved to {output_file}")
    print(f"Total aliases removed: {total_removed}")

if __name__ == "__main__":
    clean_aliases(
        'src/data/role_aliases_maximal.json',
        'src/data/role_aliases_clean.json'
    )
