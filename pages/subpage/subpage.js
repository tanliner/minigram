// pages/subpage.js
const extraLine = []

Page({
  constData: {
    fundRateValue: 3.25,
    commerRateValue: 4.90,
    fundMulity: 1,
    commerMulity: 1,
  },
  /**
   * 页面的初始数据
   */
  data: {
    calculated: false,
    type: 'interest', // 等额本息; principal: 等额本金
    loanType: 'providentFund', // commercial, combination
    fundAmount: 1,
    commerAmount: 1,
    yearIndex: 9, // range [0~30], default 10 years
    months: 120,
    firstMonth: 0,
    baseFundRate: 3.25,
    baseCommerRate: 4.90,
    fundMulity: 1,
    commerMulity: 1,
    fundRateValue: 3.25,
    commerRateValue: 4.90,

  },
  /**
  fundRateValue: (baseFundRate * fundMulity).toFixed(2),
  commerRateValue: (baseCommerRate * commerMulity).toFixed(2),
   */
  change() {
    const type = this.data.type;
    if (type === 'interest') {
      this.setData({
        calculated: true,
        type: 'principal'
      });
    } else {
      this.setData({
        calculated: true,
        type: 'interest'
      });
    }
    setTimeout(this.calculate, 10);
  },
  bindFundInput(e) {
    this.setData({
      fundAmount: e.detail.value,
    });
  },
  bindCommerInput(e) {
    this.setData({
      commerAmount: e.detail.value,
    });
  },
  bindToShowDetail(e) {
    console.log('show detail');
    const payType = this.data.type;
    const loanType = this.data.loanType;
    const months = this.data.months;
    let lendAmount = 0;
    let rate = 0;
    let rate2 = 0;
    let everyMonth = 0;
    if (loanType === 'providentFund') {
      rate = this.data.fundRateValue / 100;
      lendAmount = this.data.fundAmount * 10000;
      //everyMonth = this.calculateMonth(lendAmount, rate, months);
    } else if (loanType === 'commercial') {
      rate2 = this.data.commerRateValue / 100;
      lendAmount = this.data.commerAmount * 10000;
      //everyMonth = this.calculateMonth(lendAmount, rate2, months);
    } else {
      rate = this.data.fundRateValue / 100;
      rate2 = this.data.commerRateValue / 100;
      //lendAmount = (this.data.fundAmount + this.data.commerAmount) * 10000;
      let fAmount = this.data.fundAmount * 10000;
      let cAmount = this.data.commerAmount * 10000;
      lendAmount = fAmount + cAmount;
      console.log('fAmount' + fAmount + ', cAmount' + cAmount + ', rate' + rate + ',' + rate2);
      //everyMonth = this.calculateMonth(fAmount, rate, months) + this.calculateMonth(cAmount, rate2, months);
    }

    wx.navigateTo({
      url: '../detail/detail?total=' + lendAmount + '&loanType=' + loanType + 
        '&payType=' + payType + '&average=' + this.data.firstMonth + 
        '&months=' + months + '&rate=' + rate + '&rate2' + rate2,
      success: function(res) {
        console.log('navigation success');
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // mulitiply number
  fundMulity(e) {
    let eValue = e.detail.value;
    const bRate = this.data.baseFundRate;
    if (!eValue) {
      eValue = this.constData.fundMulity;
    }
    this.setData({
      fundMulity: eValue,
      fundRateValue: (bRate * eValue).toFixed(2),
    });
  },
  commerMulity(e) {
    let eValue = e.detail.value;
    const bRate = this.data.baseCommerRate;
    if (!eValue) {
      eValue = this.constData.commerMulity;
    }
    this.setData({
      commerMulity: eValue,
      commerRateValue: (bRate * eValue).toFixed(2),
    });
  },

  changeloan(event) {
    this.setData({
      loanType: event.currentTarget.id,
    });
  },
  yearChange(event) {
    const index = event.detail.value;
    this.setData({
      yearIndex: index,
      months: (parseInt(index) + 1) * 12,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('sub page show, set to 1');
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  calculate: function(e) {
    const payType = this.data.type;
    const loanType = this.data.loanType;
    const months = this.data.months;
    let lendAmount = 0;
    let rate = 0;
    let rate2 = 0;
    let everyMonth = 0;
    if (loanType === 'providentFund') {
      rate = this.data.fundRateValue / 100;
      lendAmount = this.data.fundAmount * 10000;
      everyMonth = this.calculateMonth(lendAmount, rate, months);
    } else if (loanType === 'commercial') {
      rate2 = this.data.commerRateValue / 100;
      lendAmount = this.data.commerAmount * 10000;
      everyMonth = this.calculateMonth(lendAmount, rate2, months);
    } else {
      rate = this.data.fundRateValue / 100;
      rate2 = this.data.commerRateValue / 100;
      //lendAmount = (this.data.fundAmount + this.data.commerAmount) * 10000;
      let fAmount = this.data.fundAmount * 10000;
      let cAmount = this.data.commerAmount * 10000;
      console.log('fAmount' + fAmount + ', cAmount' + cAmount + ', rate' + rate + ',' + rate2);
      everyMonth = this.calculateMonth(fAmount, rate, months) + this.calculateMonth(cAmount, rate2, months);
    }
    this.setData({
      firstMonth: everyMonth.toFixed(2),
    });
    return everyMonth;
  },

  calculateMonth: function(lendAmount, rate, months) {
    const payType = this.data.type;
    const mRate = rate / 12;
    let everyMonth = 0;
    let amount = 0;
    if (payType === 'interest') {
      // 100000×0.566667%×(1+0.566667%)120/[(1+0.566667%)120-1]
      // everyMonth = this.justInterst(lendAmount, rate, months)
      let top = lendAmount * mRate * Math.pow((1 + mRate), months);
      let bottom = Math.pow((1 + mRate), months) - 1;
      console.log('just interest top:' + top + ' ' + bottom);
      amount = top / bottom;
    } else if (payType === 'principal') {
      // 100000/120 + (10000-已还)*0.566667%
      console.log('just principal:' + lendAmount + ', rate:' + rate);
      amount = (lendAmount / months) + (lendAmount - 0) * mRate;
    }
    return amount;
  },
})