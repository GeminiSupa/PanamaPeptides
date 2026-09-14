import re

css_path = "/Users/apple/Desktop/Panama-peptides /src/app/globals.css"
with open(css_path, "r") as f:
    css = f.read()

# Replace fonts
css = css.replace("--font-montserrat", "--font-rubik")
css = css.replace("--font-inter", "--font-manrope")
css = css.replace("font-family: Georgia, 'Times New Roman', serif;", "font-family: var(--font-rubik), sans-serif;")

# Overwrite root variables with exact BBR palette
root_replacement = """:root {
    --primary: #121212;
    --primary-alt: #1a1a1a;
    --accent: #2e6bc6;
    --cta: #2e6bc6;
    --cta-hover: #1e4a8c;
    --accent-on-dark: #2e6bc6;
    --radius-md: 0px;
    --radius-lg: 0px;
    --container-width: 1200px;
    
    --bg-main: #ffffff;
    --bg-card: #f9f9f9;
    --bg-secondary: #f2f2f2;
    --text-main: #333333;
    --text-muted: #666666;
    --text-primary: #121212;
    --border: #e6e6e6;
    --border-highlight: #cccccc;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
    --danger: #d9534f;
    --danger-border: #c9302c;
    --danger-ring: rgba(217, 83, 79, 0.25);
    --danger-bg: rgba(217, 83, 79, 0.1);
}

[data-theme="dark"] {
    --bg-main: #121212;
    --bg-card: #1a1a1a;
    --bg-secondary: #222222;
    --text-main: #f4f4f4;
    --text-muted: #a0a0a0;
    --text-primary: #ffffff;
    --border: #333333;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 20px 30px rgba(0, 0, 0, 0.7);
    --danger: #d9534f;
    --danger-border: #c9302c;
    --danger-ring: rgba(217, 83, 79, 0.25);
    --danger-bg: rgba(217, 83, 79, 0.1);
}"""

root_pattern = re.compile(r':root\s*\{.*?\}\s*\[data-theme="dark"\]\s*\{.*?\}', re.DOTALL)
css = root_pattern.sub(root_replacement, css)

with open(css_path, "w") as f:
    f.write(css)
