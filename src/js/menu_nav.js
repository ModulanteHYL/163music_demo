{
    let view = {
        el: '#mainContent>#menu_nav',
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.$el=$(this.view.el);
            this.bindEvents();
        },
        bindEvents(){
            this.$el.on('click','li',(e)=>{
                $(e.currentTarget).addClass('active').siblings().removeClass('active');
                $(`.${$(e.currentTarget).attr('id')}`).addClass('active').siblings().removeClass('active');
            });
        }
    }
    controller.init(view, model);
}