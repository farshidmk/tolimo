# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for the Tolimo exam system (سازمان سنجش و آموزش کشور), an online testing platform for language assessments. The application is built with React 19, TypeScript, and uses a Right-to-Left (RTL) layout for Persian/Farsi language support.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Core Architecture

### State Management
The application uses **Zustand** with session storage persistence for exam state management:
- **Primary store**: [src/hooks/useExamStore.ts](src/hooks/useExamStore.ts) - manages all exam-related state including:
  - Exam and section timer management (multiple concurrent timers)
  - Question navigation and auto-progression
  - Answer tracking and submission
  - Section transitions with automatic timer switching
  - State persisted to sessionStorage (except intervals/timers)

### Provider Architecture
The app wraps components in a layered provider structure at [src/app/layout.tsx](src/app/layout.tsx):
1. **ApplicationProviders** [src/providers/ApplicationProviders.tsx](src/providers/ApplicationProviders.tsx):
   - **AuthProvider**: Authentication, React Query client, and API call handling
   - **RTL CacheProvider**: Emotion cache with RTL plugin for Material-UI
   - **ThemeProvider**: Material-UI theme with Persian font (Vazirmatn)
   - **ToastContainer**: Global toast notifications
   - **ReactQueryDevtools**: Development tools for React Query

### Authentication & API
- **AuthProvider** [src/providers/AuthProvider.tsx](src/providers/AuthProvider.tsx) manages:
  - JWT token storage in cookies (`js-cookie`)
  - User info (firstName, lastName, image)
  - React Query integration with default query/mutation handlers
  - Authorization header injection for all API calls
  - API base URL from `NEXT_PUBLIC_API_URL` env variable

- **API Configuration** [src/services/serverCall.ts](src/services/serverCall.ts):
  - Axios instance with `withCredentials: true`
  - Base URL defaults to `http://localhost:3008` if env not set

### Routing Structure
- `/` - Main landing page
- `/login` - Authentication page
- `/confirm` - Confirmation page
- `/exam` - Main exam interface with custom layout
  - Uses [src/app/exam/layout.tsx](src/app/exam/layout.tsx) for exam-specific UI
  - Question rendering at [src/app/exam/page.tsx](src/app/exam/page.tsx)

### Component Organization

**Exam Components** (`src/app/exam/_components/`):
- `layout/` - Exam navigation and UI (ExamButtons, SectionInfoInNavbar)
- `passage/` - Passage/content rendering (RenderPassage)
- `question/` - Question display logic:
  - `questionTypes/` - Type-specific renderers (SingleChoiceQuestion, ListeningLecture, etc.)
  - `ShowQuestion.tsx` - Main question orchestrator
  - `ShowEmbeddedQuestion.tsx` - Embedded question handler
  - `RenderQuestionByType.tsx` - Question type router

**Shared Components** (`src/components/`):
- `errors/` - Error handling (ErrorHandler, ShowErrors)
- `formItems/` - Dynamic form rendering (RenderFormItem, RenderTextInput, RenderSelectInput)
- `statusHandler/` - Status management

### Type System

The exam data model is complex and well-typed in `src/types/`:

- **[exam.ts](src/types/exam.ts)**: Core exam structure
  - `Exam`: Top-level exam with sections
  - `ExamSection`: Section with questions, timers, and answer constraints
  - `SectionQuestion`: Individual question with passages, form objects, and timing rules
  - `Passage`: Content blocks (text, audio, images, etc.)
  - `EmbeddedFile`: Media files with playback controls
  - Enums: `FileType`, `PassageType`

- **[question.ts](src/types/question.ts)**: Question taxonomy
  - `QuestionKind` enum: Comprehensive question types (SingleChoice, Reading_SingleChoice, Listening_Lecture, Writing_Lecture, Speaking, etc.)
  - `TestType` enum: Test categories (Tolimo = 3)

- **[server.d.ts](src/types/server.d.ts)**: API contracts
  - `ServerCall<T>`: Axios request config wrapper
  - `ServerResponse<T>`: Standard response format with `isSuccessful`, `message`, `statusCode`

### Exam Timer Architecture

The exam system manages multiple concurrent timers:
1. **Exam-wide timer** (`examTimeLeft`) - counts down total exam time
2. **Section-specific timers** - each section has independent `timeLeft`
3. **Auto-next question timer** (`questionAutoNextTimeLeft`) - for timed question progression
4. **Timer controls**:
   - Timers stored in Zustand but NOT persisted (intervals cleared on reload)
   - `startExamTimer()` / `stopExamTimer()` - exam-level control
   - `startActiveSectionTimer()` / `stopActiveSectionTimer()` - section-level control
   - `autoNextQuestionAfter(seconds)` - auto-advance to next question
   - `pauseDuringRequest()` - pauses all timers during API calls
5. **Auto-transitions**:
   - Section timer reaching 0 triggers `endOfSection()`
   - Last question in section auto-advances to next section
   - All sections complete triggers `submitAction()`

### UI/Styling Stack
- **Tailwind CSS v4** with PostCSS (config: [postcss.config.mjs](postcss.config.mjs))
- **Material-UI v7** with RTL support via `@mui/stylis-plugin-rtl`
- **Persian font**: Vazirmatn (loaded from Google Fonts in [src/ui/font.ts](src/ui/font.ts))
- **RTL Direction**: Set at root HTML level with `dir="rtl"` and `lang="fa"`
- **Emotion** for CSS-in-JS with RTL cache configuration

### Key Patterns

**Dynamic Question Rendering**:
- Questions are rendered based on `questionType` (QuestionKind enum)
- Each question type has specific passage requirements and media handling
- Passages have `PassageType` (Lecture, Question, StopMedia, Reading) that controls display behavior
- Media files (audio/video/images) have start/duration controls and can pause timers

**Form Object System**:
- `FormObject` type defines dynamic UI elements (buttons, labels, inputs)
- Can be defined at section or question level
- Questions inherit section formObjects if not specified

**Answer Management**:
- Answers stored in Zustand `answers` array with structure: `{ answer, questionId, isMarked, isSubmited }`
- Speaking questions require separate endpoint: `/Assessment/SpeakingAnswer`
- Other questions use: `/Assessment/Answer`
- Section `isForcedToAnswer` flag controls whether answers can be skipped

### Mock Data
Mock exam data available at [mock/confirm.ts](mock/confirm.ts) for testing and development.

## Path Aliases
- `@/*` maps to `./src/*` (configured in [tsconfig.json](tsconfig.json))

## Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API endpoint (defaults to `http://localhost:3008`)

## Image Configuration
Remote image patterns allowed from `dkstatics-public.digikala.com` (see [next.config.ts](next.config.ts))

## ESLint Configuration
Uses Next.js recommended configs (`next/core-web-vitals`, `next/typescript`) with flat config format in [eslint.config.mjs](eslint.config.mjs)

## Important Implementation Notes

1. **Timer Management**: Always clear timers with `clearAllTimers()` before initializing a new exam to prevent memory leaks
2. **Section Navigation**: Use `endOfSection()` instead of direct section switching to ensure proper timer cleanup
3. **API Authentication**: All API calls automatically include Authorization header via AuthProvider's React Query integration
4. **RTL Support**: Always test UI changes with RTL in mind; Material-UI and Tailwind are configured for RTL
5. **State Persistence**: Exam state persists in sessionStorage, but timers must be restarted after page reload
6. **Question Time Controls**: Some questions have `stopSectionTimer`, `nextAfterSeconds`, `questionTime`, and `waitingTime` properties that affect timer behavior
