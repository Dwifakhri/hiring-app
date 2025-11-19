# Hiring App - Hiring Management Application (Fullstack)

A modern recruitment platform built with Next.js to streamline the hiring process. Manage candidates, track applications, and make better hiring decisions.

## Features

- Candidate Management
- Job & Application Tracking
- Role-based Authentication
- Responsive Design
- Webcam Photo Capture with Handphose Detection

## Tech Stack

- **Framework:** Next.js 16.x
- **Language:** TypeScript
- **Runtime:** Bun
- **UI Library:** Material-UI (MUI) v7
- **Client Fetching:** Axios
- **Validation:** Zod
- **Unique IDs:** uuidv7
- **Icons:** React Feather
- **State Management:** Zustand
- **Authentication:** NextAuth.js
- **Styling:** Emotion, Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Data Grid:** MUI X Data Grid
- **Date Handling:** Day.js
- **Camera & ML:** react-webcam, TensorFlow Handpose

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
bun run build
bun run start
```

## Database Migration

Run Prisma migrations locally:

```bash
bunx prisma migrate dev
```

Generate Prisma Client:

```bash
bunx prisma generate
```

Seed for User:

```bash
bunx prisma db seed
```

Deploy migrations in production:

```bash
bunx prisma migrate deploy
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop the containers
docker-compose down
```

### Using Docker CLI

```bash
# Build the image
docker build -t hiring-app .

# Run the container
docker run -p 3000:3000 hiring-app
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## License

Private
