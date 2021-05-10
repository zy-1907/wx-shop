/* 
1 页面加载
  1 从缓存中获取购物车数据（选中的商品checked=true ） 渲染到页面中
*/

Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1 获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    //1 获取缓存中的购物车数据
    let cart=wx.getStorageSync('cart')||[];
    // 过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
    this.setData({address});
  
      // 总价格 总数量
      let totalPrice=0;
      let totalNum=0;
      cart.forEach(v=>{
          totalPrice +=v.num*v.goods_price;
          totalNum+=v.num;
      })
      this.setData({
        cart,
        address,
        totalPrice,
        totalNum
      })
  }
})
  //点击支付
