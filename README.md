# Resume Analyzer

## Overview

Resume Analyzer is a modern web application that provides AI-powered resume analysis and feedback. Users can upload their resumes and receive comprehensive analysis including ATS compatibility scores, keyword extraction, career timeline visualization, and actionable improvement suggestions. The application features a clean, professional interface with dark/light mode support and responsive design patterns inspired by modern productivity tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system supporting light/dark themes
- **Build Tool**: Vite for fast development and optimized production builds

### Component Structure
- **Modular Design**: Components are organized by feature (analytics, career timeline, keywords, etc.)
- **Design System**: Consistent spacing, typography, and color schemes following modern design principles
- **Responsive Layout**: Mobile-first approach with adaptive layouts for different screen sizes
- **Theme System**: Built-in dark/light mode with CSS custom properties for dynamic theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Structure**: RESTful API design with /api prefix for all endpoints
- **Request Handling**: Express middleware for JSON parsing, CORS, and request logging
- **Error Handling**: Centralized error handling with structured error responses

### Data Management
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Definition**: Shared TypeScript schemas using Zod for validation
- **Storage Interface**: Abstracted storage layer supporting multiple backends (currently in-memory for development)
- **Data Models**: User management and resume analysis result schemas

### Development Architecture
- **Monorepo Structure**: Client, server, and shared code in a single repository
- **Hot Reloading**: Vite development server with HMR for rapid development
- **Build Process**: Separate build processes for client (Vite) and server (esbuild)
- **Path Aliases**: Configured aliases for clean imports (@/ for client, @shared/ for shared code)

## External Dependencies

### UI and Styling
- **Radix UI**: Complete set of accessible UI primitives for building the component library
- **Tailwind CSS**: Utility-first CSS framework for styling and responsive design
- **Lucide React**: Modern icon library for consistent iconography
- **Inter Font**: Google Fonts integration for professional typography

### Data Visualization
- **Chart.js**: Canvas-based charting library for creating interactive data visualizations
- **Recharts**: React-specific charting library for declarative chart components

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **TypeScript**: Static type checking across the entire application
- **Vite**: Build tool and development server with optimized bundling

### Database
- **Neon Database**: PostgreSQL-compatible serverless database (configured via DATABASE_URL)
- **Drizzle ORM**: Type-safe database ORM with automatic migration generation

### Form Management
- **React Hook Form**: Performant form library with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and validation libraries

### Additional Libraries
- **TanStack Query**: Powerful data synchronization for React applications
- **Wouter**: Minimalist routing library for single-page applications
- **Date-fns**: Modern JavaScript date utility library
- **Class Variance Authority**: Utility for creating type-safe component variants
- **clsx**: Utility for constructing className strings conditionally
