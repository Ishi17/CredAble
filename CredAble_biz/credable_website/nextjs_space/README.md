# CredAble Website - Local Development Setup

This is a Next.js 14 application for CredAble's AI Credit Engine demo.

## Prerequisites

- **Node.js** v18 or higher (you have v22.14.0 ✓)
- **npm** or **yarn** package manager
- **PostgreSQL** database (optional - only needed if using database features)

## Quick Start

### 1. Install Dependencies

```bash
cd nextjs_space
npm install
```

**If you encounter dependency conflicts**, use:

```bash
npm install --legacy-peer-deps
```

Or if you prefer yarn (recommended if npm has permission issues):

```bash
yarn install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `nextjs_space` directory:

```bash
# Database (optional - only if using Prisma features)
DATABASE_URL="postgresql://user:password@localhost:5432/credable_db?schema=public"

# NextAuth (optional - only if using authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**Note:** The main demo page (`page.tsx`) works without a database connection. The database is only needed if you're using features that require Prisma.

### 3. Set Up Database (Optional)

If you need database functionality:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (if you have migrations)
npx prisma migrate dev

# Or push schema to database
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will be available at **http://localhost:3000**

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
nextjs_space/
├── app/              # Next.js app directory
│   ├── page.tsx      # Main homepage with AI demo
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/       # React components
├── lib/             # Utility functions and database
├── prisma/          # Prisma schema
└── public/          # Static assets
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Next.js will automatically use the next available port (3001, 3002, etc.).

### Database Connection Issues

If you see Prisma errors but don't need database features, you can:
1. Comment out database-related imports in your code
2. Or set up a local PostgreSQL instance
3. Or use a cloud database service

### Dependency Conflicts (ESLint)

If you see an error about ESLint version conflicts, the package.json has been updated to fix this. If you still encounter issues:

```bash
npm install --legacy-peer-deps
```

Or use yarn which handles peer dependencies better:

```bash
yarn install
```

### Missing Dependencies

If you encounter module not found errors:

```bash
rm -rf node_modules package-lock.json
npm install
```

### npm Permission Issues

If you get EPERM errors when running npm:

**Option 1: Use yarn instead**
```bash
yarn install
yarn dev
```

**Option 2: Fix npm permissions (macOS/Linux)**
```bash
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) ~/.npm
```

**Option 3: Use nvm (Node Version Manager)**
```bash
# Install nvm, then:
nvm install 22
nvm use 22
npm install
```

## Features

- **AI Credit Engine Demo**: Interactive demo showing AI-powered credit analysis
- **Typewriter Effect**: Animated hero text
- **Canvas Animation**: Background particle animation
- **Modal Results**: Full results view with timeline and options
- **Responsive Design**: Works on desktop and mobile

## Development Notes

- The main demo is fully client-side and doesn't require a backend
- All AI analysis is simulated/demo data
- The application uses TypeScript and Tailwind CSS
- Uses Next.js 14 App Router

