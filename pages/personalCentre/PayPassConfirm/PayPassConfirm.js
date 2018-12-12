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
    var passW = options.pass;
    this.setData({
      passW: passW
    })
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
      content: '两次密码输入不一致',
      showCancel: false,
      success: function(res) {

      }
    })
  },
  submit(e) {
    var passTwo = this.data.Value;
    var passW = this.data.passW;

    if (passTwo != passW) {
      this.modalcnt()
    } else {
      var phoneUrl = getApp().globalData.wx_url_1;
      this.passHttp(phoneUrl, this.passHttpCallback)
    }

  },
  passHttp:function(url,callback){
    var passW = this.data.passW;
    var user_id = this.data.user_id
    wx.request({
      url: url,
      method: "POST",
      data: {
        service: "setPayPassword",
        user_id: user_id,
        pay_pwd:passW
      },
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        callback(res.data)
      }
    })
  },
  passHttpCallback:function(res){
    wx.navigateTo({
      url: '/pages/personalCentre/security/security'
    }) 
  }
})