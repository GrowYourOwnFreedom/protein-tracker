// `defineConfig` is Vitest's helper for writing a config file.
// It gives TypeScript proper knowledge of the available Vitest config options.

import { defineConfig } from "vitest/config";

// `node:path` is a built-in Node module for safely working with file paths.
// We use it instead of manually joining strings like dirname + "/src".

import path from "node:path";

// `fileURLToPath` is a built-in Node helper.
// In ES modules, `import.meta.url` gives us a file URL, not a normal file path.
// This converts that file URL into a normal filesystem path.

import { fileURLToPath } from "node:url";

// In CommonJS Node projects, you often see `__dirname`.
// `__dirname` means "the folder this current file lives in".
// This project uses ES modules, where `__dirname` is not available by default.
// So this line recreates the same idea:
// 1. `import.meta.url` gives the location of this config file as a file URL.
// 2. `fileURLToPath(...)` converts that URL into a normal file path.
// 3. `path.dirname(...)` gets the folder that contains this file.
// Because this file lives in `server/vitest.config.ts`,
// `dirname` should point to the `server` folder.

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            // This teaches Vitest what the `@` import alias means.
            // Your server code uses imports like:
            // import itemRouter from "@/routes/itemRoutes.js";
            // TypeScript may understand that from tsconfig,
            // and your dev server may understand it because you run tsx with
            // `tsconfig-paths/register`.
            // But Vitest needs its own config so tests can resolve the same imports.
            // This says:
            // "When you see @, treat it as the server/src folder."
            // So:
            // "@/routes/itemRoutes.js"
            // resolves to:
            // server/src/routes/itemRoutes.ts

            "@": path.resolve(dirname, "src"),
            "@shared": path.resolve(dirname, "../shared"),
        },
    },

    test: {
        // Setup files run before the test files.
        // Your app imports environment config when the Express app is loaded.
        // In normal development, `server.ts` loads dotenv before starting the app.
        // But tests import `app.ts` directly, not `server.ts`,
        // so the tests need their own setup step to load environment variables.
        // This setup file can contain:
        // import "dotenv/config";
        // That makes variables like CLIENT_ORIGIN and BACKUP_KEY available
        // before the app/config files are imported during tests.

        setupFiles: ["src/test/setup.ts"],
    },
});
