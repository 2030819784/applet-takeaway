import { http } from '@/utils/http'
import type { authenticationList } from '@/types/profile'

export const Authentication = (data: authenticationList) => {
  return http({
    method: 'POST',
    url: '/user/authentication',
    data,
  })
}
