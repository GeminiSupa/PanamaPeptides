import re

css_path = "/Users/apple/Desktop/Panama-peptides /src/app/globals.css"
with open(css_path, "r") as f:
    css = f.read()

theme_overrides = """
/* =========================================
   KILL LANDING-LAYOUT LIGHT MODE VARIABLES
   ========================================= */

.landing-layout {
    --primary: #0a0a0a !important;
    --primary-alt: #111111 !important;
    --accent: #a30000 !important;
    --bg-main: #000000 !important;
    --bg-card: #0a0a0a !important;
    --bg-secondary: #141414 !important;
    --text-main: #ffffff !important;
    --text-muted: #888888 !important;
    --text-primary: #ffffff !important;
    --border: #333333 !important;
    --cta: #a30000 !important;
    --cta-hover: #ff1a1a !important;
    background: #000000 !important;
}

.landing-layout .lp-header,
.landing-layout .lp-header--scrolled .lp-header-inner,
.landing-layout .lang-selector,
.landing-layout .lp-hero,
.landing-layout .lp-nav {
    background: #050505 !important;
    border-color: #333333 !important;
}

.landing-layout .site-shipping-bar { background: #0a0a0a !important; color: #ffffff !important; }

/* Force WhatsApp button to be red */
.whatsapp-btn, .product-detail-cart-button, #catalog-whatsapp-btn {
    background: #a30000 !important;
    border-color: #ff1a1a !important;
    color: #ffffff !important;
}

/* Force Product Cards to be dark */
.product-card {
    background: linear-gradient(145deg, #111111, #080808) !important;
    border: 1px solid #222222 !important;
}

.product-grid.grid-view .product-card,
.product-grid.compact-view .product-card {
    background: linear-gradient(145deg, #111111, #080808) !important;
}

.product-grid.compact-view .product-image {
    background: #0a0a0a !important;
}

/* Force Stock badges to match red theme */
.stock-badge, .stock-soon {
    background: rgba(204, 0, 0, 0.2) !important;
    color: #ff1a1a !important;
    border-color: rgba(204, 0, 0, 0.4) !important;
}

.cart-free-shipping-badge {
    background: #a30000 !important;
    color: #ffffff !important;
}

/* Fix text colors */
.landing-layout *, .landing-layout p, .landing-layout span, .landing-layout h1, .landing-layout h2, .landing-layout h3 {
    /* Don't use * for text color, let variables handle it */
}
"""

css = css + theme_overrides

with open(css_path, "w") as f:
    f.write(css)
