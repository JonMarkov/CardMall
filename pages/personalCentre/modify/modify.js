Page({
  /** 
   * 页面的初始数据 
   */

  data: {
    gray: true,
    Length: 6,
    isFocus: true,
    Value: "",
    ispassword: true,
  },
  onLoad: function(options) {
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
  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    if (inputValue.length == 6) {
      that.setData({
        gray: false
      })
    } else {
      that.setData({
        gray: true
      })
    }
    that.setData({
      Value: inputValue,

    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,

    })
  },
  modalcnt: function() {
    wx.showModal({
      title: '提示',
      content: '密码错误，请重新输入',
      showCancel: false,
      success: function(res) {

      }
    })
  },
  submitHttp: function(url, callback) {
    var pay_pwd = this.data.Value;
    var user_id = this.data.user_id
    wx.request({
      url: url,
      method: "POST",
      data: {
        service: "updatePayPassword",
        user_id: user_id,
        pay_pwd: pay_pwd
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        callback(res.data)
      }
    })
  },
  submitHttpCallback: function(res) {
    if (res.result_code == '1') {
      this.modalcnt()
    } else {
      wx.navigateTo({
        url: "/pages/personalCentre/Paypass/Paypass"
      })
    }
  },
  submit(e) {
    var phoneUrl = getApp().globalData.wx_url_1;
    this.submitHttp(phoneUrl, this.submitHttpCallback)
  },
})