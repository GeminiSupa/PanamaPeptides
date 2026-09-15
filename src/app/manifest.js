export default function manifest() {
  return {
    name: "Panama Peptides",
    short_name: "Panama Peptides",
    description:
      "Catálogo bilingüe de Panama Peptides con inventario local y documentación por lote.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#7d000a",
    orientation: "portrait-primary",
    categories: ["shopping", "business"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Catálogo",
        short_name: "Catálogo",
        description: "Abrir el catálogo",
        url: "/catalog?source=pwa-shortcut",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Mi cuenta",
        short_name: "Cuenta",
        description: "Abrir mi cuenta",
        url: "/account?source=pwa-shortcut",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Certificados",
        short_name: "COA",
        description: "Consultar certificados de análisis",
        url: "/coa-database?source=pwa-shortcut",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
