<template>
    <el-dialog @closed="onCancel"
               :visible.sync="visible">
        <div style="text-align: start;">
            <div ref="htmlPreview"
                 style="max-height: 500px;min-height:400px;overflow: auto;width: 100%;color: black;"
                 id="printArea"
                 v-html="content"/>
        </div>
        <div slot="title" style="text-align: start;font-size: 18px;font-weight: bold;">预览</div>
        <div slot="footer">
            <el-button @click="onCancel">取消</el-button>
            <el-button type="primary" v-print="print">打印</el-button>
            <el-button type="primary" @click="exportPdf">导出PDF</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {downloadPDF} from "@/utils/htmlToPdf";
    import {formatDate} from "@/utils/format-util";

    export default {
        name: "PreviewDialog",
        props: {
            /**
             * 是否显示
             */
            show: {
                type: Boolean,
                default: false
            },
            /**
             * 预览内容-html
             */
            content: {
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
        },
        data() {
            return {
                visible: this.show,
                print: {
                    id: 'printArea',
                    popTitle: this.printTitle, // 打印配置页上方标题
                    extraHead: '', //最上方的头部文字，附加在head标签上的额外标签,使用逗号分隔
                    preview: '', // 是否启动预览模式，默认是false（开启预览模式，可以先预览后打印）
                    previewTitle: '', // 打印预览的标题（开启预览模式后出现）,
                    previewPrintBtnLabel: '', // 打印预览的标题的下方按钮文本，点击可进入打印（开启预览模式后出现）
                    zIndex: '', // 预览的窗口的z-index，默认是 20002（此值要高一些，这涉及到预览模式是否显示在最上面）
                    previewBeforeOpenCallback() {
                    }, //预览窗口打开之前的callback（开启预览模式调用）
                    previewOpenCallback() {
                    }, // 预览窗口打开之后的callback（开启预览模式调用）
                    beforeOpenCallback() {
                    }, // 开启打印前的回调事件
                    openCallback() {
                    }, // 调用打印之后的回调事件
                    closeCallback() {
                    }, //关闭打印的回调事件（无法确定点击的是确认还是取消）
                    url: '',
                    standard: '',
                    extraCss: '',
                }
            }
        },
        watch: {
            show() {
                this.visible = this.show;
            },
        },
        methods: {
            /**
             * @param user
             * 取消关闭
             */
            onCancel() {
                this.$emit('update:show', false)
            },
            /**
             * 导出PDF
             */
            exportPdf() {
                downloadPDF(this.$refs.htmlPreview, formatDate() + '.pdf')
            },
        },
    }
</script>

<style scoped>

</style>
