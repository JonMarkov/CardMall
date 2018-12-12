// pages/orderGoods/rechargeOrder/rechargeOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false
  },
  // makePhoneCall: function () {
  //   wx.makePhoneCall({
  //     phoneNumber: '15340158751',
  //     success: function () {
  //       console.log("成功拨打电话")
  //     }
  //   })
  // },
  submit: function () {
    this.setData({
      showModal: true
    })
  },

  go: function () {
    this.setData({
      showModal: false
    })
  },
  makePhoneCall1: function () {
    wx.makePhoneCall({
      phoneNumber: '15340158751',
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },
  makePhoneCall2: function () {
    wx.makePhoneCall({
      phoneNumber: '15340162692',
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取本地缓存里面的urseid，并设置到data中
    var that = this;
    wx.getStorage({
      key: "uerid",
      success: function(res) {
        that.setData({
          user_id: res.data
        })
      }
    })
  },
  rechargeHttp: function(callback) {
    var phoneUrl = getApp().globalData.wx_url_1;
    var userId = this.data.user_id;
    wx.request({
      url: phoneUrl,
      method: "POST",
      data: {
        service: "rechargeOrderList",
        user_id: userId
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        callback(res.data.order_list)
      }
    })
  },
  rechargeHttpCallback: function(res) {
    console.log(res)
    var orderList = []
    for (var i in res) {
      // 订单时间
      var create_date = res[i].create_date;
      // 充值面值
      var face_value = res[i].face_value;
      // 运营商
      var operator = res[i].operator
      // 订单编号
      var order_code = res[i].order_code
      // 归属地
      var province = res[i].province
      // 状态
      var status = res[i].status == 1 ? "待支付" : res[i].status == 2?"已支付":"支付失败"
      // 支付金额
      var total = res[i].total
      // 充值号码
      var telephone = res[i].telephone
      var temp = {
        create_date: create_date,
        face_value: face_value,
        operator: operator,
        order_code: order_code,
        province: province,
        status: status,
        total: total,
        telephone: telephone
      }
      orderList.push(temp)
    }
    this.setData({
      orderList: orderList
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    wx.getStorage({
      key: "uerid",
      success: function(res) {
        that.setData({
          user_id: res.data
        })
      }
    })
    this.rechargeHttp(this.rechargeHttpCallback)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})