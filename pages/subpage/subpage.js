// pages/subpage.js
const extraLine = []
const utils = require('../../utils/util.js');
const Types = require('../../constants.js');

const LOAN_TYPE = Types.LOAN_TYPE;
const PAY_TYPE = Types.PAY_TYPE;
const keyInterestTotal = 'interestTotal';
const keyPayTotal = 'payTotal';
/**
 * constant data for the page
 * some time you want to reset page as default.
 */
const constData = {
  fundBaseRateLess: 2.75,
  fundBaseRate: 3.25,
  commerBaseRateLess: 4.75,
  commerBaseRate: 4.90,
  fundMulity: 1,
  commerMulity: 1,
};

Page({
  /**
   * page data
   */
  data: {
    calculated: false,
    loanType: LOAN_TYPE.providentFund, // commercial, combination
    fundAmount: 1,
    commerAmount: 1,
    yearIndex: 0, // range [5~30], default 5 years
    months: 60,
    baseFundRate: constData.fundBaseRate,
    baseCommerRate: constData.commerBaseRate,

    fundMulity: constData.fundMulity,
    commerMulity: constData.commerMulity,
    fundRateValue: constData.fundBaseRate,
    commerRateValue: constData.commerBaseRate,
    payType: PAY_TYPE.interest,
    firstMonth: 0,
    interestsTotal: 0,
    payTotal: 0,
    minus: 0,
    details: {},
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
  /**
   * switch the loan type, @see{fundation/commercial/combine}
   */
  bindChangeLoan(e) {
    this.setData({
      loanType: e.currentTarget.id,
      interestsTotal: 0,
      payTotal: 0,
      firstMonth: 0,
      minus: 0
    });
  },
  /**
   * build an object for all input.
   */
  getParams: function() {
    const payType = this.data.payType;
    const loanType = this.data.loanType;
    let fAmount = 0;
    let cAmount = 0;
    let lendAmount = 0;
    let rate = 0;
    let rate2 = 0;

    if (loanType === LOAN_TYPE.providentFund) {
      rate = this.data.fundRateValue / 100;
      fAmount = lendAmount = this.data.fundAmount * 10000;
    } else if (loanType === LOAN_TYPE.commercial) {
      rate = this.data.commerRateValue / 100;
      cAmount = lendAmount = this.data.commerAmount * 10000;
    } else {
      rate = this.data.fundRateValue / 100;
      rate2 = this.data.commerRateValue / 100;
      fAmount = this.data.fundAmount * 10000;
      cAmount = this.data.commerAmount * 10000;
      lendAmount = fAmount + cAmount;
    }
    return {
      rate,
      rate2,
      fAmount,
      cAmount,
      lendAmount,
      months: this.data.months,
      payType: this.data.payType,
      loanType: this.data.loanType,
    };
  },

  /**
   * calculate money of first month should pay
   */
  calculateMonth: function(lendAmount, rate, months, payType) {
    const mRate = rate / 12;
    let everyMonth = 0;
    let amount = 0;
    if (payType === PAY_TYPE.interest) {
      // 100000×0.566667%×(1+0.566667%)^120/[(1+0.566667%)^120-1]
      let top = lendAmount * mRate * Math.pow((1 + mRate), months);
      let bottom = Math.pow((1 + mRate), months) - 1;
      amount = top / bottom;
    } else if (payType === PAY_TYPE.principal) {
      // 100000/120 + (10000-已还)*0.566667%
      amount = (lendAmount / months) + (lendAmount - 0) * mRate;
    }
    return amount;
  },
  /**
   * change loan years
   */
  bindYearInput(e) {
    const year = e.detail.value;
    this.setData({
      months: year * 12,
    });
  },
  bindYearChange(e) {
    const index = e.detail.value;
    this.setData({
      yearIndex: index,
      months: (parseInt(index) + 1) * 5 * 12,
    });
  },
  /**
   * base rate input of fundation
   */
  bindFundBaseValue: function(e) {
    let eValue = e.detail.value;
    const fMulity = this.data.fundMulity;
    if (!eValue) {
      eValue = constData.fundBaseRate;
    }
    this.setData({
      fundRateValue: utils.toFixed(eValue * fMulity, 2),
    });
  },
  /**
   * mulity input of fundation
   * 3.25 * X
   */
  bindFundMulity(e) {
    let eValue = e.detail.value;
    const bRate = this.data.baseFundRate;
    if (!eValue) {
      eValue = constData.fundMulity;
    }
    this.setData({
      fundMulity: eValue,
      fundRateValue: utils.toFixed(bRate * eValue, 2),
    });
  },
  /**
   * base rate input of commercial
   */
  bindCommerBaseValue(e) {
    let eValue = e.detail.value;
    const cMulity = this.data.commerMulity;
    if (!eValue) {
      eValue = constData.commerBaseRate;
    }
    this.setData({
      commerRateValue: (eValue * cMulity).toFixed(2),
    });
  },
  /**
   * mulity input of commercial
   * 4.9 * X
   */
  bindCommerMulity(e) {
    let eValue = e.detail.value;
    const bRate = this.data.baseCommerRate;
    if (!eValue) {
      eValue = constData.commerMulity;
    }
    this.setData({
      commerMulity: eValue,
      commerRateValue: (bRate * eValue).toFixed(2),
    });
  },
  bindPayTypeChange(e) {
    this.setData({
      calculated: true,
      payType: e.detail.value,
    });
    setTimeout(this.bindCalculate, 10);
  },
  /**
   * begin calculate all
   */
  bindCalculate: function (e) {
    const uInput = this.getParams();
    const payType = uInput.payType;
    const loanType = uInput.loanType;
    const rate = uInput.rate;
    const rate2 = uInput.rate2;
    const months = uInput.months;

    let everyMonth = 0;
    let details = {};
    let interestTotal = 0;

    if (loanType === LOAN_TYPE.combination) {
      const fFirstPay = this.calculateMonth(uInput.fAmount, rate, months, payType);
      const cFirstPay = this.calculateMonth(uInput.cAmount, rate2, months, payType);
      everyMonth = fFirstPay + cFirstPay;
      // fundmental
      let fDetail = this.calculatDetail(uInput.fAmount, rate, months, payType);
      let cDetail = this.calculatDetail(uInput.cAmount, rate2, months, payType);
      
      let interests = [];
      let principals = [];
      for (let i = 0; i < months; i++) {
        interests.push(utils.toFixed(fDetail.interests[i] + cDetail.interests[i], 2));
        principals.push(utils.toFixed(fDetail.principals[i] + cDetail.principals[i], 2));
      }
      details = {
        interests,
        principals,
        minus: utils.toFixed(fDetail.minus + cDetail.minus, 2)
      };
      details[keyInterestTotal] = utils.arraySum(details.interests);
      details[keyPayTotal] = details[keyInterestTotal] + uInput.lendAmount;

    } else { /* fundation commercial */
      everyMonth = this.calculateMonth(uInput.lendAmount, rate, months, payType);
      details = this.calculatDetail(uInput.lendAmount, rate, months, payType);
      details[keyInterestTotal] = utils.arraySum(details.interests);
      details[keyPayTotal] = details[keyInterestTotal] + uInput.lendAmount;
    }
    // update UI
    this.setData({
      firstMonth: utils.toFixed(everyMonth, 2),
      interestsTotal: utils.toFixed(details[keyInterestTotal], 2),
      payTotal: utils.toFixed(details[keyPayTotal], 2),
      details,
    });
  },
  /**
   * to view payment detail
   * Note that: the object should be a json string.
   */
  bindToShowDetail(e) {
    const uInput = this.getParams();
    // uri: just like http request
    wx.navigateTo({
      url: '../detail/detail?lendAmount=' + uInput.lendAmount + '&loanType=' + uInput.loanType +
        '&payType=' + uInput.payType + '&average=' + this.data.firstMonth +
        '&months=' + uInput.months + '&details=' + JSON.stringify(this.data.details),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /******* function define *******/
  /**
   * to get the detail of payment, which contains interests and principals array
   * if pay-type is principal, minus will be set.
   * 
   * @param amount how many you lend
   * @param rate   rate of year
   * @param months 
   * @param payType @see{interest/principal}
   */
  calculatDetail: function(amount, rate, months, payType) {
    if (payType === PAY_TYPE.interest) {
      // first month should pay
      const firstPay = this.calculateMonth(amount, rate, months, payType);
      return this.interestDetail(amount, rate, months, firstPay);
    } else if (payType === PAY_TYPE.principal) {
      return this.principalDetail(amount, rate, months);
    }
  },
  /**
   * detail for `equal installments of principal and interest`, means that
   * you will pay the same monthly payment
   * 
   * @param amount how many you lend
   * @param rate   rate of year
   * @param months
   */
  interestDetail: function(amount, rate, months, firstPay) {
    let interests = [];
    let principals = [];
    const mRate = rate / 12;
    // the first month interest, the left principal mutiply rate of month
    let firstInterset = amount * mRate;
    let firstPrincipal = firstPay - firstInterset;
    interests.push(utils.toFixed(firstInterset, 2));
    principals.push(utils.toFixed(firstPrincipal, 2));

    let totalRetuend = firstPrincipal;
    let fixedReturned = utils.toFixed(totalRetuend, 2);
    // loop start from the second month
    for (let i = 1; i < months; i++) {
      // left principal
      let left = amount - totalRetuend;
      // current month interest
      let cIntersts = left * mRate;
      // should pay principal for current month
      let cPrincipal = firstPay - cIntersts;
      interests.push(utils.toFixed(cIntersts, 2));
      principals.push(utils.toFixed(cPrincipal, 2));
      fixedReturned += principals[i];
      totalRetuend += cPrincipal;
    }
    if (fixedReturned + 0.001 < amount) {
      principals[months - 1] = amount - fixedReturned;
    }
    const detail = {
      interests: interests,
      principals: principals,
      minus: 0
    };
    return detail;
  },
  /**
   * detail for `equal principal`, means that you will pay the principal 
   * same monthly payment. ( lendAmount / months = average )
   * 
   * @param amount how many you lend
   * @param rate   rate of year
   * @param months
   */
  principalDetail: function(amount, rate, months) {
    let everagePrincipal = amount / months;
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
      // let last = utils.toFixed(amount - constPrincipal * (months - 1), 2);
      // principals[months - 1] = last;
    }
    let minus = 0;
    if (months > 1) {
      minus = utils.toFixed(interests[0] - interests[1], 2);
    }
    const detail = {
      interests: interests,
      principals: principals,
      minus,
    };
    return detail;
  },
  /******* function define end *******/
})