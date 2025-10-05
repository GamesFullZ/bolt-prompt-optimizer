import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Prompt Studio for Bolt.new — Generador de prompts optimizados",
    template: "%s | Prompt Studio",
  },
  description:
    "Convierte ideas en prompts listos y optimizados para Bolt.new. Ajusta estilo, tono, tipo y contexto. Historial local, mejoras automáticas, atajos y UX moderna.",
  keywords: [
    "prompt studio",
    "bolt.new",
    "generador de prompts",
    "optimización de prompts",
    "shadcn ui",
    "next.js 15",
    "tailwind css",
    "framer-motion",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/dashboard",
  },
  openGraph: {
    type: "website",
    url: "/dashboard",
    title: "Prompt Studio for Bolt.new — Generador de prompts optimizados",
    description:
      "Genera y mejora prompts profesionales para Bolt.new con historial local, atajos y controles finos de estilo/tono.",
    images: [
      {
        url: "/vercel.svg",
        width: 1200,
        height: 630,
        alt: "Prompt Studio Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Studio for Bolt.new — Generador de prompts",
    description:
      "Crea prompts optimizados para Bolt.new. Historial local, mejoras automáticas y UX moderna.",
    images: ["/vercel.svg"],
  },
  category: "productivity",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* JSON-LD: WebApplication */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Prompt Studio for Bolt.new",
            applicationCategory: "Productivity",
            operatingSystem: "Web",
            description:
              "Convierte ideas en prompts optimizados para Bolt.new con historial local y mejoras automáticas.",
            offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
          }),
        }}
      />
      {children}
    </>
  );
}