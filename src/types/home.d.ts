import { type } from 'os'
import type { GoodsItem } from './global'
import { imgType } from './map'
import { items } from './order'

/** 分类数据类型 */
export type CategoryItem = {
  /** 图标路径 */
  icon: string
  /** id */
  id: string
  /** 分类名称 */
  name: string
  url: string
}

//首页商品信息获取参数
export type goodsListParams = {
  //分类
  categoryName: string
  //商品名称
  goodName?: string
  page: number
  pageSize: number
  //店铺名称
  shopName?: string
  //用户经纬度
  userLatitude?: number
  userLongitude?: number
}

//首页商品信息返回数据
export type goodsListResultItems = {
  //数量
  count: number
  //该类商品列表
  list: items[]
}

export type imgListType = {
  id: string
  ownerType: string
  goods_spu: string
  ownerId: string
  name: string
  objName: string
  type: string
  size: string
  createdAt: string
  updatedAt: string
}

export type items = {
  id: number
  //类别名称
  categoryName: string
  //商品名称
  goodName: string
  //商品价格
  price: number
  //店铺名称
  shopName: string
  skuValue: string
  spuValue: string
  stock: number
  //图片
  imgList: imgListType[]
}

/** 商品类型 */
export type GuessItem = GoodsItem
