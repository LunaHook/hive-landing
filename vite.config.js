import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  build: {
    rollupOptions: {
      input: {
        main:        resolve(__dirname, 'index.html'),
        downloads:   resolve(__dirname, 'downloads.html'),
        timecapsule: resolve(__dirname, 'time-capsule.html'),
        presets:     resolve(__dirname, 'presets.html'),
        account:     resolve(__dirname, 'account.html'),
        support:     resolve(__dirname, 'support.html'),
      },
    },
  },
})
