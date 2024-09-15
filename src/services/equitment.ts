//检测相关
import { http } from '@/utils/http'
import type { departmentApparatusParams } from '@/types/equitment'

//获取设备列表信息接口
export const getdepartmentApparatusAPI = (data: departmentApparatusParams) => {
  return http({
    method: 'POST',
    url: '/departmentApparatus/list',
    data,
  })
}
