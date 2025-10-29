# HireFlow - Hiring Management Application

A modern recruitment platform built with Next.js to streamline the hiring process. Manage candidates, track applications, and make better hiring decisions.

## Tech Stack

- **Framework:** Next.js 16.0
- **Language:** TypeScript
- **UI Library:** Material-UI (MUI) v7
- **State Management:** Zustand
- **Authentication:** NextAuth.js
- **Styling:** Emotion, Tailwind CSS
- **Data Grid:** MUI X Data Grid
- **Date Handling:** Day.js

## Getting Started

### Development

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
npm start
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop the container
docker-compose down
```

### Using Docker CLI

```bash
# Build the image
docker build -t hiring-app .

# Run the container
docker run -p 3000:3000 hiring-app
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
hiring-app/
├── app/              # Next.js app directory
├── components/       # Reusable components
├── assets/          # Images and static files
├── public/          # Public static files
└── ...
```

## Features

- Candidate Management
- Application Tracking
- Analytics & Insights
- User Authentication
- Responsive Design

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file in the root directory for environment-specific configuration:

```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## License

Private
