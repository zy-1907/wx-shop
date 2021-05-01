import {request} from "../../request/index.js";
Page({
  data: {
    //轮播图数组
    swiperList: [],
    //分类导航数组
    catesList:[],
    //楼层数据
    floorList:[]

  },
  onLoad: function (options) {
    // 发送异步请求获取轮播图数据
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     // console.log(result)
    //    this.setData({
    //      swiperList:result.data.message
    //    })
    //   },
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getfloorList();
  },
  //获取轮播图数据
 getSwiperList(){
    //使用Promise封装微信的reques，防止回调地狱
    request({
       url:"/home/swiperdata"
      //url:"http://localhost/wxShop/home/swiperdata.php"
    })
    .then(result => {
      //console.log(result)
      this.setData({
        swiperList: result.data.message
      })
    })
 },
 //
 getCatesList(){
  request({
    url:"/home/catitems"
   // url:"http://localhost/wxShop/catitems/catitems.php"
  })
  .then(result => {
    // console.log(result)
    this.setData({
      catesList: result.data.message
    })
  })
},
 //
 getfloorList(){
  request({
     url:"/home/floordata"
    //url:"http://localhost/wxShop/home/floordata.php"
  })
  .then(result => {
    // console.log(result)
    this.setData({
      floorList: result.data.message
    })
  })
}
})