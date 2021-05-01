import {request} from "../../request/index.js";
// pages/goods_list/goods_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid;
    this.getGoodsList();
  },
  //获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams})
    //获取总条数
    const total=res.data.message.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      //下拉有新数据时进行拼接
      goodsList:[...this.data.goodsList,...res.data.message.goods]
      
    })
    //关闭下拉刷新窗口
    wx.stopPullDownRefresh();
  },
  //标题点击事件，从子组件传递过来
  handleTabsItemChange(e){
    //获取被点击标题索引
    const {index}=e.detail;
    //修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })

  },
  /* 
  用户上滑滚动条触底，开始加载下一页数据
  1 判断还有没有下一页内容
  2 有下一页数据 
    1 获取总页数  总页数 = Math.ceil(总页数 / 页容量 pagesize)
    2 获取到当前的页码 pagenum
    3 判断 当前页码 是否大于等于 总页数
      大于等于则表示没内容
  3 没内容弹出提示
  */
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页内容
      wx.showToast({
        title: '没有下一页数据了',
      })
    }else{
      //有下一页内容
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    //1 重置数组
    this.setData({
      goodsList:[]
    })
    //2 重置页码
    this.QueryParams.pagenum=1;
    //3 发送请求
    this.getGoodsList();
  }
})