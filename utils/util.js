var globalMd5 = require('../utils/md5.js');

var app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const setStorage = options => {
  if (!options || typeof options !== 'object') return;
  for (var i in options) {
    wx.setStorageSync(i, options[i])
  }

}


const showToast = text => {
  wx.showToast({
    title: text,
    duration: 2000
  })
}
const transKey = obj => {

  if (typeof obj != 'object') return;
  var key = '';
  for (var item in obj) {
    key += obj[item];
  }
  return key;
}
const requestQuery = (option, fnSuc, fnFail) => {
  let data = {
    sign_type: "MD5",
    timestamp: formatTime(new Date()),
    system_id: '',
    version: '1.1',
    terminal: '2',
    channel: "2",
    sign: ""
  }
  let parms = Object.assign(data, option);
  console.log(parms)
  //parms.sign = globalMd5.hex_md5(transKey(parms) + "kjbcjsdhsd");
  wx.request({
    url: app.globalData.domain,
    data: parms,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success: function (res) {
      fnSuc && fnSuc(res);
      console.log(res.data)
    },
    fail:function(res){
      fnFail && fnFail(res);
    }
  })
}
const upload = (option, filePath , fnSuc) => {
  // let data = {
  //   sign_type: "MD5",
  //   timestamp: formatTime(new Date()),
  //   system_id: '',
  //   version: '1.1',
  //   terminal: '2',
  //   channel: "2",
  //   sign: ""
  // }
  // let parms = Object.assign(data, option);
  // console.log('parms')
  //parms.sign = globalMd5.hex_md5(transKey(parms) + "kjbcjsdhsd");

      wx.uploadFile({
        url: app.globalData.domain, 
        filePath: filePath,
        name: 'file',
        formData: option,
        success: function (res) {
          fnSuc && fnSuc(res);
          console.log(res.data)
        }
      })
    
 
}
module.exports = {
  formatTime: formatTime,
  requestQuery: requestQuery,
  setStorage: setStorage,
  showToast: showToast,
  upload: upload
}
