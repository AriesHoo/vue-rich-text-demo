<template>
    <div>
        <Toolbar class="toolbar"
                 :editorId="editorId"
                 :defaultConfig="toolbarConfig"
                 :mode="mode"/>
        <div id="content">
            <div id="editor-container">
                <div id="title-container"
                     v-if="false">
                    <input value="请输入标题">
                </div>
                <Editor class="editor-text-area"
                        :editorId="editorId"
                        :defaultConfig="editorConfig"
                        :defaultContent="getDefaultContent"
                        :mode="mode"/>
            </div>
        </div>
        <!-- 注意： defaultContent （JSON 格式） 和 defaultHtml （HTML 格式），二选一 -->
    </div>
</template>

<script>
    import '@wangeditor/editor/dist/css/style.css'
    import {Editor, Toolbar, getEditor, removeEditor} from '@wangeditor/editor-for-vue'
    import cloneDeep from 'lodash.clonedeep'

    export default {
        name: "TencentEditor",
        components: {Editor, Toolbar},
        data() {
            return {
                editorId: `w-e-${Math.random().toString().slice(-5)}`, //【注意】编辑器 id ，要全局唯一
                toolbarConfig: {
                    excludeKeys: 'fullScreen redo',
                },
                editorConfig: {
                    placeholder: '请输入内容',
                    scroll: false,
                },
                mode: 'default', // or 'simple'

                // defaultContent （JSON 格式） 和 defaultHtml（HTML 格式）二选一
                // defaultContent: [
                //     {type: 'paragraph', children: [{text: '一行文字'}]}
                // ],
                //
                // defaultHtml: '<p>hello</p>',
            }
        },
        computed: {
            getDefaultContent() {
                return cloneDeep(this.defaultContent) //【注意】深度拷贝 defaultContent ，否则会报错
            }
        },
        beforeDestroy() {
            const editor = getEditor(this.editorId)
            if (editor == null) return

            // 【注意】组件销毁时，及时销毁编辑器
            editor.destroy()
            removeEditor(this.editorId)
        },
    }
</script>

<style scoped>
    .toolbar {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 100;
        border: 1px solid #e8e8e8;
        box-shadow: 0 1px 2px rgb(0 0 0 / 12%);
    }

    #top-container {
        border-bottom: 1px solid #e8e8e8;
        padding-left: 30px;
    }

    #editor-toolbar {
        width: 1300px;
        background-color: #FCFCFC;
        margin: 0 auto;
    }

    #content {
        height: calc(100% - 40px);
        background-color: rgb(245, 245, 245);
        overflow-y: auto;
        position: relative;
    }

    #editor-container {
        width: 850px;
        margin: 30px auto 150px auto;
        background-color: #fff;
        padding: 20px 50px 50px 50px;
        border: 1px solid #e8e8e8;
        box-shadow: 0 2px 10px rgb(0 0 0 / 12%);
    }

    #title-container {
        padding: 20px 0;
        border-bottom: 1px solid #e8e8e8;
    }

    #title-container input {
        font-size: 30px;
        border: 0;
        outline: none;
        width: 100%;
        line-height: 1;
    }

    .editor-text-area {
        min-height: 900px;
        margin-top: 20px;
        height: 400px;
        text-align: start;
        color: black;
    }
</style>
