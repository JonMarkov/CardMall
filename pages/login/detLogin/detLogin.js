Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function(options) {
    var goods_id = options.goods_id;
    var sharrUserId = options.sharrUserId;
    var sku_id = options.sku_id;
    this.setData({
      goods_id: goods_id,
      sharrUserId: sharrUserId,
      sku_id: sku_id
    })
    console.log(this.data)
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              //从数据库获取用户信息
              //用户已经授权过
              wx.navigateTo({
                url: "/pages/home/commodityDet/commodityDet?goods_id=" + goods_id + "&" + "sharrUserId=" + sharrUserId + "&" + "sku_id=" + sku_id
              })
            }
          });
        }
      }
    })
  },
  //判断手机号
  phoneHttp: function(userId, callback) {
    var phoneUrl = getApp().globalData.wx_url_1;
    wx.request({
      url: phoneUrl,
      method: "POST",
      data: {
        service: "checkPhone",
        user_id: userId
      },
      header: {
        "content-type": "application.josn"
      },
      success: function(res) {
        callback(res)
      }
    })
  },
  // 判断手机号的回调函数
  phoneHttpCallback: function(res) {
    wx.setStorage({
      key: "phone",
      data: res.data.is_bind_phone
    })
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      wx.setStorage({
        key: "weChat",
        data: e.detail.userInfo
      })
      wx.login({
        success: res => {
          var params = {
            service: 'userVerify',
            code: res.code,
            nickName: e.detail.userInfo.nickName,
          }
          params.service = 'userVerify'
          params.code = res.code
          const newparams = Object.assign(params, getApp().globalData.params);
          // const newparams = util.sign(params1)
          wx.request({
            url: getApp().globalData.wx_url_1,
            data: newparams,
            method: "POST",
            // dataType: JSON,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: res => {
              wx.setStorage({
                key: "uerid",
                data: res.data.user_id
              })
              //从数据库获取用户信息
              var macid = res.data.user_id
              this.phoneHttp(macid, this.phoneHttpCallback)
            }
          })
        }
      });
      console.log(this.data)
      var goods_id = this.data.goods_id;
      var sharrUserId = this.data.sharrUserId;
      var sku_id = this.data.sku_id
      wx.navigateTo({
        url: "/pages/home/commodityDet/commodityDet?goods_id=" + goods_id + "&" + "sharrUserId=" + sharrUserId + "&" + "sku_id=" + sku_id
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
})