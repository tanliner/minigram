# minigram
wechat minigram

20190219
new a minigram, unpublished

custom-tab-bar offcial-doc，[custom-tabBar](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html)
tabbar default index is 0，so you should keep the page's index is 0 when you setup default page.

pages/index/
the wechat offcial example page when project initialized.

pages/subpage/
for user money application

pages/detail/
show the detail payment for every month.


```
// index will become the detail page
"pages": [
  "pages/index/index",
  "pages/subpage/subpage"
],

// subpage will become the detail page
"pages": [
  "pages/subpage/subpage"
  "pages/index/index"
],
```

Updated on: 03/09/2019
remove the custom tabbar, just not need
add the module to get user info

#### Note that:
the commercial rate is 4.75% when year less than 6
the fundation rate is 2.75% when year less than 6