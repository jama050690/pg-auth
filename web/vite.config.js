import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "user_page/index.html"),
        login: resolve(__dirname, "login/index.html"),
        projects: resolve(__dirname, "projects/index.html"),
        samples: resolve(__dirname, "projects/samples/index.html"),
        register: resolve(__dirname, "register/index.html"),
        dashboard: resolve(__dirname, "dashboard/index.html"),
      },
    },
  },
});
