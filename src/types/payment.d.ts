export type goodsType = {
  totalNumber: number
  totalPrice: number
  finalData: goodsListType[]
}

export type goodsListType = {
  checked?: boolean
  createdAt?: number
  name: string
  id?: number
  number: number
  price: number
  scene?: boolean
  shopAddressId?: number
  shopInfoId?: number
  skuId?: number
  spuId?: number
  state?: number
  updatedAt?: number
  userId?: number
  imgUrl?: string
}
