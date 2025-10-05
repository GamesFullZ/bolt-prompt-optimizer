/**
 * SEO Content Generator System
 * Optimized for Google and YouTube positioning
 * Keywords: prompt, prompt enhancer, Bolt.new
 */

export interface SEOContent {
  title: string;
  url: string;
  meta_description: string;
  youtube_description?: string;
  headings: {
    h2: string[];
    h3: Record<string, string[]>;
  };
  content: {
    introduction: string;
    sections: Array<{
      heading: string;
      paragraphs: string[];
      list?: string[];
    }>;
    conclusion: string;
  };
  tags: {
    web_meta: string[];
    youtube: string[];
  };
  schema_org?: object;
}

/**
 * Base keywords and variations
 */
const KEYWORDS = {
  primary: ["prompt", "prompt enhancer", "Bolt.new"],
  secondary: [
    "optimizar prompts",
    "mejorar prompts",
    "mejorar prompts Bolt.new",
    "ejemplos de prompts IA",
    "generador de prompts",
    "prompt studio",
    "cómo crear prompts",
    "prompts efectivos",
    "tutorial prompts",
    "herramienta de prompts",
  ],
  longTail: [
    "cómo optimizar prompts para Bolt.new",
    "mejores prácticas para prompts de IA",
    "ejemplos de prompts efectivos para desarrollo",
    "tutorial completo de prompt engineering",
    "herramientas para mejorar prompts automáticamente",
    "prompt enhancer gratuito para desarrolladores",
  ],
};

/**
 * Generate SEO-optimized title variations
 */
export function generateTitles(topic: string, targetKeyword: string): string[] {
  const templates = [
    `${targetKeyword} ${topic} — Guía Completa 2025`,
    `Cómo ${topic} con ${targetKeyword} [Tutorial Paso a Paso]`,
    `${targetKeyword}: Todo lo que Necesitas Saber Sobre ${topic}`,
    `Mejora tu ${targetKeyword} — ${topic} Profesional`,
    `${topic} con ${targetKeyword} | Ejemplos y Mejores Prácticas`,
    `Domina ${targetKeyword} para ${topic} [Guía Definitiva]`,
  ];
  return templates;
}

/**
 * Generate meta description with natural keyword usage
 */
export function generateMetaDescription(
  targetKeyword: string,
  focus: string,
  charLimit: number = 160
): string {
  const descriptions = [
    `Aprende a usar ${targetKeyword} para ${focus}. Guía completa con ejemplos prácticos, mejores prácticas y herramientas gratuitas. ¡Empieza ahora!`,
    `Descubre cómo ${focus} con ${targetKeyword}. Tutorial paso a paso, tips profesionales y ejemplos reales. Optimiza tu workflow hoy.`,
    `${targetKeyword} profesional: ${focus} de forma efectiva. Incluye ejemplos, plantillas y técnicas avanzadas. Guía actualizada 2025.`,
    `Guía definitiva de ${targetKeyword} para ${focus}. Aprende técnicas probadas, evita errores comunes y mejora tus resultados inmediatamente.`,
  ];
  
  const selected = descriptions[Math.floor(Math.random() * descriptions.length)];
  return selected.length > charLimit ? selected.substring(0, charLimit - 3) + "..." : selected;
}

/**
 * Generate YouTube-optimized description
 */
export function generateYouTubeDescription(
  targetKeyword: string,
  focus: string,
  videoLength: string = "10 minutos"
): string {
  return `🚀 En este video aprenderás todo sobre ${targetKeyword} para ${focus}

📌 Temas que cubrimos:
✅ Qué es ${targetKeyword} y por qué es importante
✅ Cómo optimizar prompts para obtener mejores resultados
✅ Ejemplos prácticos y casos de uso reales
✅ Herramientas gratuitas recomendadas
✅ Mejores prácticas y tips profesionales

🎯 Perfecto para: Desarrolladores, creators, estudiantes y profesionales que quieren mejorar sus prompts de IA.

⏱️ Duración: ${videoLength}

🔗 Recursos mencionados:
• Prompt Studio para Bolt.new: [TU_URL]
• Guía completa de prompt engineering
• Ejemplos de prompts efectivos

📚 Artículos relacionados:
• Cómo crear prompts efectivos
• Tutorial de Bolt.new para principiantes
• Mejores herramientas de IA 2025

💬 ¿Qué temas te gustaría que cubriera en el próximo video? ¡Déjamelo en los comentarios!

🔔 Suscríbete para más contenido sobre IA, prompts y desarrollo

#${targetKeyword.replace(/\s+/g, "")} #PromptEngineering #BoltNew #IA #Desarrollo #Tutorial`;
}

/**
 * Generate SEO-friendly URL slug
 */
export function generateURLSlug(title: string, targetKeyword: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove multiple hyphens
    .substring(0, 60); // Limit length
  
  // Ensure keyword is in URL
  if (!slug.includes(targetKeyword.toLowerCase().replace(/\s+/g, "-"))) {
    return `${targetKeyword.toLowerCase().replace(/\s+/g, "-")}-${slug}`;
  }
  
  return slug;
}

/**
 * Generate H2/H3 headings with long-tail keywords
 */
export function generateHeadings(targetKeyword: string, topic: string) {
  const h2Headings = [
    `¿Qué es ${targetKeyword}?`,
    `Por qué Necesitas un ${targetKeyword}`,
    `Cómo Funciona ${targetKeyword} con Bolt.new`,
    `Mejores Prácticas para Optimizar Prompts`,
    `Ejemplos Prácticos de ${targetKeyword}`,
    `Herramientas Recomendadas para ${topic}`,
    `Errores Comunes al Usar ${targetKeyword}`,
    `Casos de Uso Reales y Resultados`,
  ];

  const h3Structure: Record<string, string[]> = {
    [`¿Qué es ${targetKeyword}?`]: [
      "Definición y Conceptos Básicos",
      "Diferencias con Otros Métodos",
      "Beneficios Principales",
    ],
    [`Cómo Funciona ${targetKeyword} con Bolt.new`]: [
      "Integración Paso a Paso",
      "Configuración Inicial",
      "Optimización Avanzada",
    ],
    "Mejores Prácticas para Optimizar Prompts": [
      "Estructura del Prompt Perfecto",
      "Uso de Contexto y Especificidad",
      "Técnicas de Refinamiento",
    ],
    [`Ejemplos Prácticos de ${targetKeyword}`]: [
      "Ejemplo 1: Desarrollo Web",
      "Ejemplo 2: Componentes UI",
      "Ejemplo 3: APIs y Backend",
    ],
    [`Herramientas Recomendadas para ${topic}`]: [
      "Prompt Studio — Editor Gratuito",
      "Extensiones y Plugins",
      "Recursos Adicionales",
    ],
  };

  return { h2: h2Headings, h3: h3Structure };
}

/**
 * Generate natural content paragraphs with keywords
 */
export function generateContentSections(
  targetKeyword: string,
  topic: string,
  headings: { h2: string[]; h3: Record<string, string[]> }
) {
  const sections = headings.h2.map((h2, index) => {
    let paragraphs: string[] = [];
    let list: string[] | undefined = undefined;

    // Generate contextual paragraphs based on heading
    if (h2.includes("¿Qué es")) {
      paragraphs = [
        `Un ${targetKeyword} es una herramienta esencial para cualquier desarrollador o profesional que trabaje con IA. En términos simples, te permite transformar ideas básicas en instrucciones claras y detalladas que las herramientas de IA pueden entender y ejecutar de manera efectiva.`,
        `Cuando usas Bolt.new para desarrollar aplicaciones, la calidad de tu prompt determina directamente la calidad del resultado final. Un ${targetKeyword} profesional optimiza automáticamente tus instrucciones, añadiendo contexto, estructura y especificidad que maximizan la precisión de la salida.`,
        `La diferencia entre un prompt básico y uno optimizado puede ser la diferencia entre obtener código funcional en el primer intento o tener que iterar múltiples veces. Por eso, dominar el uso de un ${targetKeyword} es fundamental para ${topic}.`,
      ];
    } else if (h2.includes("Cómo Funciona")) {
      paragraphs = [
        `La integración de ${targetKeyword} con Bolt.new es sorprendentemente simple pero poderosa. El sistema analiza tu input inicial, identifica las áreas que necesitan más detalle, y genera automáticamente un prompt estructurado que incluye todos los elementos clave.`,
        `El proceso funciona en tres etapas principales: (1) Análisis del input, donde el sistema identifica el tipo de proyecto y requisitos implícitos; (2) Enriquecimiento, donde se añaden especificaciones técnicas, mejores prácticas y contexto; y (3) Optimización, donde se refina el lenguaje para máxima claridad.`,
        `Para ${topic}, esto significa que puedes empezar con una idea simple como "una app de tareas" y obtener un prompt completo que especifica framework, componentes UI, gestión de estado, persistencia de datos y más.`,
      ];
    } else if (h2.includes("Mejores Prácticas")) {
      paragraphs = [
        `Optimizar prompts para Bolt.new requiere entender qué elementos producen los mejores resultados. La especificidad es clave: en lugar de decir "crear una app", especifica "crear una aplicación web React con TypeScript que incluya autenticación, dashboard y gestión de usuarios".`,
        `El contexto también importa. Menciona siempre el stack tecnológico preferido, el nivel de complejidad deseado, y cualquier restricción o requisito especial. Un ${targetKeyword} profesional te ayudará a incorporar estos elementos de forma natural.`,
      ];
      list = [
        "Sé específico sobre tecnologías y frameworks",
        "Define claramente la funcionalidad principal",
        "Menciona el estilo visual o UI deseado",
        "Incluye requisitos de datos y persistencia",
        "Especifica consideraciones de UX y accesibilidad",
        "Añade contexto sobre el usuario final",
      ];
    } else if (h2.includes("Ejemplos Prácticos")) {
      paragraphs = [
        `Veamos ejemplos reales de cómo un ${targetKeyword} transforma inputs básicos en prompts profesionales que producen excelentes resultados con Bolt.new.`,
        `**Antes:** "Hacer un blog"\n**Después con ${targetKeyword}:** "Crear una aplicación de blog moderna con Next.js 15 y TypeScript. Debe incluir: (1) Lista de posts con paginación y filtros por categoría, (2) Página individual de post con markdown rendering, (3) Sistema de comentarios, (4) Panel de administración para crear/editar posts, (5) Dark mode, (6) Diseño responsive con Tailwind CSS, (7) Almacenamiento en localStorage. Estilo: moderno y minimalista."`,
        `Como puedes ver, el prompt optimizado incluye detalles técnicos específicos, funcionalidades claras, y consideraciones de diseño que guían a Bolt.new para generar exactamente lo que necesitas.`,
      ];
    } else if (h2.includes("Herramientas")) {
      paragraphs = [
        `Existen varias herramientas excelentes para ${topic}, pero no todas son iguales. Aquí te presentamos las más efectivas y por qué las recomendamos.`,
        `**Prompt Studio** es nuestra recomendación principal para trabajar con Bolt.new. Es gratuita, funciona completamente en el navegador sin necesidad de registro, y ofrece personalización completa de estilo, tono y contexto. Incluye historial local, mejoras automáticas, y atajos de teclado para máxima productividad.`,
      ];
    } else if (h2.includes("Errores Comunes")) {
      paragraphs = [
        `Incluso con un ${targetKeyword}, hay errores que pueden afectar tus resultados. El más común es ser demasiado vago o demasiado ambicioso en un solo prompt.`,
        `Otro error frecuente es no especificar el stack tecnológico, dejando que Bolt.new adivine. Esto puede resultar en código con dependencias no deseadas o patrones que no coinciden con tu proyecto existente.`,
      ];
      list = [
        "❌ Ser demasiado vago: 'hacer una app'",
        "❌ No mencionar tecnologías específicas",
        "❌ Omitir requisitos de diseño o UX",
        "❌ No definir la estructura de datos",
        "❌ Ignorar casos edge o validaciones",
        "❌ No especificar responsive/mobile behavior",
      ];
    } else {
      // Generic content for other headings
      paragraphs = [
        `${h2} es un aspecto crucial cuando trabajas con ${targetKeyword} para ${topic}. Entender estos conceptos te ayudará a maximizar la efectividad de tus prompts y obtener mejores resultados con Bolt.new.`,
        `La clave está en aplicar consistentemente las mejores prácticas y aprender de cada iteración. Con el tiempo, desarrollarás una intuición para crear prompts que generen exactamente lo que necesitas en el primer intento.`,
      ];
    }

    return {
      heading: h2,
      paragraphs,
      list,
    };
  });

  return sections;
}

/**
 * Generate comprehensive tag sets for web and YouTube
 */
export function generateTags(targetKeyword: string, topic: string) {
  const webMetaTags = [
    targetKeyword.toLowerCase(),
    ...KEYWORDS.primary.map(k => k.toLowerCase()),
    ...KEYWORDS.secondary.slice(0, 8),
    topic.toLowerCase(),
    "tutorial",
    "guía",
    "2025",
    "gratis",
    "español",
  ];

  const youtubeTags = [
    targetKeyword,
    ...KEYWORDS.primary,
    "tutorial español",
    "guía completa",
    "paso a paso",
    "para principiantes",
    "desarrollo web",
    "IA",
    "inteligencia artificial",
    "herramientas gratis",
    "productividad",
    "programación",
    topic,
    "2025",
  ];

  return {
    web_meta: [...new Set(webMetaTags)].slice(0, 15), // Limit to 15 unique tags
    youtube: [...new Set(youtubeTags)].slice(0, 30), // YouTube allows more tags
  };
}

/**
 * Generate complete SEO content package
 */
export function generateSEOContent(config: {
  targetKeyword: string;
  topic: string;
  focus: string;
  contentType?: "article" | "tutorial" | "guide";
}): SEOContent {
  const { targetKeyword, topic, focus, contentType = "guide" } = config;

  const titles = generateTitles(topic, targetKeyword);
  const selectedTitle = titles[0]; // Use first title as primary

  const headings = generateHeadings(targetKeyword, topic);
  const sections = generateContentSections(targetKeyword, topic, headings);

  const introduction = `En esta guía completa, aprenderás todo sobre ${targetKeyword} y cómo usarlo efectivamente para ${focus}. Cubriremos desde los conceptos básicos hasta técnicas avanzadas, con ejemplos prácticos y mejores prácticas probadas. Si trabajas con Bolt.new o cualquier herramienta de IA para desarrollo, dominar el arte del prompting es esencial para obtener resultados profesionales. ¡Empecemos!`;

  const conclusion = `Dominar el uso de ${targetKeyword} para ${topic} es una inversión que te ahorrará tiempo y mejorará significativamente la calidad de tus proyectos. Con las técnicas y mejores prácticas que hemos cubierto, estás listo para crear prompts profesionales que generen exactamente lo que necesitas con Bolt.new. Recuerda: la práctica hace al maestro, así que no dudes en experimentar y refinar tu enfoque. ¿Listo para empezar? ¡Prueba Prompt Studio hoy y transforma tu workflow!`;

  return {
    title: selectedTitle,
    url: generateURLSlug(selectedTitle, targetKeyword),
    meta_description: generateMetaDescription(targetKeyword, focus),
    youtube_description: generateYouTubeDescription(targetKeyword, focus),
    headings,
    content: {
      introduction,
      sections,
      conclusion,
    },
    tags: generateTags(targetKeyword, topic),
    schema_org: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: selectedTitle,
      description: generateMetaDescription(targetKeyword, focus, 250),
      keywords: generateTags(targetKeyword, topic).web_meta.join(", "),
      author: {
        "@type": "Organization",
        name: "Prompt Studio",
      },
      publisher: {
        "@type": "Organization",
        name: "Prompt Studio",
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    },
  };
}

/**
 * Generate multiple content variations for different keywords
 */
export function generateContentVariations(): SEOContent[] {
  const variations: SEOContent[] = [];

  // Variation 1: Prompt Enhancer focus
  variations.push(
    generateSEOContent({
      targetKeyword: "prompt enhancer",
      topic: "optimización de prompts",
      focus: "mejorar tus prompts automáticamente",
      contentType: "guide",
    })
  );

  // Variation 2: Bolt.new integration
  variations.push(
    generateSEOContent({
      targetKeyword: "Bolt.new",
      topic: "desarrollo con IA",
      focus: "crear aplicaciones profesionales con Bolt.new",
      contentType: "tutorial",
    })
  );

  // Variation 3: General prompt optimization
  variations.push(
    generateSEOContent({
      targetKeyword: "optimizar prompts",
      topic: "prompt engineering",
      focus: "obtener mejores resultados con IA",
      contentType: "article",
    })
  );

  // Variation 4: Practical examples
  variations.push(
    generateSEOContent({
      targetKeyword: "ejemplos de prompts IA",
      topic: "casos de uso prácticos",
      focus: "aprender con ejemplos reales",
      contentType: "guide",
    })
  );

  return variations;
}

/**
 * Export content as JSON
 */
export function exportAsJSON(content: SEOContent | SEOContent[]): string {
  return JSON.stringify(content, null, 2);
}

/**
 * Get keyword density for content validation
 */
export function analyzeKeywordDensity(content: string, keyword: string): number {
  const words = content.toLowerCase().split(/\s+/);
  const keywordWords = keyword.toLowerCase().split(/\s+/);
  let count = 0;

  for (let i = 0; i <= words.length - keywordWords.length; i++) {
    const slice = words.slice(i, i + keywordWords.length).join(" ");
    if (slice === keyword.toLowerCase()) {
      count++;
    }
  }

  const density = (count / words.length) * 100;
  return Math.round(density * 100) / 100;
}