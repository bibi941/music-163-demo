{
  let view = {
    el: '#app',
    render(data) {
      let {
        song,
        status
      } = data
      $(this.el).find('.vague').css('background-image', `url(${song.cover})`)
      $(this.el).find('img.cover').attr('src', song.cover)
      if ($(this.el).find('audio').attr('src') !== song.url) {
        $(this.el).find('audio').attr('src', song.url)
      }
      if (status === 'playing') {
        $(this.el).find('.disc-container').addClass('playing')
      } else {
        $(this.el).find('.disc-container').removeClass('playing')
      }
    },
    play() {
      $(this.el).find('audio')[0].play()
    },
    pause() {
      $(this.el).find('audio')[0].pause()
    }
  }
  let model = {
    data: {
      song: {
        id: '',
        name: '',
        singer: '',
        url: ''
      },
      status: 'playing'
    },
    getLeancloudData(id) {
      var query = new AV.Query('Song')
      return query.get(id).then(
        song => {
          Object.assign(this.data.song, {
            id: song.id,
            ...song.attributes
          })
          return song
        },
        error => {
          console.log(error)
        }
      )
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      let id = this.getSongId()
      this.model.getLeancloudData(id).then(() => {
        this.view.render(this.model.data)
      })
      this.bindEvents()
    },
    bindEvents() {
      $(this.view.el).on('click', '.disc-container', () => {
        if (this.model.data.status === 'playing') {
          this.view.pause()
          this.model.data.status = 'pause'
          this.view.render(this.model.data)
        } else {
          this.view.play()
          this.model.data.status = 'playing'
          this.view.render(this.model.data)
        }
      })
    },
    getSongId() {
      let search = window.location.search
      if (search.indexOf('?') === 0) {
        search = search.substring(1)
      }
      let array = search.split('&').filter(v => v)
      let id = ''
      for (let i = 0; i < array.length; i++) {
        let keyValue = array[i].split('=')
        let key = keyValue[0]
        let value = keyValue[1]
        if (key === 'id') {
          id = value
        }
      }
      return id
    }
  }
  controller.init(view, model)
}