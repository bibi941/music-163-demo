{
  let view = {
    el: '.page-1',
    init() {
      this.$el = $(this.el)
    },
    show() {
      this.$el.addClass('active')
    },
    hide() {
      this.$el.removeClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.bindEvents()
      this.bindEventsHub()
      this.loadRecommendationlist()
      this.theLatestSong()
    },
    bindEvents() {},
    bindEventsHub() {
      window.eventHub.on('selectTab', tabName => {
        if (tabName === 'page-1') {
          this.view.show()
        } else {
          this.view.hide()
        }
      })
    },
    loadRecommendationlist() {
      let page1 = document.createElement('script')
      page1.src = './js/index/page-1-1.js'
      page1.onload = () => {
        console.log('推荐歌单加载完毕')
      }
      document.body.appendChild(page1)
    },
    theLatestSong() {
      let page2 = document.createElement('script')
      page2.src = './js/index/page-1-2.js'
      page2.onload = () => {
        console.log('最新歌单加载完毕')
      }
      document.body.appendChild(page2)
    }
  }
  controller.init(view)
}
