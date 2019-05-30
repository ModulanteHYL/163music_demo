{
    let view={
        el:'div.headline',
        template:``,
    }
    let model={
        data:{}
    }
    let controller={
        init(view,model){
            this.view=view;
            this.model=model;
            this.bindEvents();
            window.eventHub.on('update',()=>{
                $(this.view.el).addClass('active');
            });
            window.eventHub.on('delete',()=>{
                $(this.view.el).addClass('active');
            });
        },
        bindEvents(){
            this.$el=$(this.view.el);
            this.$el.on('click',()=>{
                this.$el.addClass('active');
                this.$el.siblings('.songList').children().removeClass('active');
                window.eventHub.emit('new',{})//点击新建歌曲触发新建事件
            })
        }
    }
    controller.init(view,model);
}