import re

css_path = "/Users/apple/Desktop/Panama-peptides /src/app/globals.css"
with open(css_path, "r") as f:
    css = f.read()

theme_overrides = """
/* =========================================
   GLOBAL TRUE BBR TACTICAL THEME OVERRIDES (ALL PAGES)
   ========================================= */

/* Force all major layout wrappers to be pitch black or dark grey */
.catalog-page-shell, .about-page, .blog-page, .faq-page, .contact-page, .landing-layout,
main, .main, .container, section, article {
    background-color: transparent !important;
}

body {
    background-color: var(--bg-main) !important;
}

/* Force text on all structural elements */
h1, h2, h3, h4, h5, h6, .catalog-seo-title, .section-title, .about-hero h1 {
    color: #ffffff !important;
    text-transform: uppercase !important;
}

p, span, div, li {
    color: #f5f5f5;
}

/* Specific component overrides that typically had white backgrounds */
.header-top, .catalog-brand-row, .lp-header, .clone-nav-wrap, .clone-nav-dropdown {
    background-color: #050505 !important;
    border-color: #333333 !important;
}

.modal-content, .cart-body, .card-payment-panel, .checkout-form {
    background-color: #0a0a0a !important;
    border: 1px solid #333333 !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.8) !important;
}

/* Update text in modals/inputs */
.modal-content *, .cart-body *, .checkout-form * {
    color: #ffffff !important;
}

input, textarea, select {
    background-color: #111111 !important;
    color: #ffffff !important;
    border: 1px solid #333333 !important;
}

input:focus, textarea:focus, select:focus {
    border-color: #a30000 !important;
}

/* Update any stray buttons */
button, .btn-hero-primary {
    background: transparent;
    color: #ffffff;
    border-color: #a30000;
}

/* Sidebar filter links */
.category-nav a {
    color: #cccccc !important;
}
.category-nav a:hover, .category-nav a.active {
    color: #a30000 !important;
    font-weight: 700;
}

/* Override the white landing page hero */
.lp-hero, .about-hero {
    background: radial-gradient(circle at center, #2a0000 0%, #000000 70%) !important;
    border-bottom: 2px solid #a30000 !important;
}

.lp-hero::after, .about-hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.05"/></svg>');
    opacity: 0.15;
    pointer-events: none;
    z-index: 1;
}

/* Any white borders or backgrounds */
* {
    /* If there are inline backgrounds, this will NOT override, but it overrides css rules */
}
"""

css = css + theme_overrides

with open(css_path, "w") as f:
    f.write(css)
