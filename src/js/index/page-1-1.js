{
  let view = {
    el: 'section.playlists',
    template: `
      <li>
        <a href="./song.html?id={{song.id}}">
        <div class="cover">
          <img width=105 src="{{song.cover}}" alt="封面">
        </div>
        <p>{{song.name}}</p>
        <p>{{song.singer}}</p>
        </a>
      </li>
    `,
    init() {

      this.$el = $(this.el)
    },
    render(data) {
      //随机random到页面中
      let { songs } = data
      for (let i = 0; i < songs.length-2  ; i++) {
        var randomIndex = Math.floor(Math.random() * songs.length);
        songs.splice(randomIndex, 1);
      }
      songs.map(song => {
        let $li = $(this.template
          .replace(`{{song.name}}`, song.name)
          .replace(`{{song.cover}}`, song.cover)
          .replace(`{{song.singer}}`, song.singer)
          .replace(`{{song.id}}`, song.id))
        this.$el.find(`ol.songs`).append($li)
      })
    }
  }
  let model = {
    data: {
      songs: []
    },
    find() {
      let query = new AV.Query('Song')
      return query.find().then(songs => {
        this.data.songs = songs.map(song => {
          return {
            id: song.id,
            ...song.attributes
          }
        })
        return songs
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.model.find().then(() => {
        window.eventHub.emit('getSongsData', JSON.parse(JSON.stringify(this.model.data)))
        this.view.render(this.model.data)
      })
    },
  }
  controller.init(view, model)
}