# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Canva Clone** is a full-stack Next.js 15 design editor application (running on port 3008) that allows users to create visual content with templates, shapes, images, and AI capabilities. The architecture combines a Next.js frontend with a Hono API backend, PostgreSQL database (via Drizzle ORM), and integrations with Stripe, Replicate, Unsplash, and UploadThing.

## Development Commands

```bash
# Start development server (port 3008)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code with ESLint
npm run lint

# Database operations
npm run db:generate    # Generate migrations from schema changes
npm run db:migrate     # Apply pending migrations to database
npm run db:studio      # Open Drizzle Studio GUI for database inspection
```

## Codebase Architecture

### Directory Structure & Purpose

```
src/
├── app/                              # Next.js 15 App Router pages
│   ├── (auth)/                       # Auth pages: sign-in, sign-up (public routes)
│   ├── (dashboard)/                  # Dashboard group: projects list, templates (protected)
│   ├── editor/[projectId]/           # Main canvas editor (protected)
│   ├── api/[[...route]]/             # Hono API routes (microrouter pattern at /api)
│   │   ├── [[...route]]/route.ts     # Main Hono app setup + routes
│   │   ├── auth/[...nextauth]/       # NextAuth.js handlers
│   │   └── uploadthing/              # UploadThing file upload handlers
│   ├── layout.tsx                    # Root layout with auth & theme providers
│   └── globals.css                   # Global TailwindCSS + custom styles
│
├── features/                         # Feature-based modular organization
│   ├── auth/                         # Authentication: sign-in/up forms, OAuth logic
│   ├── editor/                       # Canvas editor: hooks, components, utilities
│   │   ├── hooks/                    # useEditor, useHistory, useCanvasEvents, etc.
│   │   ├── components/               # Editor UI (toolbar, sidebars, dialogs)
│   │   ├── utils/                    # Canvas operations, serialization, filters
│   │   └── types.ts                  # Editor-specific types
│   ├── projects/                     # Project CRUD: API hooks, mutation logic
│   ├── ai/                           # AI features: image generation, background removal
│   ├── images/                       # Image library: Unsplash integration
│   └── subscriptions/                # Stripe: checkout, billing portal, webhook
│
├── components/                       # Shared UI components
│   ├── providers.tsx                 # AuthProvider, QueryClientProvider, ThemeProvider
│   └── ui/                           # Shadcn/Radix UI component library
│
├── db/                               # Database layer
│   ├── schema.ts                     # Drizzle ORM schema definitions
│   └── index.ts                      # Database client & connection setup
│
├── lib/                              # External service integrations & utilities
│   ├── auth.ts, auth.config.ts       # NextAuth configuration & callbacks
│   ├── stripe.ts                     # Stripe client & helpers
│   ├── replicate.ts                  # Replicate AI API client
│   └── validators.ts                 # Zod schemas for API validation
│
└── config/                           # Application configuration
    └── (constants, feature flags, etc.)

public/                              # Static assets (SVG shapes, logos)
drizzle.config.ts                    # Drizzle migration configuration
next.config.ts                       # Image optimization, remotePatterns
tailwind.config.ts                   # TailwindCSS configuration
tsconfig.json                        # TypeScript configuration
```

### Architectural Patterns

#### **1. Feature-Based Organization**

Each feature folder (e.g., `features/editor/`, `features/projects/`) contains:
- `api/` - React Query hooks for API calls (queries & mutations)
- `components/` - Feature-specific React components
- `hooks/` - Reusable custom hooks (canvas operations, state management)
- `utils/` - Helper functions, formatting, serialization
- `types.ts` - TypeScript interfaces/types for the feature

**Benefit**: Colocated code is easier to navigate and reduces import depth.

#### **2. Canvas Editor Architecture**

The editor uses a `useEditor` custom hook that coordinates all canvas operations:

```typescript
useEditor Hook
├── useHistory           # Undo/redo with state stack (debounced saves)
├── useClipboard         # Copy/paste with deep object cloning
├── useCanvasEvents      # Selection, modification, interaction events
├── useHotkeys           # Keyboard shortcuts (Ctrl+Z, etc.)
├── useAutoResize        # Responsive canvas resizing
└── useLoadState         # Rehydrate canvas from JSON

↓ manages ↓

Fabric.js Canvas Instance (stored in ref)
├── Workspace Rect       # Virtual page (clipped container for exports)
├── Objects              # Shapes, text, images, drawn paths
└── Drawing Mode         # Freehand brush
```

**State Serialization**: Canvas state stored as JSON in `projects.json` column:
- Objects use `toDatalessJSON()` (external URLs, no embedded image data)
- Rehydrated with `canvas.loadFromJSON()` + `canvas.renderAll()`
- Debounced saves prevent excessive DB writes (1000ms)

#### **3. API Architecture (Hono Framework)**

All API routes mounted at `/api` using Hono's modular router pattern:

**Authentication**: Protected with NextAuth JWT middleware via `@hono/auth-js`
- All protected routes verify auth with `verifyAuth()` → injects `authUser` into context
- Public routes (images, stripe webhooks) skip auth

**Key Routes**:
| Route | Methods | Auth | Purpose |
|-------|---------|------|---------|
| `/projects` | GET, POST, PATCH, DELETE | ✓ | CRUD operations, fetch templates |
| `/projects/:id/duplicate` | POST | ✓ | Clone projects |
| `/ai/remove-bg`, `/ai/generate-image` | POST | ✓ | Replicate AI APIs |
| `/images` | GET | ✗ | Unsplash random images |
| `/subscriptions/*` | Varies | Varies | Stripe integration (checkout, webhook) |

#### **4. Database & ORM**

**ORM**: Drizzle ORM with PostgreSQL via Neon HTTP (`@neondatabase/serverless`)

**Core Tables**:
- `users` - Email/password credentials, OAuth accounts
- `projects` - Canvas designs (name, JSON state, dimensions, thumbnail, isPro flag)
- `subscriptions` - Stripe subscription tracking (subscriptionId, customerId, status, periodEnd)
- Auth adapter tables - NextAuth: accounts, sessions, verificationTokens, authenticators

**Patterns**:
- Zod schema integration (`drizzle-zod`) for type-safe validation
- Relations defined in schema (automatic foreign key constraints)
- Drizzle Kit migrations for schema changes

#### **5. State Management**

| State Layer | Tool | Scope | Usage |
|-----------|------|-------|-------|
| Server State | React Query | API data caching | Projects, templates, images |
| Client State | useState | Component/Form | UI toggles, input values, selection |
| Canvas State | useRef + useState | Editor only | Fabric instance, history stack, objects |
| Modal State | Zustand | Global | Subscription modals (minimal) |

**Hydration**: Server-side auth check in protected pages via `protectServer()` utility → prevents unauthorized access.

#### **6. Authentication Flow**

**Providers**:
1. **Credentials** - Email/password with bcrypt-edge hashing
2. **Google OAuth** - via `next-auth/providers/google`
3. **GitHub OAuth** - via `next-auth/providers/github`

**Configuration** (`src/lib/auth.config.ts`):
- **Session Strategy**: JWT (custom claims include `user.id`)
- **Adapter**: DrizzleAdapter (persists sessions in DB)
- **Callbacks**:
  - `jwt()` - Adds `user.id` to token
  - `session()` - Injects `session.user.id` from token
  - `signIn()` - Custom email/password validation

**Protected Routes**:
- All API endpoints: `verifyAuth()` middleware
- Dashboard/editor pages: `protectServer()` server-side check
- Sign-in page: Redirect if already authenticated

### External Integrations

#### **Replicate.io** (AI Image Models)
- **Models**: `cjwbw/rembg` (background removal), `stability-ai/stable-diffusion-3` (image generation)
- **API**: POST endpoints at `/ai/remove-bg` and `/ai/generate-image`
- **Webhook**: Polls for completion status
- **Env Var**: `REPLICATE_API_TOKEN`

#### **Unsplash API** (Image Library)
- **Feature**: Fetch 50 random images from collection
- **Endpoint**: GET `/api/images` (no auth required)
- **Env Var**: `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`

#### **Stripe** (Payment Processing)
- **Checkout**: `POST /api/subscriptions/checkout` → creates session with metadata
- **Billing Portal**: `POST /api/subscriptions/billing` → returns portal URL
- **Webhook**: `POST /api/subscriptions/webhook` → listens for checkout.session.completed, invoice.payment_succeeded
- **Env Vars**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`

#### **UploadThing** (File Uploads)
- **Config**: `src/app/api/uploadthing/core.ts`
- **Type-Safe**: Generated components for file uploads
- **Env Var**: `UPLOADTHING_TOKEN`

### Key Conventions & Patterns

1. **Protected API Routes**: All routes with `verifyAuth()` middleware before handler
2. **Debounced Saves**: Canvas changes auto-save with 1000ms debounce to prevent DB overload
3. **Image Optimization**: `next.config.ts` includes remotePatterns for Unsplash, UploadThing
4. **Type Safety**: Drizzle schemas + Zod validators ensure single source of truth
5. **Error Handling**: Sonner toast notifications for user feedback
6. **Component Exports**: Import from feature folders to avoid deep imports (`from '@/features/editor/components'`)
7. **Workspace Pattern**: Virtual "workspace" Rect on canvas defines export bounds (objects outside are hidden)
8. **Polymorph Structure**: Each feature mirrors structure (api/, components/, hooks/, utils/)

## Important Setup Details

### Required Environment Variables

```
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host/dbname

# NextAuth
AUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_GITHUB_ID=<from GitHub OAuth app>
AUTH_GITHUB_SECRET=<from GitHub OAuth app>
AUTH_GOOGLE_ID=<from Google Cloud Console>
AUTH_GOOGLE_SECRET=<from Google Cloud Console>

# External APIs
REPLICATE_API_TOKEN=<from replicate.com>
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=<from unsplash.com>

# Stripe
STRIPE_SECRET_KEY=<from stripe.com dashboard>
STRIPE_WEBHOOK_SECRET=<from stripe.com webhook endpoint>
STRIPE_PRICE_ID=<Stripe product price ID>
NEXT_PUBLIC_APP_URL=http://localhost:3008 (dev), https://yourapp.com (prod)

# File Upload
UPLOADTHING_TOKEN=<from uploadthing.com>
```

### Database Workflow

```bash
# After schema changes in src/db/schema.ts
npm run db:generate    # Creates migration file in drizzle/ folder

# Before running app
npm run db:migrate     # Applies migrations to database

# During development
npm run db:studio      # GUI inspection of live database
```

### Canvas Export Functionality

Objects are exported respecting the **workspace bounds** (virtual page):
- Objects behind workspace are sent to back layer
- Only objects within workspace are visible in exports
- Exports to PNG, JPEG, SVG, or JSON

### Fabric.js Canvas Objects

Supported object types:
- **Text** - Textbox with font styling (family, size, weight, alignment, etc.)
- **Shapes** - Circle, Rectangle, Triangle, Diamond, Polygon, and custom SVG shapes
- **Images** - JPEG, PNG, WebP from URLs
- **Drawings** - Freehand paths with brush customization
- **Filters** - Brightness, contrast, saturation, blur, grayscale (applied to any object)

All objects support: fill color, stroke (color, width, dash-array), opacity, rotation, scaling, layering (bring forward/send back), grouping/ungrouping, alignment.

## Common Development Tasks

### Adding a New API Route

1. Create handler in appropriate file within `src/app/api/[[...route]]/`
2. Add to Hono router in `route.ts`
3. Protect with `verifyAuth()` if user-specific
4. Use Zod validators for request body
5. Return JSON response with proper error handling

### Adding a New Canvas Feature

1. Add hook in `src/features/editor/hooks/` (e.g., `useNewFeature.ts`)
2. Integrate into `useEditor` hook
3. Add UI components in `src/features/editor/components/`
4. Test canvas state serialization/deserialization

### Modifying Database Schema

1. Update schema in `src/db/schema.ts`
2. Run `npm run db:generate`
3. Review generated migration file in `drizzle/`
4. Run `npm run db:migrate`
5. Update API routes/types as needed

### Working with Canvas State

- Access canvas instance via `editorRef` in useEditor
- Use `canvas.toDatalessJSON(JSON_KEYS)` for serialization
- Use `canvas.loadFromJSON()` for deserialization
- Always call `canvas.renderAll()` after state updates
- Debounce saves in editor to prevent DB spam

## Technology Stack

**Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, Radix UI, Fabric.js, React Query
**Backend**: Hono, NextAuth.js, Drizzle ORM
**Database**: PostgreSQL (Neon)
**Services**: Stripe, Replicate, Unsplash, UploadThing
**Dev Tools**: ESLint, TypeScript, Drizzle Kit
