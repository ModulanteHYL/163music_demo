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
                    <label>歌曲名字：</label>
                    <input name="songName" type="text" value="__songName__">
                </div>

                <div class="row">
                    <label>歌手名字：</label>
                    <input name="singer" type="text" value="__singer__">
                </div>
                <div class="row">
                    <label>歌曲链接：</label>
                    <input name="url" type="text" value="__url__">
                </div>
                <div class="row">
                    <label>封面链接：</label>
                    <input name="cover" type="text" value="__cover__">
                </div>
                <div class="btn_list">
                    <div class="row submit">
                        <input type="submit" value="保存歌曲">
                    </div>
                    <div class="row delete __show__">
                        <input type="button" value="删除歌曲">
                    </div>
                </div>
            </form>`,
        render(title = '', data = {}, show = false) {
            let placeholder = ['songName', 'singer', 'url', 'id', 'cover'];
            let html = this.template;
            placeholder.map((key) => {
                html = html.replace(`__${key}__`, data[key] || '');
            });
            html = html.replace(`__show__`, show ? 'show' : '');//是否显示删除按钮
            html = html.replace(`__title__`, title || '新建歌曲');//默认为新建歌曲
            this.$el.html(html);
        },
    }
    let model = {
        data: {},//只存入一组数据
        savaEvent(data, dbName) {
            Object.assign(this.data, data);
            let DB = AV.Object.extend(`${dbName}`);
            let db = new DB();
            return db.save(this.data);
        },
        updateEvent(data, dbName) {
            let update = AV.Object.createWithoutData(dbName, data.id);
            update.set('songName', data.songName);
            update.set('singer', data.singer);
            update.set('url', data.url);
            update.set('cover', data.cover);
            return update.save();
        },
        deleteEvent(id, dbName) {
            let del = AV.Object.createWithoutData(dbName, id);
            return del.destroy();
        },
        clearData() {
            for (var key in this.data) {//清空model的数据
                delete this.data[key];
            }
        }
    }
    let controller = {
        init: function (view, model) {
            this.view = view;
            this.view.init();
            this.model = model;
            this.view.render('', this.model.data, false);
            this.bindEvents();
            window.eventHub.on('new', (data) => {
                this.model.clearData();//新建歌曲时清空model的data
                this.view.render('', this.model.data, false);
            });
            window.eventHub.on('upload', (data) => {
                this.view.render('', data, false);
            });
            window.eventHub.on('edit', (data) => {
                Object.assign(this.model.data, data);//将edit的数据传入model.data
                this.view.render('编辑歌曲', this.model.data, true);
            });
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault();
                let inputName = 'songName singer url cover id'.split(' ');//数据库里的属性名
                let formData = {};
                inputName.map((data) => {
                    formData[data] = this.view.$el.find(`input[name=${data}]`).val();
                });
                formData.id = this.model.data.id;
                if (formData.id) {//歌曲存在id时走更新事件
                    this.model.updateEvent(formData, 'Song').then((object) => {
                        alert('更新成功');
                        window.eventHub.emit('update', { id: object.id, ...object.attributes });//如果当前处于编辑状态，则保存按钮触发更新事件
                        this.model.clearData();
                        this.view.render();
                    }, (error) => {
                        alert('更新失败...');
                        console.log(error);
                    });
                } else if (formData['songName'] && formData['singer'] && formData['url'] && formData['cover']) {//歌曲不存在id切表格中有数据时，走保存事件
                    this.model.savaEvent(formData, 'Song').then((object) => {
                        alert('保存成功');
                        Object.assign(this.model.data, { id: object.id });
                        window.eventHub.emit('save', this.model.data);//如果当前处于新建歌曲状态，则点击保存按钮触发保存事件
                        this.model.clearData();
                        this.view.render();
                    }, (error) => { alert('保存失败！'); console.log(error); });
                } else {
                    alert('请输入完整要保存的歌曲信息...')
                }
            });
            this.view.$el.on('click', 'input[type=button]', () => {
                if (this.model.data.id) {
                    this.model.deleteEvent(this.model.data.id, 'Song').then(() => {
                        alert('删除成功');
                        window.eventHub.emit('delete', this.model.data.id);//当前处于编辑状态，点击删除触发删除事件
                        this.model.clearData();
                        this.view.render();
                    }, (error) => {
                        alert('删除失败...');
                        console.log(error);
                    });
                } else {
                    alert('未指定歌曲');
                }
            });
        }
    }
    controller.init(view, model);
}