# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **youlianVisitor** project built with the unibest framework - a modern uniapp development template using Vue3 + TypeScript + Vite5 + UnoCSS + wot-design-uni. It supports cross-platform development for H5, mini-programs, and mobile apps without requiring HBuilderX.

## Key Commands

### Development
- `pnpm dev` or `pnpm dev:h5` - Run H5 development server (http://localhost:9000)
- `pnpm dev:mp` or `pnpm dev:mp-weixin` - Build for WeChat mini-program development
- `pnpm dev:app` - Build for mobile app development

### Building
- `pnpm build` or `pnpm build:h5` - Build H5 for production
- `pnpm build:mp` or `pnpm build:mp-weixin` - Build WeChat mini-program for production
- `pnpm build:app` - Build mobile app for production

### Code Quality
- `pnpm lint` - Run ESLint checks
- `pnpm lint:fix` - Auto-fix ESLint issues
- `pnpm type-check` - Run TypeScript type checking

### Environment Requirements
- Node.js >= 22
- pnpm 10.10.0 (exact version required)

## Architecture

### Directory Structure
- `src/pages/` - Page components with auto-routing via @uni-helper/vite-plugin-uni-pages
- `src/pages-sub/` - Sub-package pages for app bundle optimization
- `src/components/` - Reusable components with auto-import
- `src/layouts/` - Layout templates (default.vue, tabbar.vue)
- `src/api/` - API endpoint definitions
- `src/service/` - Generated API services (auto-generated from OpenAPI)
- `src/http/` - HTTP request handling with alova and vue-query
- `src/store/` - Pinia state management
- `src/hooks/` - Composable functions (auto-imported)
- `src/utils/` - Utility functions
- `src/tabbar/` - Bottom navigation configuration

### Key Configuration Files
- `vite.config.ts` - Main build configuration with platform-specific settings
- `pages.config.ts` - Page routing and tabbar configuration
- `manifest.config.ts` - App manifest for different platforms
- `uno.config.ts` - UnoCSS styling configuration
- `env/` - Environment variables directory

### Auto-Import Features
- Vue composition APIs and uni-app APIs auto-imported
- Components from `src/components/` auto-imported
- Hooks from `src/hooks/` and store from `src/store/` auto-imported
- Generated type definitions in `src/types/`

### HTTP Requests
The project uses both alova and vue-query for HTTP requests:
- alova: `src/http/alova.ts` - Main HTTP client with uniapp adapter
- vue-query: `src/http/vue-query.ts` - React Query-like data fetching
- Generated services in `src/service/` from OpenAPI specs

### Styling
- UnoCSS for utility-first CSS with custom shortcuts (e.g., `center` class)
- wot-design-uni component library
- Platform-specific safe area handling with custom utilities (`p-safe`, `pt-safe`, `pb-safe`)
- Theme colors via CSS custom properties

### Code Conventions
- TypeScript strict mode enabled
- ESLint with @uni-helper/eslint-config
- Vue 3 Composition API with `<script setup>`
- File-based routing with route blocks for page configuration
- Component naming: PascalCase for components, kebab-case for files

### Platform Support
The project targets: H5, iOS, Android, WeChat mini-program, and other mini-program platforms. Use platform-specific code with `#ifdef` directives when needed.

### Development Notes
- Use `uni.*` APIs for cross-platform compatibility
- Environment variables in `env/` directory (not root `.env`)
- Generated files (pages.json, manifest.json, types) are ignored by ESLint
- Tabbar configuration in `src/tabbar/config.ts`
- Layout system via @uni-helper/vite-plugin-uni-layouts