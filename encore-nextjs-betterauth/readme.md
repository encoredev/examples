# 🚀 Full-Stack Authentication App

A modern, production-ready authentication system built with **Encore** backend and **Next.js 15** frontend, featuring JWT-based authentication powered by Better Auth.

<img width="1918" height="909" alt="image" src="https://github.com/user-attachments/assets/c80cfea5-8b8d-468c-8018-4a86a7e178f3" />


## ✨ Features

- 🔐 **Secure Authentication** - JWT tokens with Better Auth
- 🎨 **Modern UI** - Beautiful forms with Shadcn UI components
- 🔄 **State Management** - Redux Toolkit with persistence
- 📡 **API Integration** - TanStack Query (React Query) for server state
- 📝 **Form Validation** - TanStack Form for robust form handling
- 🎯 **Type Safety** - Full TypeScript support with auto-generated Encore client
- 🗄️ **Database** - PostgreSQL with Encore's built-in support
- 🔥 **Hot Reload** - Fast development experience
- 📱 **Responsive Design** - Mobile-first approach

## 🛠️ Tech Stack

### Backend (Server)

- [Encore](https://encore.dev) - Backend development framework
- [Better Auth](https://www.better-auth.com/) - Authentication library
- PostgreSQL - Database
- TypeScript - Language

### Frontend (Web)

- [Next.js 15](https://nextjs.org/) - React framework
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Redux Persist](https://github.com/rt2zz/redux-persist) - State persistence
- [TanStack Query](https://tanstack.com/query) - Server state management
- [TanStack Form](https://tanstack.com/form) - Form management
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- TypeScript - Language

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm
- [Encore CLI](https://encore.dev/docs/install)
- [PostgreSQL](https://www.postgresql.org/) (or use Encore's cloud database)

### Install Encore CLI

```bash
# macOS
brew install encoredev/tap/encore

# Linux
curl -L https://encore.dev/install.sh | bash

# Windows (PowerShell)
iwr https://encore.dev/install.ps1 | iex
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ajay01103/encore-betterauth-nextjs-starter
```

### 2. Server Setup (Encore Backend)

## Docker must be installed in machine to run encore server otherwise it will throw an error

```bash
cd server
pnpm install
```

<!-- #### Configure Database

Create a `.env` file in the `server` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/auth_app"
``` -->

<!-- #### Run Migrations

```bash
encore db migrate
``` -->

#### Start the Server

```bash
encore run
```

The server will start at `http://localhost:4000` then go to your encore local dashboard then in DB explorer add some dummy todos data in order to see protected endpoint in action

You can access:

- **API Explorer**: `http://localhost:4000/api`
- **Local Dashboard**: `http://localhost:9400`

### 3. Web Setup (Next.js Frontend)

Open a new terminal:

```bash
cd web
pnpm install
```

#### Generate Encore Client

Make sure the server is running, then generate the type-safe client:

```bash
cd ../server
encore gen client --output=../web/src/lib/client.ts --lang=ts
```

#### Start the Web App

```bash
cd ../web
pnpm dev
```

The web app will start at `http://localhost:3000`

## 📁 Project Structure

```
auth-app/
├── server/                 # Encore backend
│   ├── auth/              # Authentication service
│   │   ├── auth.ts        # Auth endpoints
│   │   ├── better-auth.ts # Better Auth configuration
│   │   ├── db.ts          # Database utilities
│   │   ├── handler.ts     # Auth handler
│   │   └── schema.ts      # Database schema
│   ├── hello/             # Example service
│   ├── sessions/          # Session management
│   ├── todos/             # Example todos service
│   ├── user/              # User management
│   └── encore.app         # Encore configuration
│
└── web/                   # Next.js frontend
    ├── src/
    │   ├── app/           # App router pages
    │   │   ├── (auth)/    # Auth layout group
    │   │   │   ├── sign-in/
    │   │   │   └── sign-up/
    │   │   └── page.tsx   # Home page
    │   ├── components/    # Reusable components
    │   │   ├── providers/ # Context providers
    │   │   └── ui/        # Shadcn UI components
    │   ├── hooks/         # Custom React hooks
    │   │   └── useAuth.ts # Authentication hooks
    │   ├── lib/           # Utilities
    │   │   ├── client.ts  # Generated Encore client
    │   │   └── encore-client.ts # Client instance
    │   ├── modules/       # Feature modules
    │   │   └── auth/      # Auth module
    │   └── store/         # Redux store
    │       ├── slices/    # Redux slices
    │       ├── hooks.ts   # Typed Redux hooks
    │       └── store.ts   # Store configuration
    └── package.json
```

## 🔑 API Endpoints

### Authentication

- `POST /auth/signup` - Create a new account
- `POST /auth/signin` - Sign in to existing account
- `POST /auth/signout` - Sign out (revoke session)

### User

- `GET /current-user` - Get current user profile
- `PUT /update` - Update user profile

### Sessions

- `GET /sessions` - List active sessions
- `DELETE /sessions/:id` - Revoke a specific session

## 🎯 Usage

### Sign Up

1. Navigate to `http://localhost:3000/sign-up`
2. Enter your name, email, and password
3. Click "Create account"
4. You'll be automatically logged in and redirected

### Sign In

1. Navigate to `http://localhost:3000/sign-in`
2. Enter your email and password
3. Click "Sign in"
4. You'll be redirected to the home page

### Logout

1. Click the "Logout" button in the top-right corner
2. You'll be redirected to the sign-in page

## 🔧 Development

### Add a New Service (Backend)

```bash
cd server
encore service new <service-name>
```

### Add New UI Components (Frontend)

```bash
cd web
pnpm dlx shadcn@latest add <component-name>
```

### Regenerate Encore Client

Whenever you change the backend API:

```bash
cd server
encore gen client --output=../web/src/lib/client.ts --lang=ts
```

## 🧪 Testing

### Backend Tests

```bash
cd server
encore test
```

### Frontend Tests

```bash
cd web
pnpm test
```

## 📦 Build for Production

### Build Backend

```bash
cd server
encore build
```

### Build Frontend

```bash
cd web
pnpm build
pnpm start
```

## 🚢 Deployment

### Deploy Backend (Encore Cloud)

```bash
cd server
encore app create
encore deploy
```

### Deploy Frontend (Vercel)

```bash
cd web
vercel
```

Or connect your repository to Vercel for automatic deployments.

## 🔐 Environment Variables

### Server (.env)

```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secret-key"
```

### Web (.env.local)

```env
NEXT_PUBLIC_API_URL="https://your-encore-app.encr.app"
```

## 🐛 Troubleshooting

### "redux-persist failed to create sync storage"

This is expected during server-side rendering and is handled automatically. The warning can be safely ignored.

### "encore gen client" fails

Make sure the Encore server is running before generating the client:

```bash
cd server
encore run
```

### Database connection issues

Ensure PostgreSQL is running and the DATABASE_URL is correct:

```bash
psql $DATABASE_URL
```

## 📚 Resources

- [Encore Documentation](https://encore.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Shadcn UI Documentation](https://ui.shadcn.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

Built with ❤️ by using modern web technologies.

---

**Happy Coding! 🎉**
