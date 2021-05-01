import {request} from "../../request/index.js";
Page({
  data: {
   //左侧菜单数据
    leftMenuList:[],
    //右侧商品数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧内容加载时滚动条自动回顶部设置
    scrollTop:0

  },
  //接口返回的数据
  Cates:[],
  onLoad: function (options) {
    /* 
    本地存储区别：
      web开发本地存储：localStorage.setItem("key","value") localStorage.getItem("key"）
      小程序本地存储：wx.setStorageSync('key', data) wx.getStorageSync('key')

      web：不管存入的是什么类型的数据，最终都会先调用toString()，把数据变成了字符串再存入
      小程序：不存在类型转换操作，存什么类型获取时就是什么类型
    */
    //获取本地存储
    const Cates = wx.getStorageSync('cates')
    if(!Cates){
      //不存在 发送请求获取数据
       this.getCates();
    }else{
      //有旧数据
      //判断数据有没有超过5分钟
      if(Date.now()-Cates.time>300000){
        //重新发送请求
        this.getCates()
      }else{
        //可以使用旧数据
        this.Cates = Cates.data;
        let leftMenuList=this.Cates.map(v=>v.cat_name)
        let rightContent=this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  //获取分类数据
  async getCates(){
   /*  request({
      url:"/categories"
    })
      .then(res=>{
        this.Cates=res.data.message;
        //把接口数据存入本地存储
        wx.setStorageSync("cates", {time:Date.now(),data:this.Cates})

        //构造左侧大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name)
        //右侧商品数据
        let rightContent=this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }) */
      //使用es7的async await来发送请求
      const res = await request({url:"/categories"});
       this.Cates=res.data.message;
        //把接口数据存入本地存储
        wx.setStorageSync("cates", {time:Date.now(),data:this.Cates})

        //构造左侧大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name)
        //右侧商品数据
        let rightContent=this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })


  },
  //左侧菜单点击事件
  handleItemTap(e){
    /* 
    1 获取被点击标题的索引
    2 给data中的currentItemIndex赋值
    3 根据不同的索引来渲染右侧商品
    
    */
    const {index} = e.currentTarget.dataset;
    let rightContent=this.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      ////右侧内容加载时滚动条自动回顶部设置
      scrollTop:0
    })
  }
})