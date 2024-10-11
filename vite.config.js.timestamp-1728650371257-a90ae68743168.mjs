// vite.config.js
import { defineConfig } from "file:///C:/Users/Xetttri%20Aleen/Desktop/webapp-categories/DebugMatic_Svelte_Free/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///C:/Users/Xetttri%20Aleen/Desktop/webapp-categories/DebugMatic_Svelte_Free/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import { resolve } from "path";
import { globSync } from "file:///C:/Users/Xetttri%20Aleen/Desktop/webapp-categories/DebugMatic_Svelte_Free/node_modules/glob/dist/esm/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Xetttri Aleen\\Desktop\\webapp-categories\\DebugMatic_Svelte_Free";
function getLibEntries() {
  const libFiles = globSync("src/lib/**/*.js");
  return libFiles.reduce((entries, file) => {
    const name = file.replace("src/lib/", "").replace(".js", "");
    entries[name] = resolve(__vite_injected_original_dirname, file);
    return entries;
  }, {});
}
var vite_config_default = defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "$lib": resolve(__vite_injected_original_dirname, "./src/lib")
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(__vite_injected_original_dirname, "src/popup/popup.html"),
        background: resolve(__vite_injected_original_dirname, "src/background.js"),
        content: resolve(__vite_injected_original_dirname, "src/content/content.js"),
        ...getLibEntries()
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") {
            return "background.js";
          }
          if (chunkInfo.name === "content") {
            return "content/content.js";
          }
          if (chunkInfo.name.startsWith("lib/")) {
            return `${chunkInfo.name}.js`;
          }
          return "[name]/[name].js";
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "popup.html") {
            return "popup/popup.html";
          }
          if (assetInfo.name.endsWith(".css")) {
            return "styles/[name][extname]";
          }
          return "[name][extname]";
        }
      }
    },
    target: "esnext",
    minify: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxYZXR0dHJpIEFsZWVuXFxcXERlc2t0b3BcXFxcd2ViYXBwLWNhdGVnb3JpZXNcXFxcRGVidWdNYXRpY19TdmVsdGVfRnJlZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcWGV0dHRyaSBBbGVlblxcXFxEZXNrdG9wXFxcXHdlYmFwcC1jYXRlZ29yaWVzXFxcXERlYnVnTWF0aWNfU3ZlbHRlX0ZyZWVcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1hldHR0cmklMjBBbGVlbi9EZXNrdG9wL3dlYmFwcC1jYXRlZ29yaWVzL0RlYnVnTWF0aWNfU3ZlbHRlX0ZyZWUvdml0ZS5jb25maWcuanNcIjsvLyBVcGRhdGVkOiB2aXRlLmNvbmZpZy5qc1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgZ2xvYlN5bmMgfSBmcm9tICdnbG9iJztcclxuXHJcbi8vIEZ1bmN0aW9uIHRvIGdldCBhbGwgSlMgZmlsZXMgZnJvbSBsaWIgZm9sZGVyXHJcbmZ1bmN0aW9uIGdldExpYkVudHJpZXMoKSB7XHJcbiAgY29uc3QgbGliRmlsZXMgPSBnbG9iU3luYygnc3JjL2xpYi8qKi8qLmpzJyk7XHJcbiAgcmV0dXJuIGxpYkZpbGVzLnJlZHVjZSgoZW50cmllcywgZmlsZSkgPT4ge1xyXG4gICAgY29uc3QgbmFtZSA9IGZpbGUucmVwbGFjZSgnc3JjL2xpYi8nLCAnJykucmVwbGFjZSgnLmpzJywgJycpO1xyXG4gICAgZW50cmllc1tuYW1lXSA9IHJlc29sdmUoX19kaXJuYW1lLCBmaWxlKTtcclxuICAgIHJldHVybiBlbnRyaWVzO1xyXG4gIH0sIHt9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbc3ZlbHRlKCldLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICckbGliJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9saWInKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogJ2Rpc3QnLFxyXG4gICAgZW1wdHlPdXREaXI6IGZhbHNlLFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBpbnB1dDoge1xyXG4gICAgICAgIHBvcHVwOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wb3B1cC9wb3B1cC5odG1sJyksXHJcbiAgICAgICAgYmFja2dyb3VuZDogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvYmFja2dyb3VuZC5qcycpLFxyXG4gICAgICAgIGNvbnRlbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NvbnRlbnQvY29udGVudC5qcycpLFxyXG4gICAgICAgIC4uLmdldExpYkVudHJpZXMoKSxcclxuICAgICAgfSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IChjaHVua0luZm8pID0+IHtcclxuICAgICAgICAgIGlmIChjaHVua0luZm8ubmFtZSA9PT0gJ2JhY2tncm91bmQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnYmFja2dyb3VuZC5qcyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoY2h1bmtJbmZvLm5hbWUgPT09ICdjb250ZW50Jykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2NvbnRlbnQvY29udGVudC5qcyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoY2h1bmtJbmZvLm5hbWUuc3RhcnRzV2l0aCgnbGliLycpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtjaHVua0luZm8ubmFtZX0uanNgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuICdbbmFtZV0vW25hbWVdLmpzJztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XHJcbiAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUgPT09ICdwb3B1cC5odG1sJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3BvcHVwL3BvcHVwLmh0bWwnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lLmVuZHNXaXRoKCcuY3NzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdzdHlsZXMvW25hbWVdW2V4dG5hbWVdJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiAnW25hbWVdW2V4dG5hbWVdJztcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHRhcmdldDogJ2VzbmV4dCcsXHJcbiAgICBtaW5pZnk6IGZhbHNlLFxyXG4gIH1cclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsY0FBYztBQUN2QixTQUFTLGVBQWU7QUFDeEIsU0FBUyxnQkFBZ0I7QUFKekIsSUFBTSxtQ0FBbUM7QUFPekMsU0FBUyxnQkFBZ0I7QUFDdkIsUUFBTSxXQUFXLFNBQVMsaUJBQWlCO0FBQzNDLFNBQU8sU0FBUyxPQUFPLENBQUMsU0FBUyxTQUFTO0FBQ3hDLFVBQU0sT0FBTyxLQUFLLFFBQVEsWUFBWSxFQUFFLEVBQUUsUUFBUSxPQUFPLEVBQUU7QUFDM0QsWUFBUSxJQUFJLElBQUksUUFBUSxrQ0FBVyxJQUFJO0FBQ3ZDLFdBQU87QUFBQSxFQUNULEdBQUcsQ0FBQyxDQUFDO0FBQ1A7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsT0FBTyxDQUFDO0FBQUEsRUFDbEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsUUFBUSxRQUFRLGtDQUFXLFdBQVc7QUFBQSxJQUN4QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE9BQU8sUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxRQUNoRCxZQUFZLFFBQVEsa0NBQVcsbUJBQW1CO0FBQUEsUUFDbEQsU0FBUyxRQUFRLGtDQUFXLHdCQUF3QjtBQUFBLFFBQ3BELEdBQUcsY0FBYztBQUFBLE1BQ25CO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0IsQ0FBQyxjQUFjO0FBQzdCLGNBQUksVUFBVSxTQUFTLGNBQWM7QUFDbkMsbUJBQU87QUFBQSxVQUNUO0FBQ0EsY0FBSSxVQUFVLFNBQVMsV0FBVztBQUNoQyxtQkFBTztBQUFBLFVBQ1Q7QUFDQSxjQUFJLFVBQVUsS0FBSyxXQUFXLE1BQU0sR0FBRztBQUNyQyxtQkFBTyxHQUFHLFVBQVUsSUFBSTtBQUFBLFVBQzFCO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxnQkFBZ0IsQ0FBQyxjQUFjO0FBQzdCLGNBQUksVUFBVSxTQUFTLGNBQWM7QUFDbkMsbUJBQU87QUFBQSxVQUNUO0FBQ0EsY0FBSSxVQUFVLEtBQUssU0FBUyxNQUFNLEdBQUc7QUFDbkMsbUJBQU87QUFBQSxVQUNUO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxFQUNWO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
