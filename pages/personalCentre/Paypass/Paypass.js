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
  submit(e) {
    var passW = this.data.Value;
    wx.navigateTo({
      url: '/pages/personalCentre/PayPassConfirm/PayPassConfirm?pass=' + passW
    }) 
  },
})