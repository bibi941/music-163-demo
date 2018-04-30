{
  let view = {
    el: 'li.page-1',
    template: `
    <li >
      <a href="./song.html?id={{song.id}}">
       <h3>{{song.name}}</h3>
      <p>
        <svg class="icon icon-sq">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
        </svg>
        {{song.singer}}
      </p>
      <div class="playButton">
        <svg class="icon icon-play">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
        </svg>
      </div>
      </a>
    </li>
      `,
    init() {
      this.$el = $(this.el)
    },
    render(data) {
      let {
        songs
      } = data
      songs.map(song => {
        let $li = $(this.template
          .replace(`{{song.name}}`, song.name)
          .replace(`{{song.singer}}`, song.singer)
          .replace(`{{song.id}}`, song.id)
        )
        this.$el.find('ol#songs').append($li)
      })
    }
  }
  let model = {
    data: {
      songs: []
    },

  }
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.bindEventsHub()
    },
    bindEventsHub() {
      window.eventHub.on('getSongsData', data => {
         Object.assign(this.model.data, data)
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}