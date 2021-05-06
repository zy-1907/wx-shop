/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api 获取用户地址 wx.choosesAddress

2 页面加载完毕
  0 onLoad->页面第一次加载时触发，从跳转页面返回时不能触发，可以传递参数 onShow->页面显示或从后台跳回小程序时显示此页面时触发，从跳转页面返回时触发，不能传递参数
  1 获取本地存储中的地址数据
  2 把数据 设置给data中的一个变量
3 onShow
  0 回到了商品详情页面 第一次添加商品的时候 手动添加了属性
    1 num=1；
    2 checked=true;
  1 获取缓存中的购物车数组
  2 把购物车数据 填充到data中
4 全选的实现 数据的展示
  1 onShow 获取缓存中的购物车数组
  2 根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就被选中
  */
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false
  },
  onShow(){
    //1 获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    //1 获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[];
    // 计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么每一个回调函数都返回true 那么 every方法返回值为true
    //只要 有一个回调函数返回false 那么不在循环执行，直接返回false
    //空数组 调用 every 返回 true
    const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({
      address,
      cart,
      allChecked
    })
  },
  // 点击 收货地址
  handleChooseAddress(){
    wx.chooseAddress({
      success: (result) => {
         wx.setStorageSync('address', result);
      } 
    });
  }
})