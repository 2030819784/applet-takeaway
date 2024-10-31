import { http } from '@/utils/http'

/**获取自身商铺列表 */
export const selfShopListAPI = () => {
    return http({
        method: 'GET',
        url: '/shop/list/self',
    })
}

/** 删除商品 */
export const deleteGoodsAPI = (id: string) => {
    return http({
        method: 'POST',
        url: '/goods/delete?id=' + id,
    })
}

/** 删除商铺 */
export const deleteShopAPI = (id: string) => {
    return http({
        method: 'POST',
        url: '/shop/delete?id=' + id,
    })
}