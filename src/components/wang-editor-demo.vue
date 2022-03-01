<template>
    <div>
        <div style="margin: 20px;text-align: start">
            <el-button type="text" @click="tinyMceEditorDemo">tinyMceEditorDemo</el-button>
        </div>
        <tencent-editor/>
    </div>
</template>

<script>

    import TencentEditor from "@/components/wangEditor/tencent";
    import path from "@/router/path";

    export default {
        name: "WangEditorDemo",
        components: {TencentEditor},
        methods:{
            tinyMceEditorDemo() {
                this.$router.replace(path.EDITOR_INDEX)
            }
        },
    }
</script>

<style scoped>

</style>
