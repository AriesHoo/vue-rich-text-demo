<template>
    <div style="border: 1px solid #ccc;">
        <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editorId="editorId"
                :defaultConfig="toolbarConfig"
                :mode="mode"
        />
        <Editor
                style="height: 500px; overflow-y: hidden;"
                :editorId="editorId"
                :defaultConfig="editorConfig"
                :defaultContent="getDefaultContent"
                :defaultHtml="defaultHtml"
                :mode="mode"/>
        <!-- 注意： defaultContent （JSON 格式） 和 defaultHtml （HTML 格式），二选一 -->
    </div>
</template>

<script>
    import '@wangeditor/editor/dist/css/style.css'
    import { Editor, Toolbar, getEditor, removeEditor } from '@wangeditor/editor-for-vue'
    import cloneDeep from 'lodash.clonedeep'

    export default {
        name: "WangEditor",
        components: { Editor, Toolbar },
        data(){
            return {
                editorId: `w-e-${Math.random().toString().slice(-5)}`, //【注意】编辑器 id ，要全局唯一
                toolbarConfig: {},
                editorConfig: { placeholder: '请输入内容...' },
                mode: 'default', // or 'simple'

                // defaultContent （JSON 格式） 和 defaultHtml（HTML 格式）二选一
                defaultContent: [
                    { type: 'paragraph', children: [{ text: '一行文字' }] }
                ],
                defaultHtml: '<p>hello</p>',
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

</style>
