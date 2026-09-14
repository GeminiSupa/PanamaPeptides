import os
import re

directory = "/Users/apple/Desktop/Panama-peptides "

# These ordered replacements matter to prevent double-replacements
replacements = [
    # Domains and Emails
    (re.compile(r'peptidespanama\.net', re.IGNORECASE), 'peptidespanama.net'),
    
    # Specific brand instances
    (re.compile(r'Panama Peptides', re.IGNORECASE), 'Panama Peptides'),
    (re.compile(r'Peptides Panama', re.IGNORECASE), 'Peptides Panama'),
    (re.compile(r'panamapeptides', re.IGNORECASE), 'panamapeptides'),
    (re.compile(r'panamapeptides', re.IGNORECASE), 'PanamaPeptides'),
    (re.compile(r'panama-peptides', re.IGNORECASE), 'panama-peptides'),
    
    # General terms
    (re.compile(r'panama', re.IGNORECASE), 'panama'),
    (re.compile(r'panama', re.IGNORECASE), 'panama'),
    (re.compile(r'panama', re.IGNORECASE), 'panama'),
]

excluded_dirs = {'.git', 'node_modules', '.next', '.gemini'}

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except (UnicodeDecodeError, IsADirectoryError):
        return

    original_content = content
    for pattern, replacement in replacements:
        content = pattern.sub(replacement, content)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

for root, dirs, files in os.walk(directory):
    dirs[:] = [d for d in dirs if d not in excluded_dirs]
    for file in files:
        if file.endswith(('.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico', '.sqlite', '.db')):
            continue
        filepath = os.path.join(root, file)
        process_file(filepath)
        
print("Rebranding complete.")
