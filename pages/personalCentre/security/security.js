// pages/personalCentre/security/security.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 获取userID
    wx.getStorage({
      key: "uerid",
      success: function(res) {
        // 把userId设置到data中
        that.setData({
          user_id: res.data
        })
      }
    })
  },
  secHttp: function(url, callback) {
    var userId = this.data.user_id;
    wx.request({
      url: url,
      method: "POST",
      data: {
        service: "checkPayPassword",
        user_id: userId,

      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        callback(res.data)
      }
    })
  },
  secHttpCallback: function(res) {
    var userPhone = res.user_phone;
    var resultCode = res.result_code;
    var set_pay_pwd = res.set_pay_pwd
    this.setData({
      userPhone: userPhone,
      set_pay_pwd: set_pay_pwd
    })
  },
  bindPh: function() {
    wx.navigateTo({
      url: "/pages/orderGoods/bindPh/bindPh"
    })
  },
  bindPass: function() {
    wx.navigateTo({
      url: "/pages/personalCentre/Paypass/Paypass"
    })
  },
  bindModify: function() {
    wx.navigateTo({
      url: "/pages/personalCentre/modify/modify"
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    // 获取userID
    wx.getStorage({
      key: "uerid",
      success: function(res) {
        // 把userId设置到data中
        that.setData({
          user_id: res.data
        })
      }
    })
    var phoneUrl = getApp().globalData.wx_url_1
    this.secHttp(phoneUrl, this.secHttpCallback)
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