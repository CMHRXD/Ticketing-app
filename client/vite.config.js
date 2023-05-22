import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'path'
import { json } from 'react-router-dom'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  define: {
    'process.env.STRIPE_TEST': JSON.stringify('pk_test_51MyC4IGmrvuw1mJ4vKgobsp14daeGSK5oP8ilL4jMX1VEsQFEyWgGqJIGFFYDMU7XyQEmTWJBHyN2diIZFihJg7G00jZpOOuS5'),
  },
})
