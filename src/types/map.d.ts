//根据经纬度返回的列表数据类型
export type sampleListType = {
  id: string
  name: string
  distance: string
  detailedAddress: string
  imgList?: imgType[]
}

export type imgType = {
  id: string
  objName: string
}
