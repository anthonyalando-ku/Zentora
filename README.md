# FoundationX

A modern, scalable React application built with TypeScript, Vite, and TailwindCSS. Features a robust authentication system with role-based access control (RBAC) and a well-organized feature-based architecture.

## 🚀 Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS + PostCSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Routing:** React Router
- **Form Validation:** Zod
- **Code Quality:** ESLint + Stylelint

## 📋 Features

- ✅ Role-based authentication (Admin, User, Public)
- ✅ Multi-step registration flow
- ✅ Protected routes with route guards
- ✅ Theme support (Light/Dark mode)
- ✅ Centralized error handling with error boundaries
- ✅ HTTP interceptors for request/response handling
- ✅ Reusable UI components library
- ✅ Feature-based modular architecture

## 🏗️ Project Structure

```
FoundationX/
├── .env
├── .env.example
├── .gitignore
├── .stylelintrc
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
├── src/
│   ├── index.css
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── providers.tsx
│   │   └── router.tsx
│   ├── assets/
│   │   └── react.svg
│   ├── core/
│   │   ├── api/              # HTTP client & interceptors
│   │   │   ├── http.ts
│   │   │   ├── index.ts
│   │   │   ├── interceptors.ts
│   │   │   └── token.ts
│   │   ├── config/           # Environment configuration
│   │   │   └── env.ts
│   │   ├── error/            # Error handling
│   │   │   ├── AppError.ts
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── RouteError.tsx
│   │   ├── guards/           # Route protection
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── RoleRoute.tsx
│   │   └── theme/            # Theme configuration
│   │       ├── index.ts
│   │       └── ThemeProvider.tsx
│   ├── features/             # Feature modules
│   │   ├── admin/
│   │   │   └── home/
│   │   │       └── pages/
│   │   │           └── AdminHomePage.tsx
│   │   ├── auth/
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuthMutations.ts
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── services/
│   │   │   │   └── authApi.ts
│   │   │   ├── store/
│   │   │   │   └── authStore.ts
│   │   │   └── validation/
│   │   │       └── authSchemas.ts
│   │   ├── public/
│   │   │   ├── home/
│   │   │   │   └── pages/
│   │   │   │       └── HomePage.tsx
│   │   │   └── unauthorized/
│   │   │       └── pages/
│   │   │           └── UnauthorizedPage.tsx
│   │   └── user/
│   │       └── home/
│   │           └── pages/
│   │               └── UserHomePage.tsx
│   ├── shared/               # Shared resources
│   │   ├── components/
│   │   │   ├── ThemeToggle/
│   │   │   │   ├── index.ts
│   │   │   │   └── ThemeToggle.tsx
│   │   │   └── ui/          # UI component library
│   │   │       ├── index.ts
│   │   │       ├── Button/
│   │   │       │   ├── Button.tsx
│   │   │       │   └── index.ts
│   │   │       ├── Card/
│   │   │       │   ├── Card.tsx
│   │   │       │   └── index.ts
│   │   │       ├── Heading/
│   │   │       │   ├── Heading.tsx
│   │   │       │   └── index.ts
│   │   │       ├── Input/
│   │   │       │   ├── index.ts
│   │   │       │   └── Input.tsx
│   │   │       └── Loader/
│   │   │           ├── index.ts
│   │   │           └── Loader.tsx
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── CenteredLayout.tsx
│   │   │   └── index.ts
│   │   ├── types/
│   │   └── utils/
│   │       └── cn.ts
│   └── styles/               # Global styles
│       ├── globals.css
│       └── theme.css
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FoundationX
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## 🗂️ Architecture Patterns

### Feature-Based Structure
Each feature is self-contained with its own components, hooks, services, and state management.

### Core Layer
Contains application-wide functionality:
- **API:** HTTP client configuration and interceptors
- **Config:** Environment and app configuration
- **Error:** Global error handling
- **Guards:** Route protection logic
- **Theme:** Theme management

### Shared Resources
Reusable components, hooks, utilities, and layouts used across features.

## 🔒 Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes with guards
- Automatic token refresh
- Secure token storage

## 🎨 Styling

- TailwindCSS for utility-first styling
- Custom theme with CSS variables
- Dark mode support
- Responsive design

## 📝 License

MIT License