import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  const serverUrl = `${env.VITE_SERVER_PROTOCOL || 'http'}://${env.VITE_SERVER_HOST || 'localhost'}:${env.VITE_SERVER_PORT || 3000}`
  console.log('Vite config - API proxy target:', serverUrl)
  
  return {
    plugins: [react()],
    css: {
      postcss: './postcss.config.cjs',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5174, // Match your current port
      proxy: {
        '/api/v1': {
          target: serverUrl,
          changeOrigin: true,
          secure: false,
          logLevel: 'debug', // Add this to see detailed logs
          rewrite: (path) => path, // Don't rewrite the path
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response:', proxyRes.statusCode, req.url);
            });
          }
        }
      }
    }
  }
})
