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
5 总价格和总数量
  1 都需要商品被选中 才计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品的单价 * 商品的数量
  6 总数量 += 商品的数量
  7 把计算后价格和数量 设置回data中
6 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算全选，总价格 总数量
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取 data中的全选变量 allChecked
  3 直接取反 allChecked=!allChecked
  4 遍历购物车数组 让里面 商品 选中状态跟随 allChecked 改变而改变
  5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中
8 商品数量的编辑
  1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性
  2 传递被点击的商品od goods_id
  3 获取打他中的购物车数组 来获取需要被修改的商品对象
    当购物车的数量=1 同时用户点击 "-"
    弹出提示(showModal)，询问是否要删除
  4 直接修改商品对象的数量 num
  5 把cart数组 重新设置回 缓存中 和 data中
9 点击结算
  1 判断有没有收获地址信息
  2 判断用户有没有选购商品
  3 经过以上的验证 跳转到 支付页面
  */
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1 获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    //1 获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[];
   /*  // 计算全选         封装到了setCart里！！
    // every 数组方法 会遍历 会接收一个回调函数 那么每一个回调函数都返回true 那么 every方法返回值为true
    //只要 有一个回调函数返回false 那么不在循环执行，直接返回false
    //空数组 调用 every 返回 true
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    let allChecked=true;
    // 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice +=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false
      }
    })
    //判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      address,
      cart,
      allChecked,
      totalPrice,
      totalNum
    }) */
    this.setData({address});
    this.setCart(cart);
  },
  // 点击 收货地址
  handleChooseAddress(){
    wx.chooseAddress({
      success: (result) => {
         wx.setStorageSync('address', result);
      } 
    });
  },
  //商品的选中
  handelItemChange(e){
    // 1 获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id
    // 2 获取购物车数组
    let {cart}=this.data;
    // 3 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    // 4 选中状态取反
    cart[index].checked=!cart[index].checked
    //把购物车数据重新设置回data中 和 缓存中
    this.setCart(cart);
     
    
  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买数量
  setCart(cart){
    let allChecked=true;
    // 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice +=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false
      }
    })
    //判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart)
  },
  //商品的全选
  handleItemAllCheck(){
    // 1 获取data中的数据
    let {cart,allChecked}=this.data;
    // 2 修改值
    allChecked=!allChecked;
    // 3 循环修改cart数组中商品的选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 4 把修改后的值 填充回data或缓存中
    this.setCart(cart);
  },
  //商品数量的编辑功能
  handleItemNumEdit(e){
    //获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    //获取购物车数组
    let {cart}=this.data;
    //找到需要修改的商品索引
    const index=cart.findIndex(v=>v.goods_id===id);
    //判断是否执行删除
    if(cart[index].num===1&&operation===-1){
      //弹窗提示
      wx.showModal({
        title:'提示',
        content: '您是否要删除',
        //不用=>箭头函数的话 this.setCart(cart) this指向的是showModal
        success:(res)=>{
          if(res.confirm){
            cart.splice(index,1)
            this.setCart(cart);
          }else if(res.cancel){
            cart[index].num=1
            this.setCart(cart);
          }
        }
      })
    }else{
    //修改数量
    cart[index].num+=operation;
    //设置回缓存和data中
    this.setCart(cart);
    }
   
  },
  //点击结算
  handlePay(){
    // 1 判断收货地址
    const {address,totalNum}=this.data
    if(!address.userName){
      wx.showToast({
        title: '还没有选择收货地址',
        icon: 'none'
      })
      return;
    }
    // 2 判断用户有没有选购商品
    if(totalNum===0){
      wx.showToast({
        title: '还没有选购商品',
        icon: 'none'
      })
      return;
    }
    // 3 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  }
})