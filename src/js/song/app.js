{
  let view = {
    el: '#app',
    render(data) {
      let {
        song,
        song: {
          lyric
        },
        status
      } = data
      $(this.el).find('.vague').css('background-image', `url(${song.cover})`)
      $(this.el).find('img.cover').attr('src', song.cover)
      $(this.el).find('.song-description>h1').text(song.name)
      if ($(this.el).find('audio').attr('src') !== song.url) {
        let audio = $(this.el).find('audio').attr('src', song.url)[0]
        audio.onended = () => {
          window.eventHub.emit('songEnd')
        }
        audio.ontimeupdate = () => {
          this.showLyric(audio.currentTime)//当前音频播放的时间
        }
      }
      //状态判断，是否加载动画
      if (status === 'playing') {
        $(this.el).find('.disc-container').addClass('playing')
      } else {
        $(this.el).find('.disc-container').removeClass('playing')
      }
      //把拿到个歌词字符串加工，分成时间+歌词
      lyric.split('\n').map((string) => {
        let p = document.createElement('p')
        let regex = /\[([\d:.]+)\](.+)/
        let matches = string.match(regex)
        if (matches) {
          p.textContent = matches[2]
          let time = matches[1]
          let parts = time.split(':')
          let min = parts[0]
          let sec = parts[1]
          let newtime = parseFloat(min) * 60 + parseFloat(sec)
          p.setAttribute('data-time', newtime)
        } else {
          p.textContent = string
        }
        $(this.el).find('.lyric>.lines').append(p)
      })
    },
    showLyric(time) {
      //找到播放时间对应的歌词
      let allP = $(this.el).find('.lyric>.lines>p')
      for (let i = 0; i < allP.length; i++) {
        if (i === allP.length - 1) {
          // console.log(allP[i].textContent);
        } else {
          let currentTime = allP.eq(i).attr('data-time')
          let nextTime = allP.eq(i + 1).attr('data-time')
          if (currentTime <= time && time < nextTime) {
            let p = allP[i]
            let pHeight = p.getBoundingClientRect().top//播放时的current歌词的距离视口的高度
            let linesHeight = $(this.el).find('.lyric>.lines')[0].getBoundingClientRect().top
            let height = pHeight - linesHeight//动画应该移动的高度
            $(this.el).find('.lyric>.lines').css({
              transform: `translateY(${-(height-25)}px)`
            })
            $(p).addClass('active').siblings('.active').removeClass('active')
            break
          }
        }
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
        url: '',
        lyric: '',
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
      //暂停-播放
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
      //歌曲完毕自动暂停
      window.eventHub.on('songEnd', () => {
        this.view.pause()
        this.model.data.status = 'pause'
        this.view.render(this.model.data)
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