# AdVantage: Project & Resource Discovery Engine

AdVantage Creator Hub is a mobile-first responsive web application designed to connect student developers, creators, and learners. It serves as a unified platform for showcasing projects, discovering new tech content, and collaborating on technical video creation.

This project was built using modern web technologies and provides distinct views tailored for different user roles.

## 🚀 Features

*   **Mobile-First Responsive Design**: Carefully crafted to provide an exceptional user experience on mobile devices and desktop screens alike.
*   **Learn Feed**: An engaging, TikTok/Instagram Reels-style feed for viewing short, educational tech project videos.
*   **Creator Dashboard**: A dedicated space for student developers to showcase their work, manage their project portfolios, and view engagement.
*   **Content Editor Hub**: A collaborative area where content creators can browse project listings and find inspiring materials to produce videos about.
*   **Modern Routing & State Management**: Utilizes TanStack Router for type-safe routing and React Query for efficient data fetching.
*   **Backend Integration**: Connected to Supabase for authentication, database, and backend services.

## 💻 Tech Stack

*   **Frontend**: React (v19), TypeScript, Vite
*   **Styling**: Tailwind CSS, class-variance-authority, clsx, tailwind-merge
*   **UI Components**: Radix UI Primitives, Lucide React (Icons), Recharts (Data Visualization)
*   **Routing & State**: @tanstack/react-router, @tanstack/react-query
*   **Forms & Validation**: React Hook Form, Zod
*   **Backend/BaaS**: Supabase

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1.  **Clone the repository**
    ```bash
    git clone <this-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```
    *(Alternatively, you can use `bun install`, `yarn install`, or `pnpm install` depending on your package manager).*

3.  **Environment Variables**
    Copy the `.env.example` (if available) to `.env` and fill in your Supabase credentials or any other required environment variables.

### Running the Application

To start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will typically run at `http://localhost:5173`.

### Building for Production

To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## 📂 Project Structure

*   `src/routes/`: Contains the main page components (`index.tsx`, `learn.tsx`, `creator.tsx`, `editor.tsx`).
*   `src/components/`: Reusable React components and UI elements.
*   `src/lib/`: Utility functions and shared helpers.
*   `src/hooks/`: Custom React hooks.
*   `src/styles.css`: Global stylesheet.
*   `supabase/`: Supabase configuration and edge functions.

---
*This project was initialized with [Lovable](https://lovable.dev).*
