import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    // Single React instance: Base UI pre-bundles must externalize to the same copy.
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@base-ui/react/avatar',
      '@base-ui/react/button',
      '@base-ui/react/collapsible',
      '@base-ui/react/dialog',
      '@base-ui/react/input',
      '@base-ui/react/menu',
      '@base-ui/react/merge-props',
      '@base-ui/react/popover',
      '@base-ui/react/progress',
      '@base-ui/react/separator',
      '@base-ui/react/tabs',
      '@base-ui/react/toast',
      '@base-ui/react/tooltip',
      '@base-ui/react/use-render',
    ],
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({ router: { routeToken: 'layout' } }),
    viteReact(),
  ],
  ssr: {
    external: ['typeorm', 'pg', 'reflect-metadata'],
  },
})

export default config
