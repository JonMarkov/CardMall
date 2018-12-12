// pages/home/phoneCharge/phoneCharge.js
Page({
  data: {
    tellNum: [],
    currentTabsIndex: -1,
    phoneFace: '',
    phoNum: '',
    carrier: '',
    code: '',
    user_id: '',
    locations: '',
    operatorLo:"",
    phoneMa: true
  },
  /**
   * 生命周期函数--监听页面加载
   */

  changColor: function(e) {
    //获取id
    var index = e.currentTarget.dataset['index'];
    // 获取面值
    var phoneFace = e.currentTarget.dataset['face']
    var old = e.currentTarget.dataset['old']
    // 向data设置面值、、、
    this.setData({
      currentTabsIndex: index,
      phoneFace: phoneFace ?'￥' + phoneFace:'',
      old: old
    })
  },
  callPhone: function() {
    wx.addPhoneContact({
      firstName: '',
      mobilePhoneNumber: '',
      success: function(res) {
        console.log(res)
      }
    })
  },
  onLoad: function(options) {
    // 获取本地缓存 user-id
    var that = this;
    wx.getStorage({
      key: "uerid",
      success: function(res) {
        that.setData({
          user_id: res.data
        })
      }
    })
    // 请求接口
    var phoneUrl = getApp().globalData.wx_url_1
    //执行初始化事件函数-遍历插入面值信息
    this.phoneHttp(phoneUrl, this.phoneCallback)
  },
  // 进入页面初始化数据事件-遍历插入面值函数
  phoneHttp: function(url, callback) {
    wx.request({
      url: url,
      method: "POST",
      data: {
        service: "selectProductList"
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        callback(res.data.sale_list)
      }
    })
  },
  // 初始化事件返回成功后回调函数
  phoneCallback: function(res) {
    var tellNum = [];
    for (var idx in res) {
      var salePrice = res[idx].sale_price;
      var price = res[idx].price;
      var id = idx;

      var temp = {
        new_call: salePrice,
        old_call: price,
        id: idx,
        changeColor: ''
      }
      tellNum.push(temp)
    }
    var redyDate = [];
    redyDate = {
      tellNum: tellNum
    }
    this.setData(redyDate)
  },
  //点击面值选项改变当前颜色
  changColor: function(e) {
    //获取id
    var index = e.currentTarget.dataset['index'];
    // 获取面值
    var phoneFace = e.currentTarget.dataset['face'];
    var old = e.currentTarget.dataset['old']
    // 向data设置面值、、、
    this.setData({
      currentTabsIndex: index,
      phoneFace: phoneFace ? '￥' + phoneFace : '',
      old: old
    })
  },
  // 手机号输入监听事件，实时传入data
  bindphoneNum: function(e) {
    //把输入的手机号放到data中
    this.setData({
      phoNum: e.detail.value
    })
  },
  // 手机号输入框失去焦点事件
  bindfocusNum: function() {
    //判断是否为正确的手机号
    var phoneDet = this.data.phoNum;
    if ((/^1[34578]\d{9}$/.test(phoneDet))) {
      this.location(this.locationCallback)
    }
  },
  //手机号输入框失去焦点后执行的函数
  location: function(callback) {
    // 接口url
    var phoneUrl = getApp().globalData.wx_url_1;
    // 手机号
    var phoNumb = this.data.phoNum;
    var userId = this.data.user_id
    wx.request({
      url: phoneUrl,
      method: "POST",
      data: {
        service: "queryProduct",
        telephone: phoNumb,
        user_id: userId
      },
      header: {
        "content-type": "application.josn"
      },
      success: function(res) {
        console.log(res)
        callback(res.data)
      }
    })
  },
  //手机号输入框失去焦点后执行完函数回调中的设置
  locationCallback(res) {
    console.log(res)
    var locations = res.carrier;
   
    var operatorLo = res.operator;
    var sale_list = res.sale_list
    var tellNum = [];
    for (var idx in sale_list) {
      var zk = sale_list[idx].zk;
      var salePrice = sale_list[idx].sale_price;
      var price = sale_list[idx].price;
      var idx = sale_list[idx].id;
      var temp = {
        new_call: salePrice,
        old_call: price,
        id: idx,
        changeColor: '',
        zk:zk
      }
      tellNum.push(temp)
    }
    // var redyDate = [];
    // redyDate = {
    //   tellNum: tellNum
    // }
    this.setData({
      locations: locations,
      operatorLo: operatorLo,
      tellNum: tellNum,
      phoneMa: false
    })
    console.log(this.data)
  },
  // 防止暴力点击
  violent: function(res) {
    console.log(res)
    res.setData({
      buttonClicked: true
    })
    setTimeout(function() {
      res.setData({
        buttonClicked: true
      })
    }, 1000)
  },

  // 点击提交调取微信支付
  bindSubmit: function(e) {
    this.violent(this)
    var that = this;
    var phoneDet = this.data.phoNum;
    if ((/^1[34578]\d{9}$/.test(phoneDet))) {
      console.log(this.data)
      // 获取data数据中的面值参数
      var subface = this.data.old;
      // 获取data中code值
      var sucode = this.data.code;
      var userId = this.data.user_id
      var carrier = this.data.locations
      var operatorLo = this.data.operatorLo
      console.log(userId)
      var phoneUrl = getApp().globalData.wx_url_1
      wx.request({
        url: phoneUrl,
        method: "POST",
        data: {
          service: "createOrder",
          money: subface,
          telephone: phoneDet,
          code: sucode,
          user_id: userId,
          operator: operatorLo
        },
        header: {
          "content-type": "application.josn"
        },
        success: function(res) {
          console.log(res)
          var pay = res.data.payment;

          var timeStamp_pay = pay.timeStamp;
          var nonceStr_pay = pay.nonceStr;
          var package_pay = pay.package;
          var signType_pay = pay.signType;
          var paySign_pay = pay.paySign
          wx.requestPayment({
            'timeStamp': timeStamp_pay,
            'nonceStr': nonceStr_pay,
            'package': package_pay,
            'signType': signType_pay,
            'paySign': paySign_pay,
            'success': function(res) {
              wx.navigateTo({
                url: '/pages/home/chargeSuc/chargeSuc'
              })
            },
            'fail': function(res) {}
          })
        }
      })
    } else {
      //用户收入的手机号不正确
      wx.showModal({
        title: '警告',
        content: '您输入的手机号不正确,请确定您输入的手机号!!!',
        showCancel: false,
        confirmText: '重新输入',
        success: function(res) {
          if (res.confirm) {
            console.log("用户点了'重新输入'")
          }
        }
      })
    }

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