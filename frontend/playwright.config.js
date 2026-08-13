import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",

    use: {
        baseURL: "http://localhost:5173",
        headless: false,
        channel: "msedge",
    },

    projects: [
        {
            name: "Microsoft Edge",
            use: {
                ...devices["Desktop Edge"],
                channel: "msedge",
            },
        },
    ],
});