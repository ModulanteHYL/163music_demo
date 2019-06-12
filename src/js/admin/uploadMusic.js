{
       let view = {
              el: 'div.pages>aside .upload_wrapper',
              template: ``,
              dom(){
                     return $(this.el)[0];
              },
              render(data) {
                     $(this.el).html(this.template);
              }
       }
       let model = {}
       let controller = {
              init: function (view, model) {
                     this.view = view;
                     this.model = model;
                     this.initQiniu();
              },
              initQiniu: function () {
                     var uploader = Qiniu.uploader({//·git clone git@github.com:qiniu/js-sdk.git，进入项目根目录执行npm install，执行 npm run build，即可在dist目录生成qiniu.min.js
                            runtimes: 'html5',    //上传模式,依次退化
                            browse_button: this.view.dom().querySelector('#pickfiles'),       //上传选择的点选按钮，**必需**
                            uptoken_url: 'http://127.0.0.1:8888/',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                            // uptoken: token, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                            // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                            // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                            domain: 'http://prli8ih39.bkt.clouddn.com/',   //bucket 域名，下载资源时用到，**必需**
                            get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                            container: this.view.dom().querySelector('#container'),           //上传区域DOM ID，默认是browser_button的父元素，
                            max_file_size: '100mb',           //最大文件体积限制
                            max_retries: 3,                   //上传失败最大重试次数
                            dragdrop: true,                   //开启可拖曳上传
                            drop_element: this.view.dom().querySelector('#container'),        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                            chunk_size: '10mb',                //分块上传时，每片的体积
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                   'FilesAdded': function (up, files) {
                                          plupload.each(files, function (file) {
                                                 // 文件添加进队列后,处理相关的事情
                                          });
                                          console.log(1);
                                   },
                                   'BeforeUpload': function (up, file) {
                                          // 每个文件上传前,处理相关的事情
                                          console.log(2);
                                   },
                                   'UploadProgress': function (up, file) {
                                          // 每个文件上传时,处理相关的事情
                                          console.log(3);
                                   },
                                   'FileUploaded': function (up, file, info) {
                                          // 每个文件上传成功后,处理相关的事情
                                          // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                                          // {
                                          //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                                          //    "key": "gogopher.jpg"
                                          //  }
                                          // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                                          var domain = up.getOption('domain');
                                          var res = JSON.parse(info.response);
                                          var query=res.key;
                                          var data=query.split(' - ');
                                          var sourceLink = domain + encodeURIComponent(query); //获取上传成功后的文件的Url
                                          window.eventHub.emit('upload',
                                          {
                                                 "songName":`${data[1]}`,
                                                 "singer":`${data[0]}`,
                                                 "url":`${sourceLink}`,
                                                 "cover":``
                                          });
                                   },
                                   'Error': function (up, err, errTip) {
                                          console.log(err);
                                   },
                                   'UploadComplete': function () {
                                          //队列文件处理完毕后,处理相关的事情
                                          console.log(4);
                                   },
                            }
                     });
              }
       }
       controller.init(view,model);
}
