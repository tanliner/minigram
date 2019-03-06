// pages/loan_detail/detail.js
const utils = require('../../utils/util.js');
const Types = require('../../constants.js');

const LOAN_TYPE = Types.LOAN_TYPE;
const PAY_TYPE = Types.PAY_TYPE;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstMonthPayment: 0,
    lendAmount: 0,
    months: 60,
    payType: PAY_TYPE.interest,
    loanType: LOAN_TYPE.providentFund,
    details: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const details = JSON.parse(options.details);
    // payment of the first month
    const firstMonthPayment = utils.toFixed(details.interests[0] + details.principals[0], 2);
    this.setData({
      firstMonthPayment: firstMonthPayment,
      lendAmount: options.lendAmount,
      months: options.months,
      loanType: options.loanType,
      payType: options.payType,
      details: details,
    });
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
    console.log('share');
  }
})