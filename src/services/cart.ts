import type { items } from '@/types/home'
import { http } from '@/utils/http'

//获取购物车列表
export const getCartListAPI = () => {
  return http({
    method: 'GET',
    url: '/cart/list',
  })
}

type payCartType = {
  cartIds: number[]
  openId: string
}
//购物车结算
export const payCartListAPI = (data: payCartType) => {
  return http({
    method: 'POST',
    url: '/cart/settlement',
    data,
  })
}

// type deleteCartType = {
// 	cartIdList : number[]
// }

//购物车删除
export const delteCartAPI = (data: number[]) => {
  return http({
    method: 'POST',
    url: '/cart/delete',
    data,
  })
}

type addCartType = {
  goodsName: string
  number: number
  price: number
  shopInFoId: number
  skuId: number
  spuId: number
  id?: number
}

//购物车添加
export const addCartAPI = (data: items) => {
  return http({
    method: 'POST',
    url: '/cart/add',
    data,
  })
}
//购物车编辑
export const updateCartAPI = (data: addCartType) => {
  return http({
    method: 'POST',
    url: '/cart/update',
    data,
  })
}
