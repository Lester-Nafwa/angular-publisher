import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
 plugins: [angular(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.spec.ts", "src/**/*.test.ts"],
    setupFiles: ["src/test-setup.ts"],
    reporters: ["default"],
    coverage: {
      provider: "v8",
      reportsDirectory: "../../coverage/libs/ui-ang",
    },
  },
});
