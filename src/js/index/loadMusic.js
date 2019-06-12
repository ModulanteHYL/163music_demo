{
    let view = {
        el: 'section.recommend_song>.song_list',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <li class="wrapper">
                <div class="song_info">
                    <div class="song_name">__songName__</div>
                    <div class="singer_info">
                        <span class="sq">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-sq"></use>
                            </svg>
                        </span>
                        <span class="singer">__singer__</span>
                    </div>
                </div>
                <div class="play_button">
                    <a href="#">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-play"></use>
                        </svg>
                    </a>
                </div>
            </li>
        `,
        render(data) {
            let html=''
            for(let i=0;i<data.length;i++){
                html=this.template
                for(let key in data[i]){
                    html=html.replace(`__${key}__`,data[i][key]);
                }
                $(this.el).find('ol').append(html)
            }
        }
    }
    let model = {
        data: [],
        loadMusic() {//加载音乐资源
            let query = new AV.Query('Song')
            return query.find()
        }
    }
    let controller = {
        init: function (view, model) {
            this.view = view
            this.model = model
            this.bindEvent()
        },
        bindEvent() {
            this.model.loadMusic().then((data) => {
                data.map((key)=>{
                    this.model.data.push(key.attributes)
                })
                this.view.render(this.model.data)
            }, (error) => {

            })
        },
    }
    controller.init(view, model)
}