# minigram
wechat minigram

20190219
创建了一个计算房贷的计算器，未发布

custom-tab-bar 是参考官网教程，[自定义tabBar](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html)

pages/index/
初始化工程生成的获取用户信息的界面

pages/subpage/
用户填写贷款信息的

pages/detail/
展示还款的详细信息

tabbar 默认选中第0个Item，如果要更改默认显示的界面，需要将展示的页面放到app.json中page数组的第一个元素
```
// 此时默认展示index
"pages": [
  "pages/index/index",
  "pages/subpage/subpage"
],

// 此时默认展示subpage
"pages": [
  "pages/subpage/subpage"
  "pages/index/index"
],
```
