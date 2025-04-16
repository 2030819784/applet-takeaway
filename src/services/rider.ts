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

//接单
export const getOrderAPI = (orderId: string) => {
    return http({
        method: 'POST',
        url: `/rider/acceptOrder?orderId=${orderId}`,
    })
}

//送达
export const setOrderAPI = (orderId: string) => {
    return http({
        method: 'POST',
        url: `/rider/completeOrder?orderId=${orderId}`,
    })
}

//注销骑手
export const deleteRiderAPI = () => {
    return http({
        method: 'POST',
        url: `/rider/delete`,
    })
}