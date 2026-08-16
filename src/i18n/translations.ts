export type Language = 'en' | 'es' | 'pt';

export const translations = {
  en: {
    // Navbar
    navbar: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      team: 'Team',
      contact: 'Contact',
    },

    // Hero Section
    hero: {
      eyebrow: 'Property Management in Paraguay',
      title: {
        line1: 'How much could your property',
        line2: 'be generating right now?',
        line3: 'We take care of everything.',
      },
      subtitle: '100% comprehensive Airbnb and Booking.com management with proven results in +100 properties in Paraguay',
      cta: {
        primary: 'Get Started',
        secondary: 'Discover our services',
      },
      stats: {
        properties: {
          number: '+100',
          label: 'Properties managed',
        },
        support: {
          number: '24/7',
          label: 'Guest support',
        },
        experience: {
          number: '+9',
          label: 'Years of experience',
        },
      },
    },

    // Why Choose Us
    whyChooseUs: {
      label: 'Why Guaraní Capital?',
      title: {
        line1: 'Professional management',
        line2: 'applied to every property',
      },
      subtitle: 'We combine technology, rigorous processes and local knowledge to make your property generate real passive income.',
      pillars: {
        revenue: {
          title: 'Maximized Revenue',
          description: 'We run dynamic pricing strategies and occupancy management tuned to the Paraguayan market to maximize your income month after month.',
          stats: {
            value: '+40%',
            label: 'Average income vs. traditional management',
          },
        },
        management: {
          title: '100% Comprehensive Management',
          description: 'We take care of absolutely everything: 24/7 communication with guests, key delivery, professional cleaning, preventive maintenance and even furnishing if you need it.',
          stats: {
            value: '24/7',
            label: 'Real availability for your guests',
          },
        },
        support: {
          title: 'End-to-End Support',
          description: 'From initial setup to ongoing maintenance, we coordinate repairs, cleaning and any operational needs. You just receive payments monthly.',
          stats: {
            value: '0 hrs',
            label: 'Of your time required each month',
          },
        },
      },
    },

    // Property Portfolio
    portfolio: {
      label: 'Our Properties',
      title: {
        line1: 'Featured Properties',
        line2: 'Currently managed',
      },
      subtitle: 'Discover some of our premium properties generating exceptional returns on Airbnb',
      viewButton: 'View on Airbnb',
      profileButton: 'See all reviews on Airbnb',
      properties: [
        { name: 'Modern Luxury Apartment', details: '' },
        { name: 'Premium Downtown Suite', details: '' },
        { name: 'Elegant City View', details: '' },
        { name: '1505 Cumbres', details: 'Entire rental unit · ★ 4.8 · 1 bedroom · 1 bed · 1 bath' },
        { name: 'Palmanova 13G', details: 'Entire rental unit · ★ 4.8 · 1 bedroom · 1 bed · 1 bath' },
      ],
    },

    // Team
    team: {
      label: 'Founders',
      title: {
        line1: 'The people behind',
        line2: 'Guaraní Capital',
      },
      subtitle: 'Two founders, one clear objective: your property working at its full potential without you lifting a finger.',
      founders: [
        {
          role: 'Founder · Operations Director',
          bio: 'Designs the operational processes that sustain quality across every property. Leads the field team, cleaning standards, check-in flow, and the guest experience 24/7.',
        },
        {
          role: 'Co-Founder · Business Director',
          bio: 'Leads commercial strategy and the relationship with property owners. Responsible for portfolio growth and making sure every unit performs at its maximum.',
        },
      ],
      statement: {
        title: 'One team. One operation.',
        body: 'Clear processes, 24/7 support and a single point of contact. You just collect the income.',
      },
      who: {
        title: 'Who we are',
        subtitle: 'A reliable team that delivers excellence.',
      },
    },

    // Services
    services: {
      label: 'Our Services',
      title: {
        line1: 'Everything you need to earn',
        line2: 'in one place',
      },
      subtitle: 'From setup to ongoing management, we handle everything so your property generates passive income from day one.',
      items: {
        setup: {
          title: 'Your Property Ready to Earn in 7 Days',
          description: 'Professional photography, optimized listings, multi-platform setup, and revenue-focused pricing strategy from day one.',
          features: [
            'HD photo session',
            'Professional copywriting',
            'SEO optimization',
            'Channel configuration',
          ],
        },
        operations: {
          title: 'Zero Calls. Zero Problems. Only Payments.',
          description: '24/7 guest support, seamless check-in/check-out, professional cleaning after every stay, and complete maintenance. All handled by us.',
          features: [
            'Multilingual communication',
            'Key delivery',
            'Professional cleaning',
            'Preventive maintenance',
          ],
        },
        optimization: {
          title: 'Prices That Adjust Themselves. Revenue That Grows.',
          description: 'Dynamic pricing that maximizes your income based on real-time demand, seasonality and market analysis.',
          features: [
            'Dynamic pricing',
            'Market analysis',
            'Review management',
            'Monthly reports',
          ],
        },
        furnishing: {
          title: 'From Empty Apartment to Booking Success in 2 Weeks',
          description: 'We furnish and design your property with a style proven to maximize occupancy and command premium rates in the market.',
          features: [
            'Interior design',
            'Complete furniture',
            'Decoration',
            'Tech equipment',
          ],
        },
      },
      cta: {
        title: 'How much could your property be earning right now?',
        text: '100% comprehensive management that lets you maximize profits without the operational headaches. Prime properties in Asunción are generating exceptional returns.',
        button: 'Get your free revenue projection',
        buttonSubtext: 'Takes less than 2 minutes',
      },
    },

    // Footer
    footer: {
      tagline: 'Professional Airbnb-style property management in Paraguay. Local service, 24/7 support.',
      navigation: 'Navigation',
      servicesTitle: 'Services',
      contactTitle: 'Contact',
      links: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        contact: 'Contact',
        fullManagement: 'Full Management',
        digitalMarketing: 'Digital Marketing',
        support247: '24/7 Support',
        maintenance: 'Maintenance',
      },
      location: 'Cecilio Da Silva Lovera 1257 c, Asunción, Paraguay',
      hours: 'Mon - Fri: 9:00 - 18:00',
      developedBy: 'Developed by Bright Idea',
      legalLinks: {
        terms: 'Terms and Conditions',
        privacy: 'Privacy Policy',
      },
      rights: 'All rights reserved.',
    },

    // WhatsApp Button
    whatsapp: {
      message: 'Chat with us',
      ariaLabel: 'Contact via WhatsApp',
      waMessage: "Hello! I'd like information about property management in Paraguay",
    },

    // News
    news: {
      label: 'Market Insights',
      titleCountry: 'Paraguay',
      titleTagline: 'The Time is Now',
      readMore: 'Read full article',
      articles: [
        { description: "Standard & Poor's grants Paraguay its second Investment Grade, raising the rating to BBB- for its monetary credibility and inflation control." },
        { description: "The real estate sector represents 12% of Paraguay's GDP with returns of 5–8%, projecting US$ 1.9 billion in transactions for 2025." },
        { description: 'The rise of foreigners in Paraguay: what real estate solutions are they seeking? Investment opportunities in premium furnished apartments.' },
      ],
      advisory: {
        title: 'Real estate investment advisory',
        lead: 'We specialize in investment advisory in Asunción, with access to exclusive properties at the best price for Airbnb rental.',
        body: 'Paraguay is at a unique moment: investment grade status, growing demand for short-term stays and a real estate market in full expansion. Investing today means getting in before the rest.',
        ctaText: 'Write to us today and we will advise you on the best investment opportunities in Asunción.',
        button: 'Write to us today',
      },
    },

    // Contact
    contact: {
      locationLabel: 'Our office',
      address: 'Cecilio Da Silva Lovera 1257 c, Asunción, Paraguay',
      mapTitle: 'Guaraní Capital location on Google Maps',
    },

    // Form
    form: {
      selection: {
        title: 'Schedule a free consultation',
        subtitle: "Tell us about your case and we'll send you a simulation at no cost.",
        question: 'How can we help you?',
        investTitle: 'I want to invest',
        investDescription: "You're looking to buy an apartment for Airbnb-style rental",
        managementTitle: 'I want management',
        managementDescription: 'You already have an apartment and want us to manage it',
        footer: 'We respond in less than 24 hours',
        changeSelection: 'Change selection',
      },
      ui: {
        back: 'Back',
        continue: 'Continue',
        required: 'This field is required',
        invalid: 'Invalid value',
        select: 'Select...',
        hint: 'Press Enter ↵ to continue',
        emailInvalid: 'Please enter a valid email',
        phoneInvalid: 'Please enter a valid number',
      },
      investment: {
        fullName: { question: "What's your full name?", placeholder: 'Alex Smith' },
        email: { question: "What's your email?", placeholder: 'alex@example.com' },
        phone: { question: "What's your WhatsApp number?", subtitle: 'Include country code', placeholder: '+595 991 899050' },
        country: { question: 'Which country are you contacting us from?', placeholder: 'Paraguay' },
        budget: { question: "What's your approximate budget?", options: ['USD 30,000–50,000', 'USD 50,000–100,000', 'Over USD 100,000'] },
        timeframe: { question: 'When are you thinking of investing?', options: ['Immediately', 'Next 3 months', 'Just evaluating'] },
        rentalType: { question: 'What type of rental are you interested in?', subtitle: 'This field is optional', options: ['Short-term rental (Airbnb/Booking)', "I'm not sure"] },
      },
      management: {
        fullName: { question: "What's your full name?", placeholder: 'Alex Smith' },
        email: { question: "What's your email?", placeholder: 'alex@example.com' },
        phone: { question: "What's your WhatsApp number?", subtitle: 'Include country code', placeholder: '+595 991 899050' },
        zone: { question: 'What area or building is your property in?', placeholder: 'e.g: Villa Morra, Torre Champagne' },
        propertyType: { question: 'What type of property is it?', options: ['Studio', '1 bedroom', '2 bedrooms', 'Other'] },
        furnished: { question: 'Is it furnished?', options: ['Yes', 'No', 'Partially'] },
        published: { question: 'Is it already listed on Airbnb or Booking?', options: ['Yes', 'No'] },
        startDate: { question: 'When would you like to start?', options: ['Immediately', 'Just evaluating'] },
        photosLink: { question: 'Do you have photos of the property?', subtitle: 'You can share a link to Google Drive or similar (optional)', placeholder: 'https://drive.google.com/...' },
      },
      success: {
        title: "Done! We'll contact you soon",
        investLabel: 'investment',
        managementLabel: 'management',
        description: 'We received your {type} request. We respond in less than 24 hours.',
        back: 'Back to start',
      },
    },
  },

  es: {
    // Navbar
    navbar: {
      home: 'Inicio',
      about: 'Nosotros',
      services: 'Servicios',
      team: 'Equipo',
      contact: 'Contacto',
    },

    // Hero Section
    hero: {
      eyebrow: 'Gestión de propiedades en Paraguay',
      title: {
        line1: '¿Cuánto podría generar',
        line2: 'tu propiedad hoy?',
        line3: 'Nosotros lo manejamos todo.',
      },
      subtitle: 'Gestión 100% integral de Airbnb y Booking.com con resultados probados en +100 propiedades en Paraguay',
      cta: {
        primary: 'Empezá ahora',
        secondary: 'Conocé nuestros servicios',
      },
      stats: {
        properties: {
          number: '+100',
          label: 'Propiedades gestionadas',
        },
        support: {
          number: '24/7',
          label: 'Atención a huéspedes',
        },
        experience: {
          number: '+9',
          label: 'Años de experiencia',
        },
      },
    },

    // Why Choose Us
    whyChooseUs: {
      label: '¿Por qué Guaraní Capital?',
      title: {
        line1: 'Gestión profesional aplicada',
        line2: 'al mercado paraguayo',
      },
      subtitle: 'Combinamos tecnología, procesos rigurosos y conocimiento local para que tu propiedad genere ingresos pasivos reales.',
      pillars: {
        revenue: {
          title: 'Ingresos Maximizados',
          description: 'Aplicamos estrategias de precios dinámicos y gestión de ocupación ajustadas al mercado paraguayo para maximizar tus ingresos mes a mes.',
          stats: {
            value: '+40%',
            label: 'Ingresos promedio vs. gestión tradicional',
          },
        },
        management: {
          title: 'Gestión 100% Integral',
          description: 'Nos ocupamos de absolutamente todo: comunicación 24/7 con huéspedes, entrega de llaves, limpieza profesional, mantenimiento preventivo y hasta amoblado si lo necesitás.',
          stats: {
            value: '24/7',
            label: 'Disponibilidad real para tus huéspedes',
          },
        },
        support: {
          title: 'Soporte de Principio a Fin',
          description: 'Desde el setup inicial hasta el mantenimiento continuo, coordinamos reparaciones, limpieza y cualquier necesidad operativa. Vos solo recibís los pagos mensualmente.',
          stats: {
            value: '0 hrs',
            label: 'De tu tiempo requerido cada mes',
          },
        },
      },
    },

    // Property Portfolio
    portfolio: {
      label: 'Nuestras Propiedades',
      title: {
        line1: 'Propiedades Destacadas',
        line2: 'Actualmente gestionadas',
      },
      subtitle: 'Descubrí algunas de nuestras propiedades premium generando retornos excepcionales en Airbnb',
      viewButton: 'Ver en Airbnb',
      profileButton: 'Ver todas las reseñas en Airbnb',
      properties: [
        { name: 'Apartamento de Lujo Moderno', details: '' },
        { name: 'Suite Premium en el Centro', details: '' },
        { name: 'Vista Elegante a la Ciudad', details: '' },
        { name: '1505 Cumbres', details: 'Vivienda alquilada · ★ 4,8 · 1 dormitorio · 1 cama · 1 baño' },
        { name: 'Palmanova 13G', details: 'Vivienda alquilada · ★ 4,8 · 1 dormitorio · 1 cama · 1 baño' },
      ],
    },

    // Team
    team: {
      label: 'Fundadores',
      title: {
        line1: 'Las personas detrás',
        line2: 'de Guaraní Capital',
      },
      subtitle: 'Dos fundadores, un objetivo claro: que tu propiedad trabaje al máximo sin que tengas que hacer nada.',
      founders: [
        {
          role: 'Founder · Operations Director',
          bio: 'Diseña los procesos operativos que sostienen la calidad en cada propiedad. Lidera el equipo de campo, los estándares de limpieza, el check-in y la experiencia del huésped 24/7.',
        },
        {
          role: 'Co-Founder · Business Director',
          bio: 'Dirige la estrategia comercial y la relación con los propietarios. Responsable del crecimiento del portfolio y de asegurar que cada unidad rinda al máximo posible.',
        },
      ],
      statement: {
        title: 'Un equipo. Una operación.',
        body: 'Procesos claros, soporte 24/7 y un único punto de contacto. Vos solo cobrás.',
      },
      who: {
        title: 'Quiénes somos',
        subtitle: 'Un equipo confiable que brinda excelencia.',
      },
    },

    // Services
    services: {
      label: 'Nuestros Servicios',
      title: {
        line1: 'Todo lo que necesitás para ganar',
        line2: 'en un solo lugar',
      },
      subtitle: 'Desde el setup hasta la gestión continua, nos encargamos de todo para que tu propiedad genere ingresos pasivos desde el día uno.',
      items: {
        setup: {
          title: 'Tu Propiedad Lista para Generar en 7 Días',
          description: 'Fotografía profesional, anuncios optimizados, configuración multi-plataforma y estrategia de precios enfocada en ingresos desde el primer día.',
          features: [
            'Sesión fotográfica HD',
            'Copywriting profesional',
            'Optimización SEO',
            'Configuración de canales',
          ],
        },
        operations: {
          title: 'Cero Llamadas. Cero Problemas. Solo Pagos.',
          description: 'Atención 24/7 a huéspedes, check-in/check-out sin complicaciones, limpieza profesional tras cada estadía y mantenimiento completo. Todo gestionado por nosotros.',
          features: [
            'Comunicación multilingüe',
            'Entrega de llaves',
            'Limpieza profesional',
            'Mantenimiento preventivo',
          ],
        },
        optimization: {
          title: 'Precios que se Ajustan Solos. Ingresos que Crecen.',
          description: 'Precios dinámicos que maximizan tus ingresos basándose en demanda real, estacionalidad y análisis de mercado.',
          features: [
            'Dynamic pricing',
            'Análisis de mercado',
            'Gestión de reviews',
            'Reportes mensuales',
          ],
        },
        furnishing: {
          title: 'De Departamento Vacío a Éxito en Booking en 2 Semanas',
          description: 'Amoblamos y diseñamos tu propiedad con un estilo comprobado que maximiza ocupación y permite cobrar tarifas premium en el mercado.',
          features: [
            'Diseño de interiores',
            'Mobiliario completo',
            'Decoración',
            'Equipamiento tech',
          ],
        },
      },
      cta: {
        title: '¿Cuánto podría estar ganando tu propiedad ahora mismo?',
        text: 'Gestión 100% integral que te permite maximizar ganancias sin los dolores de cabeza operativos. Propiedades en zonas prime de Asunción están generando retornos excepcionales.',
        button: 'Obtené tu proyección de ingresos gratis',
        buttonSubtext: 'Toma menos de 2 minutos',
      },
    },

    // Footer
    footer: {
      tagline: 'Gestión profesional de propiedades tipo Airbnb en Paraguay. Servicio local, soporte 24/7.',
      navigation: 'Navegación',
      servicesTitle: 'Servicios',
      contactTitle: 'Contacto',
      links: {
        home: 'Inicio',
        about: 'Nosotros',
        services: 'Servicios',
        contact: 'Contacto',
        fullManagement: 'Gestión Completa',
        digitalMarketing: 'Marketing Digital',
        support247: 'Atención 24/7',
        maintenance: 'Mantenimiento',
      },
      location: 'Cecilio Da Silva Lovera 1257 c, Asunción, Paraguay',
      hours: 'Lun - Vie: 9:00 - 18:00',
      developedBy: 'Desarrollado por Bright Idea',
      legalLinks: {
        terms: 'Términos y Condiciones',
        privacy: 'Política de Privacidad',
      },
      rights: 'Todos los derechos reservados.',
    },

    // WhatsApp Button
    whatsapp: {
      message: 'Chateá con nosotros',
      ariaLabel: 'Contactar por WhatsApp',
      waMessage: '¡Hola! Me gustaría información sobre gestión de propiedades en Paraguay',
    },

    // News
    news: {
      label: 'Noticias del Mercado',
      titleCountry: 'Paraguay',
      titleTagline: 'El momento es ahora',
      readMore: 'Leer artículo completo',
      articles: [
        { description: "Standard & Poor's otorga a Paraguay su segundo Grado de Inversión, elevando la calificación a BBB- por su credibilidad monetaria y control de inflación." },
        { description: 'El sector inmobiliario representa el 12% del PIB paraguayo con retornos del 5-8%, proyectando US$ 1.900 millones en transacciones para 2025.' },
        { description: 'El auge de los extranjeros en Paraguay: ¿qué soluciones inmobiliarias buscan? Oportunidades de inversión en apartamentos premium amoblados.' },
      ],
      advisory: {
        title: 'Asesoría en inversión inmobiliaria',
        lead: 'Somos especialistas en asesoría para inversión en Asunción, con acceso a propiedades exclusivas y al mejor precio para renta en Airbnb.',
        body: 'Paraguay atraviesa un momento único: grado de inversión, demanda creciente de estadías temporarias y un mercado inmobiliario en plena expansión. Invertir hoy es entrar antes que el resto.',
        ctaText: 'Escribinos hoy y te asesoramos sobre las mejores oportunidades de inversión en Asunción.',
        button: 'Escribinos hoy',
      },
    },

    // Contact
    contact: {
      locationLabel: 'Nuestra oficina',
      address: 'Cecilio Da Silva Lovera 1257 c, Asunción, Paraguay',
      mapTitle: 'Ubicación de Guaraní Capital en Google Maps',
    },

    // Form
    form: {
      selection: {
        title: 'Agendá una consulta gratuita',
        subtitle: 'Contanos tu caso y te enviamos una simulación sin costo.',
        question: '¿Cómo podemos ayudarte?',
        investTitle: 'Quiero invertir',
        investDescription: 'Estás buscando comprar un departamento para rentar en Airbnb',
        managementTitle: 'Quiero gestión',
        managementDescription: 'Ya tenés un departamento y querés que lo gestionemos',
        footer: 'Respondemos en menos de 24 horas',
        changeSelection: 'Cambiar selección',
      },
      ui: {
        back: 'Atrás',
        continue: 'Continuar',
        required: 'Este campo es requerido',
        invalid: 'Valor inválido',
        select: 'Seleccionar...',
        hint: 'Presioná Enter ↵ para continuar',
        emailInvalid: 'Por favor ingresá un email válido',
        phoneInvalid: 'Por favor ingresá un número válido',
      },
      investment: {
        fullName: { question: '¿Cuál es tu nombre completo?', placeholder: 'Alex Smith' },
        email: { question: '¿Cuál es tu email?', placeholder: 'alex@example.com' },
        phone: { question: '¿Cuál es tu número de WhatsApp?', subtitle: 'Incluí el código de país', placeholder: '+595 991 899050' },
        country: { question: '¿Desde qué país nos contactás?', placeholder: 'Paraguay' },
        budget: { question: '¿Cuál es tu presupuesto aproximado?', options: ['USD 30.000–50.000', 'USD 50.000–100.000', 'Más de USD 100.000'] },
        timeframe: { question: '¿Cuándo estás pensando invertir?', options: ['De inmediato', 'Próximos 3 meses', 'Solo estoy evaluando'] },
        rentalType: { question: '¿Qué tipo de renta te interesa?', subtitle: 'Este campo es opcional', options: ['Renta corta (Airbnb/Booking)', 'No estoy seguro/a'] },
      },
      management: {
        fullName: { question: '¿Cuál es tu nombre completo?', placeholder: 'Alex Smith' },
        email: { question: '¿Cuál es tu email?', placeholder: 'alex@example.com' },
        phone: { question: '¿Cuál es tu número de WhatsApp?', subtitle: 'Incluí el código de país', placeholder: '+595 991 899050' },
        zone: { question: '¿En qué zona o edificio está tu propiedad?', placeholder: 'Ej: Villa Morra, Torre Champagne' },
        propertyType: { question: '¿Qué tipo de propiedad es?', options: ['Monoambiente', '1 dormitorio', '2 dormitorios', 'Otro'] },
        furnished: { question: '¿Está amoblado?', options: ['Sí', 'No', 'Parcialmente'] },
        published: { question: '¿Ya está publicado en Airbnb o Booking?', options: ['Sí', 'No'] },
        startDate: { question: '¿Desde cuándo te gustaría empezar?', options: ['Inmediato', 'Estoy evaluando'] },
        photosLink: { question: '¿Tenés fotos de la propiedad?', subtitle: 'Podés compartir un link a Google Drive o similar (opcional)', placeholder: 'https://drive.google.com/...' },
      },
      success: {
        title: '¡Listo! Te contactamos pronto',
        investLabel: 'inversión',
        managementLabel: 'administración',
        description: 'Recibimos tu solicitud de {type}. Respondemos en menos de 24 horas.',
        back: 'Volver al inicio',
      },
    },
  },

  pt: {
    // Navbar
    navbar: {
      home: 'Início',
      about: 'Sobre',
      services: 'Serviços',
      team: 'Equipe',
      contact: 'Contato',
    },

    // Hero Section
    hero: {
      eyebrow: 'Gestão de propriedades no Paraguai',
      title: {
        line1: 'Quanto poderia gerar',
        line2: 'sua propriedade hoje?',
        line3: 'Cuidamos de tudo.',
      },
      subtitle: 'Gestão 100% integral do Airbnb e Booking.com com resultados comprovados em +100 propriedades no Paraguai',
      cta: {
        primary: 'Comece agora',
        secondary: 'Conheça nossos serviços',
      },
      stats: {
        properties: {
          number: '+100',
          label: 'Propriedades gerenciadas',
        },
        support: {
          number: '24/7',
          label: 'Atendimento aos hóspedes',
        },
        experience: {
          number: '+9',
          label: 'Anos de experiência',
        },
      },
    },

    // Why Choose Us
    whyChooseUs: {
      label: 'Por que Guaraní Capital?',
      title: {
        line1: 'Gestão profissional aplicada',
        line2: 'ao mercado paraguaio',
      },
      subtitle: 'Combinamos tecnologia, processos rigorosos e conhecimento local para que sua propriedade gere renda passiva real.',
      pillars: {
        revenue: {
          title: 'Receita Maximizada',
          description: 'Aplicamos estratégias de precificação dinâmica e gestão de ocupação ajustadas ao mercado paraguaio para maximizar sua renda mês a mês.',
          stats: {
            value: '+40%',
            label: 'Receita média vs. gestão tradicional',
          },
        },
        management: {
          title: 'Gestão 100% Integral',
          description: 'Cuidamos de absolutamente tudo: comunicação 24/7 com hóspedes, entrega de chaves, limpeza profissional, manutenção preventiva e até mobiliário se você precisar.',
          stats: {
            value: '24/7',
            label: 'Disponibilidade real para seus hóspedes',
          },
        },
        support: {
          title: 'Suporte do Início ao Fim',
          description: 'Desde a configuração inicial até a manutenção contínua, coordenamos reparos, limpeza e qualquer necessidade operacional. Você só recebe os pagamentos mensalmente.',
          stats: {
            value: '0 hrs',
            label: 'Do seu tempo necessário a cada mês',
          },
        },
      },
    },

    // Property Portfolio
    portfolio: {
      label: 'Nossas Propriedades',
      title: {
        line1: 'Propriedades em Destaque',
        line2: 'Atualmente gerenciadas',
      },
      subtitle: 'Descubra algumas de nossas propriedades premium gerando retornos excepcionais no Airbnb',
      viewButton: 'Ver no Airbnb',
      profileButton: 'Ver todas as avaliações no Airbnb',
      properties: [
        { name: 'Apartamento de Luxo Moderno', details: '' },
        { name: 'Suíte Premium no Centro', details: '' },
        { name: 'Vista Elegante da Cidade', details: '' },
        { name: '1505 Cumbres', details: 'Locação inteira · ★ 4,8 · 1 quarto · 1 cama · 1 banheiro' },
        { name: 'Palmanova 13G', details: 'Locação inteira · ★ 4,8 · 1 quarto · 1 cama · 1 banheiro' },
      ],
    },

    // Team
    team: {
      label: 'Fundadores',
      title: {
        line1: 'As pessoas por trás',
        line2: 'da Guaraní Capital',
      },
      subtitle: 'Dois fundadores, um objetivo claro: sua propriedade trabalhando ao máximo sem que você precise fazer nada.',
      founders: [
        {
          role: 'Founder · Operations Director',
          bio: 'Desenha os processos operacionais que sustentam a qualidade em cada propriedade. Lidera a equipe de campo, os padrões de limpeza, check-in e a experiência do hóspede 24/7.',
        },
        {
          role: 'Co-Founder · Business Director',
          bio: 'Dirige a estratégia comercial e o relacionamento com os proprietários. Responsável pelo crescimento do portfólio e por garantir que cada unidade renda o máximo possível.',
        },
      ],
      statement: {
        title: 'Uma equipe. Uma operação.',
        body: 'Processos claros, suporte 24/7 e um único ponto de contato. Você só recebe a renda.',
      },
      who: {
        title: 'Quem somos',
        subtitle: 'Uma equipe confiável que entrega excelência.',
      },
    },

    // Services
    services: {
      label: 'Nossos Serviços',
      title: {
        line1: 'Tudo o que você precisa para ganhar',
        line2: 'em um só lugar',
      },
      subtitle: 'Desde a configuração até a gestão contínua, cuidamos de tudo para que sua propriedade gere renda passiva desde o primeiro dia.',
      items: {
        setup: {
          title: 'Sua Propriedade Pronta para Gerar em 7 Dias',
          description: 'Fotografia profissional, anúncios otimizados, configuração multiplataforma e estratégia de preços focada em receita desde o primeiro dia.',
          features: [
            'Sessão fotográfica HD',
            'Copywriting profissional',
            'Otimização SEO',
            'Configuração de canais',
          ],
        },
        operations: {
          title: 'Zero Ligações. Zero Problemas. Só Pagamentos.',
          description: 'Atendimento 24/7 aos hóspedes, check-in/check-out sem complicações, limpeza profissional após cada estadia e manutenção completa. Tudo gerenciado por nós.',
          features: [
            'Comunicação multilíngue',
            'Entrega de chaves',
            'Limpeza profissional',
            'Manutenção preventiva',
          ],
        },
        optimization: {
          title: 'Preços que se Ajustam Sozinhos. Receita que Cresce.',
          description: 'Preços dinâmicos que maximizam sua renda baseando-se em demanda real, sazonalidade e análise de mercado.',
          features: [
            'Preços dinâmicos',
            'Análise de mercado',
            'Gestão de avaliações',
            'Relatórios mensais',
          ],
        },
        furnishing: {
          title: 'De Apartamento Vazio a Sucesso no Booking em 2 Semanas',
          description: 'Mobiliamos e desenhamos sua propriedade com um estilo comprovado que maximiza a ocupação e permite cobrar tarifas premium no mercado.',
          features: [
            'Design de interiores',
            'Mobiliário completo',
            'Decoração',
            'Equipamento tecnológico',
          ],
        },
      },
      cta: {
        title: 'Quanto sua propriedade poderia estar ganhando agora mesmo?',
        text: 'Gestão 100% integral que permite maximizar lucros sem as dores de cabeça operacionais. Propriedades em áreas nobres de Assunção estão gerando retornos excepcionais.',
        button: 'Obtenha sua projeção de receita grátis',
        buttonSubtext: 'Leva menos de 2 minutos',
      },
    },

    // Footer
    footer: {
      tagline: 'Gestão profissional de propriedades tipo Airbnb no Paraguai. Serviço local, suporte 24/7.',
      navigation: 'Navegação',
      servicesTitle: 'Serviços',
      contactTitle: 'Contato',
      links: {
        home: 'Início',
        about: 'Sobre',
        services: 'Serviços',
        contact: 'Contato',
        fullManagement: 'Gestão Completa',
        digitalMarketing: 'Marketing Digital',
        support247: 'Atendimento 24/7',
        maintenance: 'Manutenção',
      },
      location: 'Cecilio Da Silva Lovera 1257 c, Asunción, Paraguay',
      hours: 'Seg - Sex: 9:00 - 18:00',
      developedBy: 'Desenvolvido por Bright Idea',
      legalLinks: {
        terms: 'Termos e Condições',
        privacy: 'Política de Privacidade',
      },
      rights: 'Todos os direitos reservados.',
    },

    // WhatsApp Button
    whatsapp: {
      message: 'Converse conosco',
      ariaLabel: 'Contatar via WhatsApp',
      waMessage: 'Olá! Gostaria de informações sobre gestão de propriedades no Paraguai',
    },

    // News
    news: {
      label: 'Notícias do Mercado',
      titleCountry: 'Paraguai',
      titleTagline: 'O Momento é Agora',
      readMore: 'Ler artigo completo',
      articles: [
        { description: "A Standard & Poor's concede ao Paraguai seu segundo Grau de Investimento, elevando a classificação para BBB- pela credibilidade monetária e controle de inflação." },
        { description: 'O setor imobiliário representa 12% do PIB paraguaio com retornos de 5-8%, projetando US$ 1,9 bilhão em transações para 2025.' },
        { description: 'A ascensão dos estrangeiros no Paraguai: quais soluções imobiliárias eles buscam? Oportunidades de investimento em apartamentos mobiliados premium.' },
      ],
      advisory: {
        title: 'Assessoria em investimento imobiliário',
        lead: 'Somos especialistas em assessoria para investimento em Assunção, com acesso a propriedades exclusivas e ao melhor preço para aluguel no Airbnb.',
        body: 'O Paraguai vive um momento único: grau de investimento, demanda crescente por estadias temporárias e um mercado imobiliário em plena expansão. Investir hoje é entrar antes dos demais.',
        ctaText: 'Fale conosco hoje e orientamos você sobre as melhores oportunidades de investimento em Assunção.',
        button: 'Fale conosco hoje',
      },
    },

    // Contact
    contact: {
      locationLabel: 'Nosso escritório',
      address: 'Cecilio Da Silva Lovera 1257 c, Asunción, Paraguay',
      mapTitle: 'Localização da Guaraní Capital no Google Maps',
    },

    // Form
    form: {
      selection: {
        title: 'Agende uma consulta gratuita',
        subtitle: 'Conte-nos sobre seu caso e enviaremos uma simulação sem custo.',
        question: 'Como podemos ajudá-lo?',
        investTitle: 'Quero investir',
        investDescription: 'Você está procurando comprar um apartamento para alugar no Airbnb',
        managementTitle: 'Quero gestão',
        managementDescription: 'Você já tem um apartamento e quer que o gerenciemos',
        footer: 'Respondemos em menos de 24 horas',
        changeSelection: 'Mudar seleção',
      },
      ui: {
        back: 'Voltar',
        continue: 'Continuar',
        required: 'Este campo é obrigatório',
        invalid: 'Valor inválido',
        select: 'Selecionar...',
        hint: 'Pressione Enter ↵ para continuar',
        emailInvalid: 'Por favor insira um email válido',
        phoneInvalid: 'Por favor insira um número válido',
      },
      investment: {
        fullName: { question: 'Qual é o seu nome completo?', placeholder: 'Alex Smith' },
        email: { question: 'Qual é o seu email?', placeholder: 'alex@example.com' },
        phone: { question: 'Qual é o seu número de WhatsApp?', subtitle: 'Inclua o código do país', placeholder: '+595 991 899050' },
        country: { question: 'De qual país você está nos contatando?', placeholder: 'Paraguai' },
        budget: { question: 'Qual é o seu orçamento aproximado?', options: ['USD 30.000–50.000', 'USD 50.000–100.000', 'Mais de USD 100.000'] },
        timeframe: { question: 'Quando você está pensando em investir?', options: ['Imediatamente', 'Próximos 3 meses', 'Só estou avaliando'] },
        rentalType: { question: 'Que tipo de aluguel te interessa?', subtitle: 'Este campo é opcional', options: ['Aluguel de curta temporada (Airbnb/Booking)', 'Não tenho certeza'] },
      },
      management: {
        fullName: { question: 'Qual é o seu nome completo?', placeholder: 'Alex Smith' },
        email: { question: 'Qual é o seu email?', placeholder: 'alex@example.com' },
        phone: { question: 'Qual é o seu número de WhatsApp?', subtitle: 'Inclua o código do país', placeholder: '+595 991 899050' },
        zone: { question: 'Em qual área ou prédio está sua propriedade?', placeholder: 'Ex: Villa Morra, Torre Champagne' },
        propertyType: { question: 'Que tipo de propriedade é?', options: ['Estúdio', '1 quarto', '2 quartos', 'Outro'] },
        furnished: { question: 'É mobiliado?', options: ['Sim', 'Não', 'Parcialmente'] },
        published: { question: 'Já está publicado no Airbnb ou Booking?', options: ['Sim', 'Não'] },
        startDate: { question: 'Quando você gostaria de começar?', options: ['Imediatamente', 'Estou avaliando'] },
        photosLink: { question: 'Você tem fotos da propriedade?', subtitle: 'Você pode compartilhar um link para o Google Drive ou similar (opcional)', placeholder: 'https://drive.google.com/...' },
      },
      success: {
        title: 'Pronto! Entraremos em contato em breve',
        investLabel: 'investimento',
        managementLabel: 'gestão',
        description: 'Recebemos sua solicitação de {type}. Respondemos em menos de 24 horas.',
        back: 'Voltar ao início',
      },
    },
  },
};
