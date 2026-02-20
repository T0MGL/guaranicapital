export type Language = 'en' | 'es' | 'pt' | 'de';

export const translations = {
  en: {
    // Navbar
    navbar: {
      home: 'Home',
      about: 'About',
      services: 'Services',
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
      subtitle: '100% comprehensive Airbnb and Booking.com management with European experience and proven results in +50 properties in Paraguay',
      cta: {
        primary: 'Get Started',
        secondary: 'Discover our services',
      },
      stats: {
        properties: {
          number: '+50',
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
        line1: 'European experience applied',
        line2: 'to the Paraguayan market',
      },
      subtitle: 'We combine technology, international experience and local knowledge to make your property generate real passive income.',
      pillars: {
        revenue: {
          title: 'Maximized Revenue',
          description: 'With almost 10 years of experience in competitive European markets, we master dynamic pricing strategies and occupancy management that maximize your income month after month.',
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
        { name: 'Modern Luxury Apartment' },
        { name: 'Premium Downtown Suite' },
        { name: 'Elegant City View' },
        { name: 'Stylish Urban Retreat' },
        { name: 'Executive Apartment' },
      ],
    },

    // Services
    services: {
      label: 'Our Services',
      title: {
        line1: 'Everything you need to earn',
        line2: 'in one place',
      },
      subtitle: 'From setup to ongoing management, we handle everything so your property generates passive income from day one.',
      brochure: 'Download complete brochure',
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
          description: '24/7 guest support, seamless check-in/check-out, professional cleaning after every stay, and complete maintenance—all handled by us.',
          features: [
            'Multilingual communication',
            'Key delivery',
            'Professional cleaning',
            'Preventive maintenance',
          ],
        },
        optimization: {
          title: 'Prices That Adjust Themselves. Revenue That Grows.',
          description: 'European-proven dynamic pricing that maximizes your income based on real-time demand, seasonality, and market analysis.',
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
      tagline: 'Professional Airbnb-style property management in Paraguay. European experience, local service.',
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
      location: 'Asunción, Paraguay',
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
      subtitle: 'Gestión 100% integral de Airbnb y Booking.com con experiencia europea y resultados probados en +50 propiedades en Paraguay',
      cta: {
        primary: 'Empezá ahora',
        secondary: 'Conocé nuestros servicios',
      },
      stats: {
        properties: {
          number: '+50',
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
        line1: 'Experiencia europea aplicada',
        line2: 'al mercado paraguayo',
      },
      subtitle: 'Combinamos tecnología, experiencia internacional y conocimiento local para que tu propiedad genere ingresos pasivos reales.',
      pillars: {
        revenue: {
          title: 'Ingresos Maximizados',
          description: 'Con casi 10 años de experiencia en mercados competitivos de Europa, dominamos las estrategias de precios dinámicos y gestión de ocupación que maximizan tus ingresos mes a mes.',
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
        { name: 'Apartamento de Lujo Moderno' },
        { name: 'Suite Premium en el Centro' },
        { name: 'Vista Elegante a la Ciudad' },
        { name: 'Retiro Urbano con Estilo' },
        { name: 'Apartamento Ejecutivo' },
      ],
    },

    // Services
    services: {
      label: 'Nuestros Servicios',
      title: {
        line1: 'Todo lo que necesitás para ganar',
        line2: 'en un solo lugar',
      },
      subtitle: 'Desde el setup hasta la gestión continua, nos encargamos de todo para que tu propiedad genere ingresos pasivos desde el día uno.',
      brochure: 'Descargar brochure completo',
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
          description: 'Atención 24/7 a huéspedes, check-in/check-out sin complicaciones, limpieza profesional tras cada estadía y mantenimiento completo—todo gestionado por nosotros.',
          features: [
            'Comunicación multilingüe',
            'Entrega de llaves',
            'Limpieza profesional',
            'Mantenimiento preventivo',
          ],
        },
        optimization: {
          title: 'Precios que se Ajustan Solos. Ingresos que Crecen.',
          description: 'Estrategia de precios dinámicos probada en Europa que maximiza tus ingresos basándose en demanda real, estacionalidad y análisis de mercado.',
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
      tagline: 'Gestión profesional de propiedades tipo Airbnb en Paraguay. Experiencia europea, servicio local.',
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
      location: 'Asunción, Paraguay',
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
      subtitle: 'Gestão 100% integral do Airbnb e Booking.com com experiência europeia e resultados comprovados em +50 propriedades no Paraguai',
      cta: {
        primary: 'Comece agora',
        secondary: 'Conheça nossos serviços',
      },
      stats: {
        properties: {
          number: '+50',
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
        line1: 'Experiência europeia aplicada',
        line2: 'ao mercado paraguaio',
      },
      subtitle: 'Combinamos tecnologia, experiência internacional e conhecimento local para que sua propriedade gere renda passiva real.',
      pillars: {
        revenue: {
          title: 'Receita Maximizada',
          description: 'Com quase 10 anos de experiência em mercados europeus competitivos, dominamos as estratégias de precificação dinâmica e gestão de ocupação que maximizam sua renda mês a mês.',
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
        { name: 'Apartamento de Luxo Moderno' },
        { name: 'Suíte Premium no Centro' },
        { name: 'Vista Elegante da Cidade' },
        { name: 'Refúgio Urbano com Estilo' },
        { name: 'Apartamento Executivo' },
      ],
    },

    // Services
    services: {
      label: 'Nossos Serviços',
      title: {
        line1: 'Tudo o que você precisa para ganhar',
        line2: 'em um só lugar',
      },
      subtitle: 'Desde a configuração até a gestão contínua, cuidamos de tudo para que sua propriedade gere renda passiva desde o primeiro dia.',
      brochure: 'Baixar brochura completa',
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
          description: 'Atendimento 24/7 aos hóspedes, check-in/check-out sem complicações, limpeza profissional após cada estadia e manutenção completa—tudo gerenciado por nós.',
          features: [
            'Comunicação multilíngue',
            'Entrega de chaves',
            'Limpeza profissional',
            'Manutenção preventiva',
          ],
        },
        optimization: {
          title: 'Preços que se Ajustam Sozinhos. Receita que Cresce.',
          description: 'Estratégia de preços dinâmicos comprovada na Europa que maximiza sua renda baseando-se em demanda real, sazonalidade e análise de mercado.',
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
      tagline: 'Gestão profissional de propriedades tipo Airbnb no Paraguai. Experiência europeia, serviço local.',
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
      location: 'Assunção, Paraguai',
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

  de: {
    // Navbar
    navbar: {
      home: 'Startseite',
      about: 'Über uns',
      services: 'Dienstleistungen',
      contact: 'Kontakt',
    },

    // Hero Section
    hero: {
      eyebrow: 'Immobilienverwaltung in Paraguay',
      title: {
        line1: 'Wie viel könnte Ihre Immobilie',
        line2: 'gerade jetzt generieren?',
        line3: 'Wir kümmern uns um alles.',
      },
      subtitle: '100% umfassende Airbnb- und Booking.com-Verwaltung mit europäischer Erfahrung und nachgewiesenen Ergebnissen in über 50 Immobilien in Paraguay',
      cta: {
        primary: 'Jetzt starten',
        secondary: 'Unsere Leistungen entdecken',
      },
      stats: {
        properties: {
          number: '+50',
          label: 'Verwaltete Immobilien',
        },
        support: {
          number: '24/7',
          label: 'Gästebetreuung',
        },
        experience: {
          number: '+9',
          label: 'Jahre Erfahrung',
        },
      },
    },

    // Why Choose Us
    whyChooseUs: {
      label: 'Warum Guaraní Capital?',
      title: {
        line1: 'Europäische Erfahrung angewendet',
        line2: 'auf den paraguayischen Markt',
      },
      subtitle: 'Wir kombinieren Technologie, internationale Erfahrung und lokales Wissen, damit Ihre Immobilie echtes passives Einkommen generiert.',
      pillars: {
        revenue: {
          title: 'Maximierte Einnahmen',
          description: 'Mit fast 10 Jahren Erfahrung in wettbewerbsintensiven europäischen Märkten beherrschen wir dynamische Preisstrategien und Belegungsmanagement, die Ihre Einnahmen Monat für Monat maximieren.',
          stats: {
            value: '+40%',
            label: 'Durchschnittliches Einkommen vs. traditionelle Verwaltung',
          },
        },
        management: {
          title: '100% Umfassende Verwaltung',
          description: 'Wir kümmern uns um absolut alles: 24/7-Kommunikation mit Gästen, Schlüsselübergabe, professionelle Reinigung, vorbeugende Wartung und sogar Möblierung, wenn Sie diese benötigen.',
          stats: {
            value: '24/7',
            label: 'Echte Verfügbarkeit für Ihre Gäste',
          },
        },
        support: {
          title: 'Rundum-Support',
          description: 'Von der ersten Einrichtung bis zur laufenden Wartung koordinieren wir Reparaturen, Reinigung und alle betrieblichen Bedürfnisse. Sie erhalten nur monatlich die Zahlungen.',
          stats: {
            value: '0 Std',
            label: 'Ihrer Zeit pro Monat erforderlich',
          },
        },
      },
    },

    // Property Portfolio
    portfolio: {
      label: 'Unsere Immobilien',
      title: {
        line1: 'Ausgewählte Immobilien',
        line2: 'Derzeit verwaltet',
      },
      subtitle: 'Entdecken Sie einige unserer Premium-Immobilien, die außergewöhnliche Renditen auf Airbnb erzielen',
      viewButton: 'Auf Airbnb ansehen',
      profileButton: 'Alle Bewertungen auf Airbnb ansehen',
      properties: [
        { name: 'Moderne Luxuswohnung' },
        { name: 'Premium Downtown Suite' },
        { name: 'Elegante Stadtaussicht' },
        { name: 'Stilvolles Stadtrefugium' },
        { name: 'Executive Apartment' },
      ],
    },

    // Services
    services: {
      label: 'Unsere Dienstleistungen',
      title: {
        line1: 'Alles, was Sie zum Verdienen brauchen',
        line2: 'an einem Ort',
      },
      subtitle: 'Von der Einrichtung bis zur laufenden Verwaltung kümmern wir uns um alles, damit Ihre Immobilie vom ersten Tag an passives Einkommen generiert.',
      brochure: 'Vollständige Broschüre herunterladen',
      items: {
        setup: {
          title: 'Ihre Immobilie bereit zum Verdienen in 7 Tagen',
          description: 'Professionelle Fotografie, optimierte Anzeigen, Multi-Plattform-Einrichtung und umsatzorientierte Preisstrategie vom ersten Tag an.',
          features: [
            'HD-Fotoshooting',
            'Professionelles Copywriting',
            'SEO-Optimierung',
            'Kanalkonfiguration',
          ],
        },
        operations: {
          title: 'Null Anrufe. Null Probleme. Nur Zahlungen.',
          description: '24/7-Gästebetreuung, nahtloser Check-in/Check-out, professionelle Reinigung nach jedem Aufenthalt und vollständige Wartung – alles von uns verwaltet.',
          features: [
            'Mehrsprachige Kommunikation',
            'Schlüsselübergabe',
            'Professionelle Reinigung',
            'Vorbeugende Wartung',
          ],
        },
        optimization: {
          title: 'Preise, die sich selbst anpassen. Einnahmen, die wachsen.',
          description: 'In Europa bewährte dynamische Preisgestaltung, die Ihre Einnahmen basierend auf Echtzeit-Nachfrage, Saisonalität und Marktanalyse maximiert.',
          features: [
            'Dynamische Preisgestaltung',
            'Marktanalyse',
            'Bewertungsmanagement',
            'Monatliche Berichte',
          ],
        },
        furnishing: {
          title: 'Von leerer Wohnung zum Booking-Erfolg in 2 Wochen',
          description: 'Wir möblieren und gestalten Ihre Immobilie mit einem bewährten Stil, der die Belegung maximiert und Premium-Preise ermöglicht.',
          features: [
            'Innenarchitektur',
            'Komplette Möblierung',
            'Dekoration',
            'Technische Ausstattung',
          ],
        },
      },
      cta: {
        title: 'Wie viel könnte Ihre Immobilie gerade jetzt verdienen?',
        text: '100% umfassende Verwaltung, die es Ihnen ermöglicht, Gewinne zu maximieren, ohne betriebliche Kopfschmerzen. Erstklassige Immobilien in Asunción erzielen außergewöhnliche Renditen.',
        button: 'Kostenlose Umsatzprognose erhalten',
        buttonSubtext: 'Dauert weniger als 2 Minuten',
      },
    },

    // Footer
    footer: {
      tagline: 'Professionelle Airbnb-ähnliche Immobilienverwaltung in Paraguay. Europäische Erfahrung, lokaler Service.',
      navigation: 'Navigation',
      servicesTitle: 'Dienstleistungen',
      contactTitle: 'Kontakt',
      links: {
        home: 'Startseite',
        about: 'Über uns',
        services: 'Dienstleistungen',
        contact: 'Kontakt',
        fullManagement: 'Vollständige Verwaltung',
        digitalMarketing: 'Digitales Marketing',
        support247: '24/7 Support',
        maintenance: 'Wartung',
      },
      location: 'Asunción, Paraguay',
      hours: 'Mo - Fr: 9:00 - 18:00',
      developedBy: 'Entwickelt von Bright Idea',
      legalLinks: {
        terms: 'Allgemeine Geschäftsbedingungen',
        privacy: 'Datenschutzrichtlinie',
      },
      rights: 'Alle Rechte vorbehalten.',
    },

    // WhatsApp Button
    whatsapp: {
      message: 'Chatten Sie mit uns',
      ariaLabel: 'Über WhatsApp kontaktieren',
      waMessage: 'Hallo! Ich hätte gerne Informationen über die Immobilienverwaltung in Paraguay',
    },

    // News
    news: {
      label: 'Marktnachrichten',
      titleCountry: 'Paraguay',
      titleTagline: 'Die Zeit ist Jetzt',
      readMore: 'Vollständigen Artikel lesen',
      articles: [
        { description: "Standard & Poor's verleiht Paraguay sein zweites Investment-Grade-Rating und hebt die Bewertung auf BBB- für seine monetäre Glaubwürdigkeit und Inflationskontrolle an." },
        { description: 'Der Immobiliensektor repräsentiert 12% des paraguayischen BIP mit Renditen von 5-8% und prognostiziert US$ 1,9 Milliarden an Transaktionen für 2025.' },
        { description: 'Der Aufstieg der Ausländer in Paraguay: Welche Immobilienlösungen suchen sie? Investitionsmöglichkeiten in Premium-Möbelwohnungen.' },
      ],
    },

    // Form
    form: {
      selection: {
        title: 'Kostenlose Beratung vereinbaren',
        subtitle: 'Erzählen Sie uns von Ihrem Fall und wir senden Ihnen kostenlos eine Simulation.',
        question: 'Wie können wir Ihnen helfen?',
        investTitle: 'Ich möchte investieren',
        investDescription: 'Sie suchen eine Wohnung zu kaufen, die über Airbnb vermietet werden soll',
        managementTitle: 'Ich möchte Verwaltung',
        managementDescription: 'Sie haben bereits eine Wohnung und möchten, dass wir sie verwalten',
        footer: 'Wir antworten in weniger als 24 Stunden',
        changeSelection: 'Auswahl ändern',
      },
      ui: {
        back: 'Zurück',
        continue: 'Weiter',
        required: 'Dieses Feld ist erforderlich',
        invalid: 'Ungültiger Wert',
        select: 'Auswählen...',
        hint: 'Drücken Sie Enter ↵ um fortzufahren',
        emailInvalid: 'Bitte geben Sie eine gültige E-Mail ein',
        phoneInvalid: 'Bitte geben Sie eine gültige Nummer ein',
      },
      investment: {
        fullName: { question: 'Wie lautet Ihr vollständiger Name?', placeholder: 'Alex Smith' },
        email: { question: 'Wie lautet Ihre E-Mail?', placeholder: 'alex@example.com' },
        phone: { question: 'Wie lautet Ihre WhatsApp-Nummer?', subtitle: 'Landesvorwahl angeben', placeholder: '+595 991 899050' },
        country: { question: 'Aus welchem Land kontaktieren Sie uns?', placeholder: 'Paraguay' },
        budget: { question: 'Was ist Ihr ungefähres Budget?', options: ['USD 30.000–50.000', 'USD 50.000–100.000', 'Über USD 100.000'] },
        timeframe: { question: 'Wann möchten Sie investieren?', options: ['Sofort', 'In den nächsten 3 Monaten', 'Ich evaluiere nur'] },
        rentalType: { question: 'Welche Art von Mieteinnahmen interessiert Sie?', subtitle: 'Dieses Feld ist optional', options: ['Kurzzeitmiete (Airbnb/Booking)', 'Ich bin unsicher'] },
      },
      management: {
        fullName: { question: 'Wie lautet Ihr vollständiger Name?', placeholder: 'Alex Smith' },
        email: { question: 'Wie lautet Ihre E-Mail?', placeholder: 'alex@example.com' },
        phone: { question: 'Wie lautet Ihre WhatsApp-Nummer?', subtitle: 'Landesvorwahl angeben', placeholder: '+595 991 899050' },
        zone: { question: 'In welchem Gebiet oder Gebäude befindet sich Ihre Immobilie?', placeholder: 'z.B: Villa Morra, Torre Champagne' },
        propertyType: { question: 'Um welchen Immobilientyp handelt es sich?', options: ['Studio', '1 Schlafzimmer', '2 Schlafzimmer', 'Sonstiges'] },
        furnished: { question: 'Ist sie möbliert?', options: ['Ja', 'Nein', 'Teilweise'] },
        published: { question: 'Ist sie bereits auf Airbnb oder Booking gelistet?', options: ['Ja', 'Nein'] },
        startDate: { question: 'Ab wann möchten Sie beginnen?', options: ['Sofort', 'Ich evaluiere noch'] },
        photosLink: { question: 'Haben Sie Fotos der Immobilie?', subtitle: 'Sie können einen Link zu Google Drive oder ähnlichem teilen (optional)', placeholder: 'https://drive.google.com/...' },
      },
      success: {
        title: 'Fertig! Wir melden uns bald',
        investLabel: 'Investition',
        managementLabel: 'Verwaltung',
        description: 'Wir haben Ihre {type}-Anfrage erhalten. Wir antworten in weniger als 24 Stunden.',
        back: 'Zurück zum Anfang',
      },
    },
  },
};
