<template>
    <div style="flex-direction: column;align-content: start;align-items: start;color: black;">
        <div :id="tinymceId"
             :ref="tinymceId"/>
        <preview-dialog
                :content="value"
                :print-title="printTitle"
                :show.sync="dialogPreview"/>
    </div>
</template>

<script>
    /**
     * 加载js--本地或在线CDN地址-https://www.bootcdn.cn/tinymce/
     */
    import load from './dynamicLoadScript'
    import {printLog} from "@/utils/log-util";
    import PreviewDialog from "@/components/tinymce/preview-dialog";

    // why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
    // const tinymceCDN = 'https://cdn.tiny.cloud/1/ngbabp4a9elrbbhq4nu8rmltsa36z6shlweayi0lzi0l9st3/tinymce/5/tinymce.min.js'
    const tinymceCDN = 'static/tinymce/tinymce.min.js'
    export default {
        name: 'Tinymce',
        components: {PreviewDialog},
        props: {
            id: {
                type: String,
                default: function () {
                    return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
                }
            },
            value: {
                type: String,
                default: ''
            },
            /**
             * 操作栏
             */
            toolbar: {
                type: Array,
                required: false,
                default() {
                    return []
                }
            },
            height: {
                type: [Number, String],
                required: false,
                default: 500
            },
            width: {
                type: [Number, String],
                required: false,
                default: 'auto'
            },
            /**
             * 是否可读模式
             */
            readonly: {
                type: Boolean,
                default: false,
            },
            /**
             * 输入框提示语
             */
            placeholder: {
                type: String,
                default: '',
            },
            /**
             * 打印顶部标题--没有则为当前网址
             */
            printTitle: {
                type: String,
                default: '',
            },
            /**
             * 图片上传回调
             * function (blobInfo, success, failure) {
                        let file = blobInfo.blob();
                        // 上传图片接口，跟后端同事协调上传图片
                        // http://hh.xxxx.cn/admin/upload为上传图片接口
                        uploadCourseToQiNiuYun(file)
                            .then((result) => {
                                success(result.fileUrl)
                            }).catch((e) => {
                            failure(e)
                        })
                    },
             */
            imagesUploadHandler: {
                type: Function,
            },
        },
        data() {
            return {
                hasChange: false,
                hasInit: false,
                tinymceId: this.id,
                fullscreen: false,
                editor: null,
                dialogPreview: false,
            }
        },
        computed: {
            containerWidth() {
                const width = this.width
                if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
                    return `${width}px`
                }
                return width
            }
        },
        watch: {
            value(val) {
                if (!this.hasChange && this.hasInit) {
                    this.$nextTick(() =>
                        window.tinymce.get(this.tinymceId).setContent(val || ''))
                }
            },
        },
        mounted() {
            this.init()
        },
        activated() {
            if (window.tinymce) {
                this.initTinymce()
            }
        },
        deactivated() {
            this.destroyTinymce()
        },
        destroyed() {
            this.destroyTinymce()
        },
        methods: {
            /**
             * 加载编辑器
             */
            init() {
                // dynamic load tinymce from cdn
                ///加载编辑器js
                load(tinymceCDN, (err) => {
                    if (err) {
                        this.$message.error(err.message)
                        return
                    }
                    this.initTinymce()
                })
            },
            /**
             * 加载成功后初始化编辑器配置
             */
            initTinymce() {
                let _this = this
                ///初始化编辑器-http://tinymce.ax-z.cn/
                window.tinymce.init({
                    selector: `#${this.tinymceId}`,
                    // external_plugins: {
                    //     'bdmap': '/static/tinymce/plugins/bdmap/plugin.min.js',
                    //     'kityformula-editor': '/static/tinymce/plugins/kityformula-editor/plugin.min.js'
                    // },
                    language: 'zh_CN',
                    height: this.height, //编辑器高度
                    min_height: this.height,
                    width: this.width,
                    //只读模式-不可编辑
                    readonly: this.readonly,
                    ///顶部菜单栏-不显示
                    // menubar: 'file view',
                    // menu: {
                    //     view: {title: '常用功能', items: 'print preview'}
                    // },
                    menubar: false,
                    placeholder: this.placeholder,
                    // menubar: 'file edit insert view format table tools help',
                    // menu: {
                    //     file: {title: '文件', items: 'newdocument print preview'},
                    //     edit: {title: '编辑', items: 'undo redo | cut copy paste pastetext | selectall'},
                    //     insert: {title: '插入', items: 'link media | template hr'},
                    //     view: {title: '查看', items: 'visualaid'},
                    //     format: {
                    //         title: '格式',
                    //         items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'
                    //     },
                    //     table: {title: '表格', items: 'inserttable tableprops deletetable | cell row column'},
                    //     tools: {title: '工具', items: 'spellchecker code'}
                    // },
                    ///版权信息--powered by Tinymec
                    branding: false,
                    plugins: 'quickbars print formatpainter searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave kityformula-editor importword indent2em autoresize formatpainter axupimgs',
                    toolbar: this.toolbar.length > 0 ? this.toolbar : 'undo redo fullscreen | formatselect fontselect fontsizeselect lineheight removeformat | forecolor backcolor bold italic underline strikethrough |alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | table image media charmap emoticons hr pagebreak print expertPdf',
                    //选中时出现的快捷工具，与插件有依赖关系
                    quickbars_selection_toolbar: "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
                    content_style: "img {max-width:100%;}",
                    fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
                    font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
                    importcss_append: true,
                    ///顶部操作栏悬停
                    toolbar_sticky: true,
                    autosave_ask_before_unload: false,
                    /**
                     * 初始化成功后回调
                     * @param editor
                     */
                    init_instance_callback: editor => {
                        _this.editor = editor
                        printLog("ID为: " + editor.id + " 的编辑器已初始化完成.");
                        if (_this.value) {
                            editor.setContent(_this.value)
                        }
                        _this.hasInit = true
                        editor.on('NodeChange Change KeyUp SetContent', () => {
                            this.hasChange = true
                            this.$emit('input', editor.getContent())
                        })
                    },
                    /**
                     * 加载编辑器成功回到
                     * @param editor
                     */
                    setup(editor) {
                        editor.on('FullscreenStateChanged', (e) => {
                            _this.fullscreen = e.state
                        })
                        // 功能按钮中添加自定义的button
                        editor.ui.registry.addButton('expertPdf', {
                            tooltip: '预览/导出PDF',
                            text: '预览/导出PDF',
                            // icon: "preview",
                            onAction: function () {
                                _this.dialogPreview = true
                                // _this.handleWindowPrint('expert.pdf')
                                // _this.dialogPreview = true
                            }
                        })
                    },
                    // 图片上传三个参数，图片数据，成功时的回调函数，失败时的回调函数
                    images_upload_handler: this.imagesUploadHandler,
                },)
            },
            destroyTinymce() {
                const tinymce = window.tinymce.get(this.tinymceId)
                if (this.fullscreen) {
                    tinymce.execCommand('mceFullScreen')
                }

                if (tinymce) {
                    tinymce.destroy()
                }
            },
            setContent(value) {
                window.tinymce.get(this.tinymceId).setContent(value)
            },
            getContent() {
                if (this.editor) {
                    return this.editor.getContent()
                } else {
                    return this.value
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
</style>
