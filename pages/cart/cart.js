/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api 获取用户地址 wx.choosesAddress

2 页面加载完毕
  0 onLoad->页面第一次加载时触发，从跳转页面返回时不能触发，可以传递参数 onShow->页面显示或从后台跳回小程序时显示此页面时触发，从跳转页面返回时触发，不能传递参数
  1 获取本地存储中的地址数据
  2 把数据 设置给data中的一个变量
*/
Page({
  data:{
    address:{}
  },
  onShow(){
    // 1 获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    this.setData({
      address
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