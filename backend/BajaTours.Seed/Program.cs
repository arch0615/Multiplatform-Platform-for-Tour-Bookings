using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;
using BajaTours.Api.Domain.Enums;
using BajaTours.Seed;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

var config = new ConfigurationBuilder()
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "BajaTours.Api", "appsettings.json"), optional: false)
    .AddJsonFile(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "BajaTours.Api", "appsettings.Development.json"), optional: true)
    .AddEnvironmentVariables()
    .Build();

var connStr = config.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Missing connection string 'Default'.");

var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlServer(connStr).Options;
await using var db = new AppDbContext(options);

var hasher = new PasswordHasher<User>();
const string demoPassword = "Provider!2026";

Console.WriteLine($"Seeding database: {db.Database.GetDbConnection().Database}");

var providers = await SeedProvidersAsync(db, hasher, demoPassword);
Console.WriteLine($"Providers ensured: {providers.Count}");

var newTourCount = await SeedToursAsync(db, providers);
Console.WriteLine($"New tours this run: {newTourCount}");
Console.WriteLine("Seed complete.");


static async Task<Dictionary<string, Provider>> SeedProvidersAsync(
    AppDbContext db, IPasswordHasher<User> hasher, string demoPassword)
{
    var seed = new[]
    {
        new ProviderSeed("acme@tours.mx", "Acme Owner",
            "Acme Adventures", "La Paz",
            "Operador local de aventura en el Mar de Cortés desde 2012. Especialistas en kayak, snorkel y senderismo."),
        new ProviderSeed("seawolves@bajatours.mx", "Mariana Sea Wolves",
            "Sea Wolves Tours", "La Paz",
            "Expediciones marinas con biólogos certificados. Avistamiento de ballenas, buceo y pesca deportiva responsable."),
        new ProviderSeed("loscaboscultural@bajatours.mx", "Hector Cultural",
            "Los Cabos Cultural Co.", "Los Cabos",
            "Recorridos culturales por San José del Cabo y Cabo San Lucas, con guías historiadores locales."),
        new ProviderSeed("bajagastro@bajatours.mx", "Sofia Gastro",
            "Baja Gastro Tours", "La Paz",
            "Experiencias gastronómicas de mariscos, vinos del Valle de Guadalupe y tradiciones culinarias bajacalifornianas."),
        new ProviderSeed("cabotransport@bajatours.mx", "Esteban Premium",
            "Cabo Premium Transport", "Los Cabos",
            "Traslados privados y rentas exclusivas frente al mar en Los Cabos."),
    };

    var result = new Dictionary<string, Provider>(StringComparer.OrdinalIgnoreCase);

    foreach (var p in seed)
    {
        var email = p.Email.ToLowerInvariant();
        var user = await db.Users
            .Include(u => u.Provider)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user is null)
        {
            user = new User
            {
                Email = email,
                FullName = p.OwnerName,
                Role = UserRole.Provider,
                PreferredLanguage = "es",
                EmailVerified = true,
            };
            user.PasswordHash = hasher.HashPassword(user, demoPassword);
            db.Users.Add(user);
            await db.SaveChangesAsync();
            Console.WriteLine($"  + user {email}");
        }

        var provider = user.Provider ?? await db.Providers.FirstOrDefaultAsync(x => x.UserId == user.Id);
        if (provider is null)
        {
            provider = new Provider
            {
                UserId = user.Id,
                CompanyName = p.CompanyName,
                Location = p.Location,
                Description = p.Description,
                CommissionRate = 0.15m,
                Verified = true,
                Status = ProviderStatus.Active,
            };
            db.Providers.Add(provider);
            await db.SaveChangesAsync();
            Console.WriteLine($"  + provider {p.CompanyName}");
        }
        else
        {
            if (!provider.Verified || provider.Status != ProviderStatus.Active)
            {
                provider.Verified = true;
                provider.Status = ProviderStatus.Active;
                if (string.IsNullOrWhiteSpace(provider.Description)) provider.Description = p.Description;
                if (string.IsNullOrWhiteSpace(provider.Location)) provider.Location = p.Location;
                await db.SaveChangesAsync();
            }
        }

        result[p.CompanyName] = provider;
    }

    return result;
}


static async Task<int> SeedToursAsync(AppDbContext db, Dictionary<string, Provider> providers)
{
    var tours = TourSeeds(providers);
    int created = 0;

    foreach (var t in tours)
    {
        var exists = await db.Tours.AnyAsync(x => x.Slug == t.Slug);
        if (exists)
        {
            Console.WriteLine($"  · skip {t.Slug} (already present)");
            continue;
        }

        var tour = new Tour
        {
            ProviderId = t.Provider.Id,
            Slug = t.Slug,
            Title = t.Title,
            Category = t.Category,
            Location = t.Location,
            Description = t.Description,
            Itinerary = t.Itinerary,
            MeetingPoint = t.MeetingPoint,
            Duration = t.Duration,
            Languages = t.Languages,
            PriceAdult = t.PriceAdult,
            PriceChild = t.PriceChild,
            MaxGuests = t.MaxGuests,
            Status = TourStatus.Active,
        };
        db.Tours.Add(tour);
        await db.SaveChangesAsync();

        for (var i = 0; i < t.ImageUrls.Length; i++)
        {
            db.TourImages.Add(new TourImage
            {
                TourId = tour.Id,
                Url = t.ImageUrls[i],
                Caption = t.ImageCaptions.ElementAtOrDefault(i),
                SortOrder = i,
            });
        }

        foreach (var r in t.Reviews)
        {
            db.Reviews.Add(new Review
            {
                TourId = tour.Id,
                Rating = r.Rating,
                Title = r.Title,
                Comment = r.Comment,
                ExternalAuthor = r.Author,
                Source = ReviewSource.Google,
                Status = ReviewStatus.Approved,
                CreatedAt = DateTime.UtcNow.AddDays(-r.DaysAgo),
            });
        }

        await db.SaveChangesAsync();

        if (t.Reviews.Length > 0)
        {
            tour.Rating = Math.Round(t.Reviews.Average(r => (decimal)r.Rating), 2);
            tour.ReviewCount = t.Reviews.Length;
            await db.SaveChangesAsync();
        }

        Console.WriteLine($"  + tour {t.Slug} ({t.ImageUrls.Length} imgs, {t.Reviews.Length} reviews)");
        created++;
    }

    return created;
}


static TourSeed[] TourSeeds(Dictionary<string, Provider> p)
{
    static string Img(string id) => $"https://images.unsplash.com/photo-{id}?w=1600&q=80&auto=format&fit=crop";

    var acme = p["Acme Adventures"];
    var sea = p["Sea Wolves Tours"];
    var cult = p["Los Cabos Cultural Co."];
    var gastro = p["Baja Gastro Tours"];
    var cabo = p["Cabo Premium Transport"];

    return new[]
    {
        new TourSeed(acme, "kayak-isla-espiritu-santo", "Kayak en Isla Espíritu Santo",
            TourCategory.Adventure, "La Paz",
            "Un día inolvidable navegando en kayak por las aguas turquesas de Isla Espíritu Santo, una de las áreas marinas protegidas más impresionantes de México. Incluye snorkel con lobos marinos y comida en playa.",
            "8:00 Recogida en hotel · 8:45 Salida desde Marina CostaBaja · 10:00 Llegada a la isla · 12:00 Snorkel con lobos marinos · 13:30 Comida en playa · 15:00 Regreso · 16:30 Hotel",
            "Marina CostaBaja, La Paz", "8 horas", "es,en",
            1800m, 1200m, 12,
            new[] { Img("1502943693086-33b5b1cfdf2f"), Img("1463693396721-8ca0cfa2b3b5"), Img("1507525428034-b723cf961d3e") },
            new string?[] { "Kayak al amanecer", "Aguas turquesas", "Playa desierta" },
            new[] {
                new ReviewSeed("María G.", 5, "Experiencia única", "Los guías muy profesionales y el almuerzo en la playa fue espectacular. La isla parece de otro mundo.", 35),
                new ReviewSeed("James M.", 5, "Worth every peso", "Saw sea lions up close, water was crystal clear. Highly recommended for anyone visiting La Paz.", 18),
                new ReviewSeed("Carlos R.", 4, null, "Muy buen tour aunque el regreso fue con bastante oleaje. Los guías muy atentos en todo momento.", 7),
            }),

        new TourSeed(acme, "snorkel-lobos-marinos", "Snorkel con lobos marinos",
            TourCategory.Adventure, "La Paz",
            "Tour de medio día nadando con los juguetones lobos marinos de Los Islotes. Equipo de snorkel completo incluido.",
            "9:00 Recogida · 9:45 Embarque en panga · 10:30 Snorkel sesión 1 · 11:30 Refrigerio · 12:00 Snorkel sesión 2 · 13:30 Regreso",
            "Marina La Paz, muelle 3", "5 horas", "es,en",
            1500m, 1000m, 14,
            new[] { Img("1544551763-46a013bb70d5"), Img("1559827260-dc66d52bef19"), Img("1564550975564-3bcd7d56de2f") },
            new string?[] { "Snorkel con lobos marinos", "Vista submarina", "Equipo incluido" },
            new[] {
                new ReviewSeed("Lucía P.", 5, "Increíble", "Los lobos juegan contigo, parecen perros. Mi hijo de 10 se enamoró del lugar.", 22),
                new ReviewSeed("Ana V.", 5, null, "Súper recomendado. El agua estaba a 24°C, perfecta. Volveríamos sin dudar.", 60),
            }),

        new TourSeed(acme, "senderismo-sierra-laguna", "Senderismo Sierra de la Laguna",
            TourCategory.Adventure, "La Paz",
            "Caminata guiada por la Reserva de la Biósfera Sierra de la Laguna, hogar de cascadas y especies endémicas. Para niveles intermedios.",
            "6:00 Recogida · 7:30 Trailhead · 12:00 Cascada El Salto · 13:00 Comida · 16:00 Regreso a hotel",
            "Hotel del cliente (La Paz)", "10 horas", "es,en",
            1200m, null, 10,
            new[] { Img("1551632811-561732d1e306"), Img("1506905925346-21bda4d32df4"), Img("1464822759023-fed622ff2c3b") },
            new string?[] { "Cascada El Salto", "Sendero entre encinos", "Vista panorámica" },
            new[] {
                new ReviewSeed("Diego H.", 5, "Naturaleza pura", "El guía Manuel sabe muchísimo de la flora local. La cascada es premio merecido.", 12),
                new ReviewSeed("Patricia E.", 4, null, "Demandante pero hermoso. Llevar muy buen calzado y mucha agua.", 40),
                new ReviewSeed("Tom L.", 5, "Hidden gem", "Did this tour in October — perfect weather. Manuel pointed out every endemic plant.", 90),
            }),

        new TourSeed(acme, "atv-todos-santos", "ATV Tour por Todos Santos",
            TourCategory.Adventure, "La Paz",
            "Recorrido en ATV de 4 ruedas por dunas, palmares y la playa de Todos Santos. Conductor sin experiencia previa requerida (instrucción incluida).",
            "9:00 Briefing y prueba · 9:45 Salida · 11:00 Pausa en playa · 13:00 Regreso al lodge",
            "Lodge ATV, km 53 carretera La Paz – Todos Santos", "4 horas", "es,en",
            2200m, null, 8,
            new[] { Img("1533743410561-3a0f8e6ce4f1"), Img("1597531072931-7d2ae08c0c46"), Img("1571866418773-be7bd5e3f5c2") },
            new string?[] { "ATV en dunas", "Atardecer en Todos Santos", "Foto de grupo" },
            new[] {
                new ReviewSeed("Alex K.", 5, null, "Adrenalina y paisaje al máximo. Los ATVs estaban en perfectas condiciones.", 14),
                new ReviewSeed("Carmen B.", 4, "Polvoroso", "Diviértete pero prepárate: vas a terminar cubierto de polvo. Ropa vieja recomendada.", 31),
            }),

        new TourSeed(acme, "surf-cerritos", "Clase de surf en Playa Cerritos",
            TourCategory.Adventure, "La Paz",
            "Clase grupal de surf en Playa Cerritos, ideal para principiantes. Tabla y traje incluidos. Hasta 6 alumnos por instructor.",
            "8:00 Encuentro en estacionamiento · 8:15 Calentamiento y técnica · 9:00 Sesión en agua (90 min) · 10:30 Pausa · 11:00 Sesión 2 · 12:00 Fin",
            "Acceso público Playa Cerritos", "4 horas", "es,en",
            1400m, 900m, 6,
            new[] { Img("1502680390469-be75c86b636f"), Img("1502933691298-84fc14542831"), Img("1505459668311-8dbac7952bf0") },
            new string?[] { "Surfeando primera ola", "Tablas en la arena", "Cerritos al atardecer" },
            new[] {
                new ReviewSeed("Lola D.", 5, "Mi primera ola", "Me paré en la tabla a la tercera intentada. Esteban es un instructor con paciencia infinita.", 8),
                new ReviewSeed("Mike T.", 5, null, "Best beginner spot on the peninsula. Soft sand bottom, friendly waves.", 26),
            }),

        new TourSeed(sea, "ballenas-grises-magdalena", "Avistamiento de ballenas grises (Bahía Magdalena)",
            TourCategory.Adventure, "La Paz",
            "Excursión de día completo a Puerto López Mateos para avistar ballenas grises en su santuario invernal (enero-marzo). Transporte terrestre + panga.",
            "5:30 Recogida · 8:30 Llegada Puerto López · 9:00 Embarque panga · 13:00 Comida · 16:00 Regreso a hotel · 19:00 Hotel",
            "Recogida en hotel La Paz", "13 horas", "es,en",
            3200m, 2000m, 15,
            new[] { Img("1568430462989-44163eb1752f"), Img("1607604276583-eef5d076aa5f"), Img("1610312278520-bcc893a3ff1d") },
            new string?[] { "Ballena gris saludando", "Madre y cría", "Costa de Magdalena" },
            new[] {
                new ReviewSeed("Helena R.", 5, "Experiencia espiritual", "Una ballena tocó la panga con su aleta. Los marinos lloraron de emoción.", 95),
                new ReviewSeed("Ben J.", 5, null, "Worth the early start. We had three close encounters in two hours.", 80),
                new ReviewSeed("Rosa F.", 4, null, "Largo día de carretera, pero las ballenas valen la pena. Recomiendo llevar dramamina.", 110),
            }),

        new TourSeed(sea, "buceo-cabo-pulmo", "Buceo en Cabo Pulmo",
            TourCategory.Adventure, "La Paz",
            "Dos inmersiones guiadas en el Parque Nacional Cabo Pulmo, uno de los arrecifes más biodiversos del Pacífico. Solo para certificados (OW mínimo).",
            "7:00 Recogida · 9:00 Llegada al parque · 10:00 Inmersión 1 · 12:00 Comida ligera · 13:30 Inmersión 2 · 17:00 Regreso",
            "Cabo Pulmo (transporte incluido desde La Paz)", "10 horas", "es,en",
            3800m, null, 8,
            new[] { Img("1544551763-46a013bb70d5"), Img("1582967788606-a171c1080cb0"), Img("1559827347-2cdbd33e30b8") },
            new string?[] { "Cardumen de jureles", "Coral y peces tropicales", "Lancha en Cabo Pulmo" },
            new[] {
                new ReviewSeed("Andrés M.", 5, "Mejor buceo de mi vida", "Visibilidad de 25m y un cardumen de jureles del tamaño de un edificio. Espectacular.", 18),
                new ReviewSeed("Sarah N.", 5, "Worth the certification", "Strict no-touch rules show in the health of the reef. Best dive in Baja.", 45),
            }),

        new TourSeed(sea, "pesca-deportiva-amanecer", "Pesca deportiva al amanecer",
            TourCategory.Fishing, "La Paz",
            "Salida en panga de pesca deportiva desde La Paz. Especies posibles: dorado, marlín rayado, sierra. Captura y libera promovida.",
            "5:00 Embarque · 6:00 Salida al canal · 13:00 Regreso a marina · 14:00 Limpieza de pesca",
            "Marina La Paz, muelle de pescadores", "9 horas", "es,en",
            8500m, null, 4,
            new[] { Img("1545177-1ce8d6c1a8a3"), Img("1502536321-87e92b76aef9"), Img("1463693396721-8ca0cfa2b3b5") },
            new string?[] { "Captura del día", "Salida al amanecer", "Marlín liberado" },
            new[] {
                new ReviewSeed("Joaquín P.", 5, null, "Don Memo conoce el mar como su patio. Sacamos 3 dorados antes de las 10am.", 22),
                new ReviewSeed("Frank D.", 4, "Solid charter", "Boat was clean, tackle was good. Marlin season is more productive — go May-Oct.", 70),
            }),

        new TourSeed(cult, "centro-historico-san-jose", "Recorrido histórico San José del Cabo",
            TourCategory.Cultural, "Cabo San Lucas",
            "Caminata guiada de 2 horas por el centro histórico de San José del Cabo. Misión, plaza Mijares y mercado tradicional.",
            "Inicio en Misión San José del Cabo · Plaza Mijares · Calle Doblado · Mercado tradicional",
            "Plaza Mijares, San José del Cabo", "2 horas", "es,en",
            950m, 600m, 20,
            new[] { Img("1518105779142-d975f22f1b0a"), Img("1559817093-7f23ec0f4dba"), Img("1551038041-9b4be83bb3a4") },
            new string?[] { "Misión San José", "Plaza Mijares", "Mercado tradicional" },
            new[] {
                new ReviewSeed("Elena T.", 5, "Encantador", "Héctor cuenta historias deliciosas del fundación de la ciudad. Salimos enamorados del centro.", 4),
                new ReviewSeed("Ryan F.", 5, null, "Loved hearing the origin stories — way better than a self-guided walk.", 19),
                new ReviewSeed("Mariana C.", 4, null, "Recorrido tranquilo, ideal para una mañana de descanso. Llevar gorra.", 50),
            }),

        new TourSeed(cult, "arte-san-jose-galerias", "Tour de galerías de arte (Art Walk)",
            TourCategory.Cultural, "Cabo San Lucas",
            "Recorrido nocturno por las galerías del distrito artístico de San José del Cabo, los jueves de noviembre a junio. Incluye copa de vino en cada galería.",
            "17:00 Encuentro · 17:15 Galería 1 · 18:00 Galería 2 · 19:00 Galería 3 · 20:00 Cena opcional · 21:00 Fin",
            "Plaza Mijares, San José del Cabo", "4 horas", "es,en",
            1100m, null, 12,
            new[] { Img("1547826039-bfc35e0f1ea8"), Img("1531058020387-3be344556be6"), Img("1518998053901-5348d3961a04") },
            new string?[] { "Galería contemporánea", "Vino entre obras", "Distrito artístico" },
            new[] {
                new ReviewSeed("Verónica L.", 5, "Sofisticado", "Una velada perfecta. Conocimos al artista de la pintura que terminé comprando.", 14),
                new ReviewSeed("Daniel P.", 4, null, "Algunas galerías más interesantes que otras, pero el ambiente es excelente.", 35),
            }),

        new TourSeed(cult, "museo-arte-cabo", "Visita guiada al Museo de Arte de Los Cabos",
            TourCategory.Cultural, "Cabo San Lucas",
            "Visita de 90 minutos al Museo de Arte de Los Cabos (MACSL) con curador. Exposición permanente y exposición temporal.",
            "11:00 Encuentro en lobby · 11:15 Tour guiado · 12:30 Espacio Q&A · 13:00 Fin",
            "MACSL, San José del Cabo", "1.5 horas", "es,en",
            800m, 500m, 25,
            new[] { Img("1545987796-200677ee1011"), Img("1517147177326-b37599372b75"), Img("1531058020387-3be344556be6") },
            new string?[] { "Sala principal", "Exposición temporal", "Curador en sala" },
            new[] {
                new ReviewSeed("Pablo S.", 5, null, "Pequeño pero potente. La curadora nos explicó cada pieza con pasión.", 9),
                new ReviewSeed("Olivia K.", 5, "Underrated", "Small but well-curated museum, well worth 90 minutes of your day.", 28),
            }),

        new TourSeed(gastro, "mariscos-vino-la-paz", "Tour de mariscos y vinos en La Paz",
            TourCategory.Gastronomic, "La Paz",
            "Recorrido por tres puestos de mariscos del Malecón y cata de vinos del Valle de Guadalupe. Aguachile, almeja chocolata y pescado zarandeado.",
            "17:00 Encuentro Malecón · 17:30 Aguachile · 18:30 Almeja chocolata · 19:30 Pescado zarandeado · 20:30 Cata de vinos · 22:00 Fin",
            "Quiosco del Malecón, La Paz", "5 horas", "es,en",
            2400m, null, 10,
            new[] { Img("1505250463725-0bc1c5fa1d31"), Img("1467003909585-2f8a72700288"), Img("1547573854-74d2a71d0826") },
            new string?[] { "Aguachile bahía", "Vino del valle", "Atardecer en el Malecón" },
            new[] {
                new ReviewSeed("Fernando A.", 5, "Tres horas en el paraíso", "Probamos lo mejor del Malecón sin gastar de más. Sofía conoce a todos los cocineros.", 11),
                new ReviewSeed("Kate W.", 5, null, "Local food, local wine, local stories — exactly what we wanted.", 33),
                new ReviewSeed("Roberto N.", 5, null, "Ya he hecho este tour dos veces. Cada puesto es distinto y todos buenísimos.", 65),
            }),

        new TourSeed(gastro, "ruta-tacos-cabo", "Ruta del taco — Cabo San Lucas",
            TourCategory.Gastronomic, "Cabo San Lucas",
            "Cuatro paradas tacomaníacas en Cabo: pastor, pescado, marlín ahumado y birria. Cervezas artesanales locales incluidas.",
            "18:00 Parada 1 (pastor) · 18:45 Parada 2 (pescado) · 19:30 Parada 3 (marlín) · 20:30 Parada 4 (birria) · 21:30 Fin",
            "Plaza Amelia Wilkes, Cabo San Lucas", "3.5 horas", "es,en",
            1600m, 950m, 12,
            new[] { Img("1565299543923-37dd37887442"), Img("1599974579688-8dbdd335c77f"), Img("1551218808-94e220e084d2") },
            new string?[] { "Tacos al pastor", "Marlín ahumado", "Birria de res" },
            new[] {
                new ReviewSeed("Pepe S.", 5, "Tacosaurio", "Comí más de lo que debería pero cero arrepentimientos. El marlín ahumado es brutal.", 6),
                new ReviewSeed("Jordan L.", 5, "Best food tour", "Skipped the resort dinner for this — no regrets. Birria stop was the highlight.", 24),
            }),

        new TourSeed(gastro, "mezcal-artesanal", "Cata de mezcales artesanales",
            TourCategory.Gastronomic, "Cabo San Lucas",
            "Cata guiada de 6 mezcales artesanales de Oaxaca y Durango, con maridaje de quesos y chocolate amargo. Mezcalero experto.",
            "19:00 Bienvenida · 19:15 Cata · 21:00 Maridaje · 22:00 Cierre",
            "Mezcalería Centro, San José del Cabo", "3 horas", "es,en",
            1900m, null, 15,
            new[] { Img("1514218953589-2d7d37efd2dc"), Img("1551538827-9c037cb4f32a"), Img("1572896213-9d9aab51f5d8") },
            new string?[] { "Línea de mezcales", "Cata guiada", "Maridaje con chocolate" },
            new[] {
                new ReviewSeed("Andrea V.", 5, null, "El mezcalero explica cada espadín y tobalá como si fuera poesía. Aprendí muchísimo.", 21),
                new ReviewSeed("Greg P.", 4, "Eye-opening", "Never knew mezcal had this range. The wild-agave pour at the end was incredible.", 48),
            }),

        new TourSeed(gastro, "postres-cafes-sjd", "Tour de postres y cafés — San José",
            TourCategory.Gastronomic, "Cabo San Lucas",
            "Recorrido dulce por las pastelerías y cafeterías de especialidad de San José del Cabo. Cuatro paradas, ideal para tardes lentas.",
            "15:00 Café de especialidad · 15:45 Repostería francesa · 16:30 Heladería artesanal · 17:30 Chocolate de barra · 18:00 Fin",
            "Plaza Mijares, San José del Cabo", "3 horas", "es,en",
            1100m, 700m, 10,
            new[] { Img("1505252585461-04db1eb84625"), Img("1505250463725-0bc1c5fa1d31"), Img("1551024601-bec78aea704b") },
            new string?[] { "Café de especialidad", "Repostería francesa", "Heladería artesanal" },
            new[] {
                new ReviewSeed("Marta E.", 5, null, "Mi hija de 9 años no paraba de sonreír. Tour ideal para familias golosas.", 13),
                new ReviewSeed("Beth M.", 5, "Sweet tooth heaven", "Loved every stop. The chocolate-bar workshop was a delightful surprise.", 41),
            }),

        new TourSeed(cabo, "traslado-aeropuerto-cabo", "Traslado aeropuerto SJD a Cabo San Lucas",
            TourCategory.Transport, "Cabo San Lucas",
            "Traslado privado de SUV de hasta 6 personas desde el Aeropuerto Internacional de Los Cabos (SJD) a cualquier hotel de Cabo San Lucas. 24/7.",
            "Reúnete con el chofer en sala de llegadas · Trayecto directo 45 minutos · Drop-off en lobby",
            "Aeropuerto SJD, sala de llegadas internacional", "45 minutos", "es,en",
            700m, 350m, 6,
            new[] { Img("1502136033100-aa2c0ade1b4d"), Img("1512486130939-2c4f79935e4f"), Img("1485470733090-0aae1788d5af") },
            new string?[] { "SUV ejecutiva", "Chofer profesional", "Aeropuerto SJD" },
            new[] {
                new ReviewSeed("Helen S.", 5, null, "Chofer puntual con cartel, agua fría en el coche. Llegué a mi hotel relajadísima.", 5),
                new ReviewSeed("Ken P.", 5, "Smooth pickup", "Driver was waiting at arrivals, car was spotless. Easy.", 17),
            }),

        new TourSeed(cabo, "villa-vista-arco", "Villa Vista al Arco — 4 huéspedes",
            TourCategory.Housing, "Cabo San Lucas",
            "Villa privada de 3 habitaciones con vista directa al Arco de Cabo San Lucas. Alberca infinity, chef opcional, transporte al centro incluido. Estancia mínima 3 noches.",
            "Check-in 15:00 · Check-out 11:00 · Anfitrión disponible 24/7",
            "Pedregal, Cabo San Lucas", "Por noche", "es,en",
            5500m, null, 4,
            new[] { Img("1597531072931-7d2ae08c0c46"), Img("1564013799919-ab600027ffc6"), Img("1542838132-92c53300491e") },
            new string?[] { "Vista al Arco", "Alberca infinity", "Sala principal" },
            new[] {
                new ReviewSeed("Camila B.", 5, "Vista que enamora", "Despertarse con el Arco frente a la cama no tiene precio. Anfitrión atentísimo.", 28),
                new ReviewSeed("Marcus R.", 5, null, "Best Airbnb-style stay we've ever had. The infinity pool view is unreal.", 56),
            }),
    };
}
