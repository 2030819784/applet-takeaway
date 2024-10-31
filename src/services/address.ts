import { http } from '@/utils/http'

/** 地址列表 */
export const addressListAPI = () => {
    return http({
        method: 'GET',
        url: '/address/list',
    })
}

/** 保存地址 */
export const saveAddressAPI = () => {
    return http({
        method: 'POST',
        url: '/address/save',
    })
}

/** 删除地址 */
export const deleteAddressAPI = () => {
    return http({
        method: 'POST',
        url: '/address/delete',
    })
}
