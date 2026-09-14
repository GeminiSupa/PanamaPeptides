import re

css_path = "/Users/apple/Desktop/Panama-peptides /src/app/globals.css"
with open(css_path, "r") as f:
    css = f.read()

# 1. Update Root Variables for True Dark/Red Theme
root_replacement = """:root {
    --primary: #0a0a0a;       /* Deep Black */
    --primary-alt: #111111;   /* Dark Charcoal */
    --accent: #a30000;        /* Deep Blood Red */
    --cta: #a30000;           
    --cta-hover: #ff1a1a;     /* Bright Red Hover */
    --accent-on-dark: #cc0000;
    --radius-md: 4px;         /* Slight edge for tactical feel */
    --radius-lg: 6px;
    --container-width: 1200px;
    
    --bg-main: #000000;       /* Pitch Black */
    --bg-card: #0a0a0a;       /* Almost Black */
    --bg-secondary: #141414;  /* Dark Grey */
    --text-main: #f5f5f5;     /* Stark White */
    --text-muted: #888888;    /* Medium Grey */
    --text-primary: #ffffff;  
    --border: #333333;        /* Dark Grey Border */
    --border-highlight: #a30000; /* Red Border Highlights */
    --shadow: 0 4px 15px rgba(0, 0, 0, 0.8);
    --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(163, 0, 0, 0.2);
    --danger: #ff0000;
    --danger-border: #cc0000;
    --danger-ring: rgba(204, 0, 0, 0.25);
    --danger-bg: rgba(204, 0, 0, 0.1);
}

[data-theme="dark"] {
    --bg-main: #000000;
    --bg-card: #0a0a0a;
    --bg-secondary: #141414;
    --text-main: #f5f5f5;
    --text-muted: #888888;
    --text-primary: #ffffff;
    --border: #333333;
    --shadow: 0 4px 15px rgba(0, 0, 0, 0.8);
    --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(163, 0, 0, 0.2);
    --danger: #ff0000;
    --danger-border: #cc0000;
    --danger-ring: rgba(204, 0, 0, 0.25);
    --danger-bg: rgba(204, 0, 0, 0.1);
}"""

root_pattern = re.compile(r':root\s*\{.*?\}\s*\[data-theme="dark"\]\s*\{.*?\}', re.DOTALL)
css = root_pattern.sub(root_replacement, css)

# 2. Add Radial Red Gradient to Hero Sections
# We inject this at the end of the file or replacing .clone-hero if it exists.
# Wait, let's just append some overrides at the end to guarantee they win.
theme_overrides = """
/* =========================================
   TRUE BBR TACTICAL THEME OVERRIDES
   ========================================= */

body {
    background-color: var(--bg-main);
    color: var(--text-main);
}

.clone-hero {
    background: radial-gradient(circle at center, #2a0000 0%, #000000 70%) !important;
    position: relative;
    border-bottom: 2px solid #a30000;
}

/* Texture overlay for hero */
.clone-hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.05"/></svg>');
    opacity: 0.15;
    pointer-events: none;
    z-index: 1;
}

.clone-hero-copy, .clone-hero-media {
    position: relative;
    z-index: 2;
}

.clone-hero-copy h2 {
    color: #ffffff !important;
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}

.clone-hero-copy p {
    color: #cccccc !important;
}

.product-card {
    background: linear-gradient(145deg, #111111, #080808) !important;
    border: 1px solid #222222 !important;
    border-radius: var(--radius-md) !important;
}

.product-card:hover {
    border-color: #a30000 !important;
    box-shadow: 0 0 15px rgba(163, 0, 0, 0.4) !important;
}

.add-to-cart-btn {
    background: transparent !important;
    color: #ffffff !important;
    border: 1px solid #a30000 !important;
    border-radius: 4px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
}

.add-to-cart-btn:hover:not(:disabled) {
    background: #a30000 !important;
    color: #ffffff !important;
    box-shadow: 0 0 10px rgba(163, 0, 0, 0.6) !important;
}

.catalog-brand-sticky, .header-top-section {
    background: rgba(5, 5, 5, 0.95) !important;
    border-bottom: 1px solid #333333 !important;
}

.catalog-seo-title, .clone-section h2 {
    text-transform: uppercase;
    color: #ffffff !important;
}

.clone-footer {
    background: #050505 !important;
    border-top: 2px solid #a30000 !important;
}
"""

css = css + theme_overrides

with open(css_path, "w") as f:
    f.write(css)
