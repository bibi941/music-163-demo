{
  let view = {
    el: '#app',
    template: `
    <audio controls src={{url}}></audio>
    `,
    render(data) {
      $(this.el).html(this.template.replace(`{{url}}`,data.url))
    }
  }
  let model = {
    data: {
      id: '',
      name: '',
      singer: '',
      url: ''
    },
    getLeancloudData(id) {
      var query = new AV.Query('Song')
      return query.get(id).then(
        song => {
          console.log(song);
          Object.assign(this.data, { id: song.id, ...song.attributes })
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
      this.model.getLeancloudData(id).then((data) => {
        console.log(this.model.data);
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
