import { createSSRApp } from 'vue'
import App from './App.vue'
import uviewPlus from 'uview-plus'

// 导入 pinia 实例
import pinia from './stores'
export function createApp() {
  // 创建 vue 实例
  const app = createSSRApp(App)

  // 使用 pinia
  app.use(pinia)
  app.use(uviewPlus)

  return {
    app,
  }
}
