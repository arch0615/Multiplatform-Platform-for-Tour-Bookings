# Baja Tours — Tour & Service Booking Platform

## 1. Project Description
Baja Tours is an online booking marketplace for tourism services in Baja California Sur, Mexico (La Paz, Los Cabos, Cabo San Lucas). The platform connects tourists with local providers for tours, transportation, house rentals, and authentic experiences. It serves three user types: clients (tourists), providers (local operators), and administrators (internal team).

## 2. Page Structure
- `/` — Public Homepage (done)
- `/tours` — Search Results / Tour List (done)
- `/tours/:slug` — Tour Detail Page (done)
- `/booking/:tourId` — Booking / Checkout (3-step flow) (done)
- `/login` — Login (done)
- `/register` — Register (Client / Provider) (done)
- `/profile` — Client Profile (reservations, favorites, settings) (done)
- `/provider/dashboard` — Provider Dashboard (KPIs, charts, bookings) (done)
- `/provider/products` — Provider Product Management (done)
- `/provider/calendar` — Provider Calendar & Bookings (done)
- `/admin` — Admin Dashboard (sales, commissions, providers, reviews) (done)
- `*` — 404 Not Found (done)

## 3. Core Features
- [x] Public homepage with hero search, categories, featured tours, destinations
- [x] Tour search with filters (category, location, price, duration, language, rating)
- [x] Tour detail pages with gallery, booking widget, itinerary, reviews, FAQ, provider info
- [x] Booking/checkout flow (details → payment → confirmation)
- [x] User authentication (login/register) with social login
- [x] Client profile with bookings, favorites, profile editing
- [x] Provider dashboard with revenue charts, booking management
- [x] Provider product creation and editing (multi-step form)
- [x] Provider calendar view for bookings
- [x] Admin oversight (providers, commissions, coupons, review moderation)
- [x] Bilingual support (Spanish primary + English)
- [x] WhatsApp floating chat button
- [x] Cookie consent banner

## 4. Data Model Design

### Table: users
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| email | text | User email |
| full_name | text | Display name |
| phone | text | Mexican phone format |
| avatar_url | text | Profile photo |
| role | enum | client, provider, admin |
| created_at | timestamp | Registration date |

### Table: providers
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| company_name | text | Business name |
| rfc | text | Mexican tax ID |
| location | text | Business address |
| service_categories | text[] | Categories offered |
| commission_rate | decimal | Admin-set commission % |
| verified | boolean | Verified badge |
| status | enum | active, suspended |

### Table: tours (products)
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| provider_id | uuid | FK to providers |
| slug | text | URL-friendly name |
| title | text | Tour name |
| category | enum | Adventure, Cultural, Gastronomic, Transport, Housing, Fishing |
| location | text | La Paz, Los Cabos, Cabo San Lucas |
| description | text | Rich text description |
| duration | text | Duration string |
| languages | text[] | ES, EN, both |
| price_adult | decimal | Adult price in MXN |
| price_child | decimal | Child price in MXN |
| max_guests | integer | Capacity per session |
| rating | decimal | Average rating |
| review_count | integer | Number of reviews |
| images | text[] | Image URLs |
| status | enum | active, paused, archived |
| created_at | timestamp |

### Table: bookings
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| tour_id | uuid | FK to tours |
| date | date | Booking date |
| adults | integer | Adult count |
| children | integer | Child count |
| total_price | decimal | Final amount |
| status | enum | confirmed, pending, cancelled |
| created_at | timestamp |

### Table: reviews
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| booking_id | uuid | FK to bookings |
| user_id | uuid | FK to users |
| tour_id | uuid | FK to tours |
| rating | integer | 1-5 stars |
| comment | text | Review text |
| photos | text[] | Optional review photos |
| status | enum | approved, pending, rejected |
| created_at | timestamp |

## 5. Backend / Third-party Integration Plan
- **Supabase**: Authentication, database, storage for images. Needed for user accounts, provider profiles, bookings, reviews.
- **Shopify**: Not needed — this is a booking platform, not an e-commerce product store.
- **Stripe**: Needed for payment processing (credit cards). Mercado Pago and PayPal will be integrated via their respective SDKs.
- **WhatsApp Business API**: Floating chat button for customer support.

## 6. Development Phase Plan

### Phase 1: Homepage & Foundation (done)
- Goal: Build the public homepage with all sections and establish design system
- Deliverable: Responsive homepage with hero, search, categories, featured tours, destinations, how-it-works, testimonials, provider CTA, footer. Set up Tailwind colors, fonts, i18n, mock data.

### Phase 2: Search & Tour List Page (done)
- Goal: Build the tour search results page with filters and sorting
- Deliverable: `/tours` page with sidebar filters, tour card grid, map toggle, pagination

### Phase 3: Tour Detail Page (done)
- Goal: Build individual tour detail pages
- Deliverable: `/tours/:slug` with image gallery, sticky booking widget, description, itinerary, included/not-included, meeting point, reviews with ratings breakdown, FAQ accordion, provider card, similar tours

### Phase 4: Booking Flow (done)
- Goal: Build the 3-step checkout experience
- Deliverable: `/booking/:tourId` with details → payment → confirmation

### Phase 5: Authentication (done)
- Goal: Build login and register pages
- Deliverable: `/login` and `/register` with split layout, social login, client/provider toggle

### Phase 6: Client Profile (done)
- Goal: Build the user profile dashboard
- Deliverable: `/profile` with bookings, favorites, profile editing, password change

### Phase 7: Provider Dashboard (done)
- Goal: Build provider-facing pages
- Deliverable: `/provider/dashboard`, `/provider/products`, `/provider/calendar`

### Phase 8: Admin Dashboard (done)
- Goal: Build admin oversight pages
- Deliverable: `/admin` with sales KPIs, provider management, commissions, coupons, review moderation