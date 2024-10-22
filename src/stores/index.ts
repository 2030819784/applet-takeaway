import type { from } from 'form-data'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建 pinia 实例
const pinia = createPinia()
// 使用持久化存储插件
pinia.use(persist)

// 默认导出，给 main.ts 使用
export default pinia

// 模块统一导出
export * from './modules/member'
export * from './modules/login'
export * from './modules/map'
export * from './modules/roles'
export * from './modules/orderType'
export * from './modules/otherType'
export * from './modules/certification'
export * from './modules/sample'
export * from './modules/comfirm'
