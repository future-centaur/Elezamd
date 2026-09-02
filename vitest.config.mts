import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    testTimeout: 15000,
    env: {
      NEXT_PUBLIC_FEATURE_VOICE: "false",
      NEXT_PUBLIC_FEATURE_TIDY: "false",
    },
  },
});
