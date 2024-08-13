import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    console.log(env);

    return {
        plugins: [
            react(),
            createHtmlPlugin({
                minify: true,
                inject: {
                    data: {
                        naverClientId: env.VITE_NAVER_MAP_CLIENT_ID,
                    },
                },
            }),
        ],
        base: "/",

        server: {
            port: 8080,
        },
    };
});
