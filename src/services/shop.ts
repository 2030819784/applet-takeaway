import { http } from '@/utils/http'

/**获取自身商铺列表 */
export const selfShopListAPI = () => {
    return http({
        method: 'GET',
        url: '/shop/list/self',
    })
}