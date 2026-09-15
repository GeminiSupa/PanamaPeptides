import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import UTMTracker from "@/components/UTMTracker";
import GlobalContactForm from "@/components/GlobalContactForm";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import GoogleReviewsBadge from "@/components/GoogleReviewsBadge";
import EntryDisclaimer from "@/components/EntryDisclaimer";
import PWARegister from "@/components/PWARegister";
import InstallAppPrompt from "@/components/InstallAppPrompt";
import { LIVE_SITE_URL } from "@/lib/publicUrl";
import { getTikTokPixelBootstrapScript } from "@/lib/tiktokPixel.mjs";

import "./storefront-theme.css";
import "./pwa.css";

// The reference style uses a sturdy display face with a restrained sans-serif
// body. These bundled fonts keep that character without a request to Google.
const inter = localFont({
  src: './fonts/inter-latin-variable.woff2',
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = localFont({
  src: './fonts/montserrat-latin-variable.woff2',
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  // This app IS the catalog site, so every canonical, hreflang and og:url it
  // emits has to resolve to its own origin.
  metadataBase: new URL(LIVE_SITE_URL),
  applicationName: "Panama Peptides",
  manifest: "/manifest.webmanifest",
  title: {
    default: "Péptidos de Investigación en Panamá | Panama Peptides",
    template: "%s | Panama Peptides",
  },
  description: "Péptidos para investigación de laboratorio disponibles en Panamá, con documentación HPLC por lote, precios claros y entrega coordinada localmente.",
  keywords: [
    "péptidos Panamá",
    "research peptides Panama",
    "peptide catalog Panama",
    "COA peptides Panama",
    "laboratory research peptides",
    "Panama Peptides",
  ],
  alternates: {
    canonical: '/',
    languages: {
      'es-PA': '/?lang=es',
      'en-US': '/?lang=en',
    },
  },
  openGraph: {
    title: "Péptidos de Investigación en Panamá",
    description: "Inventario local, documentación de lote por HPLC y entrega coordinada dentro de Panamá.",
    url: '/',
    siteName: 'Panama Peptides',
    locale: 'es_PA',
    alternateLocale: ['en_US'],
    type: 'website',
    images: [
      {
        url: '/catalog-promo-banner.webp',
        width: 1200,
        height: 630,
        alt: 'Panama Peptides catalog preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Péptidos de Investigación en Panamá',
    description: 'Inventario local, documentación de lote por HPLC y entrega dentro de Panamá.',
    images: ['/catalog-promo-banner.webp'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Panama Peptides",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3f4" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

import { getBusinessLinks } from "@/lib/settings";

export default async function RootLayout({ children }) {
  const businessLinks = await getBusinessLinks();
  
  return (
    <html lang="es" data-theme="light" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script
          id="theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var saved=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',saved==='dark'?'dark':'light');}catch(error){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
        <Script id="tiktok-pixel" strategy="beforeInteractive">
          {getTikTokPixelBootstrapScript()}
        </Script>
        {/* Mgid Sensor */}
        <Script id="mgid-sensor" strategy="afterInteractive">
          {`(function() {
              var d = document, w = window;
              w.MgSensorData = w.MgSensorData || [];
              w.MgSensorData.push({
                  cid:988745,
                  project: "a.mgid.com"
              });
              var l = "a.mgid.com";
              var n = d.getElementsByTagName("script")[0];
              var s = d.createElement("script");
              s.type = "text/javascript";
              s.async = true;
              var dt = !Date.now?new Date().valueOf():Date.now();
              s.src = "https://" + l + "/mgsensor.js?d=" + dt;
              n.parentNode.insertBefore(s, n);
          })();`}
        </Script>
        {/* /Mgid Sensor */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  const nativeRemoveChild = Node.prototype.removeChild;
                  Node.prototype.removeChild = function(child) {
                    if (child.parentNode !== this) {
                      return child;
                    }
                    return nativeRemoveChild.apply(this, arguments);
                  };
                  const nativeInsertBefore = Node.prototype.insertBefore;
                  Node.prototype.insertBefore = function(newNode, referenceNode) {
                    if (referenceNode && referenceNode.parentNode !== this) {
                      return newNode;
                    }
                    return nativeInsertBefore.apply(this, arguments);
                  };
                }
              })();
            `
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${LIVE_SITE_URL}/#organization`,
                  "name": "Panama Peptides",
                  "url": LIVE_SITE_URL,
                  "logo": `${LIVE_SITE_URL}/logo.png`,
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": businessLinks.whatsappDisplay,
                    "contactType": "customer service",
                    "areaServed": "PA",
                    "availableLanguage": ["es", "en"]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": `${LIVE_SITE_URL}/#website`,
                  "url": LIVE_SITE_URL,
                  "name": "Panama Peptides",
                  "publisher": {
                    "@id": `${LIVE_SITE_URL}/#organization`
                  },
                  "inLanguage": ["es-PA", "en-US"]
                },
                {
                  "@type": "Store",
                  "@id": `${LIVE_SITE_URL}/#store`,
                  "name": "Panama Peptides",
                  "url": `${LIVE_SITE_URL}/catalog`,
                  "image": `${LIVE_SITE_URL}/catalog-promo-banner.webp`,
                  "telephone": businessLinks.whatsappDisplay,
                  "areaServed": {
                    "@type": "Country",
                    "name": "Panama"
                  },
                  "availableLanguage": ["Spanish", "English"],
                  "parentOrganization": {
                    "@id": `${LIVE_SITE_URL}/#organization`
                  }
                }
              ]
            })
          }}
        />
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://analytics.tiktok.com" />
        <link rel="preconnect" href="https://cbanvzipzfmllexraiei.supabase.co" />
        {/* Preload the logo — it's the LCP element on catalog & home */}
        <link
          rel="preload"
          href="/logo.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {/* Google Tag Manager — noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M2GVDQ44"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        <PWARegister />
        <InstallAppPrompt />
        <AnalyticsTracker />
        <UTMTracker />
        <GlobalContactForm />
        <EntryDisclaimer />
        {/* Google's seller-rating badge. Hides itself on /admin and /embed,
            and renders nothing at all when NEXT_PUBLIC_GCR_BADGE=off. */}
        <GoogleReviewsBadge />
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-M2GVDQ44');`}
        </Script>
      </body>
    </html>
  );
}
