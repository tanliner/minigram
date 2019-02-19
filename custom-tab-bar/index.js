Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      "pagePath": "/pages/index/index",
      "text": "主页",
      "iconPath": "../imgs/index.png",
      "selectedIconPath": "../imgs/index_active.png"
    }, {
      "pagePath": "/pages/subpage/subpage",
      "text": "计算房贷",
      "iconPath": "../imgs/detail.png",
      "selectedIconPath": "../imgs/detail_active.png"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({url});
      console.log('current index?' + data.index);
      this.setData({
        selected: data.index
      });
    }
  }
})