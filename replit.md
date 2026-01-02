# Casper Loyalty LaaS

## Overview

A blockchain-based loyalty points management platform built on the Casper Network. This application enables merchants to issue and manage loyalty points through smart contracts, with users connecting via Casper-compatible wallets. The platform provides a modern dashboard interface for point balance viewing and claims.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled via Vite
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with CSS variables for theming, using a dark "deep space" theme
- **Component Library**: shadcn/ui components (New York style) built on Radix UI primitives
- **Animations**: Framer Motion for smooth UI transitions
- **Wallet Integration**: @make-software/csprclick-ui for Casper wallet connections (supports Casper Wallet, Ledger, Torus, MetaMask Snap)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript compiled with tsx for development, esbuild for production
- **API Design**: RESTful endpoints with Zod schema validation shared between client and server
- **Build System**: Custom build script using esbuild for server bundling and Vite for client

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` with shared types between frontend and backend
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization
- **Current State**: Minimal schema focused on blockchain interactions; storage layer exists but is lightweight

### Blockchain Integration
- **Network**: Casper Network (configured for testnet)
- **SDK**: casper-js-sdk v5 for transaction building and deployment
- **Smart Contract Interaction**: Server-side point issuance via merchant private key
- **Required Environment Variables**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `NODE_ADDRESS`: Casper node RPC endpoint
  - `NETWORK_NAME`: Network identifier (e.g., "casper-test")
  - `CONTRACT_HASH`: Deployed loyalty contract hash
  - `MERCHANT_PRIVATE_KEY`: Hex-encoded Ed25519 private key for signing transactions

### API Structure
- **Endpoint**: `POST /api/issue-points`
- **Input**: `{ userAddress: string, amount: number }` validated via Zod
- **Response**: `{ success: boolean, deployHash?: string, message?: string }`
- **Route Definitions**: Centralized in `shared/routes.ts` with type-safe schemas

### Development Workflow
- Development server uses Vite middleware with HMR
- Production build creates static assets in `dist/public` and server bundle in `dist/index.cjs`
- Path aliases configured: `@/` for client source, `@shared/` for shared code

## External Dependencies

### Blockchain Services
- **Casper Network**: Primary blockchain for loyalty point smart contracts
- **Casper Click**: Wallet connection service supporting multiple wallet providers

### Database
- **PostgreSQL**: Primary data store (requires `DATABASE_URL` environment variable)

### Third-Party UI Libraries
- **styled-components**: Required dependency for csprclick-ui theming
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library

### Build & Development Tools
- **Vite**: Frontend build tool with React plugin and Replit-specific plugins
- **esbuild**: Server-side bundling for production
- **Drizzle Kit**: Database migration management