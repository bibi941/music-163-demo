{
  let view = {
    el: '#songList-container',
    template: `  
            <ul class="songList">
            </ul>
            `,
    render(data) {
      let $el = $(this.el)
      $el.html(this.template)
      let { songs } = data
      let liList = songs.map(song => {
        return $('<li></li>').text(song.name)
      })
      console.log('$el.find("ul")');
      console.log($el.find('ul'))
      $el.find('ul').empty()
      liList.map(domli => {
        $el.find('ul').append(domli)
      })
    },
    clearActive() {
      $(this.el)
        .find('.active')
        .removeClass('active')
    }
  }
  let model = {
    data: {
      songs: []
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      window.eventHub.on('upload', () => {
        this.view.clearActive()
      })
      window.eventHub.on('create', songData => {
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}
