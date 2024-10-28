import { http } from '@/utils/http'

//获取基本商品信息---
export const getGoodsListAPI = (id: string) => {
  return http({
    method: 'GET',
    //1 上架  不传 默认所有
    url: `/goods/list?shopId=${id}&isPutAway=1`,
  })
}
//获取商品分类---
export const getGoodsCategoryListAPI = (data: string) => {
  return http({
    method: 'GET',
    url: `/dict/list?type=${data}`,
  })
}
//根据分类id获取商铺列表---
export const getShopListAPI = (id: number) => {
  return http({
    method: 'GET',
    url: `/shop/list?typeId=${id}`,
  })
}
//根据商铺id获取商铺信息---
export const getShopMessageAPI = (id: string) => {
  return http({
    method: 'GET',
    url: `/shop/info?shopId=${id}`,
  })
}
