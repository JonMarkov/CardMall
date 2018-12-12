Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoNum: '',
    codeNum: '',
    date: '请选择日期',
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 61
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取上一页面传参得来的参数 goods_id，并设置到data中
    this.setData({
      good_id: options.goods_id,
      sku_id: options.sku_id
    })
    // 获取本地缓存里面的urseid，并设置到data中
    var that = this;
    wx.getStorage({
      key: "uerid",
      success: function (res) {
        that.setData({
          user_id: res.data
        })
      }
    })
  },
  // 点击验证码间隔60秒定时器
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    var interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  // 点击验证码执行函数
  bindToCode: function () {
    var user_phone = this.data.phoNum
    var phoneUrl = getApp().globalData.wx_url_1
    // 判断是否为正确的手机号，是则执行，否则弹窗
    if ((/^1[34578]\d{9}$/.test(user_phone))) {
      this.getCode();
      var that = this
      that.setData({
        disabled: true
      })
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
        success: function (res) { }
      })
    } else {
      this.modalcnt()
    }
  },

  // 如果手机号输入格式错误执行的弹窗
  modalcnt: function () {
    wx.showModal({
      content: '请输入正确的手机号',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  modalcode: function () {
    wx.showModal({
      content: '请输入正确的验证码',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  // 手机号输入监听事件，实时传入data
  bindphoneNum: function (e) {
    //把输入的手机号放到data中
    this.setData({
      phoNum: e.detail.value
    })
  },
  // 验证码输入监听
  bindcodeNum: function (e) {
    //把输入的验证码放到data中
    this.setData({
      codeNum: e.detail.value
    })
  },
  // 点击提交按钮执行函数
  bindTosubmit: function () {


    var that = this
    var userId = this.data.user_id;
    var phoneUrl = getApp().globalData.wx_url_1;
    var user_phone = this.data.phoNum;
    var identify_code = this.data.codeNum;
    var user_phone = this.data.phoNum;

    if ((/^1[34578]\d{9}$/.test(user_phone))) {

      if (identify_code) {
        wx.request({
          url: phoneUrl,
          method: "POST",
          data: {
            service: "bindPhone",
            user_id: userId,
            user_phone: user_phone,
            identify_code: identify_code
          },
          header: {
            "content-type": "application/json"
          },
          success: function (res) {
    
            if (res.data.result_code == 0) {
              wx.setStorage({
                key: "phone",
                data: 1
              })
              var goodid = that.data.good_id;
              var sku_id = that.data.sku_id
              wx.navigateTo({
                url: "/pages/personalCentre/security/security"
              })
            } else {
              that.modalcode()
            }

          }
        })
      } else {
        this.modalcode()
      }
    } else {
      this.modalcnt()
    }


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})