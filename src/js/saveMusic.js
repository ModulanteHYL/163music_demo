{
    let view = {
        el: 'div.pages>main',
        init() {
            this.$el = $(this.el);
        },
        template: `
           <div class="title">
                  <span>__title__</span>
           </div>
           <form autocomplete="off">
                  <div class="row">
                         <label>歌曲：</label>
                         <input name="songName" type="text" value="__songName__">
                  </div>

                  <div class="row">
                         <label>歌手：</label>
                         <input name="singer" type="text" value="__singer__">
                  </div>

                  <div class="row">
                         <label>链接：</label>
                         <input name="url" type="text" value="__url__">
                  </div>
                  <div class="row">
                         <label>封面：</label>
                         <input name="cover" type="text" value="__cover__">
                  </div>
                  <div class="row submit">
                         <input type="submit" value="保存">
                  </div>
           </form>`,
        render(title,data = {}) {
            let placeholder = ['songName', 'singer', 'url', 'id', 'cover'];
            let html = this.template;
            placeholder.map((key) => {
                html = html.replace(`__${key}__`, data[key] || '');
            });
            html = html.replace(`__title__`, title || '新建歌曲');//默认为新建歌曲
            this.$el.html(html);        
        },
    }
    let model = {
        data: {},
        savaEvent(data, dbName) {
            Object.assign(this.data, data);
            let DB = AV.Object.extend(`${dbName}`);
            let db = new DB();
            db.save(this.data)
                .then((object) => {
                    Object.assign(this.data, { id: object.id });
                    window.eventHub.emit('save', this.data);
                    alert('保存成功');
                }, (error) => { alert('保存失败！'); console.log(error); })
        },
        updateEvent(data, dbName) {
            var update = AV.Object.createWithoutData(dbName, data.id);
            update.set('songName', data.songName);
            update.set('singer', data.singer);
            update.set('url', data.url);
            update.set('cover', data.cover);
            update.save().then((object) => {
                alert('更新成功');
                window.eventHub.emit('update', { id: object.id, ...object.attributes });
            });
        }
    }
    let controller = {
        init: function (view, model) {
            this.view = view;
            this.view.init();
            this.model = model;
            this.view.render('',this.model.data);
            this.bindEvents();
            window.eventHub.on('new',(data)=>{
                for(let key in this.model.data){//新建歌曲时清空model.data
                    this.model.data[key]='';
                }
                this.view.render('',this.model.data);
            });
            window.eventHub.on('upload', (data) => {
                this.view.render(data);
            });
            window.eventHub.on('edit', (data) => {
                Object.assign(this.model.data, data);//将edit的数据传入model.data
                this.view.render('编辑歌曲',this.model.data);
                
            });
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault();
                let inputName = 'songName singer url cover id'.split(' ');
                let formData = {};
                inputName.map((data) => {
                    formData[data] = this.view.$el.find(`input[name=${data}]`).val();
                });
                formData.id = this.model.data.id;
                if (formData.id) {//歌曲存在id时走更新事件
                    this.model.updateEvent(formData, 'Song');
                } else {//歌曲不存在id时，走保存事件
                    this.model.savaEvent(formData, 'Song');
                }
                this.view.render();
            });
        }
    }
    controller.init(view, model);
}