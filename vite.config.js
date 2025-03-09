import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Define env variables that should be available in the client
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
      'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY),
      'import.meta.env.CLOUDINARY_CLOUD_NAME': JSON.stringify(env.CLOUDINARY_CLOUD_NAME),
      'import.meta.env.CLOUDINARY_API_KEY': JSON.stringify(env.CLOUDINARY_API_KEY),
      'import.meta.env.CLOUDINARY_API_SECRET': JSON.stringify(env.CLOUDINARY_API_SECRET),
      'import.meta.env.CLOUDINARY_UPLOAD_PRESET': JSON.stringify(env.CLOUDINARY_UPLOAD_PRESET),
    }
  }
})
