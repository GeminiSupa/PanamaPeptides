export const metadata = {
  title: 'About Panama Peptides',
  description: 'Meet Joey Webster and Sean McCully and learn why they built a local Panama source for documented research products, clear stock, and direct support.',
  keywords: ['Panama Peptides about', 'research peptides Panama', 'Joey Webster', 'Sean McCully', 'Panama peptide catalog'],
  alternates: {
    canonical: '/about',
    languages: {
      'en-US': '/about?lang=en',
      'es-PA': '/about?lang=es',
    },
  },
  openGraph: {
    title: 'About Panama Peptides',
    description: 'A Panama business built around local availability, batch documentation, and direct bilingual support.',
    url: '/about',
    images: [
      {
        url: '/science_lab_about.webp',
        width: 1200,
        height: 630,
        alt: 'Panama Peptides local research product story',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Panama Peptides',
    description: 'Local availability, batch documentation, and direct bilingual support in Panama.',
    images: ['/science_lab_about.webp'],
  },
};

export default function AboutLayout({ children }) {
  return children;
}
