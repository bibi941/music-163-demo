{
  let view = {
    el: '#tabs',
    init() {
      this.$el = $(this.el)
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.bindEvents()
    },
    bindEvents() {
      this.view.$el.on('click', '.tabs-nav>li', (e) => {
        let $li = $(e.currentTarget)
        let tabName=$li.attr('data-tab-name')//取到html上的标记，然后穿出去
        $li.addClass('active').siblings().removeClass('active')
        window.eventHub.emit('selectTab',tabName)
      })
    },
  }
  controller.init(view)
}