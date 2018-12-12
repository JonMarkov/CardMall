// pages/orderGoods/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false,
    kefuShow:false,
    // 弹窗开始是关闭的
    showModal: false,
    showCode: false,
    err: false,
    date: '请选择日期',
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 61
  },
  submit: function () {
    this.setData({
      kefuShow: true
    })
  },
  go: function () {
    this.setData({
      kefuShow: false
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
  cancellation: function() {
    console.log(this.data)
    var flowNo = this.data.flow_no;
    console.log(flowNo)
    var phoneUrl = getApp().globalData.wx_url_1;
    wx.request({
      url: phoneUrl,
      method: "POST",
      data: {
        service: "calcelOrder",
        flow_no: this.data.flow_no
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        // 执行回调
        console.log(res)
        wx.navigateTo({
          url: '/pages/orderGoods/orderGoods'
        })
      }
    })
  },
  copyNum: function(e) {
    console.log(e)
    var numCopy = e.currentTarget.dataset.num
    var that = this;
    wx.setClipboardData({
      data: numCopy,
      success: function(res) {
        wx.showModal({
          title: '提示',
          content: '复制成功',
          success: function(res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    });
  },
  copyMine: function(e) {
    var mineCopy = e.currentTarget.dataset.mine
    var that = this;
    wx.setClipboardData({
      data: mineCopy,
      success: function(res) {
        wx.showModal({
          title: '提示',
          content: '复制成功',
          success: function(res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 保留this指向
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
    // 从上一页面的参数中获取到的订单号设置到data中
    this.setData({
      flow_no: options.flow_no
    })
  },
  // 防止暴力点击
  violent: function(res) {
    console.log(res)
    res.setData({
      buttonClicked: true
    })
    setTimeout(function() {
      res.setData({
        buttonClicked: false
      })
    }, 1000)
  },
  // 点击去支付按钮函数
  bindToBuy: function() {
    this.violent(this)
    this.buyCallback()
  },
  // 点击去支付按钮之后执行函数
  buyCallback: function(res) {
    // 公共接口
    var phoneUrl = getApp().globalData.wx_url_1;
    // 订单编号
    var flow_no = this.data.flow_no
    wx.request({
      url: phoneUrl,
      method: "POST",
      data: {
        service: "orderToPay",
        flow_no: flow_no

      },
      header: {
        "content-type": "application.josn"
      },
      success: function(res) {
        console.log(res)
        // 获取到支付得参数
        var data_res = res.data.payment
        wx.requestPayment({
          'timeStamp': data_res.timeStamp,
          'nonceStr': data_res.nonceStr,
          'package': data_res.package,
          'signType': data_res.signType,
          'paySign': data_res.paySign,
          'success': function(res) {
            wx.navigateTo({
              url: '/pages/home/commodityDet/confirmSuc/confirmSuc'
            })
          },
          'fail': function(res) {}
        })
      }
    })
  },
  // 联系客服函数，点击拨打电话
  // makePhoneCall: function() {
  //   wx.makePhoneCall({
  //     phoneNumber: '15340158751',
  //     success: function() {
  //       console.log("成功拨打电话")
  //     }
  //   })
  // },
  //点击提取卡密开始展开弹窗
  showDialogBtn: function() {
    var _this = this;
    // 执行第一个弹窗-->手机号验证函数
    this.phoneHttp(_this, this.phoneHttpCallback)
  },
  // 定义第一个弹窗-->手机号验证函数
  phoneHttp: function(_this, callback) {
    var user_id = this.data.user_id;
    var phoneUrl = getApp().globalData.wx_url_1;
    wx.request({
      url: phoneUrl,
      method: "POST",
      data: {
        service: "selectUserPhone",
        user_id: user_id
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        // 执行回调
        callback(_this, res.data)
      }
    })
  },
  // 定义第一个弹窗-->手机号验证函数的回调函数
  phoneHttpCallback: function(_this, res) {
    this.setData({
      user_phone: res.user_phone,
      showCode: true
    })
  },
  // 点击验证码间隔60秒定时器
  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime
    var interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        console.log('jinlai')
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  // 定义第一个弹窗-->手机号验证等于ture后获取验证码函数
  codeObtain: function() {
    this.getCode();
    var user_phone = this.data.user_phone;
    var phoneUrl = getApp().globalData.wx_url_1;
    wx.request({
      url: phoneUrl,
      method: "POST",
      data: {
        service: "identifyCode",
        user_phone: user_phone
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        console.log('获取成功')
      }
    })
  },
  // 定义第一个弹窗-->手机号验证等于ture后input输入监听函数
  codePhoneNum: function(e) {
    //把输入的手机号实时放到data中
    this.setData({
      phoNum: e.detail.value
    })
  },
  // 定义第一个弹窗-->手机号验证等于ture后点击取消函数
  cancel: function() {
    this.setData({
      showCode: false
    })
  },
  // 定义第一个弹窗-->手机号验证等于ture后点击提交函数封装
  confirmSuc: function() {
    this.confirm(this.confirmCallback)
  },
  // 定义第一个弹窗--> 手机号验证等于ture后点击提交函数
  confirm: function(callback) {
    var phoneUrl = getApp().globalData.wx_url_1;
    var user_phone = this.data.user_phone
    var phoNum = this.data.phoNum
    wx.request({
      url: phoneUrl,
      method: "POST",
      data: {
        service: "checkIdentifyCode",
        user_phone: user_phone,
        identify_code: phoNum
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        // 执行回调
        callback(res.data)
      }
    })
  },
  // 定义第一个弹窗--> 手机号验证等于ture后点击提交函数的回调函数
  confirmCallback: function(res) {
    if (res.result_code == 0) {
      console.log(res)
      this.setData({
        showCode: false
      })
      // 如果验证码正确则执行第二个弹窗函数
      this.showHttp(this.showHttpCallback)
    } else {
      console.log('验证码错误')
      this.setData({
        err: true
      })
    }
  },
  // 定义第二个弹窗-->获取卡密信息执行函数
  showHttp: function(callback) {
    // 公共URL
    var phoneUrl = getApp().globalData.wx_url_1;
    // 订单编号
    var flow_no = this.data.flow_no
    // 请求卡密和卡号内容
    wx.request({
      url: phoneUrl,
      method: "POST",
      data: {
        service: "extractCardmine",
        flow_no: flow_no
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        // 执行回调
        callback(res.data.cardmine_list)
      }
    })
    this.setData({
      showModal: true
    })
  },
  // 定义第二个弹窗-->获取卡密信息的回调函数
  showHttpCallback: function(res) {

    console.log(res)
    // 如果没有卡密和卡号等信息
    if (res == '') {
      var card_num = '网络堵塞，请稍后...';
      var cardmine = '网络堵塞，请稍后...'
    } else {
      var card = []
      for (var i in res) {
        var card_num = res[i].card_num;
        var cardmine = res[i].cardmine
        var temp = {
          card_num: card_num,
          cardmine: cardmine
        }
        card.push(temp)
      }
      // var card_num = res.card_num;
      // var cardmine = res.cardmine;
    }
    // 把数据放到data中
    this.setData({
      card: card
    })
  },
  //定义第二个弹窗-->获取卡密信息的关闭弹窗函数
  hideModal: function() {
    this.setData({
      showModal: false
    });

  },
  //定义第二个弹窗-->获取卡密信息的弹窗之后点击确定
  onConfirm: function() {
    this.hideModal();
    console.log('1')
  },
  //定义第二个弹窗-->获取卡密信息的弹窗之后点击取消
  onCancel: function() {
    this.hideModal();
    console.log('2')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 公共url
    var phoneUrl = getApp().globalData.wx_url_1
    // 执行页面遍历函数
    this.detaHttp(phoneUrl, this.detaHttpCallback)
  },
  // 进入页面遍历
  detaHttp: function(url, callback) {
    // 获取订单编号
    var flow_no = this.data.flow_no
    // 进入页面遍历获取所需信息
    wx.request({
      url: url,
      method: "POST",
      data: {
        service: "orderDetails",
        flow_no: flow_no
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        console.log(res.data.cardmine_list)
        // 遍历之后回调函数执行
        callback(res.data)
      }
    })
  },
  // 遍历之后的回调函数
  detaHttpCallback: function(res) {
    console.log(res.order_info)
    // 判断订单状态
    var oStatus = res.order_info.status;
    // 订单编号
    var flow_no = res.order_info.flow_no;
    // 商品图片地址
    var pic_url = res.order_info.pic_url;
    // 购买数量
    var goods_num = res.order_info.goods_num;
    // 订单金额
    var total = res.order_info.total;
    // 购买商品name
    var goods_name = res.order_info.goods_name;
    // 商品广告语
    var ad_words = res.order_info.ad_words;
    // 价钱
    var sale_price = res.order_info.sale_price
    // 订单状态文字显示
    var orderState = oStatus == 0 ? "待支付" : oStatus == 1 ? "待提取" : "已完成"
    // 获取下单时间
    var create_date = this.timestampToTime(res.order_info.create_date)
    // 获取支付时间
    var pay_time = this.timestampToTime(res.order_info.pay_time)

    var cardmine_list = res.cardmine_list
    var cardmineList = []
    for (var index in cardmine_list) {
      var card_num = cardmine_list[index].card_num;
      var cardmine = cardmine_list[index].cardmine;
      var temp = {
        card_num: card_num,
        cardmine: cardmine
      }
      cardmineList.push(temp)
    }
    this.setData({
      oStatus: oStatus,
      status: orderState,
      flow_no: flow_no,
      pic_url: pic_url,
      goods_num: goods_num,
      total: total,
      goods_name: goods_name,
      ad_words: ad_words,
      sale_price: sale_price,
      create_date: create_date,
      pay_time: pay_time,
      cardmineList: cardmineList
    })
    console.log(this.data)
  },
  // 时间戳转换为时间
  timestampToTime: function(timestamp) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
  }
})