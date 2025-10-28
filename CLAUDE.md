# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment Setup

### Prerequisites

Before running the project, you need to set up accounts and obtain API keys for the following services:

1. **Neon PostgreSQL** (Database)
   - Create account at https://neon.tech
   - Create a new project
   - Copy your database connection string

2. **NextAuth.js** (Authentication)
   - Generate a secret: `openssl rand -base64 32`
   - Set up OAuth providers (GitHub, Google)

3. **GitHub OAuth** (Login Provider)
   - Create OAuth app at https://github.com/settings/developers
   - Copy Client ID and Client Secret

4. **Google OAuth** (Login Provider)
   - Create OAuth project at https://console.cloud.google.com
   - Create OAuth 2.0 credentials
   - Copy Client ID and Client Secret

5. **Replicate.io** (AI Image Models)
   - Create account at https://replicate.com
   - Copy your API token for AI features (background removal, image generation)

6. **Unsplash API** (Image Library)
   - Create app at https://unsplash.com/oauth/applications
   - Copy your Access Key

7. **Stripe** (Payment Processing)
   - Create account at https://stripe.com
   - Create a product and price
   - Copy Secret Key, Webhook Secret, and Price ID

8. **UploadThing** (File Uploads)
   - Create account at https://uploadthing.com
   - Create an app
   - Copy your API token

### Setting Up Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

Fill in `.env` with your actual credentials from the services above

**Important**: Never commit `.env` to version control. The `.env.example` file shows required variables without secrets.

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

## Dependencies & Libraries

### Core Framework & UI
- `next` (15.1.6) - React framework for production
- `react` (19.0.0) - JavaScript library for building user interfaces
- `react-dom` (19.0.0) - React package for working with the DOM
- `typescript` (5) - Typed superset of JavaScript

### State Management & Data Fetching
- `@tanstack/react-query` (5.66.0) - Server state management, caching, and synchronization
- `zustand` (5.0.3) - Lightweight state management library
- `next-auth` (5.0.0-beta.25) - Authentication for Next.js applications

### Canvas & Graphics
- `fabric` (6.5.4) - JavaScript canvas library for interactive objects and drawings
- `react-color` (2.19.3) - React color picker component
- `material-colors` (1.2.6) - Material Design color palette
- `lucide-react` (0.474.0) - Icon library
- `react-icons` (5.4.0) - Icon library with multiple icon sets

### UI Components & Styling
- `@radix-ui/react-avatar` - Avatar component
- `@radix-ui/react-dialog` - Dialog/modal component
- `@radix-ui/react-dropdown-menu` - Dropdown menu component
- `@radix-ui/react-label` - Label component
- `@radix-ui/react-popover` - Popover component
- `@radix-ui/react-scroll-area` - Scrollable area component
- `@radix-ui/react-separator` - Separator/divider component
- `@radix-ui/react-slider` - Slider/range input component
- `@radix-ui/react-slot` - Slot composition utility
- `@radix-ui/react-tooltip` - Tooltip component
- `tailwindcss` (3.4.1) - Utility-first CSS framework
- `tailwindcss-animate` (1.0.7) - Animation utilities for Tailwind CSS
- `tailwind-merge` (3.0.1) - Merge Tailwind CSS classes without conflicts
- `class-variance-authority` (0.7.1) - Component styling patterns
- `clsx` (2.1.1) - Utility for constructing className strings
- `next-themes` (0.4.4) - Theme management (dark/light mode)

### Database & ORM
- `drizzle-orm` (0.39.2) - TypeScript ORM for relational databases
- `drizzle-zod` (0.7.0) - Zod schema generation from Drizzle
- `@neondatabase/serverless` (0.10.4) - Serverless Postgres client (HTTP driver)
- `@auth/drizzle-adapter` (1.7.4) - NextAuth.js adapter for Drizzle ORM

### API & Server
- `hono` (4.7.0) - Lightweight web framework
- `@hono/auth-js` (1.0.15) - NextAuth.js middleware for Hono
- `@hono/zod-validator` (0.4.2) - Zod validation middleware for Hono

### Authentication & Security
- `@auth/core` (0.37.4) - Core NextAuth.js authentication engine
- `bcrypt-edge` (0.1.0) - Password hashing with edge runtime support

### External Service Integrations
- `stripe` (17.6.0) - Stripe payment processing SDK
- `replicate` (1.0.1) - Replicate AI API client
- `unsplash-js` (7.0.19) - Unsplash API client
- `uploadthing` (7.4.4) - File upload service
- `@uploadthing/react` (7.1.5) - React components for UploadThing

### Utilities & Helpers
- `zod` (3.24.1) - TypeScript-first schema validation
- `date-fns` (4.1.0) - Modern date utility library
- `lodash.debounce` (4.0.8) - Debouncing utility
- `uuid` (11.0.5) - UUID generation
- `sonner` (1.7.4) - Toast notification library
- `react-use` (17.6.0) - React hooks library
- `use-file-picker` (2.1.2) - File picker hook for React

### Development & Build Tools
- `drizzle-kit` (0.30.4) - Drizzle ORM migration and schema tools
- `eslint` (9) - JavaScript linter
- `eslint-config-next` (15.1.6) - ESLint configuration for Next.js
- `postcss` (8) - CSS transformation tool
- `dotenv` (16.4.7) - Environment variable loader
- `@types/` - TypeScript type definitions for various libraries


