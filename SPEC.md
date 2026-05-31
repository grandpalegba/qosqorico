# Qosqorico — Reconstruction spec

## Stack
- React 18 + Vite
- TailwindCSS + shadcn/ui (new-york style, JSX not TSX)
- React Router v6 (BrowserRouter)
- TanStack Query v5 (QueryClient)
- base44 SDK (@base44/sdk) — auth + entities + integrations
- Framer Motion, Lucide React
- Fonts: DM Sans (Google Fonts)

## Entrypoint
src/main.jsx → <App /> → <LangProvider><AuthProvider><QueryClientProvider><Router>

## Directory structure
src/api/           → base44Client.js
src/components/    → custom UI components
src/components/ui/ → shadcn/ui primitives (43 files)
src/components/menu/        → MenuItemCard, MenuItemModal, OrderCart
src/components/reservation/ → MiniCalendar, ServiceCard, TimeSlotPicker
src/entities/      → JSON schemas (Order, Reservation, Favorite, Message, Review, User)
src/hooks/         → use-mobile.jsx
src/lib/           → AuthContext, LangContext, PageNotFound, data files, utils
src/pages/         → 13 page components
src/App.jsx        → routes + providers
src/main.jsx       → ReactDOM entry
src/index.css      → Tailwind + CSS variables

## Routes (React Router v6)
/                           → Home
/login                      → Login
/register                   → Register
/forgot-password            → ForgotPassword
/reset-password             → ResetPassword
/series/:seriesName         → Series
/provider/:providerId       → Profile
/payment                    → Payment
/watch/:providerId/:episodeIndex → VideoPlayer
/reservations               → Reservations
/menu                       → Menu
/my-reservations            → MyReservations
/settings                   → Settings
*                           → PageNotFound

## Entities (base44 SDK)
Accessed via: base44.entities.<Name>.filter() / .create() / .delete()
- Order        — cart/order lifecycle (status: cart→submitted→preparing→ready)
- Reservation  — booking with service, date, time slot, guest info
- Favorite     — saved provider bookmarks
- Message      — provider↔user messaging
- Review       — 6-dimension scoring system
- User         — role (explorador/proveedor/admin) + referral

## Auth
base44.auth.me() / .logout() / .redirectToLogin()
Context: src/lib/AuthContext.jsx → export useAuth()

## i18n
src/lib/LangContext.jsx → export useLang()
Languages: ES (default), EN, FR

## Environment variables required
VITE_BASE44_APP_ID=
VITE_BASE44_FUNCTIONS_VERSION=
VITE_BASE44_APP_BASE_URL=
