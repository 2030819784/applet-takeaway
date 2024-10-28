import { http } from '@/utils/http'

//添加商铺
export const addShopAPI = (data: any) => {
    return http({
        method: 'POST',
        url: '/shop/register',
        data,
        header: {
            'Content-Type': 'application/jsonoctet-stream'
        },
    })
}