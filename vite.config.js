import {defineConfig} from 'vite';
export default defineConfig({base:'./',esbuild:{jsx:'automatic'},build:{rollupOptions:{output:{manualChunks:{three:['three','@react-three/fiber'],react:['react','react-dom']}}}}});
