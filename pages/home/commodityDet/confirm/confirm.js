// pages/home/commodityDet/confirm/confirm.js
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
    wx.getStorage({
      key: "payid",
      success: function(res) {
        that.setData({
          pay: res.data
        })
      }
    })
    wx.getStorage({
      key: "mallid",
      success: function(res) {
        console.log(res)
        that.setData({
          picList: res.data.info[0].picList[0].picUrl,
          goodsName: res.data.info[0].goodsName,


        })
      }
    })
    wx.getStorage({
      key: "mall",
      success: function(res) {
        console.log(res)
        that.setData({
          goods_num: res.data.goods_num,
          new_price: res.data.new_price,
          old_price: res.data.old_price,
          value_name: res.data.value_name,
          zong: res.data.zong.toFixed(2)
        })
      }
    })
  },
  // 防止暴力点击
  violent: function (res) {
    console.log(res)
    res.setData({
      buttonClicked: true
    })
    setTimeout(function () {
      res.setData({
        buttonClicked: true
      })
    }, 1000)
  },
  mac: function() {
    this.violent(this)
    var phoneUrl = getApp().globalData.wx_url_1;
    var timeStamp_pay = this.data.pay.timeStamp;
    var nonceStr_pay = this.data.pay.nonceStr;
    var package_pay = this.data.pay.package;
    var signType_pay = this.data.pay.signType;
    var paySign_pay = this.data.pay.paySign
    console.log(timeStamp_pay)
    wx.requestPayment({
      'timeStamp': timeStamp_pay,
      'nonceStr': nonceStr_pay,
      'package': package_pay,
      'signType': signType_pay,
      'paySign': paySign_pay,
      'success': function(res) {
        wx.navigateTo({
          url: '/pages/home/commodityDet/confirmSuc/confirmSuc'
        })
      },
      'fail': function(res) {}
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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