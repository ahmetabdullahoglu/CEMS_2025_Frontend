#!/bin/bash

# CEMS Frontend - Minimal Setup Script
# Creates project structure without auto-generated files

set -e

PROJECT_NAME="cems-frontend"
BACKEND_URL="http://localhost:8000/api/v1"

echo "🚀 Creating CEMS Frontend Project - Minimal Setup"
echo "=================================================="

# Check if directory exists
if [ -d "$PROJECT_NAME" ]; then
    echo "❌ Directory $PROJECT_NAME already exists!"
    read -p "Delete and recreate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_NAME"
    else
        exit 1
    fi
fi

# Create project with Vite
echo "📦 Creating Vite project..."
npm create vite@latest $PROJECT_NAME -- --template react-ts

cd $PROJECT_NAME

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing additional packages..."
npm install react-router-dom @tanstack/react-query axios
npm install @hookform/resolvers react-hook-form zod
npm install tailwindcss postcss autoprefixer
npm install date-fns lucide-react sonner recharts
npm install -D @types/node

# Initialize Tailwind
echo "🎨 Setting up Tailwind CSS..."
npx tailwindcss init -p

# Create directory structure
echo "📁 Creating directory structure..."

# Main directories
mkdir -p src/{app,components/{ui,common,layout},features,contexts,hooks,lib/{api,utils,validations},services,types,styles}

# Feature directories
mkdir -p src/features/{auth/{pages,components},dashboard/{pages,components},transactions/{pages,components},customers/{pages,components},currencies/pages,branches/{pages,components},vault/{pages,components},reports/{pages,components}}

# Create .env file
echo "⚙️  Creating .env file..."
cat > .env << EOF
VITE_API_BASE_URL=$BACKEND_URL
EOF

# Update configuration files
echo "📝 Updating configuration files..."

# vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
EOF

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
    },
  },
}
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Create API client
echo "📝 Creating API client..."

cat > src/lib/api/client.ts << 'EOF'
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          localStorage.setItem('access_token', data.access_token);
          return apiClient(error.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
EOF

# Create .gitkeep files for empty directories
echo "📝 Creating .gitkeep files..."
touch src/components/ui/.gitkeep
touch src/services/.gitkeep

# Create README
echo "📚 Creating README..."
cat > README.md << 'EOF'
# CEMS Frontend

Currency Exchange Management System - Frontend Application

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Login Credentials

```
Username: admin@cems.local
Password: Admin@123
```

## Project Structure

```
src/
├── app/                # Main app files
├── components/
│   ├── ui/            # shadcn/ui components
│   ├── common/        # Shared components
│   └── layout/        # Layout components
├── features/          # Feature modules
│   ├── auth/
│   ├── dashboard/
│   ├── transactions/
│   ├── customers/
│   ├── currencies/
│   ├── branches/
│   ├── vault/
│   └── reports/
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── lib/
│   ├── api/          # API client
│   ├── utils/        # Utilities
│   └── validations/  # Zod schemas
├── types/            # TypeScript types
└── styles/           # Global styles
```

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Query + Axios
- React Hook Form + Zod
- Recharts

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm run lint` - Lint code

## Next Steps

1. Setup shadcn/ui: `npx shadcn-ui@latest init`
2. Add components: `npx shadcn-ui@latest add button input card dialog select table badge`
3. Follow CONTEXT.md for development
4. Use PROMPTS.md for each feature

## Documentation

Check documentation files for:
- CONTEXT.md - Development guide
- ROADMAP.md - Development plan
- PROMPTS.md - Feature prompts

🎯 Start with Phase 1!
EOF

echo ""
echo "✅ Minimal project setup complete!"
echo ""
echo "📁 Project created at: $PROJECT_NAME"
echo ""
echo "🎨 Next manual steps:"
echo "   cd $PROJECT_NAME"
echo "   npx shadcn-ui@latest init"
echo "   npx shadcn-ui@latest add button input card dialog select table badge"
echo "   npm run dev"
echo ""
echo "📖 Documentation:"
echo "   - Follow CONTEXT.md for development workflow"
echo "   - Use PROMPTS.md for implementing features"
echo "   - Check ROADMAP.md for planning"
echo ""
echo "🎯 Start with Phase 1 prompts!"
EOF
