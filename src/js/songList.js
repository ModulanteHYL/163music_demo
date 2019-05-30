{
    let view = {
        el: 'div.pages ul.songList',
        init() {
            this.$el = $(this.el);
        },
        template: ``,
        render(songs) {
            this.$el.html(this.template);
            for (let i = 0; i < songs.length; i++) {
                this.$el.append(`<li obj_id=${songs[i].id}>${songs[i].songName}</li>`);
            }
        }
    }
    let model = {
        data: {
            songs: [],
        },
    }
    let controller = {
        init: function (view, model) {
            this.view = view;
            this.view.init();
            this.model = model;
            this.view.render(this.model.data);
            this.bindEvents();
            window.eventHub.on('save', (data) => {
                let song = {};
                Object.assign(song, data);
                this.model.data.songs.push(song);
                this.view.render(this.model.data.songs);
            });
            window.eventHub.on('update', (data) => {
                let update = {}
                Object.assign(update, data);
                for (let key in this.model.data.songs) {//找到id相同的那条数据替换
                    if (this.model.data.songs[key].id === update.id) {
                        Object.assign(this.model.data.songs[key], update);
                        break;
                    }
                }
                this.view.render(this.model.data.songs);
            })

        },
        bindEvents() {
            this.view.$el.on('click', 'li', (e) => {
                $(e.delegateTarget).siblings('.active').removeClass('active');
                $(e.currentTarget).addClass('active').siblings().removeClass('active');
                let song = {};
                for (let i = 0; i < this.model.data.songs.length; i++) {
                    if (this.model.data.songs[i].id === $(e.currentTarget).attr('obj_id')) {
                        Object.assign(song, this.model.data.songs[i]);
                        break;
                    }
                }
                window.eventHub.emit('edit', song);
            });
            setTimeout(() => {//页面加载完成后再加载歌曲列表
                let query = new AV.Query('Song');
                query.find().then((data) => {
                    data.map((r) => {
                        let newData = {}
                        Object.assign(newData, { ...r.attributes, id: r.id });
                        this.model.data.songs.push(newData);
                        this.view.render(this.model.data.songs);
                    });
                }, (error) => { console.log('获取数据失败') });
            }, 0)
        }
    }
    controller.init(view, model);
}