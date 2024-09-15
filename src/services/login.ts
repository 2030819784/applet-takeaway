import { http } from '@/util/http'
type LoginParams = {
    code: string
    phoneCode: string
}

export const postLoginWxMinAPI = (data: LoginParams) => {
    return http({
        method: 'POST',
        url: '/login/wechat',
        data,
    })
}