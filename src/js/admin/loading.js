{
  let view = {
    el: '#animation-loading',
    show() {
      $(this.el).addClass('active')
    },
    hide() {
      $(this.el).removeClass('active')
    }
  }
  let controller = {
    init(view) {
      this.view = view
      this.bindEventsHub()
    },
    bindEventsHub() {
      window.eventHub.on('before-animation-loading', () => {
        this.view.show()
      })
      window.eventHub.on('after-animation-loading', () => {
        this.view.hide()
      })  
    }
  }
  controller.init(view)
}

