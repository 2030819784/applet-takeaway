import { http } from '@/utils/http'
//获取轮播图商品
export const getCarouselListAPI = () => {
  return http({
    method: 'POST',
    url: '/slideshow/list',
  })
}
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

//根据商品id获取商品详细信息
export const getGoodsDetailMessageAPI = (id: number) => {
  return http({
    method: 'GET',
    url: `/goods/detailByApp/${id}`,
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
export const getShopMessageAPI = (id: number) => {
  return http({
    method: 'GET',
    url: `/shop/info?shopId=${id}`,
  })
}

//添加订单信息
export const addOrderAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/cart/settlement',
    data,
  })
}

//获取联系人列表
export const getAffiliatedListAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/orderAddress/list',
    data,
  })
}

//获取联系人详情
export const getAffiliatedDetailAPI = (id: any) => {
  return http({
    method: 'GET',
    url: `/orderAddress/detail/${id}`,
  })
}
//删除联系人
export const deleteAffiliatedAPI = (id: any) => {
  return http({
    method: 'POST',
    url: `/orderAddress/delete/${id}`,
  })
}
//增加联系人
export const addAffiliatedAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/orderAddress/add',
    data,
  })
}
