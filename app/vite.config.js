import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from 'vite-plugin-singlefile'

const { host } = new URL(process.env.GITPOD_WORKSPACE_URL)

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [svelte(), viteSingleFile()],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  },
  server: {
    hmr: {
      clientPort: host ? 443 : 24678,
      host: host ? '3000-' + host : "localhost"
    }
  }
})
