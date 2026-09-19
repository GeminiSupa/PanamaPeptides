export const metadata = {
  title: 'Catálogo de Péptidos de Investigación',
  description: 'Consulta el inventario local, precios y documentación disponible de péptidos de investigación en Panamá.',
  alternates: { canonical: '/catalog' },
  openGraph: {
    title: 'Catálogo de Péptidos de Investigación en Panamá',
    description: 'Inventario local con precios claros y documentación de lote disponible.',
    url: '/catalog',
    images: ['/catalog-promo-banner.webp'],
  },
};

export default function CatalogLayout({ children }) {
  return children;
}
