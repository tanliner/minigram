// pages/loan_detail/detail.js
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    average: 0,
    total: 0,
    rate: 3.25,
    rate2: 4.9,
    months: 120,
    payType: 'interset',
    loanType: 'providentFund',
    interests: [],
    principals: [],
    minus: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('option is?' + options.total + '-' + options.loanType)
    this.setData({
      average: options.average,
      total: options.total,
      rate: options.rate,
      rate2: options.rate2 ? options.rate2 : 4.9,
      months: options.months,
      loanType: options.loanType,
      payType: options.payType,
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
    const total = this.data.total;
    const average = this.data.average;
    const rate = this.data.rate;
    const months = this.data.months;
    const payType = this.data.payType;
    setTimeout(() => {
      if (payType === 'interest') {
        this.interestDetail(average, total, rate, months);
      } else {
        this.principalDetail(total, rate, months);
      }
    }, 0);
  },

  /**
   * @param average
   * @param amount, how much you take from bank, 100 thousand
   */
  interestDetail: function (average, total, rate, months) {
    let interests = [];
    let principals = [];
    const mRate = rate / 12;
    // 第一个月的利息，剩余本金*月利率
    let firstInterset = total * mRate;
    let firstPrincipal = average - firstInterset;
    interests.push(utils.toFixed(firstInterset, 2));
    principals.push(utils.toFixed(firstPrincipal, 2));
    // console.log('ltan 本金' + interests[0]);

    let totalRetuend = firstPrincipal;
    let fixedReturned = utils.toFixed(totalRetuend, 2);
    // 从第二个月开始计算
    for (let i = 1; i < months; i++) {
      // 未还的本金
      let left = total - totalRetuend;
      // 本月利息
      let cIntersts = left * mRate;
      // 本月应还本金
      let cPrincipal = average - cIntersts;
      interests.push(utils.toFixed(cIntersts, 2));
      principals.push(utils.toFixed(cPrincipal, 2));
      fixedReturned += principals[i];
      // console.log('ltan 本金' + interests[i]);
      totalRetuend += cPrincipal;
    }
    if(fixedReturned < total) {
      principals[months - 1] = total - fixedReturned;
    }
    this.setData({
      interests: interests,
      principals: principals,
    });
    //return interests;
    return principals;
  },
  principalDetail: function (amount, rate, months) {
    let everagePrincipal = amount / months;
    console.log('everagePrincipal' + utils.toFixed(everagePrincipal, 2));
    const mRate = rate / 12;
    let interests = [];
    let principals = [];
    let left = amount;
    let returned = 0;
    const constPrincipal = utils.toFixed(everagePrincipal, 2);
    for (let i = 0; i < months; i++) {
      principals.push(constPrincipal);
      let interest = left * mRate;
      interests.push(utils.toFixed(interest, 2));
      returned += everagePrincipal;
      left = amount - returned;
    }
    if (constPrincipal * months < amount) {
      let last = utils.toFixed(amount - constPrincipal * (months - 1), 2);
      principals[months - 1] = last;
    }
    this.setData({
      interests: interests,
      principals: principals,
      minus: utils.toFixed(interests[0] - interests[1], 2),
    });
    
    return interests;
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