import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'vitereactsharesample',
      short_name: 'PPP',
      description: 'share api sample',
      theme_color: '#666666',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      // シンプルなGETメソッドでの共有ターゲット（iOSでの互換性を高める）
      share_target: {
        action: '/share-target',
        method: 'GET',
        params: {
          title: 'title',
          text: 'text',
          url: 'url'
        }
      },
      // iOS用の追加設定
      related_applications: [
        {
          platform: 'webapp',
          url: 'https://yourdomain.com/manifest.webmanifest'
        }
      ],
      prefer_related_applications: false,
      categories: ['productivity', 'utilities'],
      // iOSにおける共有メニュー挙動の改善
      shortcuts: [
        {
          name: "共有を受け取る",
          url: "/share-target",
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            }
          ]
        }
      ],
      orientation: "portrait"
    },

    workbox: {
      // 基本設定
      globPatterns: ['**/*.{js,css,html,svg,ico,png,webp}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: 'index.html',
      // シンプルなキャッシュ設定
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
            }
          }
        }
      ]
    },

    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})