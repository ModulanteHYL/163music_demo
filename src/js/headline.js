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
        },
        bindEvents(){
            this.$el=$(this.view.el);
            this.$el.on('click',()=>{
                this.$el.addClass('active');
                this.$el.siblings('.songList').children().removeClass('active');
                window.eventHub.emit('new',{})
            })
        }
    }
    controller.init(view,model);
}