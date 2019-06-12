{
    let view={
        el:'section.recommend_song>.song_list',
        init(){
            this.$el=$(this.el)
        },
        template:``
    }
    let model={
        data:{}
    }
    let controller={
        init:function(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.bindEvents()
        },
        bindEvents:function(){
            this.view.$el.on('click','li',(e)=>{
                let text=$(e.currentTarget).find('div.song_name').text().trim()
                window.eventHub.emit('play',{});
            })
        },
    }
    controller.init(view,model)
}