import { http } from '@/utils/http'

// 成为骑手
export const addRiderAPI = (name: string) => {
    return http({
        method: 'POST',
        url: '/rider/register',
        data: {
            name
        }
    })
}
//接单列表
export const getOrderListAPI = (acceptStatus: number) => {
    return http({
        method: 'POST',
        url: `/rider/orderList?acceptStatus=${acceptStatus}`,
    })
}