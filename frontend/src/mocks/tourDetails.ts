export interface TourDetailData {
  description: string;
  gallery: string[];
  itinerary: { time: string; title: string; description: string }[];
  included: string[];
  notIncluded: string[];
  meetingPoint: string;
  provider: { name: string; avatar: string; verified: boolean; description: string; tourCount: number };
  childPrice: number | null;
  maxGuests: number;
  cancellationPolicy: string;
  reviews: { id: string; name: string; avatar: string; rating: number; date: string; comment: string; verified: boolean }[];
  faq: { question: string; answer: string }[];
}

const avatars = [
  "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20friendly%20smiling%20young%20Mexican%20woman%20with%20dark%20hair%20wearing%20casual%20clothes%20against%20a%20soft%20neutral%20background%2C%20warm%20natural%20lighting%2C%20clean%20modern%20portrait%20photography%20style&width=100&height=100&seq=101&orientation=squarish",
  "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20friendly%20middle-aged%20Mexican%20man%20with%20short%20beard%20wearing%20a%20polo%20shirt%20against%20a%20soft%20neutral%20background%2C%20warm%20natural%20lighting%2C%20clean%20modern%20portrait%20photography%20style&width=100&height=100&seq=102&orientation=squarish",
  "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20cheerful%20young%20woman%20with%20light%20brown%20hair%20wearing%20sunglasses%20on%20her%20head%20against%20a%20soft%20neutral%20background%2C%20warm%20natural%20lighting%2C%20casual%20travel%20portrait%20style&width=100&height=100&seq=103&orientation=squarish",
  "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20friendly%20older%20Mexican%20woman%20with%20gray%20hair%20wearing%20elegant%20earrings%20against%20a%20soft%20neutral%20background%2C%20warm%20natural%20lighting%2C%20clean%20modern%20portrait%20photography%20style&width=100&height=100&seq=104&orientation=squarish",
  "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20sporty%20young%20man%20with%20short%20dark%20hair%20wearing%20a%20cap%20against%20a%20soft%20neutral%20background%2C%20warm%20natural%20lighting%2C%20casual%20outdoor%20portrait%20style&width=100&height=100&seq=105&orientation=squarish",
];

const tourDetails: Record<string, TourDetailData> = {
  "kayak-isla-espiritu-santo": {
    description: `Navega en kayak por las aguas cristalinas del Mar de Cortés y descubre la magia de la Isla Espíritu Santo, declarada Patrimonio de la Humanidad por la UNESCO. Este tour de aventura te llevará a explorar calas secretas, playas de arena blanca y formaciones rocosas únicas.

Durante el recorrido tendrás la oportunidad de observar de cerca la vida marina que habita estas aguas, desde peces tropicales coloridos hasta tortugas marinas. Nuestros guías certificados te acompañarán en todo momento, compartiendo conocimientos sobre la historia natural de la isla y su importancia ecológica.

El tour incluye un descanso en una playa remota donde podrás nadar, hacer snorkeling o simplemente relajarte bajo el sol de Baja. Es una experiencia perfecta para amantes de la naturaleza, fotógrafos y cualquiera que busque conectar con el paisaje costero mexicano de una manera auténtica y sostenible.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Group%20of%20kayakers%20paddling%20through%20crystal%20clear%20turquoise%20water%20along%20the%20rocky%20coastline%20of%20Espiritu%20Santo%20Island%20Baja%20California%20Sur%20Mexico%20with%20dramatic%20cliffs%20and%20white%20sand%20beach%20in%20the%20distance%2C%20adventure%20travel%20photography&width=800&height=500&seq=31&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Stunning%20aerial%20view%20of%20a%20hidden%20cove%20and%20white%20sand%20beach%20on%20Espiritu%20Santo%20Island%20in%20Baja%20California%20Sur%20Mexico%20surrounded%20by%20turquoise%20Sea%20of%20Cortez%20waters%20and%20desert%20mountains%2C%20tropical%20paradise%20landscape%20photography&width=800&height=500&seq=32&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Colorful%20tropical%20fish%20and%20coral%20reef%20underwater%20scene%20in%20the%20Sea%20of%20Cortez%20near%20La%20Paz%20Baja%20California%20Sur%20Mexico%20with%20clear%20blue%20water%20and%20sunlight%20rays%2C%20vibrant%20marine%20life%20photography&width=800&height=500&seq=33&orientation=landscape",
    ],
    itinerary: [
      { time: "08:00", title: "Recogida en hotel", description: "Te recogemos en tu hotel en La Paz o nos encontramos en el muelle turístico. Equipo de kayak y chaleco salvavidas incluido." },
      { time: "09:00", title: "Navegación hacia la isla", description: "Travesía en lancha de apoyo hasta el punto de inicio del recorrido en kayak. Briefing de seguridad y técnica de remado." },
      { time: "10:30", title: "Kayak y snorkel", description: "Exploración en kayak de calas y playas remotas. Parada para snorkeling en arrecife natural con equipo incluido." },
      { time: "13:00", title: "Almuerzo en la playa", description: "Descanso en playa privada con almuerzo gourmet de productos locales. Tiempo libre para nadar y relajarse." },
      { time: "15:00", title: "Regreso", description: "Navegación de regreso a La Paz. Traslado a tu hotel con fotos del día incluidas." },
    ],
    included: ["Transporte desde hotel", "Equipo de kayak y chaleco", "Snorkel y equipo", "Almuerzo gourmet", "Guía bilingüe certificado", "Agua y bebidas refrescantes", "Seguro de viajero"],
    notIncluded: ["Propinas", "Bebidas alcohólicas", "Toalla", "Protector solar biodegradable"],
    meetingPoint: "Muelle Turístico de La Paz, Avenida Allende s/n, centro. También disponible recogida en hoteles dentro de la ciudad.",
    provider: { name: "Baja Eco Adventures", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20an%20eco-tourism%20adventure%20company%20in%20Baja%20California%20Sur%20Mexico%20with%20ocean%20waves%20and%20kayak%20silhouette%2C%20turquoise%20and%20coral%20colors%20on%20white%20background%2C%20clean%20modern%20graphic%20design&width=120&height=120&seq=200&orientation=squarish", verified: true, description: "Operadores locales con más de 10 años de experiencia en tours de aventura en el Mar de Cortés. Certificados en primeros auxilios y rescate acuático.", tourCount: 8 },
    childPrice: 900,
    maxGuests: 12,
    cancellationPolicy: "Cancelación gratuita hasta 24 horas antes del tour. Cancelaciones con menos de 24 horas tienen un cargo del 50%.",
    reviews: [
      { id: "r1", name: "Mariana G.", avatar: avatars[0], rating: 5, date: "2026-04-12", comment: "Una experiencia increíble. Los guías fueron super atentos y conocedores. Vimos tortugas durante el snorkel. El almuerzo en la playa fue delicioso. Totalmente recomendado.", verified: true },
      { id: "r2", name: "John D.", avatar: avatars[1], rating: 5, date: "2026-03-28", comment: "Best kayaking experience ever! The water was crystal clear and the island is breathtaking. Guides spoke perfect English and were very professional. Worth every peso.", verified: true },
      { id: "r3", name: "Laura S.", avatar: avatars[2], rating: 4, date: "2026-02-15", comment: "Muy bonito tour. Un poco cansado si no estás acostumbrado a remar, pero los paisajes lo valen totalmente. Lleven protector solar.", verified: true },
      { id: "r4", name: "Roberto M.", avatar: avatars[4], rating: 5, date: "2026-01-20", comment: "Hice este tour con mi familia y fue el highlight del viaje. Los niños disfrutaron mucho el snorkel. Muy bien organizado.", verified: true },
      { id: "r5", name: "Emily W.", avatar: avatars[3], rating: 5, date: "2025-12-10", comment: "Magical day on the water. The guides shared so much about the local ecology. We even saw a manta ray! Highly recommend for nature lovers.", verified: true },
    ],
    faq: [
      { question: "¿Necesito experiencia previa en kayak?", answer: "No es necesario. Nuestros guías imparten una breve clase antes de salir y acompañan a principiantes en todo momento." },
      { question: "¿Qué pasa si no sé nadar?", answer: "No hay problema. Se usa chaleco salvavidas en todo momento y hay lancha de apoyo cerca durante toda la actividad." },
      { question: "¿El tour se cancela por mal clima?", answer: "Sí, por seguridad cancelamos si hay tormenta o vientos fuertes. Ofrecemos reembolso completo o reprogramación sin costo." },
    ],
  },

  "snorkel-lobos-marinos": {
    description: `Nada junto a los lobos marinos más amigables de México en este tour inolvidable en el Mar de Cortés. Desde La Paz, te llevamos a los lugares favoritos de estas criaturas juguetonas para una interacción respetuosa y segura.

Los cachorros de lobo marino son curiosos por naturaleza y a menudo se acercan a los snorkelers, girando y haciendo acrobacias bajo el agua. Es una experiencia emocionante que recuerda a nadar con delfines salvajes, pero con la personalidad única y traviesa de los lobos marinos.

Además de los lobos marinos, estas aguas albergan una gran diversidad de vida marina: mantarrayas, tortugas, miles de peces tropicales y, en temporada, tiburones ballena. Nuestros guías marinos certificados garantizan que la interacción sea segura tanto para los humanos como para los animales.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Playful%20sea%20lion%20pup%20swimming%20very%20close%20to%20a%20snorkeler%20in%20crystal%20clear%20turquoise%20water%20in%20the%20Sea%20of%20Cortez%20Baja%20California%20Sur%20Mexico%2C%20underwater%20wildlife%20interaction%20photography%20with%20sunlight%20rays&width=800&height=500&seq=34&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Group%20of%20snorkelers%20on%20a%20small%20boat%20in%20the%20Sea%20of%20Cortez%20near%20La%20Paz%20Baja%20California%20Sur%20Mexico%20with%20blue%20ocean%20water%20and%20rocky%20island%20in%20the%20background%2C%20adventure%20travel%20photography&width=800&height=500&seq=35&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Underwater%20scene%20with%20sea%20lion%20doing%20acrobatic%20flip%20in%20the%20Sea%20of%20Cortez%20Baja%20California%20Sur%20Mexico%20with%20bubbles%20and%20turquoise%20water%2C%20dynamic%20wildlife%20photography&width=800&height=500&seq=36&orientation=landscape",
    ],
    itinerary: [
      { time: "08:30", title: "Salida desde el muelle", description: "Embarque en lancha rápida equipada con toldo, equipo de snorkel y chalecos. Briefing sobre interacción con fauna marina." },
      { time: "09:15", title: "Llegada a la colonia", description: "Observación de la colonia de lobos marinos desde la lancha. Identificación de cachorros curiosos y zonas de interacción." },
      { time: "09:45", title: "Snorkel con lobos marinos", description: "Sesión de snorkel guiado de 45 minutos. Los lobos marinos nadan alrededor de los participantes de forma natural y juguetona." },
      { time: "11:00", title: "Exploración de arrecife", description: "Segunda parada en arrecife cercano para observar peces tropicales, rayas y posibles tortugas." },
      { time: "12:30", title: "Regreso a La Paz", description: "Travesía de regreso con snacks a bordo. Compartimos fotos del día y recomendaciones de la ciudad." },
    ],
    included: ["Lancha rápida con toldo", "Equipo de snorkel completo", "Guía marino certificado", "Chaleco salvavidas", "Snacks y agua", "Toalla", "Seguro de actividad"],
    notIncluded: ["Propinas", "Fotografía profesional", "Traslado al muelle", "Protector solar"],
    meetingPoint: "Muelle Turístico de La Paz, módulo 3. Favor de llegar 15 minutos antes de la hora de salida.",
    provider: { name: "Mar de Cortez Diving", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20marine%20diving%20and%20snorkeling%20tour%20company%20in%20Baja%20California%20Sur%20with%20sea%20lion%20silhouette%20and%20ocean%20waves%2C%20blue%20and%20turquoise%20colors%20on%20white%20background%2C%20clean%20modern%20graphic%20design&width=120&height=120&seq=201&orientation=squarish", verified: true, description: "Especialistas en ecoturismo marino con más de 15 años explorando el acuario del mundo. Guías certificados en biología marina.", tourCount: 6 },
    childPrice: 750,
    maxGuests: 10,
    cancellationPolicy: "Cancelación gratuita hasta 24 horas antes. Reembolso completo en caso de mal clima por parte del operador.",
    reviews: [
      { id: "r1", name: "Sophie L.", avatar: avatars[2], rating: 5, date: "2026-04-05", comment: "This was the highlight of our entire Mexico trip! The sea lions were so playful, one even nibbled my fin. The guides were incredibly knowledgeable about marine biology.", verified: true },
      { id: "r2", name: "Carlos R.", avatar: avatars[4], rating: 5, date: "2026-03-18", comment: "Increíble. Mis hijos no paraban de hablar de los lobos marinos durante días. Muy seguro y bien organizado. Los guías son unos cracks.", verified: true },
      { id: "r3", name: "Anna K.", avatar: avatars[3], rating: 4, date: "2026-02-22", comment: "Amazing experience but the water was a bit cold in February. They provided wetsuits though. The sea lions made up for everything!", verified: true },
      { id: "r4", name: "David H.", avatar: avatars[1], rating: 5, date: "2026-01-10", comment: "As a wildlife photographer, this was a dream come true. The guides knew exactly where to position us for the best shots. Highly professional.", verified: true },
    ],
    faq: [
      { question: "¿Es seguro nadar con lobos marinos?", answer: "Sí, completamente seguro. Son animales curiosos y juguetones. Nuestros guías supervisan la interacción para garantizar el respeto a los animales." },
      { question: "¿En qué época se ven más lobos marinos?", answer: "Se pueden observar durante todo el año. La temporada de cachorros es de junio a agosto, cuando son más activos y juguetones." },
      { question: "¿Incluyen traje de neopreno?", answer: "Sí, proporcionamos shorty de neopreno de 3mm durante los meses de invierno (noviembre a marzo) sin costo adicional." },
    ],
  },

  "tour-gastronomico-tacos-mezcal": {
    description: `Descubre los sabores auténticos de Baja California Sur en este recorrido gastronómico por Los Cabos. Desde tacos de pescado estilo Ensenada hasta mezcal artesanal de Oaxaca, cada parada cuenta una historia de tradición y pasión culinaria.

Recorreremos los mercados locales, taquerías escondidas y restaurantes de chefs reconocidos que han transformado la cocina de Baja en una de las más importantes de México. Aprenderás sobre la historia del mezcal, desde la cosecha del agave hasta la destilación en palenques tradicionales.

Este tour es una celebración de los ingredientes locales: pescado fresco del día, mariscos de la laguna, tortillas hechas a mano y salsas que han pasado de generación en generación. Ideal para foodies, parejas y cualquiera que quiera entender México a través de su comida.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Colorful%20Mexican%20street%20taco%20stand%20with%20fresh%20fish%20tacos%20lime%20and%20salsa%20in%20Los%20Cabos%20Baja%20California%20Sur%2C%20vibrant%20food%20market%20atmosphere%20with%20warm%20lighting%2C%20authentic%20Mexican%20street%20food%20photography&width=800&height=500&seq=37&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Artisanal%20mezcal%20tasting%20experience%20with%20traditional%20clay%20cups%20and%20beautiful%20glass%20bottles%20on%20a%20rustic%20wooden%20table%20in%20Baja%20California%20Sur%20Mexico%2C%20warm%20amber%20lighting%2C%20gourmet%20food%20photography&width=800&height=500&seq=38&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Fresh%20Mexican%20seafood%20ceviche%20with%20shrimp%20fish%20and%20octopus%20served%20in%20a%20beautiful%20bowl%20with%20lime%20and%20cilantro%20in%20an%20upscale%20restaurant%20in%20Los%20Cabos%20Baja%20California%20Sur%2C%20gourmet%20food%20photography%20with%20natural%20lighting&width=800&height=500&seq=39&orientation=landscape",
    ],
    itinerary: [
      { time: "17:00", title: "Punto de encuentro", description: "Nos reunimos en la plaza principal de San José del Cabo. Recibimos una bienvenida con agua fresca de jamaica y una breve introducción a la gastronomía de Baja." },
      { time: "17:30", title: "Mercado municipal", description: "Recorrido por el mercado local para conocer ingredientes frescos: pescados, mariscos, chiles y hierbas. Degustación de tacos de carnitas." },
      { time: "18:30", title: "Taquería de pescado", description: "Visita a una taquería emblemática por sus tacos de pescado estilo Baja. Aprendemos la técnica de la tempura y probamos diferentes salsas." },
      { time: "19:30", title: "Cata de mezcal", description: "En una cantina histórica, un maestro mezcalero nos guía por una cata de 5 mezcales artesanales. Maridaje con insectos gourmet y quesos locales." },
      { time: "20:30", title: "Postre y cierre", description: "Caminata por la galería district. Postre de chocolate de Guerrero con café de Chiapas en una cafetería local." },
    ],
    included: ["5 paradas gastronómicas", "Todas las degustaciones", "Cata de 5 mezcales", "Guía gastronómico", "Recetario digital", "Agua durante el tour"],
    notIncluded: ["Propinas", "Bebidas extras", "Souvenirs", "Transporte al punto de encuentro"],
    meetingPoint: "Plaza Mijares, centro histórico de San José del Cabo, frente a la iglesia misional.",
    provider: { name: "Sabores de Baja", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20gourmet%20food%20tour%20company%20in%20Baja%20California%20Sur%20with%20taco%20silhouette%20and%20chili%20pepper%2C%20warm%20orange%20and%20green%20colors%20on%20white%20background%2C%20clean%20modern%20graphic%20design&width=120&height=120&seq=202&orientation=squarish", verified: true, description: "Food tours y experiencias gastronómicas guiadas por chefs locales y sommeliers. Ganadores del premio a mejor tour gastronómico 2024.", tourCount: 4 },
    childPrice: null,
    maxGuests: 10,
    cancellationPolicy: "Cancelación gratuita hasta 48 horas antes. Tours gastronómicos requieren reserva con anticipación debido a la disponibilidad de los restaurantes.",
    reviews: [
      { id: "r1", name: "Felipe N.", avatar: avatars[1], rating: 5, date: "2026-04-08", comment: "El mejor tour gastronómico que he tomado en México. El guía era chef y conocía cada ingrediente. El mezcal... inolvidable.", verified: true },
      { id: "r2", name: "Jessica T.", avatar: avatars[2], rating: 5, date: "2026-03-20", comment: "As a chef myself, I was blown away by the quality and authenticity. The fish tacos were life-changing. The mezcal tasting was educational and fun.", verified: true },
      { id: "r3", name: "Marta D.", avatar: avatars[0], rating: 4, date: "2026-02-14", comment: "Muy rico todo. Un poco caminata para mi madre pero valió la pena. El mercado fue mi parte favorita.", verified: true },
      { id: "r4", name: "Tom B.", avatar: avatars[4], rating: 5, date: "2026-01-05", comment: "This tour made me fall in love with Mexican cuisine all over again. Our guide Maria was passionate and hilarious. Do not miss this!", verified: true },
    ],
    faq: [
      { question: "¿Pueden adaptar el menú para vegetarianos?", answer: "Sí, ofrecemos opciones vegetarianas en todas las paradas. Por favor indícalo al hacer la reserva." },
      { question: "¿Es adecuado para niños?", answer: "El tour está diseñado para adultos por la cata de mezcal. Para familias con niños ofrecemos una versión sin alcohol bajo petición." },
      { question: "¿Cuánto caminamos?", answer: "Aproximadamente 2.5 km en total, a paso tranquilo con paradas frecuentes para sentarse y comer." },
    ],
  },

  "recorrido-historico-la-paz": {
    description: `Explora los secretos de La Paz, la capital del estado de Baja California Sur, en este recorrido a pie por su centro histórico. Desde su fundación como misión jesuita hasta su transformación en un destino turístico de clase mundial, cada calle cuenta una historia.

Caminaremos por el malecón más bonito de México, visitaremos la catedral de Nuestra Señora de La Paz, el museo de la ballena y las galerías de arte que han convertido a esta ciudad en un referente cultural del noroeste.

Nuestro guía historiador te transportará a través de los siglos: la época de las perlas, la fiebre del oro, la revolución mexicana y el renacimiento cultural contemporáneo. Es un tour perfecto para quienes quieren entender el alma de Baja más allá de sus playas.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Beautiful%20historic%20downtown%20La%20Paz%20Baja%20California%20Sur%20Mexico%20with%20colorful%20colonial%20buildings%20palm%20trees%20and%20the%20iconic%20malecon%20waterfront%20promenade%20under%20golden%20hour%20lighting%2C%20travel%20photography&width=800&height=500&seq=40&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Interior%20of%20a%20historic%20Mexican%20cathedral%20with%20high%20arched%20ceilings%20stained%20glass%20windows%20and%20ornate%20altars%20in%20La%20Paz%20Baja%20California%20Sur%2C%20architectural%20photography%20with%20warm%20lighting&width=800&height=500&seq=41&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Colorful%20art%20gallery%20street%20in%20La%20Paz%20Baja%20California%20Sur%20Mexico%20with%20vibrant%20murals%20and%20sculptures%20on%20the%20sidewalk%20under%20a%20clear%20blue%20sky%2C%20cultural%20travel%20photography&width=800&height=500&seq=42&orientation=landscape",
    ],
    itinerary: [
      { time: "09:00", title: "Catedral de La Paz", description: "Punto de encuentro frente a la catedral. Introducción a la historia de la ciudad y la misión jesuita original." },
      { time: "09:45", title: "Plazuela y mercado", description: "Recorrido por la plazuela Constitution y el mercado Bravo. Degustación de dulces regionales y cafetería local." },
      { time: "10:30", title: "Malecón y esculturas", description: "Paseo por el malecón de 5 km con explicación de las esculturas monumentales y su significado cultural." },
      { time: "11:15", title: "Museo de la Ballena", description: "Visita guiada al museo donde aprenderemos sobre la historia de la caza de ballenas en la región y su conservación actual." },
      { time: "12:00", title: "Galería de arte local", description: "Cierre en una galería de arte contemporáneo con obras de artistas locales. Café de despedida incluido." },
    ],
    included: ["Guía historiador certificado", "Entrada al museo", "Café y dulces regionales", "Mapa ilustrado de La Paz", "Audífonos para grupos grandes"],
    notIncluded: ["Propinas", "Transporte", "Comidas", "Souvenirs"],
    meetingPoint: "Fachada de la Catedral de Nuestra Señora de La Paz, calle 5 de Mayo s/n, centro histórico.",
    provider: { name: "La Paz Historia Viva", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20historical%20walking%20tour%20company%20in%20La%20Paz%20Baja%20California%20with%20colonial%20architecture%20silhouette%20and%20book%2C%20warm%20gold%20and%20terracotta%20colors%20on%20white%20background%2C%20clean%20modern%20graphic%20design&width=120&height=120&seq=203&orientation=squarish", verified: true, description: "Historiadores y arqueólogos locales apasionados por compartir la rica historia de La Paz. Tours educativos y entretenidos para todos.", tourCount: 3 },
    childPrice: 225,
    maxGuests: 15,
    cancellationPolicy: "Cancelación gratuita hasta 12 horas antes. El tour se realiza con lluvia ligera, se cancela solo en caso de tormenta fuerte.",
    reviews: [
      { id: "r1", name: "Elena V.", avatar: avatars[3], rating: 5, date: "2026-04-02", comment: "El guía era historiador de verdad y se notaba. Aprendí más en dos horas que en toda mi vida sobre Baja. El museo de la ballena fue fascinante.", verified: true },
      { id: "r2", name: "Mark S.", avatar: avatars[1], rating: 4, date: "2026-03-15", comment: "Great walking tour with lots of interesting facts. The cathedral and malecon were highlights. Would have liked a bit more time at the art gallery.", verified: true },
      { id: "r3", name: "Diana P.", avatar: avatars[0], rating: 5, date: "2026-02-20", comment: "Perfecto para el primer día en La Paz. Te da contexto de todo lo que vas a ver después. El mapa ilustrado es un lindo souvenir.", verified: true },
    ],
    faq: [
      { question: "¿El tour es apto para sillas de ruedas?", answer: "El recorrido principal sí es accesible. El museo tiene rampa. Por favor avísanos con anticipación para adaptar la ruta." },
      { question: "¿Se hace el tour en inglés?", answer: "Sí, ofrecemos el tour en español e inglés. Los tours en inglés salen a las 10:00 y las 16:00." },
      { question: "¿Puedo llevar a mi perro?", answer: "Sí, el tour es pet-friendly. Solo pedimos que esté con correa durante la visita al museo." },
    ],
  },

  "cata-vinos-mariscos": {
    description: `Vive una experiencia gourmet única donde se encuentran el Mar de Cortés y los viñedos de Baja. Esta cata exclusiva combina los mejores mariscos de la región con vinos de los prestigiosos valles de Guadalupe y Santo Tomás.

Un sommelier certificado te guiará por una selección de 6 vinos mexicanos, desde blancos criollos hasta tintos de crianza, cada uno maridado cuidadosamente con un platillo de mariscos preparado por un chef local.

Aprenderás a identificar las notas de cada vino, a entender por qué el clima desértico de Baja produce vinos tan especiales, y descubrirás la revolución enoturística que está transformando a México en un destino vitivinícola de clase mundial.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Elegant%20wine%20tasting%20table%20with%20fresh%20oysters%20shrimp%20and%20white%20wine%20glasses%20overlooking%20the%20Sea%20of%20Cortez%20at%20sunset%20in%20Baja%20California%20Sur%20Mexico%2C%20luxury%20gourmet%20experience%20photography%20with%20warm%20lighting&width=800&height=500&seq=43&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Beautiful%20Mexican%20wine%20bottles%20from%20Baja%20California%20with%20artisanal%20labels%20and%20corks%20displayed%20on%20a%20rustic%20wooden%20table%20with%20grapes%20and%20cheese%2C%20wine%20photography%20with%20natural%20lighting&width=800&height=500&seq=44&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Upscale%20outdoor%20dining%20terrace%20with%20ocean%20view%20in%20La%20Paz%20Baja%20California%20Sur%20Mexico%20at%20golden%20hour%20with%20wine%20glasses%20and%20candlelight%2C%20romantic%20luxury%20travel%20photography&width=800&height=500&seq=45&orientation=landscape",
    ],
    itinerary: [
      { time: "16:00", title: "Recepción en la terraza", description: "Bienvenida con copa de espumoso mexicano y vistas panorámicas del mar. Introducción a la enología de Baja California." },
      { time: "16:30", title: "Primer maridaje", description: "Vino blanco criollo con ceviche de callo de hacha. Explicación de la técnica de maridaje y el origen del vino." },
      { time: "17:00", title: "Segundo maridaje", description: "Rosado de Grenache con tacos de camarón al pastor. Notas de cata y diferencias entre rosados europeos y mexicanos." },
      { time: "17:30", title: "Tercer maridaje", description: "Tinto joven con pulpo a las brasas. Aprendemos sobre la crianza en barrica y su efecto en el sabor." },
      { time: "18:00", title: "Cuarto maridaje", description: "Blend de crianza con filete de pescado negro. El plato estrella de la noche con el vino más premiado de la selección." },
      { time: "18:45", title: "Postre y digestivo", description: "Vino de postre mexicano con choco-taco de mezcal. Cierre con recomendaciones de viñedos para visitar." },
    ],
    included: ["6 vinos de diferentes viñedos", "6 platillos de mariscos", "Sommelier certificado", "Agua mineral", "Recetario de maridajes", "Certificado de participación"],
    notIncluded: ["Propinas", "Transporte", "Vinos adicionales", "Souvenirs"],
    meetingPoint: "Restaurante Alquimia, calle Allende 1234, La Paz. Estacionamiento disponible.",
    provider: { name: "Baja Vinos y Mar", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20luxury%20wine%20and%20seafood%20pairing%20company%20in%20Baja%20California%20Sur%20with%20wine%20glass%20and%20seashell%2C%20burgundy%20and%20gold%20colors%20on%20white%20background%2C%20elegant%20modern%20graphic%20design&width=120&height=120&seq=204&orientation=squarish", verified: true, description: "Sommeliers certificados y chefs especializados en mariscos locales. Experiencias enológicas galardonadas desde 2018.", tourCount: 5 },
    childPrice: null,
    maxGuests: 12,
    cancellationPolicy: "Cancelación gratuita hasta 72 horas antes. Reservas confirmadas con anticipación debido a la preparación de ingredientes frescos.",
    reviews: [
      { id: "r1", name: "Patricia H.", avatar: avatars[3], rating: 5, date: "2026-04-10", comment: "Una experiencia de otro nivel. El sommelier nos enseñó tanto sobre vinos mexicanos que ahora somos fans. El pulpo con el tinto... perfecto.", verified: true },
      { id: "r2", name: "James K.", avatar: avatars[4], rating: 5, date: "2026-03-25", comment: "I've done wine tastings in Napa, Bordeaux and Tuscany. This was right up there. Mexican wine is seriously underrated and the seafood pairings were genius.", verified: true },
      { id: "r3", name: "Rosa M.", avatar: avatars[0], rating: 5, date: "2026-02-28", comment: "Celebré mi aniversario aquí y fue mágico. La terraza al atardecer, el vino, la comida... todo impecable.", verified: true },
      { id: "r4", name: "Alberto C.", avatar: avatars[1], rating: 4, date: "2026-01-18", comment: "Muy bueno pero un poco caro. Aun así, la calidad justifica el precio. El ceviche de callo de hacha es el mejor que he probado.", verified: true },
    ],
    faq: [
      { question: "¿Puedo comprar los vinos que probamos?", answer: "Sí, al final de la cata hay una tienda con los vinos seleccionados y otros recomendados por el sommelier." },
      { question: "¿Tienen opciones sin gluten?", answer: "Sí, la mayoría de los platillos son naturalmente sin gluten. Por favor indica cualquier alergia al reservar." },
      { question: "¿Es necesario saber de vinos?", answer: "Para nada. El sommelier explica desde lo más básico. Es una experiencia educativa y entretenida para todos los niveles." },
    ],
  },

  "pesca-deportiva-cabo": {
    description: `Vive la emoción de la pesca deportiva de altura en las aguas legendarias de Cabo San Lucas, conocidas como la capital mundial del marlin. Con más de 20 especies de peces de pelea, estas aguas ofrecen una de las mejores experiencias de pesca del planeta.

Nuestro equipo de pesca de última generación y nuestros capitanes locales, que conocen cada corriente y bajo mar de la región, te garantizan las mejores oportunidades de captura. Ya seas un pescador experimentado o sea tu primera vez, adaptamos el tour a tu nivel.

Las especies más comunes incluyen marlin azul y negro, dorado, atún aleta amarilla, wahoo y pez vela. En temporada (mayo a octubre) las capturas de marlin pueden superar los 200 kg. Es una aventura que todo amante de la pesca debe vivir al menos una vez.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Majestic%20blue%20marlin%20being%20held%20by%20anglers%20on%20a%20sport%20fishing%20yacht%20in%20Cabo%20San%20Lucas%20Baja%20California%20Sur%20Mexico%20with%20deep%20blue%20ocean%20and%20clear%20sky%20background%2C%20dramatic%20fishing%20photography&width=800&height=500&seq=46&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Luxury%20sport%20fishing%20yacht%20cruising%20through%20calm%20blue%20waters%20near%20the%20iconic%20Arch%20of%20Cabo%20San%20Lucas%20Baja%20California%20Sur%20Mexico%20with%20fishing%20rods%20ready%2C%20adventure%20travel%20photography&width=800&height=500&seq=47&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Group%20of%20happy%20anglers%20displaying%20their%20fresh%20catch%20of%20dorado%20and%20tuna%20fish%20on%20the%20deck%20of%20a%20fishing%20boat%20in%20Cabo%20San%20Lucas%20Baja%20California%20Sur%20Mexico%2C%20sunny%20day%20fishing%20photography&width=800&height=500&seq=48&orientation=landscape",
    ],
    itinerary: [
      { time: "06:00", title: "Salida del puerto", description: "Embarque en yate de pesca deportiva equipado con 6 cañas profesionales, sonda y GPS. Café y pan dulce a bordo." },
      { time: "07:00", title: "Primer hotspot", description: "Navegación al banco de pesca principal. Despliegue de señuelos y presentación de técnicas de pesca al capitán y guía." },
      { time: "10:00", title: "Pique de dorado", description: "Parada en zona de dorado y atún. Sesión intensiva de pesca con asistencia del guía en cada captura." },
      { time: "13:00", title: "Almuerzo a bordo", description: "Ceviche de pescado fresco con cerveza artesanal de Baja. Descanso y reanudación de la pesca en nueva zona." },
      { time: "15:00", title: "Zona de marlin", description: "Travesía a zona profunda para marlin azul y negro. Trolling profesional con señuelos de altura." },
      { time: "17:00", title: "Regreso al puerto", description: "Regreso con fotos de capturas, fileteado opcional del pescado y recomendaciones de restaurantes locales para cocinar tu captura." },
    ],
    included: ["Yate de pesca deportiva", "6 cañas profesionales", "Capitán y guía de pesca", "Señuelos y carnada", "Almuerzo y bebidas", "Licencia de pesca", "Seguro", "Fileteado de capturas"],
    notIncluded: ["Propinas", "Traslado al puerto", "Equipos personales", "Montaje de trofeos"],
    meetingPoint: "Marina de Cabo San Lucas, muelle C, embarcación 'Reina del Mar'. Llegar 15 min antes.",
    provider: { name: "Cabo Fishing Legends", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20sport%20fishing%20charter%20company%20in%20Cabo%20San%20Lucas%20with%20marlin%20fish%20silhouette%20and%20fishing%20rod%2C%20deep%20blue%20and%20gold%20colors%20on%20white%20background%2C%20bold%20modern%20graphic%20design&width=120&height=120&seq=205&orientation=squarish", verified: true, description: "Capitanes locales con más de 30 años de experiencia en las aguas de Cabo. Yates equipados con tecnología de punta y equipo Penn internacional.", tourCount: 4 },
    childPrice: 1750,
    maxGuests: 6,
    cancellationPolicy: "Cancelación gratuita hasta 48 horas antes. Por mal clima se reprograma o reembolsa al 100%. No incluye propinas para la tripulación.",
    reviews: [
      { id: "r1", name: "Mike R.", avatar: avatars[4], rating: 5, date: "2026-04-01", comment: "Caught a 180kg blue marlin on my birthday. The crew was phenomenal, they knew exactly where to go. Best fishing trip of my life.", verified: true },
      { id: "r2", name: "Fernando G.", avatar: avatars[1], rating: 5, date: "2026-03-12", comment: "Llevé a mi papá por su jubilación y pescamos 4 dorados y 2 atunes. La tripulación nos trató como familia. El yate es de primera.", verified: true },
      { id: "r3", name: "Sarah J.", avatar: avatars[2], rating: 4, date: "2026-02-08", comment: "Amazing experience even though we didn't catch a marlin. The dorado fishing was incredible and the crew made it so fun." },
      { id: "r4", name: "Hugo V.", avatar: avatars[0], rating: 5, date: "2026-01-22", comment: "Pescadores de verdad. No son los tours turísticos de massa. Saben dónde están los peces y te enseñan técnica. Vale cada peso.", verified: true },
    ],
    faq: [
      { question: "¿Qué pasa si no pesco nada?", answer: "La naturaleza es impredecible, pero nuestros capitanes tienen un 95% de éxito de captura. En caso excepcional, ofrecemos un 30% de descuento en tu próximo tour." },
      { question: "¿Puedo llevar mi pescado a casa?", answer: "Sí, fileteamos tu captura y la empacamos en hielo seco para viaje. También recomendamos restaurantes locales que cocinan tu pescado fresco." },
      { question: "¿Necesito experiencia previa?", answer: "No es necesaria. Nuestros guías enseñan la técnica desde cero y asisten en cada captura. Niños mayores de 8 años pueden participar." },
    ],
  },

  "tour-atv-dunas": {
    description: `Siente la adrenalina de recorrer las impresionantes dunas y desiertos de Los Cabos en un ATV de alta potencia. Este tour de aventura te lleva por paisajes que parecen de otro planeta: cañones erosionados, playas salvajes y formaciones rocosas milenarias.

El recorrido comienza en nuestro campamento base en el desierto, donde recibirás una capacitación completa sobre manejo seguro del vehículo. No se requiere experiencia previa — nuestros guías te acompañan en todo momento por rutas diseñadas para todos los niveles.

A mitad del recorrido haremos una parada en una playa remota del Pacífico, accesible solo en vehículos todo terreno. Allí podrás tomar fotos, nadar si lo deseas, y disfrutar de un refrigerio con vistas al océano. Es la combinación perfecta de velocidad, naturaleza y paisajes cinematográficos.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=ATV%20quad%20bike%20speeding%20through%20golden%20sand%20dunes%20near%20Los%20Cabos%20Baja%20California%20Sur%20Mexico%20with%20dust%20clouds%20and%20dramatic%20desert%20landscape%2C%20adventure%20sports%20action%20photography%20with%20blue%20sky&width=800&height=500&seq=49&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Group%20of%20tourists%20riding%20ATVs%20along%20a%20rugged%20desert%20trail%20with%20cacti%20and%20mountains%20in%20Los%20Cabos%20Baja%20California%20Sur%20Mexico%2C%20wide%20angle%20adventure%20travel%20photography&width=800&height=500&seq=50&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Stunning%20desert%20landscape%20with%20eroded%20rock%20formations%20and%20a%20hidden%20beach%20on%20the%20Pacific%20coast%20of%20Baja%20California%20Sur%20Mexico%2C%20dramatic%20nature%20photography%20with%20golden%20light&width=800&height=500&seq=51&orientation=landscape",
    ],
    itinerary: [
      { time: "08:00", title: "Recogida y traslado", description: "Te recogemos en tu hotel de Los Cabos o San José del Cabo. Traslado de 30 minutos al campamento base en el desierto." },
      { time: "08:45", title: "Briefing y equipamiento", description: "Capacitación de seguridad de 15 minutos. Entrega de casco, goggles y bandana. Prueba del ATV en pista de entrenamiento." },
      { time: "09:15", title: "Ruta de dunas", description: "Aventura de 1 hora por dunas de hasta 30 metros de altura. Rutas técnicas para avanzados y circuitos suaves para principiantes." },
      { time: "10:30", title: "Cañón y arroyo seco", description: "Travesía por cañón erosionado con paredes de hasta 50 metros. Geología única de la península de Baja California." },
      { time: "11:30", title: "Playa privada del Pacífico", description: "Descanso en playa remota. Tiempo para nadar, tomar fotos y disfrutar de un refrigerio con vista al océano Pacífico." },
      { time: "12:30", title: "Regreso al campamento", description: "Ruta de regreso por diferentes senderos. Entrega de fotos del tour y traslado de vuelta a tu hotel." },
    ],
    included: ["ATV Honda o Can-Am", "Casco y goggles", "Guía certificado", "Refrigerio en la playa", "Agua y bebidas", "Seguro de actividad", "Fotos del tour"],
    notIncluded: ["Propinas", "Zapatos cerrados (obligatorio)", "Protector solar", "Traslado opcional desde Cabo San Lucas centro"],
    meetingPoint: "Recogida en hotel incluida. Si prefieres llegar por tu cuenta: Carretera Transpeninsular km 120, Campamento Desierto Azul.",
    provider: { name: "Desierto Aventura Cabo", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20an%20ATV%20desert%20adventure%20tour%20company%20in%20Los%20Cabos%20with%20dune%20and%20ATV%20silhouette%2C%20orange%20and%20sand%20colors%20on%20white%20background%2C%20bold%20modern%20graphic%20design&width=120&height=120&seq=206&orientation=squarish", verified: true, description: "Operadores de tours off-road con flota nueva de ATVs y UTVs. Guías certificados en primeros auxilios y manejo en dunas.", tourCount: 3 },
    childPrice: 825,
    maxGuests: 16,
    cancellationPolicy: "Cancelación gratuita hasta 24 horas antes. Actividad sujeta a condiciones climáticas. No apto para personas con problemas de espalda.",
    reviews: [
      { id: "r1", name: "Kevin L.", avatar: avatars[4], rating: 5, date: "2026-04-15", comment: "Best ATV tour I've ever done. The dunes are massive and the beach stop was unreal. Guides were fun and safety-focused. My teens loved it.", verified: true },
      { id: "r2", name: "Gabriela S.", avatar: avatars[0], rating: 5, date: "2026-03-30", comment: "Increíble adrenalina. Las dunas son altísimas y la playa del Pacífico es hermosa. Mi novio casi se cae de la emoción jaja. 100% recomendado.", verified: true },
      { id: "r3", name: "Brian T.", avatar: avatars[1], rating: 4, date: "2026-02-18", comment: "Great fun but be prepared to get dusty! The goggles help a lot. The beach break was the perfect way to cool down after the dunes.", verified: true },
    ],
    faq: [
      { question: "¿Necesito saber manejar moto?", answer: "No es necesario. El ATV es automático. Damos una capacitación completa antes de salir y hay pista de prueba." },
      { question: "¿Pueden ir dos personas en un ATV?", answer: "Sí, ofrecemos ATVs dobles. El precio es el mismo. El pasajero debe llevar casco también." },
      { question: "¿Qué pasa si llueve?", answer: "La lluvia ligera no cancela el tour. En tormenta fuerte ofrecemos reprogramación o reembolso completo." },
    ],
  },

  "avistamiento-ballenas": {
    description: `Sé testigo de uno de los espectáculos naturales más conmovedores del planeta: el avistamiento de ballenas grises en su santuario natural del Pacífico mexicano. Cada invierno, miles de ballenas migran desde Alaska hasta las cálidas aguas de Baja California Sur para reproducirse y criar a sus ballenatos.

Lo que hace única a esta experiencia es la increíble confianza que las ballenas muestran hacia los humanos. Las madres acercan activamente a sus crías a las lanchas, permitiendo un contacto visual directo y a veces incluso físico. Es un comportamiento que no se observa en ningún otro lugar del mundo.

Nuestros biólogos marinos certificados te acompañarán durante toda la travesía, compartiendo datos fascinantes sobre la biología de las ballenas, su migración de más de 10,000 km y los esfuerzos de conservación que han salvado a esta especie de la extinción.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Spectacular%20gray%20whale%20breaching%20with%20water%20splash%20near%20a%20small%20whale%20watching%20boat%20in%20the%20Pacific%20Ocean%20near%20La%20Paz%20Baja%20California%20Sur%20Mexico%2C%20breathtaking%20wildlife%20photography%20with%20blue%20sky&width=800&height=500&seq=52&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Mother%20gray%20whale%20with%20calf%20swimming%20close%20to%20a%20tour%20boat%20in%20the%20warm%20waters%20of%20Magdalena%20Bay%20Baja%20California%20Sur%20Mexico%2C%20touching%20and%20intimate%20wildlife%20photography%20with%20calm%20ocean&width=800&height=500&seq=53&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Beautiful%20sunset%20over%20the%20Pacific%20Ocean%20with%20silhouettes%20of%20birds%20flying%20and%20a%20whale%20watching%20boat%20returning%20to%20port%20in%20Baja%20California%20Sur%20Mexico%2C%20golden%20hour%20seascape%20photography&width=800&height=500&seq=54&orientation=landscape",
    ],
    itinerary: [
      { time: "07:00", title: "Salida de La Paz", description: "Traslado en van cómoda a Puerto San Carlos (2.5 horas). Desayuno ligero a bordo con café y pan." },
      { time: "09:45", title: "Embarque en lancha", description: "Arribo a la laguna de San Ignacio o Magdalena. Embarque en lanchas pequeñas con capacidad para 10 personas. Briefing de biólogo." },
      { time: "10:15", title: "Avistamiento de ballenas", description: "Navegación por la laguna buscando ballenas. Sesión de 2 horas con múltiples acercamientos. Posibilidad de tocar a las ballenas." },
      { time: "12:30", title: "Almuerzo en la costa", description: "Descanso en playa de la laguna con almuerzo de mariscos locales. Tiempo para fotos y exploración de la zona." },
      { time: "14:00", title: "Segunda sesión de avistamiento", description: "Segunda salida en lancha con diferente grupo de ballenas. Observación de comportamientos de cortejo y crianza." },
      { time: "16:00", title: "Regreso a La Paz", description: "Travesía de regreso con parada técnica. Llegada a La Paz alrededor de las 18:30." },
    ],
    included: ["Traslado desde La Paz", "Lancha local con toldo", "Biólogo marino guía", "Desayuno y almuerzo", "Chaleco salvavidas", "Audífonos y binoculares", "Seguro de viajero"],
    notIncluded: ["Propinas", "Bebidas alcohólicas", "Fotografía profesional", "Souvenirs en Puerto San Carlos"],
    meetingPoint: "Recogida en tu hotel en La Paz. Si prefieres llegar directo: Muelle de Puerto San Carlos, 8:30 AM.",
    provider: { name: "Baja Whale Connection", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20whale%20watching%20ecotourism%20company%20in%20Baja%20California%20Sur%20with%20whale%20tail%20and%20ocean%20wave%2C%20teal%20and%20deep%20blue%20colors%20on%20white%20background%2C%20elegant%20modern%20graphic%20design&width=120&height=120&seq=207&orientation=squarish", verified: true, description: "Biólogos marinos certificados con más de 20 años estudiando ballenas grises en Baja. Miembros de la Red de Avistamiento de Ballenas de México.", tourCount: 2 },
    childPrice: 700,
    maxGuests: 10,
    cancellationPolicy: "Cancelación gratuita hasta 48 horas antes. Temporada de ballenas: diciembre a abril. Reembolso completo si no se avistan ballenas.",
    reviews: [
      { id: "r1", name: "Linda W.", avatar: avatars[3], rating: 5, date: "2026-03-10", comment: "Life-changing experience. A mother whale brought her baby right up to our boat and we touched it. I cried. The biologist was so knowledgeable and passionate.", verified: true },
      { id: "r2", name: "Miguel A.", avatar: avatars[1], rating: 5, date: "2026-02-25", comment: "Llevé a mis hijos de 6 y 8 años y quedaron fascinados. La ballena nos roció con su respiración. Una experiencia educativa y emotiva.", verified: true },
      { id: "r3", name: "Rachel D.", avatar: avatars[2], rating: 5, date: "2026-01-30", comment: "I've whale watched in Alaska, Iceland and New Zealand. Nothing compares to Baja. The intimacy and trust these whales show is unparalleled.", verified: true },
      { id: "r4", name: "Carmen B.", avatar: avatars[0], rating: 5, date: "2026-01-12", comment: "El traslado es largo pero vale cada minuto. Las ballenas son majestuosas. El guía biologo nos enseñó tanto. Traigan abrigo para la lancha.", verified: true },
    ],
    faq: [
      { question: "¿Cuándo es la temporada de ballenas?", answer: "La temporada oficial es de mediados de diciembre hasta mediados de abril. Los mejores meses son enero y febrero." },
      { question: "¿Es seguro tocar a las ballenas?", answer: "Sí, las ballenas grises de Baja son conocidas por su comportamiento amistoso. Los biólogos supervisan cada interacción para proteger a los animales." },
      { question: "¿Qué tan largo es el traslado?", answer: "El traslado desde La Paz a la laguna es de aproximadamente 2.5 horas en van cómoda. El viaje incluye una parada de descanso." },
    ],
  },

  "transporte-aeropuerto-cabo": {
    description: `Viaja con comodidad y seguridad desde el Aeropuerto Internacional de Los Cabos hasta tu hotel con nuestro servicio de traslado privado. Olvídate de las filas de taxis y los precios sorpresa — con nosotros tienes una tarifa fija, vehículos impecables y conductores profesionales.

Nuestros vehículos son vans de lujo de última generación con aire acondicionado, WiFi, cargadores USB y amplio espacio para equipaje. Los conductores son locales bilingües que conocen cada ruta y te compartirán recomendaciones útiles para tu estancia.

El servicio incluye monitoreo de vuelos: si tu vuelo se retrasa, nosotros lo sabemos y ajustamos la hora de recogida sin costo adicional. También ofrecemos paradas opcionales en supermercados o tiendas de licor para que puedas abastecerte antes de llegar a tu hotel.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Luxury%20white%20passenger%20van%20parked%20at%20the%20Los%20Cabos%20International%20Airport%20terminal%20with%20a%20professional%20driver%20opening%20the%20door%20for%20tourists%2C%20premium%20airport%20transfer%20service%20photography%20with%20sunny%20day&width=800&height=500&seq=55&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Interior%20of%20a%20clean%20modern%20passenger%20van%20with%20leather%20seats%20air%20conditioning%20and%20USB%20chargers%20for%20airport%20transfer%20in%20Los%20Cabos%20Baja%20California%20Sur%20Mexico%2C%20luxury%20vehicle%20interior%20photography&width=800&height=500&seq=56&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Scenic%20coastal%20highway%20drive%20from%20Los%20Cabos%20airport%20with%20desert%20landscape%20and%20turquoise%20ocean%20views%20under%20a%20clear%20blue%20sky%2C%20travel%20photography%20through%20car%20window%20perspective&width=800&height=500&seq=57&orientation=landscape",
    ],
    itinerary: [
      { time: "A su llegada", title: "Recepción en el aeropuerto", description: "Su conductor lo espera en la salida de llegadas internacionales con un letrero con su nombre. Asistencia con el equipaje." },
      { time: "Inmediato", title: "Traslado al hotel", description: "Viaje directo en van privada con aire acondicionado, WiFi y agua embotellada. Duración aproximada: 35-50 minutos según zona hotelera." },
    ],
    included: ["Vehículo privado", "Conductor bilingüe", "WiFi a bordo", "Agua embotellada", "Seguro de pasajero", "Monitoreo de vuelo", "Equipaje ilimitado"],
    notIncluded: ["Propinas", "Paradas adicionales (con costo)", "Sillas para bebé (bajo petición)", "Bebidas alcohólicas"],
    meetingPoint: "Salida de llegadas internacionales del Aeropuerto Internacional de Los Cabos (SJD). El conductor llevará un letrero con su nombre.",
    provider: { name: "Cabo Transfers VIP", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20luxury%20airport%20transfer%20company%20in%20Los%20Cabos%20with%20airplane%20and%20road%20silhouette%2C%20navy%20blue%20and%20gold%20colors%20on%20white%20background%2C%20professional%20modern%20graphic%20design&width=120&height=120&seq=208&orientation=squarish", verified: true, description: "Servicio de transporte privado premium con flota nueva de vans de lujo. Conductores profesionales bilingües y seguro completo.", tourCount: 3 },
    childPrice: null,
    maxGuests: 8,
    cancellationPolicy: "Cancelación gratuita hasta 2 horas antes de la llegada del vuelo. Reembolso completo si el vuelo se cancela.",
    reviews: [
      { id: "r1", name: "Steven P.", avatar: avatars[1], rating: 5, date: "2026-04-20", comment: "Perfect from start to finish. Driver was waiting exactly where they said, van was immaculate, and we got to our resort in 40 minutes. Highly professional.", verified: true },
      { id: "r2", name: "Ana L.", avatar: avatars[0], rating: 5, date: "2026-03-05", comment: "Excelente servicio. El conductor nos recomendó un restaurante increíble. El wifi en la van nos salvó porque no teníamos datos. Puntualísimos.", verified: true },
      { id: "r3", name: "Greg H.", avatar: avatars[4], rating: 4, date: "2026-02-12", comment: "Good service but the van was a bit warm. Driver was friendly and helped with all our luggage. Price was fair compared to airport taxis." },
    ],
    faq: [
      { question: "¿Qué pasa si mi vuelo se retrasa?", answer: "Monitoreamos su vuelo en tiempo real. El conductor ajustará la hora de recogida automáticamente sin cargo adicional." },
      { question: "¿Puedo hacer una parada en el supermercado?", answer: "Sí, ofrecemos una parada opcional de 20 minutos en Walmart o Costco por $200 MXN adicionales. Avísenos al reservar." },
      { question: "¿Cuánto equipaje cabe?", answer: "Nuestras vans tienen espacio para hasta 12 maletas grandes. Equipaje de mano adicional también cabe sin problema." },
    ],
  },

  "renta-casa-playa-todos-santos": {
    description: `Escápate a una casa frente al mar en el pueblo mágico de Todos Santos, donde el desierto se encuentra con el Pacífico. Esta propiedad de lujo combina diseño contemporáneo mexicano con la calidez de los materiales locales: palo de arco, piedra bola y artesanías de la región.

La casa cuenta con tres recámaras en suite, cada una con vistas panorámicas al océano. El área social incluye una cocina gourmet totalmente equipada, sala con pérgola al aire libre y una alberca infinity que parece fundirse con el horizonte del Pacífico.

Ubicada a solo 5 minutos del centro histórico de Todos Santos, estarás cerca de las mejores galerías de arte, restaurantes orgánicos y la famosa playa de Cerritos para surfear. Es el refugio perfecto para familias, grupos de amigos o una escapada romántica de lujo.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Stunning%20modern%20beachfront%20vacation%20rental%20house%20with%20infinity%20pool%20overlooking%20the%20Pacific%20Ocean%20in%20Todos%20Santos%20Baja%20California%20Sur%20Mexico%20at%20sunset%2C%20luxury%20architecture%20photography%20with%20warm%20golden%20light&width=800&height=500&seq=58&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Beautiful%20interior%20living%20room%20of%20a%20modern%20Mexican%20beach%20house%20with%20palo%20de%20arco%20furniture%20ocean%20views%20through%20large%20windows%20and%20local%20artisan%20decorations%20in%20Todos%20Santos%20Baja%20California%20Sur%2C%20interior%20design%20photography&width=800&height=500&seq=59&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Panoramic%20ocean%20view%20from%20a%20private%20terrace%20with%20outdoor%20dining%20area%20and%20lounge%20chairs%20overlooking%20the%20Pacific%20Ocean%20at%20golden%20hour%20in%20Todos%20Santos%20Baja%20California%20Sur%20Mexico%2C%20luxury%20vacation%20rental%20photography&width=800&height=500&seq=60&orientation=landscape",
    ],
    itinerary: [
      { time: "15:00", title: "Check-in", description: "Llegada a la propiedad. Recibimiento personal con welcome drink. Tour de la casa y explicación de servicios." },
      { time: "Todo el día", title: "Disfrute de la propiedad", description: "Acceso privado a la playa, alberca infinity, fogata exterior, bicicletas para explorar Todos Santos. Servicio de chef disponible bajo petición." },
      { time: "11:00", title: "Check-out", description: "Despedida y servicio de transporte opcional al aeropuerto o siguiente destino." },
    ],
    included: ["3 recámaras en suite", "Alberca infinity", "Acceso privado a playa", "Cocina gourmet", "WiFi de alta velocidad", "Aire acondicionado", "Limpieza diaria", "Estacionamiento privado"],
    notIncluded: ["Chef privado (bajo petición)", "Traslados", "Masajes en casa (bajo petición)", "Excursiones"],
    meetingPoint: "Casa Pacífica, calle del Pacifico 234, Todos Santos. Coordenadas exactas se envían tras la reserva.",
    provider: { name: "Baja Luxury Rentals", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20luxury%20vacation%20rental%20company%20in%20Baja%20California%20Sur%20with%20house%20and%20palm%20tree%20silhouette%2C%20warm%20coral%20and%20sand%20colors%20on%20white%20background%2C%20elegant%20modern%20graphic%20design&width=120&height=120&seq=209&orientation=squarish", verified: true, description: "Administradores de propiedades de lujo en Todos Santos y Los Cabos. Flota de 15 casas frente al mar con servicio de concierge 24/7.", tourCount: 8 },
    childPrice: null,
    maxGuests: 6,
    cancellationPolicy: "Cancelación gratuita hasta 7 días antes de la llegada. Estancias de más de 7 noches requieren depósito del 50%.",
    reviews: [
      { id: "r1", name: "Nicole B.", avatar: avatars[2], rating: 5, date: "2026-04-18", comment: "Paradise on earth. Woke up to waves every morning. The pool is unreal. The housekeeper kept everything spotless. We never wanted to leave.", verified: true },
      { id: "r2", name: "Jorge R.", avatar: avatars[1], rating: 5, date: "2026-03-22", comment: "Celebramos el cumpleaños de mi esposa aquí y fue inolvidable. Contratamos al chef recomendado y la cena fue de restaurante Michelin." },
      { id: "r3", name: "Amy S.", avatar: avatars[0], rating: 4, date: "2026-02-14", comment: "Beautiful house but the road to the beach is a bit rough. The pool and views more than make up for it. Todos Santos is such a charming town." },
    ],
    faq: [
      { question: "¿Hay servicio de chef disponible?", answer: "Sí, contamos con chefs privados que preparan desde desayunos hasta cenas de 7 tiempos. Menús personalizados según preferencias dietéticas." },
      { question: "¿La playa es segura para nadar?", answer: "La playa frente a la casa tiene olas moderadas. Es ideal para surfistas principiantes. Para nadar tranquilo recomendamos la playa de Cerritos a 5 min en coche." },
      { question: "¿Puedo llevar a mi mascota?", answer: "Sí, la propiedad es pet-friendly. Pedimos un depósito adicional de $2,000 MXN reembolsable si no hay daños." },
    ],
  },

  "tour-ceramica-talavera": {
    description: `Sumérgete en la tradición milenaria de la cerámica mexicana en este taller práctico en el corazón de La Paz. Aprenderás las técnicas ancestrales de modelado en torno, decoración con óxidos minerales y cocción en horno de leña que han sido patrimonio cultural de México por siglos.

Nuestro maestro alfarero, tercera generación de una familia de ceramistas, te guiará paso a paso en la creación de tu propia pieza: desde amasar la arcilla hasta darle forma en el torno y pintarla con los colores característicos de la talavera poblana adaptada a motivos marinos de Baja.

Al final del taller, tu pieza será cocida en nuestro horno tradicional y estará lista para recoger al día siguiente. Es una experiencia perfecta para parejas, familias y cualquiera que busque un souvenir hecho con sus propias manos y con el alma de México.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Traditional%20Mexican%20pottery%20workshop%20with%20hands%20shaping%20clay%20on%20a%20spinning%20wheel%20surrounded%20by%20colorful%20ceramic%20pieces%20and%20talavera%20tiles%20in%20La%20Paz%20Baja%20California%20Sur%2C%20artisan%20craft%20photography%20with%20warm%20studio%20lighting&width=800&height=500&seq=61&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Colorful%20collection%20of%20hand-painted%20Mexican%20talavera%20style%20ceramic%20plates%20bowls%20and%20vases%20displayed%20on%20wooden%20shelves%20in%20an%20artisan%20studio%20in%20Baja%20California%20Sur%2C%20folk%20art%20photography%20with%20vibrant%20colors&width=800&height=500&seq=62&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Close%20up%20of%20hands%20painting%20intricate%20blue%20and%20white%20patterns%20on%20a%20ceramic%20bowl%20in%20a%20Mexican%20pottery%20workshop%20with%20brushes%20and%20pigments%20on%20the%20table%2C%20detailed%20craft%20photography%20with%20natural%20light&width=800&height=500&seq=63&orientation=landscape",
    ],
    itinerary: [
      { time: "10:00", title: "Bienvenida al taller", description: "Llegada al taller familiar en el centro de La Paz. Café de olla y pan casero de bienvenida. Introducción a la historia de la cerámica en México." },
      { time: "10:30", title: "Técnica de torno", description: "Demostración del maestro alfarero. Cada participante sube al torno para modelar su propia pieza con asistencia personalizada." },
      { time: "11:30", title: "Decoración", description: "Aprendizaje de técnicas de pintura con óxidos. Cada quien decora su pieza con motivos marinos y florales tradicionales." },
      { time: "12:30", title: "Cocción y explicación", description: "Visita al horno de leña tradicional. Explicación del proceso de cocción y esmaltado. La pieza se cuece para recoger al día siguiente." },
    ],
    included: ["Arcilla y herramientas", "Pinturas y óxidos", "Uso del torno", "Cocción en horno", "Pieza terminada para llevar", "Refrigerio", "Certificado de participación"],
    notIncluded: ["Envío de pieza", "Propinas al maestro", "Piezas adicionales", "Fotografía profesional"],
    meetingPoint: "Taller Alfarería del Mar, calle 16 de Septiembre 456, centro histórico de La Paz.",
    provider: { name: "Alfarería del Mar", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20traditional%20Mexican%20pottery%20workshop%20with%20ceramic%20vase%20and%20paintbrush%2C%20terracotta%20and%20blue%20colors%20on%20white%20background%2C%20artisan%20graphic%20design%20style&width=120&height=120&seq=210&orientation=squarish", verified: true, description: "Taller familiar de tercera generación especializado en cerámica tradicional mexicana con influencias marinas de Baja California Sur.", tourCount: 2 },
    childPrice: 325,
    maxGuests: 8,
    cancellationPolicy: "Cancelación gratuita hasta 24 horas antes. La pieza cocida se guarda por 30 días si no puedes recogerla al día siguiente.",
    reviews: [
      { id: "r1", name: "Claudia T.", avatar: avatars[0], rating: 5, date: "2026-04-05", comment: "Una experiencia única. El maestro es un artista y un gran maestro. Mi cuenco quedó hermoso y es mi souvenir favorito de todo el viaje.", verified: true },
      { id: "r2", name: "Peter M.", avatar: avatars[1], rating: 5, date: "2026-03-12", comment: "So much fun! The teacher was patient and hilarious even with my terrible Spanish. My bowl turned out surprisingly good. My wife loved it." },
      { id: "r3", name: "Lucia F.", avatar: avatars[3], rating: 4, date: "2026-02-20", comment: "Muy bonito taller. El café de olla es delicioso. Solo que el taller se sintió un poco corto, quisiera que fuera de 3 horas para practicar más." },
    ],
    faq: [
      { question: "¿Necesito experiencia previa?", answer: "Para nada. El taller está diseñado para principiantes. El maestro asiste a cada participante de forma personalizada." },
      { question: "¿Puedo hacer más de una pieza?", answer: "Sí, por $200 MXN adicionales puedes hacer una segunda pieza pequeña. Las piezas adicionales también se cuecen." },
      { question: "¿Y si no puedo recoger mi pieza al día siguiente?", answer: "La guardamos por 30 días. También ofrecemos envío a domicilio en La Paz por $150 MXN o envío nacional por $350 MXN." },
    ],
  },

  "pesca-ribereña-la-paz": {
    description: `Vive la auténtica pesca ribereña de Baja California Sur a bordo de una panga tradicional con pescadores locales que han heredado su oficio de generación en generación. Esta experiencia te conecta con la cultura pesquera del Mar de Cortés de una manera que ningún tour turístico puede ofrecer.

Salimos al amanecer, cuando el mar está en calma y los peces están más activos. Nuestros pescadores te enseñarán las técnicas tradicionales de pesca con línea de mano, red y arpón, adaptadas a las especies del día: sierra, pargo, cabrilla y, si la suerte acompaña, algún dorado cercano a la costa.

A bordo, disfrutarás de un desayuno tradicional de pescador: machaca con huevo y tortillas hechas a mano, café de olla y fruta fresca. Es una ventana a una forma de vida que ha sostenido a las comunidades de Baja por siglos.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Traditional%20Mexican%20fishing%20panga%20boat%20with%20local%20fishermen%20at%20sunrise%20in%20the%20Sea%20of%20Cortez%20near%20La%20Paz%20Baja%20California%20Sur%20Mexico%20with%20golden%20light%20and%20calm%20turquoise%20water%2C%20authentic%20cultural%20photography&width=800&height=500&seq=64&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Hands%20holding%20a%20freshly%20caught%20red%20snapper%20fish%20on%20a%20traditional%20panga%20boat%20with%20fishing%20lines%20and%20ocean%20in%20the%20background%20in%20Baja%20California%20Sur%20Mexico%2C%20authentic%20fishing%20lifestyle%20photography&width=800&height=500&seq=65&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Traditional%20Mexican%20breakfast%20of%20machaca%20with%20eggs%20and%20handmade%20tortillas%20served%20on%20a%20small%20fishing%20boat%20in%20the%20Sea%20of%20Cortez%20at%20sunrise%2C%20rustic%20food%20photography%20with%20warm%20natural%20lighting&width=800&height=500&seq=66&orientation=landscape",
    ],
    itinerary: [
      { time: "05:30", title: "Salida al amanecer", description: "Encuentro en el muelle de pescadores de La Paz. Café y pan mientras preparamos la panga. Salida con la primera luz del día." },
      { time: "06:15", title: "Primera zona de pesca", description: "Navegación a banco cercano. Los pescadores enseñan la técnica de línea de mano para sierra y cabrilla." },
      { time: "08:00", title: "Desayuno a bordo", description: "Descanso para el desayuno tradicional: machaca con huevo, tortillas, salsa y café de olla preparado en estufa de la panga." },
      { time: "09:00", title: "Segunda zona de pesca", description: "Travesía a zona de pargo y cabrilla de mayor tamaño. Técnica de anzuelo y carnada natural." },
      { time: "11:00", title: "Regreso y fileteado", description: "Regreso al muelle. El pescador filetea el pescado capturado y te lo empaca para llevar. Recomendación de restaurantes que lo cocinan." },
    ],
    included: ["Panga tradicional", "2 pescadores locales", "Equipos de pesca", "Desayuno tradicional", "Bebidas", "Pescado capturado para llevar", "Fileteado y empaque"],
    notIncluded: ["Propinas", "Licencia de pesca", "Cocina del pescado", "Transporte al muelle"],
    meetingPoint: "Muelle de Pescadores, calle Topete s/n, La Paz. Llegar 15 minutos antes.",
    provider: { name: "Pescadores de La Paz", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20traditional%20fishing%20cooperative%20in%20La%20Paz%20Baja%20California%20with%20fishing%20boat%20and%20fish%20silhouette%2C%20blue%20and%20gold%20colors%20on%20white%20background%2C%20rustic%20modern%20graphic%20design&width=120&height=120&seq=211&orientation=squarish", verified: true, description: "Cooperativa de pescadores ribereños con más de 40 años de historia. Comprometidos con la pesca sustentable y el turismo comunitario.", tourCount: 2 },
    childPrice: 1100,
    maxGuests: 4,
    cancellationPolicy: "Cancelación gratuita hasta 24 horas antes. La pesca depende de las condiciones del clima. En caso de mal clima se reprograma.",
    reviews: [
      { id: "r1", name: "Ramón E.", avatar: avatars[1], rating: 5, date: "2026-04-02", comment: "Lo más auténtico que he vivido en Baja. Los pescadores son unos maestros. Pescamos 8 pargos y los cocinamos en un restaurante que nos recomendaron. Inolvidable.", verified: true },
      { id: "r2", name: "Helen K.", avatar: avatars[3], rating: 5, date: "2026-03-15", comment: "An eye-opening cultural experience. The fishermen were so welcoming and taught us so much. The breakfast on the boat was the best meal of our trip.", verified: true },
      { id: "r3", name: "Andrés M.", avatar: avatars[4], rating: 4, date: "2026-02-10", comment: "Muy temprano pero vale la pena. El amanecer en el mar es mágico. La panga es sencilla, no esperen lujo. La autenticidad es lo que paga." },
    ],
    faq: [
      { question: "¿Qué tipo de pescado se pesca?", answer: "Depende de la temporada. Lo más común es sierra, pargo, cabrilla y dorado ribereño. No garantizamos captura específica." },
      { question: "¿Puedo comer el pescado en algún restaurante?", answer: "Sí, recomendamos varios restaurantes en La Paz que cocinan tu pescado fresco por una tarifa adicional de $200-300 MXN por persona." },
      { question: "¿Es seguro para niños?", answer: "Sí, pero recomendamos edades mayores de 6 años. Los niños deben usar chaleco salvavidas en todo momento." },
    ],
  },

  "tour-observacion-estrellas": {
    description: `Contempla el universo desde uno de los cielos más limpios del planeta. El desierto de Baja California Sur, lejos de la contaminación lumínica de las ciudades, ofrece condiciones ideales para la observación astronómica que rivalizan con los mejores observatorios del mundo.

En este tour nocturno, un astrónomo profesional te guiará por un viaje por las estrellas, planetas, nebulosas y galaxias visibles a simple vista y a través de nuestros telescopios de alta potencia. Verás la Vía Láctea en toda su extensión, los anillos de Saturno, las lunas de Júpiter y cúmulos estelares a cientos de años luz de distancia.

La experiencia incluye una cena ligera bajo las estrellas, cócteles de mezcal, y una sesión de fotografía astronómica donde aprenderás a capturar la vía láctea con tu cámara o celular. Es una experiencia romántica, educativa y absolutamente sobrecogedora.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Breathtaking%20night%20sky%20full%20of%20stars%20and%20the%20Milky%20Way%20galaxy%20over%20the%20desert%20landscape%20of%20Baja%20California%20Sur%20Mexico%20with%20silhouettes%20of%20cacti%20and%20mountains%2C%20astrophotography%20with%20vivid%20cosmic%20colors&width=800&height=500&seq=67&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Group%20of%20tourists%20looking%20through%20a%20professional%20telescope%20at%20night%20under%20a%20starry%20sky%20in%20the%20Baja%20California%20Sur%20desert%20with%20an%20astronomer%20guiding%20them%2C%20night%20adventure%20photography%20with%20warm%20lantern%20light&width=800&height=500&seq=68&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Romantic%20outdoor%20dining%20setup%20under%20the%20Milky%20Way%20in%20the%20desert%20of%20Baja%20California%20Sur%20Mexico%20with%20lanterns%20candles%20and%20wine%20glasses%20on%20a%20table%2C%20magical%20night%20travel%20photography&width=800&height=500&seq=69&orientation=landscape",
    ],
    itinerary: [
      { time: "19:00", title: "Salida desde Los Cabos", description: "Traslado en van a nuestra base en el desierto (45 min). Observación del atardecer en el desierto antes de la oscuridad total." },
      { time: "20:15", title: "Introducción astronómica", description: "Presentación del astrónomo sobre el cielo nocturno de Baja. Mapa estelar y explicación de objetos celestes visibles esa noche." },
      { time: "20:45", title: "Observación con telescopio", description: "Sesión de 1.5 horas rotando entre 3 telescopios profesionales. Observación de planetas, nebulosas y galaxias." },
      { time: "22:15", title: "Cena bajo las estrellas", description: "Cena ligera de productos locales con mezcal artesanal. Tiempo para fotografía astronómica guiada con tu propia cámara." },
      { time: "23:00", title: "Regreso", description: "Traslado de regreso a Los Cabos. Llegada aproximada a la medianoche." },
    ],
    included: ["Traslado ida y vuelta", "3 telescopios profesionales", "Astrónomo guía", "Cena ligera", "Mezcal de bienvenida", "Mapa estelar", "Taller de astrofotografía"],
    notIncluded: ["Propinas", "Cámara profesional (opcional)", "Bebidas extras", "Transporte fuera de Los Cabos"],
    meetingPoint: "Recogida en hotel en Los Cabos y San José del Cabo. También punto de encuentro en Plaza Amelia Wilkes.",
    provider: { name: "Baja Cosmos Tours", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20an%20astronomy%20and%20stargazing%20tour%20company%20in%20Baja%20California%20with%20telescope%20and%20constellation%20stars%2C%20deep%20blue%20and%20silver%20colors%20on%20white%20background%2C%20modern%20cosmic%20graphic%20design&width=120&height=120&seq=212&orientation=squarish", verified: true, description: "Astrónomos profesionales y astrofotógrafos certificados. Equipamiento de última generación y ubicaciones seleccionadas por su oscuridad de cielo.", tourCount: 2 },
    childPrice: 550,
    maxGuests: 14,
    cancellationPolicy: "Cancelación gratuita hasta 24 horas antes. Actividad sujeta a condiciones del cielo. En caso de nubosidad total se reprograma o reembolsa.",
    reviews: [
      { id: "r1", name: "Chris A.", avatar: avatars[4], rating: 5, date: "2026-04-12", comment: "Mind-blowing. I've never seen so many stars in my life. The astronomer was brilliant at explaining everything. My kids were mesmerized by Saturn's rings.", verified: true },
      { id: "r2", name: "Isabel N.", avatar: avatars[0], rating: 5, date: "2026-03-28", comment: "La mejor noche del viaje. El cielo de Baja es otro nivel. El astrónomo nos enseñó a tomar fotos de la vía láctea con el celular. Quedaron increíbles.", verified: true },
      { id: "r3", name: "Daniel R.", avatar: avatars[1], rating: 5, date: "2026-02-15", comment: "Romantic, educational and awe-inspiring. Perfect date night. The mezcal and dinner under the stars was the cherry on top." },
    ],
    faq: [
      { question: "¿Qué pasa si está nublado?", answer: "Monitoreamos el clima horas antes. Si la nubosidad supera el 70%, ofrecemos reprogramación o reembolso completo." },
      { question: "¿Necesito traer mi telescopio?", answer: "No es necesario. Proporcionamos telescopios profesionales de 8 y 10 pulgadas. Si tienes binoculares, tráelos como complemento." },
      { question: "¿Puedo tomar fotos con mi celular?", answer: "Sí, dedicamos 30 minutos del tour a enseñarte la técnica de astrofotografía con celular. Recomendamos traer trípode pequeño si tienes." },
    ],
  },

  "transporte-la-paz-los-cabos": {
    description: `Viaja con comodidad entre las dos ciudades más importantes de Baja California Sur en nuestro servicio de transporte compartido de lujo. Ya sea que estés llegando al aeropuerto de La Paz y necesites llegar a Los Cabos, o viceversa, nuestro servicio garantiza un traslado seguro, puntual y confortable.

El recorrido de aproximadamente 2 horas te lleva por una de las carreteras más espectaculares de México, con vistas al Mar de Cortés por un lado y al desierto de la Sierra de la Laguna por el otro. Hacemos una parada estratégica en el pueblo mágico de Todos Santos para estirar las piernas, tomar un café y admirar este oasis de arte y cultura.

Nuestras vans ejecutivas cuentan con aire acondicionado, WiFi, cargadores USB, asientos reclinables y espacio amplio para equipaje. Los conductores son bilingües, licenciados y conocen cada detalle de la ruta.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Comfortable%20executive%20passenger%20van%20driving%20along%20the%20scenic%20coastal%20highway%20between%20La%20Paz%20and%20Los%20Cabos%20Baja%20California%20Sur%20Mexico%20with%20desert%20mountains%20and%20Sea%20of%20Cortez%20views%2C%20travel%20photography&width=800&height=500&seq=70&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Charming%20street%20scene%20in%20the%20magical%20town%20of%20Todos%20Santos%20Baja%20California%20Sur%20Mexico%20with%20colorful%20colonial%20buildings%20and%20palm%20trees%20under%20a%20clear%20blue%20sky%2C%20cultural%20travel%20photography&width=800&height=500&seq=71&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Interior%20of%20a%20luxury%20executive%20van%20with%20comfortable%20leather%20seats%20individual%20air%20vents%20and%20USB%20chargers%20for%20intercity%20travel%20in%20Baja%20California%20Sur%20Mexico%2C%20premium%20vehicle%20interior%20photography&width=800&height=500&seq=72&orientation=landscape",
    ],
    itinerary: [
      { time: "A convenir", title: "Recogida", description: "Recogida puntual en tu hotel, Airbnb o aeropuerto en La Paz o Los Cabos. Confirmación de reserva con nombre y placas del vehículo." },
      { time: "+1h", title: "Parada en Todos Santos", description: "Descanso de 20 minutos en el centro de Todos Santos. Baños, café, tiendas de artesanías y galerías de arte locales." },
      { time: "+2h", title: "Llegada", description: "Traslado directo a tu destino final. Asistencia con equipaje y recomendaciones locales del conductor." },
    ],
    included: ["Van ejecutiva", "Conductor bilingüe", "WiFi a bordo", "Aire acondicionado", "Parada en Todos Santos", "Seguro de pasajero", "Equipaje ilimitado"],
    notIncluded: ["Propinas", "Comidas y bebidas", "Entradas a atracciones", "Traslados locales adicionales"],
    meetingPoint: "Recogida en tu hotel o Airbnb en La Paz, Los Cabos o San José del Cabo. Confirmamos la dirección exacta tras la reserva.",
    provider: { name: "Baja Shuttle Express", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20an%20intercity%20shuttle%20company%20in%20Baja%20California%20with%20road%20and%20van%20silhouette%2C%20green%20and%20blue%20colors%20on%20white%20background%2C%20clean%20modern%20graphic%20design&width=120&height=120&seq=213&orientation=squarish", verified: true, description: "Servicio de transporte interurbano entre La Paz y Los Cabos desde 2015. Flota ejecutiva nueva, conductores profesionales y puntualidad garantizada.", tourCount: 2 },
    childPrice: null,
    maxGuests: 10,
    cancellationPolicy: "Cancelación gratuita hasta 4 horas antes de la hora programada. Reembolso completo si el servicio se cancela por parte del operador.",
    reviews: [
      { id: "r1", name: "Susan L.", avatar: avatars[2], rating: 5, date: "2026-04-15", comment: "Clean van, friendly driver, and the stop in Todos Santos was a lovely bonus. Wifi worked great. Way better than the bus.", verified: true },
      { id: "r2", name: "Pedro J.", avatar: avatars[1], rating: 5, date: "2026-03-20", comment: "Puntualísimos. El conductor nos recomendó un restaurante en Todos Santos que fue lo mejor del viaje. Van muy cómoda con aire frío.", verified: true },
      { id: "r3", name: "Monica R.", avatar: avatars[0], rating: 4, date: "2026-02-10", comment: "Bien en general. Solo que la parada en Todos Santos fue un poco corta. Me hubiera gustado 30 min en vez de 20." },
    ],
    faq: [
      { question: "¿Puedo llevar equipaje extra grande?", answer: "Sí, nuestras vans tienen espacio de carga amplio. Surfboards, bicicletas desarmadas y maletas oversize caben sin problema." },
      { question: "¿El servicio es puerta a puerta?", answer: "Sí, recogemos y dejamos en la dirección que nos indiques: hoteles, Airbnb, aeropuertos o domicilios particulares." },
      { question: "¿Qué tan exacto es el horario?", answer: "Trabajamos con horarios fijos. La puntualidad es nuestra prioridad. En caso de retraso inesperado te notificamos por WhatsApp." },
    ],
  },

  "clase-cocina-baja": {
    description: `Aprende los secretos de la cocina Baja-Mediterránea, la fusión culinaria que ha puesto a Baja California Sur en el mapa gastronómico mundial. En esta clase práctica, un chef reconocido te enseñará a combinar productos locales del mar y la tierra con técnicas de la cocina mediterránea.

El tour comienza con una visita al mercado de pescadores de La Paz para seleccionar el pescado fresco del día. De regreso en nuestra cocina al aire libre con vistas al mar, prepararás desde cero un menú completo: ceviche de pescado con aguachile, tacos de pescado en tempura con salsa de chipotle, y un postre de chocolate de Guerrero con frutos de la región.

Aprenderás técnicas profesionales de corte de pescado, preparación de masas, emulsiones y salsas, además de los principios del maridaje con vinos mexicanos. Al final, disfrutarás de la cena que preparaste con tus propias manos, acompañada de una copa de vino blanco del Valle de Guadalupe.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Outdoor%20cooking%20class%20in%20a%20beautiful%20kitchen%20overlooking%20the%20Sea%20of%20Cortez%20in%20La%20Paz%20Baja%20California%20Sur%20Mexico%20with%20fresh%20seafood%20and%20vegetables%20on%20the%20counter%2C%20culinary%20experience%20photography%20with%20natural%20light&width=800&height=500&seq=73&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Fresh%20fish%20and%20seafood%20selection%20at%20a%20local%20fish%20market%20in%20La%20Paz%20Baja%20California%20Sur%20Mexico%20with%20red%20snapper%20shrimp%20and%20scallops%20on%20ice%2C%20vibrant%20market%20photography%20with%20natural%20lighting&width=800&height=500&seq=74&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Beautiful%20plated%20dish%20of%20Baja%20style%20fish%20tempura%20tacos%20with%20chipotle%20sauce%20and%20fresh%20lime%20on%20a%20ceramic%20plate%20in%20an%20outdoor%20dining%20setting%20in%20Baja%20California%20Sur%20Mexico%2C%20gourmet%20food%20photography&width=800&height=500&seq=75&orientation=landscape",
    ],
    itinerary: [
      { time: "09:00", title: "Mercado de pescadores", description: "Encuentro en el mercado de mariscos. Selección de pescado fresco del día con el chef. Explicación de especies locales y técnicas de frescura." },
      { time: "10:00", title: "Cocina al aire libre", description: "Llegada a la cocina outdoor con vista al mar. Presentación de ingredientes y menú del día. Briefing de seguridad y técnica." },
      { time: "10:30", title: "Ceviche y aguachile", description: "Clase práctica de ceviche clásico y aguachile verde. Técnica de corte de pescado, marinado cítrico y emplatado." },
      { time: "11:30", title: "Tacos de pescado", description: "Preparación de tempura de pescado y tortillas hechas a mano. Salsas: chipotle, cremosa de cilantro y pico de gallo." },
      { time: "12:30", title: "Cena y maridaje", description: "Disfrute del menú preparado con una copa de vino blanco del Valle de Guadalupe. Recetario digital de regalo y certificado de participación." },
    ],
    included: ["Visita al mercado", "Todos los ingredientes", "Clase con chef reconocido", "Menú completo degustado", "Vino de maridaje", "Recetario digital", "Certificado", "Delantal de regalo"],
    notIncluded: ["Propinas al chef", "Bebidas extras", "Transporte", "Souvenirs del mercado"],
    meetingPoint: "Entrada del Mercado de Mariscos de La Paz, calle Topete s/n. El chef te espera con un delantal de Sabores del Mar.",
    provider: { name: "Sabores del Mar", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20cooking%20class%20company%20in%20Baja%20California%20with%20chef%20hat%20and%20fish%20silhouette%2C%20coral%20and%20green%20colors%20on%20white%20background%2C%20gourmet%20modern%20graphic%20design&width=120&height=120&seq=214&orientation=squarish", verified: true, description: "Escuela de cocina Baja-Mediterránea fundada por chefs reconocidos. Clases prácticas en cocina al aire libre con vista al mar.", tourCount: 4 },
    childPrice: 725,
    maxGuests: 10,
    cancellationPolicy: "Cancelación gratuita hasta 48 horas antes. La clase requiere reserva con anticipación debido a la compra de ingredientes frescos.",
    reviews: [
      { id: "r1", name: "Vanessa Q.", avatar: avatars[0], rating: 5, date: "2026-04-08", comment: "El chef es una estrella. Aprendí a hacer tortillas de verdad y el ceviche que preparé fue mejor que en muchos restaurantes. La vista de la cocina al mar es increíble.", verified: true },
      { id: "r2", name: "Robert F.", avatar: avatars[1], rating: 5, date: "2026-03-12", comment: "As a home cook this was everything I wanted. The market visit was educational, the class was hands-on, and the chef was incredibly patient. And the wine pairing!" },
      { id: "r3", name: "Cecilia M.", avatar: avatars[3], rating: 5, date: "2026-02-20", comment: "Hice esta clase con mi mamá y fue el mejor regalo. El recetario que nos dieron ya lo he usado 5 veces en casa. Totalmente recomendado." },
    ],
    faq: [
      { question: "¿Puedo adaptar el menú si soy alérgico al marisco?", answer: "Sí, ofrecemos una versión con pescado de carne blanca o vegetariana. Indícanos tus alergias al reservar." },
      { question: "¿Necesito traer algo?", answer: "Solo traer zapatos cómodos y ropa casual. Proporcionamos delantal, utensilios, ingredientes y bebidas." },
      { question: "¿El vino está incluido?", answer: "Sí, incluye una copa de vino blanco del Valle de Guadalupe para maridar la comida. Bebidas adicionales tienen costo extra." },
    ],
  },

  "renta-casa-condominio-cabo": {
    description: `Hospédate en un condominio de lujo en la marina de Cabo San Lucas con vistas panorámicas al puerto deportivo y al Arco. Esta propiedad de clase mundial ofrece el equilibrio perfecto entre el lujo de un resort de 5 estrellas y la privacidad de un hogar.

El condominio cuenta con dos recámaras principales, cada una con baño en mármol y balcón privado. El área social incluye una cocina gourmet con electrodomésticos de línea premium, sala con sistema de sonido envolvente, y un balcón principal con jacuzzi privado y vistas al atardecer sobre la marina.

Como huésped tienes acceso a las amenidades del complejo: alberca infinity, gimnasio de última generación, spa, restaurante de playa y servicio de concierge 24/7. Estás a pasos de los mejores restaurantes, boutiques y vida nocturna de Cabo, pero con la tranquilidad de un espacio privado.`,
    gallery: [
      "https://readdy.ai/api/search-image?query=Luxury%20waterfront%20condominium%20apartment%20in%20Cabo%20San%20Lucas%20marina%20with%20panoramic%20ocean%20and%20yacht%20views%20from%20a%20private%20balcony%20with%20jacuzzi%20at%20sunset%2C%20upscale%20real%20estate%20photography%20with%20warm%20lighting&width=800&height=500&seq=76&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Modern%20luxury%20condominium%20living%20room%20interior%20with%20marble%20floors%20designer%20furniture%20and%20floor%20to%20ceiling%20windows%20overlooking%20Cabo%20San%20Lucas%20marina%2C%20high%20end%20interior%20design%20photography&width=800&height=500&seq=77&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Infinity%20pool%20at%20a%20luxury%20condominium%20complex%20in%20Cabo%20San%20Lucas%20marina%20Baja%20California%20Sur%20Mexico%20with%20lounge%20chairs%20palm%20trees%20and%20ocean%20views%20at%20golden%20hour%2C%20resort%20lifestyle%20photography&width=800&height=500&seq=78&orientation=landscape",
    ],
    itinerary: [
      { time: "15:00", title: "Check-in", description: "Recepción personal en el lobby del complejo. Tour de la propiedad y amenidades. Welcome basket con vino, frutas locales y chocolates artesanales." },
      { time: "Todo el día", title: "Estancia de lujo", description: "Acceso a alberca infinity, gimnasio, spa, restaurante de playa y concierge 24/7. Jacuzzi privado en el balcón. Estacionamiento subterráneo incluido." },
      { time: "11:00", title: "Check-out", description: "Despedida con servicio de transporte opcional al aeropuerto. Late check-out disponible bajo petición y disponibilidad." },
    ],
    included: ["2 recámaras en suite", "Jacuzzi privado en balcón", "Cocina gourmet", "WiFi de alta velocidad", "Aire acondicionado", "Acceso a amenidades del complejo", "Estacionamiento subterráneo", "Welcome basket"],
    notIncluded: ["Servicio de chef privado", "Tratamientos de spa", "Excursiones marinas", "Servicio de limpieza diario (bajo petición)"],
    meetingPoint: "Lobby del complejo Marina Cabo, Boulevard Marina s/n, Cabo San Lucas. Check-in presencial con concierge.",
    provider: { name: "Marina Luxury Stays", avatar: "https://readdy.ai/api/search-image?query=Company%20logo%20badge%20design%20for%20a%20luxury%20marina%20condominium%20rental%20company%20in%20Cabo%20San%20Lucas%20with%20yacht%20and%20building%20silhouette%2C%20navy%20and%20gold%20colors%20on%20white%20background%2C%20elegant%20modern%20graphic%20design&width=120&height=120&seq=215&orientation=squarish", verified: true, description: "Administradores de condominios de lujo en la marina de Cabo San Lucas. Acceso a amenidades de resort con privacidad de hogar.", tourCount: 6 },
    childPrice: null,
    maxGuests: 4,
    cancellationPolicy: "Cancelación gratuita hasta 14 días antes. Estancias en temporada alta (Navidad, Semana Santa) requieren pago anticipado del 100%.",
    reviews: [
      { id: "r1", name: "Alexander W.", avatar: avatars[1], rating: 5, date: "2026-04-20", comment: "The view from the balcony is insane. We sat in the jacuzzi every evening watching the yachts come in. The condo is immaculate and the staff is world-class." },
      { id: "r2", name: "Paola D.", avatar: avatars[0], rating: 5, date: "2026-03-15", comment: "La mejor ubicación de Cabo. Todo caminando: restaurantes, antros, el muelle. Pero el departamento es tan cómodo que a veces no queríamos salir. El jacuzzi es todo.", verified: true },
      { id: "r3", name: "Thomas H.", avatar: avatars[4], rating: 4, date: "2026-02-22", comment: "Great stay but the gym was a bit crowded in the mornings. Everything else was perfect. The welcome basket was a nice touch." },
    ],
    faq: [
      { question: "¿Hay servicio de concierge?", answer: "Sí, concierge 24/7 para reservas de restaurantes, excursiones, transporte y cualquier necesidad durante tu estancia." },
      { question: "¿La piscina del complejo es privada?", answer: "La alberca infinity es exclusiva para residentes del complejo. Nunca está abarrotada. También tienes jacuzzi privado en tu balcón." },
      { question: "¿Puedo hostear una cena en el departamento?", answer: "Sí, la cocina está totalmente equipada para 8 comensales. Ofrecemos servicio de chef privado bajo petición para cenas especiales." },
    ],
  },
};

export function getTourDetails(slug: string): TourDetailData | null {
  return tourDetails[slug] ?? null;
}