{
  let view = {
    el: 'li.page-3',
    template: `
      <div id="search-aera" class="search-aera">
          <span class="search-icon"></span>
          <label >
            <input id="search" type="text" placeholder="搜索结果">
          </label>
      </div>
      <div id="top-search" class="top-search"></div>
      <div id="search-result" class="search-result"></div>
    `,
    init() {
      this.$el = $(this.el)
    },
    show() {
      this.$el.addClass('active')
    },
    hide() {
      this.$el.removeClass('active')
    },
    render() {
      let $html = $(this.template)
      this.$el.append($html)
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.view.render()
      this.bindEvents()
      this.bindEventsHub()
    },
    bindEvents() {},
    bindEventsHub() {
      window.eventHub.on('selectTab', tabName => {
        if (tabName === 'page-3') {
          this.view.show()
        } else {
          this.view.hide()
        }
      })
    }
  }
  controller.init(view)
}
