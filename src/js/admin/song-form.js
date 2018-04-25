{
  let view = {
    el: '.page > main',
    init() {
      this.$el = $(this.el)
    },
    template: `
            <form class="form">
                <div class="row">
                    <label>
                        歌名
                    </label>
                    <input  name='name' type="text" value="__name__" required>
                </div>
                <div class="row">
                    <label>
                        歌手
                    </label>
                    <input name='singer' type="text" value="__singer__" >
                </div>
                <div class="row">
                    <label>
                        外链
                    </label>
                    <input  name='url' type="text" value="__url__" required>
                </div>
                <div class="row actions">
                    <label>
                    </label>
                    <button type="submit">保存</button>
                    <button type="reset">清空</button>
                </div>
            </form>
        `,
    render(data = {}) {
      //把订阅的data放入songform中
      let placeholders = ['name', 'url', 'singer', 'id']
      let html = this.template
      placeholders.map(string => {
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
      if (data.id) {
        $(this.el).prepend('<h1>编辑歌曲</h1>')
      } else {
        $(this.el).prepend('<h1>新建歌曲</h1>')
      }
    }
  }
  let model = {
    //存入leancloud数据库
    data: { name: '', singer: '', url: '', id: '' },
    update(data) {
      var song = AV.Object.createWithoutData('Song', this.data.id)
      song.set('name', data.name)
      song.set('singer', data.singer)
      song.set('url', data.url)
      return song.save().then(response => {
        Object.assign(this.data, data)
        return response
      })
    },
    create(data) {
      var Song = AV.Object.extend('Song')
      var song = new Song()
      song.set('name', data.name)
      song.set('singer', data.singer)
      song.set('url', data.url)
      return song.save().then(
        newSong => {
          let { id, attributes } = newSong
          //存入model.data中
          Object.assign(this.data, { id, ...attributes })
        },
        error => console.log(error)
      )
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventsHub()
    },
    update() {
      let needs = ['name', 'singer', 'url']
      let data = {}
      needs.map(string => {
        data[string] = this.view.$el.find(`[name="${string}"]`).val()
      })
      this.model.update(data).then(() => {
        window.eventHub.emit(
          'update',
          JSON.parse(JSON.stringify(this.model.data))
        )
      })
    },
    create() {
      let needs = ['name', 'singer', 'url']
      let data = {}
      needs.map(string => {
        data[string] = this.view.$el.find(`[name="${string}"]`).val()
      })
      //存入leancloud数据库
      this.model.create(data).then(() => {
        this.view.render({}) //存入数据库中后清空表单内容
        let deepCopyData = JSON.parse(JSON.stringify(this.model.data))
        window.eventHub.emit('create', deepCopyData)
      })
    },
    bindEvents() {
      //把上面订阅的且已经放入html中的数据存下来
      this.view.$el.on('submit', 'form', e => {
        e.preventDefault()
        if (this.model.data.id) {
          this.update()
        } else {
          this.create()
        }
      })
      //监听按钮reset掉songForm表单
      this.view.$el.on('reset', () => {
        this.view.render({})
        window.eventHub.emit('resetForm')
      })
    },
    bindEventsHub() {
      window.eventHub.on('select', liData => {
        this.model.data = liData //选择li时,把此模块的data数据更新
        this.view.render(this.model.data) //选择li后更新songform
      })
      window.eventHub.on('new', data => {
        if (this.model.data.id) {
          //form中存在id说明是从数据库中来的
          this.model.data = {}
        } else {
          Object.assign(this.model.data, data)
        }
        this.view.render(this.model.data)
      })
      window.eventHub.on('resetForm', () => {
        //点击清空按钮后，把数据恢复到初始状态
        this.model.data = {}
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}
