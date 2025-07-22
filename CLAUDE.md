# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-platform music player application built with **Taro 4 + Vue 3 + TypeScript + Sass**. The app supports WeChat Mini Programs, Alipay Mini Programs, H5, and other platforms. It features music playback, search functionality, playlist management, and a responsive UI.

## Development Commands

### Development (Watch Mode)
- **WeChat Mini Program**: `npm run dev:weapp`
- **H5**: `npm run dev:h5`
- **Alipay Mini Program**: `npm run dev:alipay`
- **ByteDance Mini Program**: `npm run dev:tt`
- **Baidu Mini Program**: `npm run dev:swan`
- **QQ Mini Program**: `npm run dev:qq`

### Production Build
- **WeChat Mini Program**: `npm run build:weapp`
- **H5**: `npm run build:h5`
- **Alipay Mini Program**: `npm run build:alipay`
- **ByteDance Mini Program**: `npm run build:tt`
- **Baidu Mini Program**: `npm run build:swan`
- **QQ Mini Program**: `npm run build:qq`

## Architecture

### State Management
- **Pinia** is used for state management with composition API style
- Main store: `src/store/music.ts` - handles music playback state, playlist management, and player controls
- User store: `src/store/user.ts` - manages user authentication and profile data

### Core Components
- **MiniPlayer** (`src/components/MiniPlayer/`) - Bottom music player component displayed across pages
- **Carousel** (`src/components/Carousel/`) - Image carousel component for home page
- **TabBar** (`src/components/TabBar.vue`) - Custom tab bar component

### Key Pages
- **Home** (`src/pages/index/`) - Main landing page with music recommendations
- **Player** (`src/pages/player/`) - Full-screen music player with controls and progress
- **Search** (`src/pages/search/`) - Music search with history and suggestions
- **Study/Practice/Profile** - Learning-related pages (this appears to be a learning assistant app)

### API Layer
- **Request Utils** (`src/utils/request.ts`) - HTTP client wrapper with interceptors, token management, and error handling
- **API Modules** (`src/api/`) - Organized API endpoints for different features
- Base URL configured in `src/utils/request.ts` (currently localhost:8080)

### Path Aliases
All path aliases are configured in both `tsconfig.json` and `config/index.js`:
- `@/components/*` → `src/components/*`
- `@/utils/*` → `src/utils/*`
- `@/assets/*` → `src/assets/*`
- `@/pages/*` → `src/pages/*`
- `@/store/*` → `src/store/*`
- `@/types/*` → `src/types/*`
- `@/styles/*` → `src/styles/*`

### Type Definitions
- **Music Types** (`src/types/music.ts`) - Music, Playlist, and PlayerState interfaces
- **User Types** (`src/types/user.ts`) - User-related type definitions

### Styling
- **Global Variables** (`src/styles/variables.scss`) - SCSS variables automatically imported globally
- **Global Styles** (`src/app.scss`) - Application-wide styles
- Design width: 750px (standard for Taro projects)

## Key Notes
- Project uses Taro 4.1.2 with Vue 3 and TypeScript
- Built with Webpack 5 as the compiler
- Supports multiple mini-program platforms plus H5
- Token-based authentication with automatic refresh handling
- Comprehensive error handling in API layer
- No linting commands defined in package.json - add if needed