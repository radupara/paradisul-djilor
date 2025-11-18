# Feature-Sliced Design (FSD) Structure

This project follows **Feature-Sliced Design (FSD)**, a scalable architecture pattern that organizes code by feature/domain rather than by type.

## Directory Structure

```
src/app/
├── shared/                          # Shared across all features
│   ├── ui/
│   │   └── components/
│   │       └── header/             # Reusable header component
│   │           ├── header.component.ts
│   │           ├── header.component.html
│   │           └── header.component.scss
│   ├── config/
│   │   └── language/               # Language/i18n configuration
│   │       └── language.service.ts
│   ├── lib/                        # Shared utilities (future use)
│   └── index.ts                    # Barrel exports
│
├── features/                        # Feature-based slices
│   └── landing/
│       ├── ui/
│       │   └── pages/
│       │       └── landing/        # Landing page component
│       │           ├── landing.component.ts
│       │           ├── landing.component.html
│       │           └── landing.component.scss
│       ├── model/                  # Business logic, state (future use)
│       ├── api/                    # API integration (future use)
│       ├── lib/                    # Feature utilities (future use)
│       └── index.ts                # Barrel exports
│
├── app.component.ts                # App root component
├── app.component.html
├── app.component.scss
├── app.routes.ts                   # Application routing
└── main.ts                         # Entry point
```

## FSD Layers Explanation

### 1. **shared/** - Shared Code
Contains code that is used across multiple features and has no dependencies on feature-specific code.

- **ui/components/**: Reusable UI components (Header, Button, Card, etc.)
- **config/**: Configuration services (Language, Theme, etc.)
- **lib/**: Utility functions and helpers
- **api/**: Shared API clients and interceptors (future)

### 2. **features/** - Feature Modules
Each feature is a self-contained slice with its own structure. Features should not depend on other features directly.

- **ui/pages/**: Page components
- **ui/components/**: Feature-specific UI components
- **model/**: Business logic, state management, data models
- **api/**: Feature-specific API integration
- **lib/**: Feature utilities and helpers
- **index.ts**: Barrel export for clean imports

### 3. **app/** - Application Root
- **app.component.ts**: Root component
- **app.routes.ts**: Application routing configuration
- **main.ts**: Bootstrap file

## Import Conventions

### ✅ Good Imports

```typescript
// From shared utilities
import { HeaderComponent } from '@app/shared/ui/components/header/header.component';
import { LanguageService } from '@app/shared/config/language/language.service';

// From feature barrel export
import { LandingComponent } from '@app/features/landing';

// Using path aliases (if configured in tsconfig.json)
import { HeaderComponent } from '@/shared/ui';
```

### ❌ Avoid These Imports

```typescript
// ❌ Importing from parent feature folders
import { something } from '../../features/landing';

// ❌ Deep imports from other features
import { LandingComponent } from '@app/features/landing/ui/pages/landing/landing.component';

// ❌ Feature importing from another feature
// (Features should be independent)
import { SomeComponent } from '@app/features/other-feature/ui/components/something';
```

## Feature Slice Internal Structure

When creating a new feature, follow this structure:

```
features/[feature-name]/
├── ui/                    # User Interface
│   ├── pages/            # Page-level components
│   └── components/       # Feature UI components
├── model/                # Business Logic & State
│   ├── entities/        # Domain entities/types
│   ├── store/           # State management (if needed)
│   └── hooks/           # Custom hooks (if using React)
├── api/                 # API Integration
│   ├── queries/        # API fetch queries
│   ���── mutations/       # API POST/PUT/DELETE operations
│   └── types.ts        # API types/interfaces
├── lib/                # Internal Utilities
│   └── utils.ts       # Helper functions specific to feature
└── index.ts           # Barrel export for public API
```

## Benefits of FSD

1. **Scalability**: Easy to add new features without affecting existing code
2. **Modularity**: Features are self-contained and can be developed independently
3. **Maintainability**: Clear structure makes codebase easier to understand
4. **Reusability**: Shared code is clearly separated
5. **Testability**: Features can be tested in isolation
6. **Feature Removal**: Features can be removed without breaking other features

## Guidelines

- **Single Responsibility**: Each folder/file has a single, clear purpose
- **No Circular Dependencies**: Features should not depend on each other
- **Explicit Exports**: Use barrel exports (index.ts) for cleaner imports
- **Naming Conventions**: Use kebab-case for folder names, PascalCase for components
- **Type Safety**: Always use TypeScript interfaces and types
- **Documentation**: Keep README files in feature folders if complexity warrants it

## Future Feature Examples

When adding new features (e.g., Authentication, Dashboard):

```
features/auth/
├── ui/pages/
│   ├── login/
│   └── register/
├── model/
│   ├── types.ts
│   └── auth.service.ts
├── api/
│   └── auth-api.ts
└── index.ts

features/dashboard/
├── ui/pages/
│   └── dashboard/
├── ui/components/
│   ├── stats-card/
│   └── activity-feed/
├── model/
│   └── dashboard.service.ts
└── index.ts
```

## Migration Complete ✅

The application has been refactored from a flat type-based structure to Feature-Sliced Design:
- ✅ Header component moved to `shared/ui/components/header/`
- ✅ Landing feature created in `features/landing/`
- ✅ Language service moved to `shared/config/language/`
- ✅ Barrel exports created for clean imports
- ✅ Routes updated to use new structure
