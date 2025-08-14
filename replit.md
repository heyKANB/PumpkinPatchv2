# Overview

This is a 3D pumpkin farming game built with React Three Fiber and Express.js. The application features a fullstack architecture with a React frontend rendered in a 3D canvas environment and an Express.js backend with PostgreSQL database integration. Players can plant pumpkin seeds, watch them grow through different stages, and harvest mature pumpkins in an interactive 3D farm environment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React Three Fiber**: Core 3D rendering engine using React components for WebGL scenes
- **Radix UI Components**: Complete UI component library for interface elements
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Zustand State Management**: Three main stores handle game state:
  - `useFarm`: Manages farm grid, pumpkin growth stages, and player inventory
  - `useAudio`: Controls sound effects and music with mute functionality
  - `useGame`: Tracks game phases (ready, playing, ended)
- **TanStack React Query**: Data fetching and caching for API communication

## Backend Architecture
- **Express.js Server**: RESTful API server with middleware for JSON parsing and request logging
- **Memory Storage Interface**: Abstracted storage layer (`IStorage`) with in-memory implementation for user management
- **Vite Development Integration**: Hot module replacement and development server setup

## 3D Game Engine
- **Canvas-based Rendering**: Full-screen 3D environment with camera controls
- **Keyboard Controls**: WASD movement and E/Space for interaction using `@react-three/drei`
- **Component-based 3D Objects**: Modular pumpkin, farm, and UI components
- **Growth Animation System**: Time-based pumpkin growth with visual stage transitions
- **Audio Integration**: Sound effects for planting and harvesting actions

## Data Storage
- **Drizzle ORM**: Type-safe database interactions with PostgreSQL
- **Database Schema**: User authentication system with username/password storage
- **Migration System**: Schema versioning through Drizzle migrations
- **Neon Database**: Serverless PostgreSQL integration

## Game Mechanics
- **Grid-based Farming**: 8x8 farm grid with collision detection
- **Growth Stages**: Four-stage pumpkin lifecycle (seed → sprout → growing → mature)
- **Inventory System**: Seed management and harvest tracking
- **Real-time Updates**: 2-second growth intervals for dynamic gameplay

# External Dependencies

## Database
- **Neon PostgreSQL**: Serverless database hosting via `@neondatabase/serverless`
- **Connection pooling**: Environment-based database URL configuration

## 3D Graphics
- **Three.js**: WebGL 3D graphics library
- **React Three Fiber**: React renderer for Three.js scenes
- **React Three Drei**: Helper components and utilities for 3D development
- **Post-processing**: Visual effects through `@react-three/postprocessing`
- **GLSL Shaders**: Custom shader support via `vite-plugin-glsl`

## UI Framework
- **Radix UI**: Comprehensive primitive component library for accessibility
- **Lucide Icons**: SVG icon set for interface elements
- **Tailwind CSS**: Utility-first styling framework
- **Class Variance Authority**: Component variant management

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production
- **Replit Integration**: Runtime error overlay for development environment

## Audio System
- **Web Audio API**: Native browser audio handling for sound effects
- **Asset Management**: MP3/OGG/WAV file support through Vite configuration