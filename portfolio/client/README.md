# 🎉 BD Wedding Client

Welcome to the **BD Wedding Client**! This is a modern, responsive web application built with Next.js and Tailwind CSS, designed to provide a seamless user experience for wedding-related services. 💍✨

---

## 🚀 Project Overview

This client app serves as the frontend for the BD Wedding platform, featuring user authentication, profile management, service browsing, and more. It integrates with a backend API to handle data and authentication securely using JWT tokens. The app supports dark mode 🌙 and includes a rich set of UI components built with React and Material UI.

---

## ⚙️ Installation & Setup

1. **Clone the repository** and navigate to the `client/` directory:
   ```bash
   git clone <repo-url>
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment variables**:

   Create a `.env.local` file in the `client/` directory with the following variables (replace with your own secrets):
   ```
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 🗂️ Folder Structure

- `components/` - Reusable React components (e.g., Navbar, EventGallery, Forms)
- `context/` - React Context providers for global state management (Auth, DarkMode, Profile)
- `pages/` - Next.js pages and API routes
- `public/` - Static assets like images and uploads
- `styles/` - Global and component-specific CSS (Tailwind configured)
- `data/` - Static or dynamic data files used in the app
- `client/` - Nested client folder (may contain additional client-specific resources)
- `.env.local` - Environment variables (not committed to repo)
- `next.config.js` - Next.js configuration including API rewrites and env variables
- `tailwind.config.js` & `postcss.config.js` - Tailwind CSS and PostCSS configuration files

---

## 🔑 Key Features

- **Authentication & Authorization** 🔐  
  Managed via JWT tokens stored in localStorage, with React Context providing global auth state.

- **Dark Mode Support** 🌙  
  Toggle between light and dark themes using the DarkModeContext.

- **Profile Management** 👤  
  Users can update their profile details and profile picture, managed globally via ProfileContext.

- **Rich UI Components** 🎨  
  Built with React, Material UI, and Tailwind CSS for a modern and responsive design.

- **API Integration** 🔗  
  Proxies API requests to backend server at `http://localhost:5000` for contact forms and admin routes.

---

## 📜 Available Scripts

- `npm run dev` - Runs the app in development mode with hot reloading
- `npm run build` - Builds the app for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check code quality

---

## 📦 Dependencies

- **Next.js** - React framework for server-side rendering and static site generation
- **React** - UI library for building components
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Material UI (MUI)** - React UI component library
- **Axios** - HTTP client for API requests
- **JWT & JWT-Decode** - For authentication token handling
- **Framer Motion** - Animation library for React
- **React Hook Form** - Form management library
- **Draft.js** - Rich text editor framework
- And more...

---

## 🌟 Usage Tips

- Use the **Navbar** to navigate between pages.
- Authentication state is persisted in localStorage for seamless user experience.
- Dark mode can be toggled and is persisted across sessions.
- API routes are proxied to the backend server running on port 5000.
- Remember to keep your JWT secrets safe in `.env.local`.

---

## 🛠️ Troubleshooting

- If you encounter issues with caching, run the provided PowerShell script to clear Next.js cache:
  ```powershell
  ./clear-next-cache.ps1
  ```

- Ensure the backend server is running on `http://localhost:5000` for API calls to work.

---

Thank you for using BD Wedding Client! 🎊 If you have any questions or want to contribute, feel free to open an issue or submit a pull request.

Happy coding! 💻❤️
