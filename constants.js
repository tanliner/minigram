const PAY_TYPE = {
  interest: 'interest', // 等额本息
  principal: 'principal'// 等额本金
};
const LOAN_TYPE = {
  providentFund: 'providentFund', // 公积金
  commercial: 'commercial',       // 商业贷款
  combination: 'combination'      // 组合贷款
};
module.exports = {
  PAY_TYPE,
  LOAN_TYPE
}