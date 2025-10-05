export interface PromptOptions {
  style: string;
  tone: string;
  responseType: string;
  context: string;
}

export interface GeneratedPrompt {
  id: string;
  originalText: string;
  optimizedPrompt: string;
  options: PromptOptions;
  timestamp: number;
  isFavorite?: boolean;
}

/**
 * Genera un prompt estructurado optimizado para Bolt.new siguiendo su formato preferido.
 * Bolt.new entiende mejor prompts con estructura clara: Objetivo → Características → Stack → Diseño → Restricciones
 */
export function optimizePrompt(
  userInput: string,
  options: PromptOptions
): string {
  if (!userInput.trim()) {
    return "";
  }

  const cleanedInput = userInput.trim();
  
  // 🎯 LLAMADO A LA ACCIÓN DIRECTO PARA LA IA
  let prompt = `**Genera el código completo de ${getProjectTypeDescription(options.responseType)} cumpliendo estas especificaciones técnicas, de diseño, backend, SEO y accesibilidad:**\n\n`;
  
  prompt += `---\n\n`;
  
  // 🧩 TL;DR – MUST-HAVES (versión corta y priorizada)
  prompt += `## ⚡ TL;DR – Must‑Haves (Resumen Corto)\n\n`;
  prompt += `1) Prioriza: funcionalidad → diseño → tests.\n`;
  prompt += `2) Stack preferido: Next.js 15 + TypeScript + Tailwind + Shadcn/UI; Backend con API Routes + PostgreSQL (Drizzle ORM); Auth (email/password u OAuth); Pagos con Stripe (si aplica).\n`;
  prompt += `3) SEO, i18n (es‑MX si aplica), accesibilidad WCAG AA, performance > 90 en Lighthouse.\n\n`;

  // 📋 RESUMEN EJECUTIVO (2-3 párrafos para claridad de IA)
  prompt += `## 📋 Resumen Ejecutivo\n\n`;
  prompt += `${cleanedInput}\n\n`;
  prompt += `Este proyecto requiere una implementación completa con Next.js 15, TypeScript, Tailwind CSS y Shadcn/UI. `;
  prompt += `Debe incluir backend funcional, integración de pagos${getPaymentProviders(cleanedInput)}, SEO optimizado, y pruebas de calidad. `;
  prompt += `La aplicación debe ser 100% responsive, accesible (WCAG 2.1 AA), y optimizada para performance.\n\n`;

  // ➿ Flujos de usuario concretos
  prompt += `## 🔁 Flujos de Usuario Concretos\n\n`;
  prompt += getConcreteUserFlows(cleanedInput, options.responseType);
  prompt += `\n`;
  
  // 🔧 SECCIÓN 1: CARACTERÍSTICAS PRINCIPALES (extraídas e inferidas del input)
  prompt += `## 🔧 Características Principales\n\n`;
  
  const inferredFeatures = inferFeatures(cleanedInput, options.responseType);
  inferredFeatures.forEach(feature => {
    prompt += `- ${feature}\n`;
  });
  prompt += `\n`;

  // 💻 SECCIÓN 2: STACK TÉCNICO COMPLETO
  prompt += `## 💻 Stack Técnico Completo\n\n`;
  prompt += `### Frontend\n`;
  prompt += `- **Framework**: Next.js 15 (App Router con Server & Client Components)\n`;
  prompt += `- **Language**: TypeScript 5+ con tipos estrictos\n`;
  prompt += `- **Styling**: Tailwind CSS v4 (NO styled-jsx bajo ninguna circunstancia)\n`;
  prompt += `- **UI Components**: Shadcn/UI (Radix UI primitives)\n`;
  prompt += `- **Icons**: Lucide React\n`;
  prompt += `- **Animations**: Framer Motion para transiciones fluidas (60fps)\n`;
  prompt += `- **Forms**: React Hook Form + Zod para validación\n`;
  prompt += `- **State Management**: React hooks + Context API cuando sea necesario\n\n`;
  
  prompt += `### Backend & Database\n`;
  prompt += getBackendStack(cleanedInput, options.responseType);
  prompt += `\n`;
  
  prompt += `### Payments & Monetization\n`;
  prompt += getPaymentIntegration(cleanedInput, options.responseType);
  prompt += `\n`;

  // 📦 Dependencias exactas priorizadas
  prompt += `## 📦 Dependencias Recomendadas (instalar primero)\n\n`;
  prompt += getPreferredDependencies(cleanedInput, options.responseType);
  prompt += `\n`;

  // 🎨 SECCIÓN 3: DISEÑO Y ESTILO
  prompt += `## 🎨 Diseño y Estética\n\n`;
  prompt += getDesignGuidelines(options.style, options.tone);
  prompt += `\n`;

  // 📐 SECCIÓN 4: ESTRUCTURA Y ARQUITECTURA
  prompt += `## 📐 Estructura del Proyecto\n\n`;
  prompt += getArchitectureGuidelines(options.responseType);
  prompt += `\n`;

  // ⚡ SECCIÓN 5: CARACTERÍSTICAS TÉCNICAS ESPECÍFICAS
  prompt += `## ⚡ Implementación Técnica\n\n`;
  prompt += getTechnicalRequirements(options);
  prompt += `\n`;
  
  // 🌍 SECCIÓN 6: SEO Y MARKETING
  prompt += `## 🌍 SEO y Marketing\n\n`;
  prompt += getSEORequirements(cleanedInput, options.context);
  prompt += `\n`;
  
  // 🌐 SECCIÓN 7: INTERNACIONALIZACIÓN Y LOCALIZACIÓN
  prompt += `## 🌐 Internacionalización\n\n`;
  prompt += getLocalizationRequirements(cleanedInput);
  prompt += `\n`;
  
  // 🧪 SECCIÓN 8: TESTING Y QA
  prompt += `## 🧪 Testing y Quality Assurance\n\n`;
  prompt += getTestingRequirements(options.responseType);
  prompt += `\n`;
  
  // 📱 SECCIÓN 9: RESPONSIVE Y ACCESIBILIDAD AVANZADA
  prompt += `## 📱 Responsive & Accesibilidad Avanzada\n\n`;
  prompt += getAccessibilityRequirements();
  prompt += `\n`;

  // 🎯 SECCIÓN 10: CRITERIOS DE ÉXITO
  prompt += `## 🎯 Criterios de Éxito\n\n`;
  prompt += getSuccessCriteria(options.context);
  prompt += `\n`;

  // 🚫 RESTRICCIONES Y MEJORES PRÁCTICAS
  prompt += `## 🚫 Restricciones Críticas y ✅ Mejores Prácticas\n\n`;
  prompt += getRestrictionsAndBestPractices();
  prompt += `\n`;

  // 📝 CONTEXTO EXTRA (opcional)
  if (options.context !== "General") {
    prompt += `## 📝 Contexto de Uso Específico\n\n`;
    prompt += getContextualNotes(options.context);
    prompt += `\n`;
  }

  // 🚀 PRE-DEPLOYMENT
  prompt += `## 🚀 Pre-Deployment Checklist\n\n`;
  prompt += getPreDeploymentChecklist();
  prompt += `\n---\n\n`;
  prompt += `**IMPORTANTE**: Este prompt está optimizado para Bolt.new. Copia y pega directamente para obtener los mejores resultados. Bolt generará automáticamente la estructura completa del proyecto siguiendo estas especificaciones.\n`;

  return prompt;
}

function getProjectTypeDescription(responseType: string): string {
  const descriptions: Record<string, string> = {
    "Web Application": "una aplicación web completa",
    "Component": "un componente reutilizable",
    "Landing Page": "una landing page profesional",
    "Dashboard": "un dashboard administrativo",
    "E-commerce": "una tienda e-commerce"
  };
  return descriptions[responseType] || "un proyecto web";
}

function getPaymentProviders(input: string): string {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes("stripe")) return " (Stripe)";
  if (lowerInput.includes("paypal")) return " (PayPal)";
  if (lowerInput.includes("mercado pago") || lowerInput.includes("mercadopago")) return " (Mercado Pago)";
  if (lowerInput.includes("pago") || lowerInput.includes("payment") || lowerInput.includes("checkout")) {
    return " (Stripe recomendado)";
  }
  return "";
}

function getBackendStack(input: string, responseType: string): string {
  let backend = "";
  
  // Detectar si necesita backend
  const needsBackend = responseType === "Web Application" || 
                       responseType === "Dashboard" || 
                       responseType === "E-commerce" ||
                       input.toLowerCase().includes("database") ||
                       input.toLowerCase().includes("base de datos") ||
                       input.toLowerCase().includes("auth") ||
                       input.toLowerCase().includes("api");
  
  if (needsBackend) {
    backend += `- **Runtime**: Node.js con Next.js API Routes (/app/api)\n`;
    backend += `- **Database**: \n`;
    backend += `  - **Recomendado**: PostgreSQL con Drizzle ORM o Prisma\n`;
    backend += `  - Alternativas: Supabase (PostgreSQL + Auth), Firebase, MongoDB\n`;
    backend += `- **Authentication**: \n`;
    backend += `  - NextAuth.js v5 (Auth.js) para autenticación completa\n`;
    backend += `  - Soporte para: Email/Password, OAuth (Google, GitHub), Magic Links\n`;
    backend += `  - Session management con JWT o Database sessions\n`;
    backend += `- **API Layer**: \n`;
    backend += `  - RESTful API routes con TypeScript\n`;
    backend += `  - Input validation con Zod schemas\n`;
    backend += `  - Error handling consistente\n`;
    backend += `  - Rate limiting para seguridad\n`;
    backend += `- **File Storage**: \n`;
    backend += `  - Para uploads: Uploadthing, Cloudinary, o AWS S3\n`;
    backend += `  - Optimización automática de imágenes\n`;
  } else {
    backend += `- **Estado Local**: React hooks + Context API para estado global\n`;
    backend += `- **Persistencia**: LocalStorage o SessionStorage para datos del cliente\n`;
    backend += `- **Mock Data**: JSON estático o generado para demos\n`;
  }
  
  return backend;
}

function getPaymentIntegration(input: string, responseType: string): string {
  const lowerInput = input.toLowerCase();
  const needsPayments = responseType === "E-commerce" ||
                        lowerInput.includes("pago") ||
                        lowerInput.includes("payment") ||
                        lowerInput.includes("checkout") ||
                        lowerInput.includes("compra") ||
                        lowerInput.includes("stripe") ||
                        lowerInput.includes("paypal");
  
  if (needsPayments) {
    let payment = "";
    payment += `**Integración Requerida:**\n`;
    payment += `- **Provider Principal**: Stripe (recomendado por facilidad y seguridad)\n`;
    payment += `  - Stripe Checkout para flujo completo\n`;
    payment += `  - Stripe Elements para formularios custom\n`;
    payment += `  - Webhooks para confirmación de pagos\n`;
    payment += `  - Test mode con tarjetas de prueba\n`;
    payment += `- **Alternativa**: PayPal SDK (si se especifica)\n`;
    payment += `- **Moneda**: Detectar región del usuario\n`;
    
    // Detectar si menciona México o MXN
    if (lowerInput.includes("mexico") || lowerInput.includes("méxico") || 
        lowerInput.includes("hermosillo") || lowerInput.includes("mxn")) {
      payment += `  - **Principal**: MXN (Pesos mexicanos) con formato $1,234.56\n`;
      payment += `  - Soporte para: OXXO, SPEI, tarjetas mexicanas\n`;
    } else {
      payment += `  - Por defecto: USD, EUR, o moneda local según geolocalización\n`;
    }
    
    payment += `- **Carrito de Compras**:\n`;
    payment += `  - Estado global con Context API o Zustand\n`;
    payment += `  - Persistencia en LocalStorage\n`;
    payment += `  - Cálculo automático de totales e impuestos\n`;
    payment += `  - Validación de stock antes de checkout\n`;
    payment += `- **Seguridad**:\n`;
    payment += `  - PCI DSS compliance (Stripe lo maneja)\n`;
    payment += `  - No guardar datos de tarjetas en frontend\n`;
    payment += `  - HTTPS obligatorio en producción\n`;
    payment += `  - Tokens de sesión seguros\n`;
    
    return payment;
  }
  
  return `No se requiere integración de pagos para este proyecto.\n`;
}

function getSEORequirements(input: string, context: string): string {
  let seo = "";
  
  seo += `### Meta Tags (CRÍTICO)\n`;
  seo += `Cada página debe incluir en el archivo \`layout.tsx\` o \`page.tsx\`:\n\n`;
  seo += `\`\`\`typescript\n`;
  seo += `export const metadata: Metadata = {\n`;
  seo += `  title: "Título descriptivo y conciso (50-60 caracteres)",\n`;
  seo += `  description: "Descripción única y atractiva (150-160 caracteres)",\n`;
  seo += `  keywords: ["palabra1", "palabra2", "palabra3"],\n`;
  seo += `  authors: [{ name: "Nombre del autor" }],\n`;
  seo += `  creator: "Nombre del creador",\n`;
  seo += `  openGraph: {\n`;
  seo += `    title: "Título para redes sociales",\n`;
  seo += `    description: "Descripción para redes sociales",\n`;
  seo += `    url: "https://tusitio.com",\n`;
  seo += `    siteName: "Nombre del Sitio",\n`;
  seo += `    images: [{\n`;
  seo += `      url: "/og-image.jpg",\n`;
  seo += `      width: 1200,\n`;
  seo += `      height: 630,\n`;
  seo += `      alt: "Descripción de la imagen"\n`;
  seo += `    }],\n`;
  seo += `    locale: "es_MX",\n`;
  seo += `    type: "website"\n`;
  seo += `  },\n`;
  seo += `  twitter: {\n`;
  seo += `    card: "summary_large_image",\n`;
  seo += `    title: "Título para Twitter",\n`;
  seo += `    description: "Descripción para Twitter",\n`;
  seo += `    images: ["/twitter-image.jpg"]\n`;
  seo += `  },\n`;
  seo += `  robots: {\n`;
  seo += `    index: true,\n`;
  seo += `    follow: true,\n`;
  seo += `    googleBot: {\n`;
  seo += `      index: true,\n`;
  seo += `      follow: true\n`;
  seo += `    }\n`;
  seo += `  }\n`;
  seo += `}\n`;
  seo += `\`\`\`\n\n`;
  
  seo += `### Sitemap y Robots\n`;
  seo += `- **sitemap.xml**: Generar automáticamente con Next.js\n`;
  seo += `  - Incluir todas las rutas públicas\n`;
  seo += `  - Actualización dinámica para contenido generado\n`;
  seo += `  - Prioridad y frecuencia de cambio configuradas\n`;
  seo += `- **robots.txt**: Configurar en \`/public/robots.txt\`\n`;
  seo += `  - Allow/Disallow rules apropiadas\n`;
  seo += `  - Link al sitemap\n`;
  seo += `  - User-agent específicos si es necesario\n\n`;
  
  seo += `### Structured Data (Schema.org)\n`;
  seo += `Implementar JSON-LD en páginas relevantes:\n`;
  seo += `- **Organization**: Para datos de la empresa\n`;
  seo += `- **Product**: Para páginas de productos (E-commerce)\n`;
  seo += `- **Article**: Para blog posts\n`;
  seo += `- **BreadcrumbList**: Para navegación\n`;
  seo += `- **FAQPage**: Para secciones de preguntas frecuentes\n`;
  seo += `- **LocalBusiness**: Si tiene ubicación física\n\n`;
  
  seo += `### URLs Amigables\n`;
  seo += `- Usar slugs descriptivos: \`/productos/bicicleta-montana-roja\`\n`;
  seo += `- Evitar IDs numéricos expuestos: NO \`/producto/12345\`\n`;
  seo += `- Lowercase y guiones en lugar de underscores\n`;
  seo += `- Mantener estructura lógica y corta\n`;
  seo += `- Implementar redirects 301 para URLs antiguas\n\n`;
  
  seo += `### Optimización Técnica\n`;
  seo += `- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1\n`;
  seo += `- **Mobile-First**: Google indexa versión móvil primero\n`;
  seo += `- **HTTPS**: Obligatorio para ranking\n`;
  seo += `- **Canonical URLs**: Evitar contenido duplicado\n`;
  seo += `- **Hreflang**: Si hay múltiples idiomas\n`;
  seo += `- **Image Alt Text**: Descriptivo y relevante en todas las imágenes\n`;
  seo += `- **Semantic HTML**: Usar tags apropiados (article, section, nav)\n`;
  
  return seo;
}

function getLocalizationRequirements(input: string): string {
  const lowerInput = input.toLowerCase();
  let i18n = "";
  
  // Detectar si menciona México o país específico
  if (lowerInput.includes("mexico") || lowerInput.includes("méxico") || 
      lowerInput.includes("hermosillo")) {
    i18n += `### Configuración para México\n`;
    i18n += `- **Moneda**: Pesos mexicanos (MXN)\n`;
    i18n += `  - Formato: $1,234.56 MXN\n`;
    i18n += `  - Usar \`Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })\`\n`;
    i18n += `- **Idioma**: Español (es-MX)\n`;
    i18n += `- **Formato de Fecha**: DD/MM/YYYY\n`;
    i18n += `- **Zona Horaria**: America/Hermosillo (sin horario de verano)\n`;
    i18n += `- **Métodos de Pago Locales**:\n`;
    i18n += `  - Tarjetas de crédito/débito mexicanas\n`;
    i18n += `  - OXXO (pagos en efectivo)\n`;
    i18n += `  - SPEI (transferencias bancarias)\n`;
    i18n += `  - Mercado Pago (opcional)\n`;
    i18n += `- **Dirección**: Formato postal mexicano\n`;
    i18n += `  - Calle, Número, Colonia, CP, Ciudad, Estado\n\n`;
  } else {
    i18n += `### Internacionalización (i18n)\n`;
    i18n += `- **Librería Recomendada**: next-intl o react-i18next\n`;
    i18n += `- **Idiomas soportados**: Detectar del navegador o selector manual\n`;
    i18n += `- **Formato de números**: \`Intl.NumberFormat\` según locale\n`;
    i18n += `- **Formato de fechas**: \`Intl.DateTimeFormat\` según locale\n`;
    i18n += `- **Moneda**: Detectar por geolocalización o selector\n`;
    i18n += `- **Dirección**: Adaptar campos según país (ZIP vs CP, State vs Provincia)\n\n`;
  }
  
  i18n += `### Implementación\n`;
  i18n += `- Archivos de traducción en \`/locales/[lang].json\`\n`;
  i18n += `- Hook personalizado \`useTranslation\` o similar\n`;
  i18n += `- Routing dinámico con prefijo de idioma: \`/es/...\` , \`/en/...\`\n`;
  i18n += `- Persistir preferencia de idioma en cookie o localStorage\n`;
  i18n += `- Meta tags \`hreflang\` para SEO multiidioma\n`;
  
  return i18n;
}

function getTestingRequirements(responseType: string): string {
  let testing = "";
  
  testing += `### Framework de Testing\n`;
  testing += `- **Unit Tests**: Vitest (compatible con Vite, rápido)\n`;
  testing += `  - Testing de funciones utilitarias\n`;
  testing += `  - Testing de hooks personalizados\n`;
  testing += `  - Testing de lógica de negocio\n`;
  testing += `- **Component Tests**: React Testing Library\n`;
  testing += `  - Testing de componentes en aislamiento\n`;
  testing += `  - User-centric testing (interacciones del usuario)\n`;
  testing += `  - Queries accesibles (getByRole, getByLabelText)\n`;
  testing += `- **Integration Tests**: Vitest + React Testing Library\n`;
  testing += `  - Testing de flujos completos\n`;
  testing += `  - Testing de integración con APIs\n`;
  testing += `  - Mock de servicios externos\n`;
  testing += `- **E2E Tests**: Playwright\n`;
  testing += `  - User journeys críticos (registro, compra, etc.)\n`;
  testing += `  - Cross-browser testing automático\n`;
  testing += `  - Screenshots y videos en caso de fallo\n\n`;
  
  testing += `### Cobertura Recomendada\n`;
  testing += `- **Mínimo**: 70% coverage para código crítico\n`;
  testing += `- **Ideal**: 85%+ cobertura total\n`;
  testing += `- Priorizar:\n`;
  testing += `  - Lógica de negocio compleja\n`;
  testing += `  - Formularios y validaciones\n`;
  testing += `  - API routes y endpoints\n`;
  testing += `  - componentes reutilizables\n`;
  testing += `  - User flows críticos (checkout, login)\n\n`;
  
  testing += `### Configuración\n`;
  testing += `\`\`\`json\n`;
  testing += `// package.json scripts\n`;
  testing += `{\n`;
  testing += `  "test": "vitest",\n`;
  testing += `  "test:ui": "vitest --ui",\n`;
  testing += `  "test:coverage": "vitest --coverage",\n`;
  testing += `  "test:e2e": "playwright test",\n`;
  testing += `  "test:e2e:ui": "playwright test --ui"\n`;
  testing += `}\n`;
  testing += `\`\`\`\n\n`;
  
  testing += `### Ejemplos de Tests\n`;
  testing += `\`\`\`typescript\n`;
  testing += `// Component test example\n`;
  testing += `import { render, screen } from '@testing-library/react'\n`;
  testing += `import userEvent from '@testing-library/user-event'\n`;
  testing += `import { Button } from '@/components/ui/button'\n\n`;
  testing += `test('button handles click', async () => {\n`;
  testing += `  const handleClick = vi.fn()\n`;
  testing += `  render(<Button onClick={handleClick}>Click me</Button>)\n`;
  testing += `  await userEvent.click(screen.getByRole('button'))\n`;
  testing += `  expect(handleClick).toHaveBeenCalledOnce()\n`;
  testing += `})\n`;
  testing += `\`\`\`\n`;
  
  return testing;
}

function getAccessibilityRequirements(): string {
  let a11y = "";
  
  a11y += `### WCAG 2.1 Level AA Compliance\n\n`;
  a11y += `#### Contraste de Color\n`;
  a11y += `- **Texto Normal**: Mínimo 4.5:1 contrast ratio\n`;
  a11y += `- **Texto Grande** (18px+ o 14px+ bold): Mínimo 3:1\n`;
  a11y += `- **Elementos UI**: Mínimo 3:1 para bordes, iconos, estados\n`;
  a11y += `- **Herramienta**: WebAIM Contrast Checker, Colour Contrast Analyser\n\n`;
  
  a11y += `#### Navegación por Teclado\n`;
  a11y += `- **Tab**: Navegación secuencial lógica\n`;
  a11y += `- **Shift+Tab**: Navegación inversa\n`;
  a11y += `- **Enter/Space**: Activar botones y links\n`;
  a11y += `- **Escape**: Cerrar modals y dropdowns\n`;
  a11y += `- **Arrow Keys**: Navegación en menus, tabs, carousels\n`;
  a11y += `- **Focus Visible**: Indicador claro en todos los elementos (ring-2 ring-offset-2)\n`;
  a11y += `- **Skip Links**: "Skip to main content" para screen readers\n\n`;
  
  a11y += `#### ARIA Labels y Semantics\n`;
  a11y += `- **Landmarks**: \`<nav>\`, \`<main>\`, \`<aside>\`, \`<footer>\` apropiados\n`;
  a11y += `- **aria-label**: Para iconos sin texto visible\n`;
  a11y += `- **aria-labelledby**: Para asociar labels complejos\n`;
  a11y += `- **aria-describedby**: Para descripciones adicionales\n`;
  a11y += `- **aria-live**: Para notificaciones dinámicas (toast, loading)\n`;
  a11y += `- **role**: Cuando HTML semántico no es suficiente\n`;
  a11y += `- **aria-expanded**: Para elementos colapsables\n`;
  a11y += `- **aria-hidden**: Para elementos decorativos\n\n`;
  
  a11y += `#### Formularios Accesibles\n`;
  a11y += `- **Labels**: Cada input debe tener \`<label htmlFor="id">\`\n`;
  a11y += `- **Error Messages**: Asociados con \`aria-describedby\`\n`;
  a11y += `- **Required Fields**: Indicador visual + \`required\` attribute\n`;
  a11y += `- **Autocomplete**: Atributos apropiados (name, email, tel)\n`;
  a11y += `- **Validation**: Mensajes claros y descriptivos\n`;
  a11y += `- **Focus Management**: Focus en primer error al submit\n\n`;
  
  a11y += `#### Screen Readers\n`;
  a11y += `- **Compatibilidad**: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)\n`;
  a11y += `- **Testing**: Probar navegación completa con screen reader\n`;
  a11y += `- **Alt Text**: Descriptivo y conciso en todas las imágenes\n`;
  a11y += `- **Decorativas**: \`alt=""\` o \`aria-hidden="true"\` para imágenes decorativas\n`;
  a11y += `- **Loading States**: Anunciar cambios con \`aria-live="polite"\`\n`;
  a11y += `- **Dynamic Content**: Asegurar que updates sean anunciados\n\n`;
  
  a11y += `#### Responsive & Mobile\n`;
  a11y += `- **Touch Targets**: Mínimo 44x44px (WCAG 2.1)\n`;
  a11y += `- **Viewport**: \`<meta name="viewport" content="width=device-width, initial-scale=1">\`\n`;
  a11y += `- **Zoom**: Permitir zoom hasta 200% sin scroll horizontal\n`;
  a11y += `- **Orientación**: Funcionar en portrait y landscape\n`;
  a11y += `- **Gestures**: Alternativas a gestures complejos (swipe, pinch)\n\n`;
  
  a11y += `#### Testing Tools\n`;
  a11y += `- **Lighthouse**: Auditoría automatizada (score > 95)\n`;
  a11y += `- **axe DevTools**: Extension de Chrome/Firefox\n`;
  a11y += `- **WAVE**: Web Accessibility Evaluation Tool\n`;
  a11y += `- **React DevTools**: Accessibility inspector\n`;
  a11y += `- **Manual Testing**: Navegación con teclado y screen reader\n`;
  
  return a11y;
}

/**
 * Infiere características clave basándose en el input del usuario y el tipo de proyecto
 */
function inferFeatures(input: string, responseType: string): string[] {
  const features: string[] = [];
  const lowerInput = input.toLowerCase();

  // Características explícitas mencionadas
  if (lowerInput.includes("drag") || lowerInput.includes("arrastrar")) {
    features.push("**Drag & Drop**: Funcionalidad de arrastre para reorganizar elementos");
  }
  if (lowerInput.includes("dark mode") || lowerInput.includes("modo oscuro")) {
    features.push("**Dark Mode**: Sistema de temas claro/oscuro persistente");
  }
  if (lowerInput.includes("auth") || lowerInput.includes("login") || lowerInput.includes("usuario")) {
    features.push("**Autenticación**: Sistema de login/registro seguro");
  }
  if (lowerInput.includes("search") || lowerInput.includes("buscar") || lowerInput.includes("búsqueda")) {
    features.push("**Búsqueda**: Filtrado y búsqueda en tiempo real");
  }
  if (lowerInput.includes("filter") || lowerInput.includes("filtro")) {
    features.push("**Filtros**: Sistema de filtrado multi-criterio");
  }
  if (lowerInput.includes("real-time") || lowerInput.includes("tiempo real")) {
    features.push("**Tiempo Real**: Actualizaciones en vivo sin refrescar");
  }
  if (lowerInput.includes("chart") || lowerInput.includes("gráfico") || lowerInput.includes("analytics")) {
    features.push("**Visualización de Datos**: Charts y gráficos interactivos");
  }
  if (lowerInput.includes("export") || lowerInput.includes("exportar")) {
    features.push("**Export**: Exportar datos a CSV/PDF/JSON");
  }
  if (lowerInput.includes("notification") || lowerInput.includes("notificación")) {
    features.push("**Notificaciones**: Sistema de notificaciones toast");
  }

  // Características según tipo de proyecto
  switch (responseType) {
    case "Dashboard":
      if (features.length === 0) {
        features.push("**Widgets**: Cards modulares con información clave");
        features.push("**Navegación lateral**: Sidebar con menú organizado");
        features.push("**Tablas de datos**: Grids con paginación y ordenamiento");
      }
      break;
    case "Landing Page":
      if (features.length === 0) {
        features.push("**Hero Section**: Sección principal impactante con CTA");
        features.push("**Features Grid**: Showcase de características principales");
        features.push("**Formulario de contacto**: Captura de leads funcional");
      }
      break;
    case "E-commerce":
      if (features.length === 0) {
        features.push("**Catálogo de productos**: Grid responsive con filtros");
        features.push("**Carrito de compras**: Gestión de items y checkout");
        features.push("**Páginas de detalle**: Vista completa de cada producto");
      }
      break;
    case "Component":
      if (features.length === 0) {
        features.push("**Props tipadas**: Interface TypeScript completa");
        features.push("**Variantes**: Múltiples estilos y tamaños configurables");
        features.push("**Composable**: Facilmente reutilizable y extensible");
      }
      break;
    case "Web Application":
      if (features.length === 0) {
        features.push("**CRUD completo**: Create, Read, Update, Delete operations");
        features.push("**Estado persistente**: LocalStorage o gestión de estado");
        features.push("**UI Responsiva**: Adaptada a todos los dispositivos");
      }
      break;
  }

  // Siempre añadir características base si no hay ninguna
  if (features.length === 0) {
    features.push("**Interfaz intuitiva**: UX clara y fácil de usar");
    features.push("**Responsive**: Funciona perfectamente en mobile y desktop");
    features.push("**Performance optimizado**: Carga rápida y fluida");
  }

  return features;
}

/**
 * Genera guías de diseño específicas según el estilo y tono
 */
function getDesignGuidelines(style: string, tone: string): string {
  let guidelines = "";

  // Estilo visual
  switch (style) {
    case "Modern":
      guidelines += `**Estilo Moderno**:\n`;
      guidelines += `- Layouts limpios con glassmorphism sutil (backdrop-blur)\n`;
      guidelines += `- Gradientes suaves (violet → blue, fuchsia → purple)\n`;
      guidelines += `- Micro-interacciones y hover effects refinados\n`;
      guidelines += `- Spacing generoso y tipografía clara (font-sans)\n`;
      guidelines += `- Bordes redondeados (rounded-xl) y sombras sutiles\n`;
      break;
    case "Professional":
      guidelines += `**Estilo Profesional**:\n`;
      guidelines += `- Paleta de colores sobria y confiable\n`;
      guidelines += `- Jerarquía visual clara con contraste apropiado\n`;
      guidelines += `- Grid layouts estructurados y alineación perfecta\n`;
      guidelines += `- Tipografía legible con line-height apropiado\n`;
      guidelines += `- Mínimas animaciones, enfoque en funcionalidad\n`;
      break;
    case "Creative":
      guidelines += `**Estilo Creativo**:\n`;
      guidelines += `- Colores vibrantes y combinaciones audaces\n`;
      guidelines += `- Layouts asimétricos e inesperados cuando sea apropiado\n`;
      guidelines += `- Animaciones llamativas y transiciones dinámicas\n`;
      guidelines += `- Uso creativo de shapes, patterns y texturas\n`;
      guidelines += `- Tipografía expresiva y jerarquía dramática\n`;
      break;
    case "Minimal":
      guidelines += `**Estilo Minimalista**:\n`;
      guidelines += `- Máximo espacio en blanco (white space)\n`;
      guidelines += `- Paleta monocromática o dual-tone\n`;
      guidelines += `- Elementos reducidos a su esencia funcional\n`;
      guidelines += `- Tipografía simple y legible (sin serifs)\n`;
      guidelines += `- Sin ornamentación innecesaria\n`;
      break;
    default:
      guidelines += `**Estilo Equilibrado**:\n`;
      guidelines += `- Diseño limpio y funcional\n`;
      guidelines += `- Uso consistente de spacing (p-4, gap-6)\n`;
      guidelines += `- Paleta de colores de design system\n`;
      guidelines += `- Interacciones intuitivas\n`;
  }

  guidelines += `\n`;

  // Tono comunicacional
  switch (tone) {
    case "Professional":
      guidelines += `**Tono**: Formal, claro, orientado a resultados. Textos concisos y directos.\n`;
      break;
    case "Friendly":
      guidelines += `**Tono**: Cercano, acogedor, conversacional. Lenguaje cálido y motivador.\n`;
      break;
    case "Technical":
      guidelines += `**Tono**: Preciso, detallado, orientado a desarrolladores. Terminología técnica apropiada.\n`;
      break;
    case "Casual":
      guidelines += `**Tono**: Relajado, accesible, sin formalidades. Lenguaje simple y directo.\n`;
      break;
    default:
      guidelines += `**Tono**: Equilibrado entre profesional y accesible.\n`;
  }

  return guidelines;
}

/**
 * Genera guías de arquitectura según el tipo de proyecto
 */
function getArchitectureGuidelines(responseType: string): string {
  let arch = "";

  switch (responseType) {
    case "Web Application":
      arch += `\`\`\`\n`;
      arch += `src/\n`;
      arch += `├── app/\n`;
      arch += `│   ├── layout.tsx          # Root layout con providers\n`;
      arch += `│   ├── page.tsx            # Homepage\n`;
      arch += `│   └── [feature]/\n`;
      arch += `│       ├── page.tsx        # Feature page (Server Component)\n`;
      arch += `│       └── components/     # Feature-specific components\n`;
      arch += `├── components/\n`;
      arch += `│   ├── ui/                 # Shadcn components\n`;
      arch += `│   └── [shared]/           # Shared app components\n`;
      arch += `├── lib/\n`;
      arch += `│   ├── utils.ts            # Helper functions\n`;
      arch += `│   └── hooks/              # Custom React hooks\n`;
      arch += `└── types/                  # TypeScript interfaces\n`;
      arch += `\`\`\`\n`;
      break;
    case "Dashboard":
      arch += `\`\`\`\n`;
      arch += `src/\n`;
      arch += `├── app/\n`;
      arch += `│   ├── dashboard/\n`;
      arch += `│   │   ├── layout.tsx      # Dashboard layout con sidebar\n`;
      arch += `│   │   ├── page.tsx        # Main dashboard\n`;
      arch += `│   │   ├── [section]/      # Dashboard sections\n`;
      arch += `│   │   └── components/     # Dashboard widgets\n`;
      arch += `├── components/\n`;
      arch += `│   ├── ui/                 # Base UI components\n`;
      arch += `│   ├── charts/             # Chart components\n`;
      arch += `│   └── layout/             # Layout components (Sidebar, Header)\n`;
      arch += `└── lib/\n`;
      arch += `    └── data/               # Data fetching logic\n`;
      arch += `\`\`\`\n`;
      break;
    case "Landing Page":
      arch += `\`\`\`\n`;
      arch += `src/\n`;
      arch += `├── app/\n`;
      arch += `│   ├── layout.tsx\n`;
      arch += `│   └── page.tsx            # Single-page layout\n`;
      arch += `├── components/\n`;
      arch += `│   ├── sections/\n`;
      arch += `│   │   ├── Hero.tsx\n`;
      arch += `│   │   ├── Features.tsx\n`;
      arch += `│   │   ├── Pricing.tsx\n`;
      arch += `│   │   └── Contact.tsx\n`;
      arch += `│   └── ui/                 # Reusable UI elements\n`;
      arch += `└── lib/\n`;
      arch += `    └── constants.ts        # Content data\n`;
      arch += `\`\`\`\n`;
      break;
    case "Component":
      arch += `Component único reutilizable en:\n`;
      arch += `\`\`\`\n`;
      arch += `src/components/[ComponentName].tsx\n`;
      arch += `\`\`\`\n`;
      arch += `Con exports: Component principal + variantes + tipos\n`;
      break;
    case "E-commerce":
      arch += `\`\`\`\n`;
      arch += `src/\n`;
      arch += `├── app/\n`;
      arch += `│   ├── products/\n`;
      arch += `│   │   ├── page.tsx        # Products grid\n`;
      arch += `│   │   └── [id]/page.tsx   # Product detail\n`;
      arch += `│   ├── cart/page.tsx\n`;
      arch += `│   └── checkout/page.tsx\n`;
      arch += `├── components/\n`;
      arch += `│   ├── product/            # Product components\n`;
      arch += `│   └── cart/               # Cart components\n`;
      arch += `└── lib/\n`;
      arch += `    ├── store.ts            # Cart state management\n`;
      arch += `    └── products.ts         # Product data/API\n`;
      arch += `\`\`\`\n`;
      break;
  }

  return arch;
}

/**
 * Requisitos técnicos detallados
 */
function getTechnicalRequirements(options: PromptOptions): string {
  let reqs = "";

  reqs += `### Componentes\n`;
  reqs += `- **Server Components** por defecto para contenido estático y SEO\n`;
  reqs += `- **Client Components** ("use client") solo cuando:\n`;
  reqs += `  - Se use useState, useEffect, event handlers\n`;
  reqs += `  - Se necesite interactividad del navegador\n`;
  reqs += `  - Se usen hooks de terceros\n\n`;

  reqs += `### Estado y Datos\n`;
  reqs += `- React hooks (useState, useReducer) para estado local\n`;
  reqs += `- useContext para estado compartido si es necesario\n`;
  reqs += `- LocalStorage para persistencia client-side\n`;
  reqs += `- Async/await en Server Components para data fetching\n\n`;

  reqs += `### Estilado (CRÍTICO)\n`;
  reqs += `- **Tailwind CSS únicamente** - clases utility\n`;
  reqs += `- Variables CSS para theming (--color-primary, etc.)\n`;
  reqs += `- Dark mode con clase .dark en root\n`;
  reqs += `- NO usar styled-jsx bajo ninguna circunstancia\n\n`;

  reqs += `### UX Requirements\n`;
  reqs += `- Loading states con skeleton loaders o spinners\n`;
  reqs += `- Error boundaries y manejo de errores elegante\n`;
  reqs += `- Empty states informativos\n`;
  reqs += `- Toast notifications (sonner) para feedback\n`;
  reqs += `- Formularios con validación en tiempo real\n\n`;

  reqs += `### Accesibilidad\n`;
  reqs += `- Landmarks semánticos HTML5 (nav, main, footer, section)\n`;
  reqs += `- Labels en todos los inputs (htmlFor + id)\n`;
  reqs += `- aria-label cuando sea necesario\n`;
  reqs += `- Navegación por teclado funcional (Tab, Enter, Escape)\n`;
  reqs += `- Contraste de color WCAG AA mínimo (4.5:1 texto normal)\n\n`;

  reqs += `### Performance\n`;
  reqs += `- Next.js Image component para imágenes optimizadas\n`;
  reqs += `- Lazy loading de componentes pesados (React.lazy + Suspense)\n`;
  reqs += `- Debounce en búsquedas y filtros\n`;
  reqs += `- Memoization con useMemo/useCallback cuando sea necesario\n`;

  return reqs;
}

/**
 * Notas contextuales según el uso
 */
function getContextualNotes(context: string): string {
  let notes = "";

  switch (context) {
    case "Business":
      notes += `Este proyecto es para uso empresarial, por lo que debe:\n`;
      notes += `- Proyectar profesionalismo y confianza\n`;
      notes += `- Ser compatible con navegadores corporativos\n`;
      notes += `- Incluir consideraciones de seguridad básicas\n`;
      notes += `- Manejar datos sensibles con cuidado\n`;
      notes += `- Ser escalable y mantenible a largo plazo\n`;
      break;
    case "Educational":
      notes += `Este proyecto es educativo, por lo que debe:\n`;
      notes += `- Ser intuitivo para usuarios de todos los niveles\n`;
      notes += `- Incluir tooltips y ayuda contextual\n`;
      notes += `- Tener un flujo de aprendizaje claro\n`;
      notes += `- Ser accesible para estudiantes con discapacidades\n`;
      notes += `- Funcionar bien en dispositivos de escuela (tablets, chromebooks)\n`;
      break;
    case "Personal":
      notes += `Este proyecto es personal, por lo que puede:\n`;
      notes += `- Ser más experimental y creativo\n`;
      notes += `- Enfocarse en la experiencia del usuario individual\n`;
      notes += `- Incluir preferencias personalizables\n`;
      notes += `- Priorizar la simplicidad sobre features complejas\n`;
      break;
    case "Entertainment":
      notes += `Este proyecto es de entretenimiento, por lo que debe:\n`;
      notes += `- Ser visualmente atractivo y engaging\n`;
      notes += `- Incluir animaciones llamativas y divertidas\n`;
      notes += `- Priorizar la experiencia de usuario sobre convenciones\n`;
      notes += `- Ser responsive en móviles (principal dispositivo)\n`;
      notes += `- Cargar rápido para mantener la atención\n`;
      break;
  }

  return notes;
}

// NEW: Flujos de usuario concretos
function getConcreteUserFlows(input: string, responseType: string): string {
  const lower = input.toLowerCase();
  if (responseType === "E-commerce" || lower.includes("e-commerce") || lower.includes("tienda") || lower.includes("checkout")) {
    return (
`1) Usuario navega catálogo → filtra por categoría → entra a producto → añade bicicleta al carrito → revisa carrito → checkout → pago con Stripe (MXN si es México) → confirmación → email de recibo → redirección a página de orden.\n
2) Usuario crea cuenta/inicia sesión → guarda direcciones → ve historial de órdenes → descarga factura.\n
3) Admin inicia sesión → crea/edita productos → gestiona stock y precios → ve reportes de ventas.`
    );
  }
  if (responseType === "Dashboard") {
    return (
`1) Usuario inicia sesión → ve KPIs en cards → filtra por rango de fechas → exporta CSV.\n
2) Usuario crea nuevo registro desde modal → validación con Zod → notificación de éxito → lista se refresca.\n
3) Usuario cambia tema dark/light → preferencia persiste en localStorage.`
    );
  }
  return (
`1) Usuario realiza CRUD completo: crea → edita → elimina elementos con validación y estados de carga/errores.\n
2) Usuario usa búsqueda con debounce → lista se actualiza al escribir.\n
3) Usuario comparte contenido si está autenticado (opcional) → otros pueden comentar y calificar.`
  );
}

// NEW: Dependencias priorizadas (texto para el prompt)
function getPreferredDependencies(input: string, responseType: string): string {
  const needsPayments = responseType === "E-commerce" || /stripe|checkout|pago/i.test(input);
  const lines: string[] = [];
  lines.push("# Base (instalar primero)");
  lines.push("- next react react-dom typescript");
  lines.push("- tailwindcss postcss autoprefixer");
  lines.push("- class-variance-authority tailwind-merge clsx");
  lines.push("- lucide-react framer-motion");
  lines.push("- zod react-hook-form");
  lines.push("- sonner @radix-ui/react-icons");
  lines.push("\n# Backend/DB");
  lines.push("- drizzle-orm pg postgres (o prisma @prisma/client)\n- zod rate-limiter-flexible");
  lines.push("\n# Auth");
  lines.push("- next-auth (o better-auth)\n- bcryptjs jose");
  if (needsPayments) {
    lines.push("\n# Pagos");
    lines.push("- stripe @stripe/stripe-js @stripe/stripe-js-types");
  }
  lines.push("\n# Testing");
  lines.push("- vitest @testing-library/react @testing-library/user-event playwright");

  return lines.join("\n");
}

// NEW: Criterios de éxito (checklist detallado)
function getSuccessCriteria(context?: string): string {
  let s = "";
  s += `### Funcionalidad\n`;
  s += `- [ ] Todas las features descritas funcionan correctamente\n`;
  s += `- [ ] Backend APIs responden adecuadamente (< 200ms promedio)\n`;
  s += `- [ ] Formularios con validación en tiempo real\n`;
  s += `- [ ] Estados de carga, error y vacío bien manejados\n`;
  s += `- [ ] Persistencia de datos funcional (DB o LocalStorage)\n\n`;
  s += `### Performance\n`;
  s += `- [ ] Lighthouse Performance Score > 90\n`;
  s += `- [ ] First Contentful Paint (FCP) < 1.5s\n`;
  s += `- [ ] Largest Contentful Paint (LCP) < 2.5s\n`;
  s += `- [ ] Cumulative Layout Shift (CLS) < 0.1\n`;
  s += `- [ ] Time to Interactive (TTI) < 3.5s\n`;
  s += `- [ ] Optimización de imágenes (Next.js Image, WebP, lazy loading)\n\n`;
  s += `### SEO\n`;
  s += `- [ ] Meta tags completos en todas las páginas\n`;
  s += `- [ ] Open Graph y Twitter Cards configurados\n`;
  s += `- [ ] Sitemap.xml generado automáticamente\n`;
  s += `- [ ] Robots.txt configurado\n`;
  s += `- [ ] Schema.org markup implementado\n`;
  s += `- [ ] URLs amigables y descriptivas\n\n`;
  s += `### Diseño y UX\n`;
  s += `- [ ] Diseño completamente responsive (320px - 2560px)\n`;
  s += `- [ ] Dark mode implementado y persistente\n`;
  s += `- [ ] Animaciones suaves y naturales (60fps)\n`;
  s += `- [ ] Micro-interacciones en botones y elementos interactivos\n`;
  s += `- [ ] Tipografía legible con line-height apropiado\n`;
  s += `- [ ] Contraste de color WCAG AA mínimo (4.5:1)\n\n`;
  s += `### Accesibilidad\n`;
  s += `- [ ] WCAG 2.1 nivel AA cumplido\n`;
  s += `- [ ] Navegación por teclado 100% funcional\n`;
  s += `- [ ] Screen readers compatibles (NVDA, JAWS, VoiceOver)\n`;
  s += `- [ ] Lighthouse Accessibility Score > 95\n`;
  s += `- [ ] Pruebas con herramientas (axe DevTools, WAVE)\n`;
  s += `- [ ] Focus visible en todos los elementos interactivos\n\n`;
  s += `### Código\n`;
  s += `- [ ] TypeScript sin errores (strict mode)\n`;
  s += `- [ ] Componentes reutilizables y bien organizados\n`;
  s += `- [ ] Comentarios en código complejo\n`;
  s += `- [ ] No warnings en consola del navegador\n`;
  s += `- [ ] Código limpio y mantenible\n\n`;
  s += `### Testing\n`;
  s += `- [ ] Tests unitarios para lógica crítica\n`;
  s += `- [ ] Tests de integración para flujos principales\n`;
  s += `- [ ] Cobertura de código > 70%\n`;
  s += `- [ ] Tests E2E para user journeys críticos\n\n`;
  s += `### Cross-Browser\n`;
  s += `- [ ] Chrome/Edge (últimas 2 versiones)\n`;
  s += `- [ ] Firefox (últimas 2 versiones)\n`;
  s += `- [ ] Safari (últimas 2 versiones)\n`;
  s += `- [ ] Mobile browsers (iOS Safari, Chrome Mobile)\n`;
  if (context === "Business" || context === "Educational") {
    s += `- [ ] IE11 polyfills si es requerido por stakeholders\n`;
  }
  return s;
}

// NEW: Restricciones y mejores prácticas
function getRestrictionsAndBestPractices(): string {
  let r = "";
  r += `### ❌ PROHIBIDO (Causarán errores):\n`;
  r += `- styled-jsx (incompatible con Next.js 15 y Server Components)\n`;
  r += `- alert()/confirm()/prompt() (rompen iframes)\n`;
  r += `- window.location.reload() (usar estado o router)\n`;
  r += `- window.open() para popups (usar Dialog)\n`;
  r += `- Imports de Node.js en Client Components (fs, path, etc.)\n`;
  r += `- Acceso a process.env sin NEXT_PUBLIC_ en cliente\n\n`;
  r += `### ✅ REQUERIDO (Mejores prácticas):\n`;
  r += `- Tailwind CSS exclusivamente para estilos\n`;
  r += `- Server Components por defecto; Client Components solo para interactividad\n`;
  r += `- Shadcn/UI para UI consistente\n`;
  r += `- Toasts con sonner; Dialogs de Shadcn para confirmaciones\n`;
  r += `- React Hook Form + Zod para formularios complejos\n`;
  r += `- Next.js Image para imágenes\n`;
  r += `- Tipos TypeScript para props y datos\n`;
  r += `- Loading/empty/error states consistentes\n`;
  return r;
}

// NEW: Pre-deployment checklist
function getPreDeploymentChecklist(): string {
  let p = "";
  p += `- [ ] Build de producción exitoso (npm run build)\n`;
  p += `- [ ] Variables de entorno documentadas en .env.example\n`;
  p += `- [ ] README.md actualizado con setup instructions\n`;
  p += `- [ ] Lighthouse audit en todos los scores > 90\n`;
  p += `- [ ] Links externos con rel=\"noopener noreferrer\"\n`;
  p += `- [ ] Favicon y meta images configurados\n`;
  p += `- [ ] Analytics configurado (Google/Vercel)\n`;
  p += `- [ ] Error tracking configurado (Sentry opcional)\n`;
  p += `- [ ] Assets comprimidos (WebP/SVG optimizados)\n`;
  p += `- [ ] CDN para assets estáticos si es necesario\n`;
  p += `- [ ] SSL/HTTPS en producción\n`;
  p += `- [ ] CORS y rate limiting correctamente configurados\n`;
  p += `- [ ] Logs y monitoring en producción\n`;
  return p;
}

/**
 * Mejora un prompt existente añadiendo detalles y estructura
 */
export function enhanceExistingPrompt(prompt: string): string {
  let enhanced = prompt;

  // Añadir sección de mejores prácticas si no existe
  if (!enhanced.includes("Best Practices") && !enhanced.includes("Mejores Prácticas")) {
    enhanced += `\n\n## 🚀 Mejoras Adicionales\n\n`;
    enhanced += `### Performance\n`;
    enhanced += `- Implementar code splitting para rutas\n`;
    enhanced += `- Usar Next.js Image para optimización automática\n`;
    enhanced += `- Añadir suspense boundaries para carga progresiva\n`;
    enhanced += `- Implementar caching inteligente\n\n`;
    
    enhanced += `### UX Enhancements\n`;
    enhanced += `- Añadir skeleton loaders durante carga inicial\n`;
    enhanced += `- Implementar optimistic updates en mutaciones\n`;
    enhanced += `- Agregar undo/redo donde sea apropiado\n`;
    enhanced += `- Incluir keyboard shortcuts para power users\n\n`;
    
    enhanced += `### Polish\n`;
    enhanced += `- Micro-interacciones en botones y cards (hover, active states)\n`;
    enhanced += `- Transiciones suaves entre estados (duration-200, ease-out)\n`;
    enhanced += `- Focus visible para navegación por teclado\n`;
    enhanced += `- Loading states consistentes en toda la app\n`;
  }

  // Añadir recordatorio de NO usar styled-jsx
  if (!enhanced.includes("styled-jsx")) {
    enhanced += `\n\n⚠️ **RECORDATORIO CRÍTICO**: NO usar styled-jsx. Solo Tailwind CSS.\n`;
  }

  // Añadir checklist si no existe
  if (!enhanced.includes("Checklist") && !enhanced.includes("✓")) {
    enhanced += `\n\n## ✅ Checklist Pre-Deploy\n\n`;
    enhanced += `- [ ] Todas las páginas son responsive (320px - 2560px)\n`;
    enhanced += `- [ ] Dark mode funciona correctamente\n`;
    enhanced += `- [ ] No hay errores de TypeScript\n`;
    enhanced += `- [ ] Loading y error states implementados\n`;
    enhanced += `- [ ] Accesibilidad básica verificada\n`;
    enhanced += `- [ ] Performance aceptable (Lighthouse score > 90)\n`;
  }

  return enhanced;
}