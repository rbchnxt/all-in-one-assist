# EduVoice - AI-Powered Learning Assistant

## Overview

EduVoice is a voice-enabled educational platform that allows students to ask questions using speech recognition and receive AI-generated answers. The application provides a seamless learning experience with multi-language support, question history tracking, and translation capabilities. Students can register with their academic information and interact with the AI assistant through both voice and text input.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with three main routes (login, registration, dashboard)
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: React Query (TanStack Query) for server state management and local React hooks for component state

### Authentication System
- **Dual Authentication**: Supports both native email/password registration and Google OAuth simulation
- **Flow**: Frontend-only authentication with localStorage-based session management
- **User Management**: Custom authentication service with support for both auth methods
- **Test Accounts**: Auto-generated test credentials for development (student1@test.com, student2@test.com, student3@test.com - password: test123)

### Database Layer
- **Storage**: Browser localStorage-based database service for development
- **Schema**: Comprehensive student profiles with personal, academic, and contact information
- **Entities**: Students (full profile data) and Questions (Q&A history with language support)
- **Features**: Automatic test data generation, encrypted data storage simulation

### AI Integration
- **Primary**: LLaMA API integration through Together AI or custom endpoint
- **Fallback**: Custom API endpoint for cases where API keys are not available
- **Processing**: Educational context-aware prompt engineering for age-appropriate responses

### Voice and Translation Services
- **Speech Recognition**: Web Speech API with cross-browser compatibility
- **Translation**: Google Translate API integration for multi-language support
- **Audio Processing**: Browser-native speech recognition with language detection

### Component Architecture
- **Layout**: Responsive design with mobile-first approach
- **Modals**: Dialog-based interfaces for answers and registration
- **Forms**: React Hook Form with Zod validation schemas
- **Loading States**: Custom loading overlay component with contextual messages

### Server Architecture
- **Runtime**: Node.js with Express.js framework
- **Development**: Vite development server with HMR support
- **Production**: Static file serving with API proxy capabilities
- **Middleware**: Request logging and error handling

## External Dependencies

### Core Services
- **LLaMA API**: AI model integration for educational responses (with fallback endpoint)
- **Google Translate API**: Multi-language translation support
- **Web Speech API**: Browser-native speech recognition
- **localStorage**: Browser storage for development database simulation

### Development Tools
- **Vite**: Frontend build tool and development server
- **Drizzle Kit**: Database schema management and migrations
- **TypeScript**: Type safety across client and server code

### UI Libraries
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hook Form**: Form validation and management

### API Integrations
- **Web Speech API**: Browser-native speech recognition
- **Google OAuth**: Authentication through Supabase
- **Custom LLaMA endpoints**: Fallback AI service integration