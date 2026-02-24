# React + TypeScript + Vite
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
│   │   ├── api/
│   │   │   ├── http.ts
│   │   │   ├── index.ts
│   │   │   ├── interceptors.ts
│   │   │   └── token.ts
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── error/
│   │   │   ├── AppError.ts
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── RouteError.tsx
│   │   ├── guards/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── RoleRoute.tsx
│   │   └── theme/
│   │       ├── index.ts
│   │       └── ThemeProvider.tsx
│   ├── features/
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
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ThemeToggle/
│   │   │   │   ├── index.ts
│   │   │   │   └── ThemeToggle.tsx
│   │   │   └── ui/
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
│   │   ├── utils/
│   │   │   └── cn.ts
│   └── styles/
│       ├── globals.css
│       └── theme.css