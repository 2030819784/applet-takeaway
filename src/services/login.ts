import { http } from '@/util/http'

export const postLoginWxMinAPI = (code: string) => {
    return http({
        method: 'POST',
        url: `/login/wechat/${code}`,
    })
}