// 此页面为购买商品时候未绑定手机号
Page({
  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false,
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'normal',
    maxStatus: 'normal',
    currentTabsIndex: 0,
    goods_num: 1,
    relation_id: 1,
    stock: 1
  },
  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    var maxStatus = num >= this.data.stock ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      maxStatus: maxStatus,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    num++;
    if (num > this.data.stock) {
      num--
    }
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    var maxStatus = num >= this.data.stock ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      maxStatus: maxStatus,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  // 点击面值选项
  bindToFace: function(e) {
    console.log(e)
    var arrtId = e.currentTarget.dataset['a'];
    var faceNum = e.currentTarget.dataset['face'];

    var goods_id = this.data.goods_id
    var salePrice = this.data.comlist[faceNum].salePrice;
    var price = this.data.comlist[faceNum].price;
    var relation_id = this.data.comlist[faceNum].relation_id;
    var stock = this.data.comlist[faceNum].stock;
    var value_name = this.data.tellAttr[faceNum].value_name
  
    this.setData({
      salePrice: salePrice,
      price: price,
      iarrtIdd: arrtId,
      currentTabsIndex: currentTabsIndex,
      relation_id: relation_id,
      goods_id: goods_id,
      stock: stock,
      value_name: value_name

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 存储this
    var that = this;
    // skuId
    var sku_id = options.sku_id;
    // 商品Id
    var goods_id = options.goods_id;
    // 存储到data中
    this.setData({
      goods_id: goods_id,
      sku_id: sku_id
    })
    // 获取userid存储user-id到data中
    wx.getStorage({
      key: "uerid",
      success: function(res) {
        that.setData({
          user_id: res.data
        })
      }
    })

    // 进入页面遍历所需要信息传入页面函数执行
    this.dityDet(this.dityDetCallback)
  },
  // 进入页面遍历所需要信息传入页面函数
  dityDet: function(callback) {
    //现存data参数
    var thisData = this.data
    // 公共url
    var phoneUrl = getApp().globalData.wx_url_1;
    // 获取商户Id
    var goods_id = thisData.goods_id;
    // 获取skuId
    var sku_id = thisData.sku_id
    wx.request({
      url: phoneUrl,
      method: "POST",
      data: {
        service: "goodsDetails",
        goods_id: goods_id,
        sku_id: sku_id
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        callback(res.data)
      }
    })
  },
  // 进入页面遍历所需要信息传入页面函数回调函数
  dityDetCallback: function(res) {
   console.log(res)
////////////////////////////
  //  商品信息列表LIST
    var goods_info = res.goods_info;
    // 商品详情图  
    var picUrl = goods_info.picList[0].picUrl;
    // 商品详情标题
    var goodsName = goods_info.goodsName
    // 商品广告语
    var adWords = goods_info.adWords;
    // 商品现价
    var price = goods_info.price;
    // 商品原价
    var salePrice = goods_info.salePrice;
    // 商品信息列表DATA
    var goodsTemp = {
      picUrl: picUrl,
      goodsName: goodsName,
      adWords: adWords,
      price: price,
      salePrice: salePrice
    };
////////////////////////////
    // SKU信息列表LIST
    var skuList = res.skuList[0].gsrList;
    // SKU信息列表DATA
    var skuDataList = []
    // 循环SKU里面得数据
    for(var i in skuList){
      // 获取relationId
      var skuRelationId = skuList[i].relationId;
      var skuTemp = {
        skuRelationId: skuRelationId
      }
      skuDataList.push(skuTemp)
    }
  ////////////////////////////////////////
    // 循环可选择类型列表LIST
    // 第一层类型
    var attrList = res.goods_info.attrList
    var attrDataList = []
    for(var i in attrList){
      // 类型名称
      var attr_name = attrList[i].attr_name;
      // 类型ID
      var attr_id = attrList[i].attr_id;
      // 第二层类型
      var valueList = attrList[i].value_list
      var valueDataList = [];
      for(var j in valueList){
        var valueRelationId = valueList[j].relation_id;
        var valueId = valueList[j].value_id;
        var valueName = valueList[j].value_name;
        var valueTemp = {
          valueRelationId: valueRelationId,
          valueId: valueId,
          valueName: valueName,
          attr_id: attr_id
        }
        valueDataList.push(valueTemp)
      }
      var attrTemp = {
          attr_name: attr_name,
          attr_id: attr_id,
          valueDataList: valueDataList
      }
      attrDataList.push(attrTemp)
    }
    // 设置setdata
    this.setData({
      goods: goodsTemp,
      skuDataList: skuDataList,
      attrDataList:attrDataList
    })
  console.log(this.data)
  },
  // 防止暴力点击
  violent: function(res) {

    res.setData({
      buttonClicked: true
    })
    setTimeout(function() {
      res.setData({
        buttonClicked: true
      })
    }, 10000)
  },
  // 购买按钮
  bindToBuy: function() {
    this.violent(this)
    this.buy(this.buyCallback)
  },
  // 购买函数
  buy: function(callback) {
    var that = this;
    var userId = this.data.user_id;
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
   
        if (res.data.is_bind_phone == 1) {
          callback(res.data.result_code)
        } else {
          
          var good_id = that.data.goods_id
          var sku_id =that.data.sku_id
          wx.navigateTo({
            url: "/pages/home/commodityDet/bindPhone/bindPhone?goods_id=" + good_id + "&" + "sku_id=" + sku_id
          })
        }
      }
    })
  },
  // 购买函数回调函数
  buyCallback: function(res) {


    // 公共接口
    var phoneUrl = getApp().globalData.wx_url_1;
    // userid
    var userId = this.data.user_id;
    // 购买数量
    var goods_num = this.data.num;
    // relationid
    var relation_id = this.data.relation_id;
    // skuid
    var sku_id = this.data.sku_id

    //goodsid
    var goodsid = this.data.goods_id
    // 商品原价
    var new_price = this.data.salePrice
    // 商品现价
    var old_price = this.data.price
    var maName = this.data.value_name
 
    var mall = {
      goods_num: goods_num,
      new_price: new_price,
      old_price: old_price,
      value_name: maName,
      zong: new_price * goods_num
    }
    wx.setStorage({
      key: "mall",
      data: mall
    })
    if (res == 0) {
      wx.request({
        url: phoneUrl,
        method: "POST",
        data: {
          service: "createGoodsOrder",
          user_id: userId,
          share_id: '分享人id',
          goods_id: goodsid,
          goods_num: goods_num,
          relation_id: relation_id,
          sku_id: sku_id

        },
        header: {
          "content-type": "application.josn"
        },
        success: function(res) {
          var data_res = res.data.payment
          wx.setStorage({
            key: "payid",
            data: {
              nonceStr: data_res.nonceStr,
              paySign: data_res.paySign,
              signType: data_res.signType,
              timeStamp: data_res.timeStamp,
              package: data_res.package
            }
          })
          wx.navigateTo({
            url: "/pages/home/commodityDet/confirm/confirm"
          })
        }
      })
    } else if (res == 1) {
      wx.showModal({
        title: '警告',
        content: '您还没有绑定手机号!!!',
        showCancel: false,
        confirmText: '绑定手机',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/home/commodityDet/bindPhone/bindPhone"
            })
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