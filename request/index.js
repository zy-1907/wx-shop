//同时发送异步代码的次数
let ajaxTimes=0

export const request=(params)=>{
  ajaxTimes++;
  //显示加载中效果
  wx.showLoading({
    title: '加载中',
    mask: true
  });

  //公共url
  const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
  // const baseUrl="http://localhost/wxShop/"
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      url:baseUrl+params.url,
      success: (result) => {
        resolve(result);
      },
      fail: (res) => {
        reject(res);
      },
      complete:()=>{
        ajaxTimes--
        //关闭正在等待
        if(ajaxTimes===0){
          wx.hideLoading()
        }
      }
    });
  })
}