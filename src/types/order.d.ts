//获取订单信息参数
export type orderListParams = {
  page: number
  pageSize: number
  state?: number
}
export type userOrderListParams = {
  page: number
  pageSize: number
  state?: number
  userId?: number
  phone: number
}

export type orderListResult = {
  //总条数
  count: number
  //返回的数据集合
  list: items[]
}
//订单基本信息
export type items = {
  id: number
  orderNo: number
  itemCount: number
  phone: number
  nickname: string
  payMode: number
  orderTime: number
  payTime: number
  outTradeNo: number
  deliveryMode: number
  totalPrice: number
  logisticsFee: number
  actualPay: number
  state: any
  status: any
  createdAt: number
  orderProductsList: orderProductsList[]
}
//订单商品信息
export type orderProductsList = {
  id: number
  skuSpecValue: string
  spuSpecValue: string
  shopName: string
  shopAddressId: number
  provinceName: string
  cityName: string
  districtName: string
  detailedAddress: string
  goodsName: string
  number: number
  price: number
}

//新增订单参数
export type addOrderItemParams = {
  //实际付款
  actualPay: number
  //创建时间
  createdAt: string
  //运输方式
  deliveryMode: number
  //订单id
  id: number
  //商品数量
  itemCount: number
  //物流费用
  logisticsFee: number
  //订单号
  orderNo: number
  //提交时间
  orderTime: string
  //出贸号
  outTradeNo: string
  //支付方式
  payMode: number
  //支付时间
  payTime: number
  //订单状态
  state: number
  //订单总价格
  totalPrice: number
  //更新时间
  updatedAt: string
  //用户id
  userId: number
}

//微信返回的订单信息参数类型(不包含订单编号)
export type WXOrderType = {
  appId: string
  noceStr: string
  packageVal: string
  package?: string
  paySign: string
  signType: string
  timeStamp: string
}

//微信返回的订单信息参数类型
export type WXAllOrderType = {
  orderNo?: string
  response: WXOrderType
}
