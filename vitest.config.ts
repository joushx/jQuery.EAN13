import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        include: ['tests/**/*.{test,spec}.ts'],
        globals: true,
        setupFiles: ["vitest-canvas-mock"],
        deps: {
            optimizer: {
                web: {
                    include: ['vitest-canvas-mock']
                }
            }
        }
    },
});
