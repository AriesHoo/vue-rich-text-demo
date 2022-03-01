<template>
    <div>
        <tinymce v-model="content"
                 :height="500"
                 :images-upload-handler="imagesUploadHandler"/>
    </div>
</template>

<script>
    import Tinymce from "@/components/tinymce/index";
    import {uploadCourseToQiNiuYun} from "@/api/upload-file";

    export default {
        name: "TinymceDemo",
        components: {Tinymce},
        data() {
            return {
                content: "",
                content1: '<h1 style="text-align: center;">长恨歌</h1>' +
                    '<p style="text-align: center;">汉皇重色思倾国，御宇多年求不得。' +
                    '<br />杨家有女初长成，养在深闺人未识。' +
                    '<br />天生丽质难自弃，一朝选在君王侧。' +
                    '<br />回眸一笑百媚生，六宫粉黛无颜色。' +
                    '<br />春寒赐浴华清池，温泉水滑洗凝脂。' +
                    '<br />侍儿扶起娇无力，始是新承恩泽时。' +
                    '<br />云鬓花颜金步摇，芙蓉帐暖度春宵。' +
                    '<br />春宵苦短日高起，从此君王不早朝。' +
                    '<br />承欢侍宴无闲暇，春从春游夜专夜。' +
                    '<br />后宫佳丽三千人，三千宠爱在一身。' +
                    '<br />金屋妆成娇侍夜，玉楼宴罢醉和春。' +
                    '<br />姊妹弟兄皆列土，可怜光彩生门户。' +
                    '<br />遂令天下父母心，不重生男重生女。' +
                    '<br />骊宫高处入青云，仙乐风飘处处闻。' +
                    '<br />缓歌慢舞凝丝竹，尽日君王看不足。' +
                    '<br />渔阳鼙鼓动地来，惊破霓裳羽衣曲。',
            };
        },
        methods: {
            /**
             * 图片上传
             * @param blobInfo
             * @param success
             * @param failure
             */
            imagesUploadHandler(blobInfo, success, failure) {
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
        },
    }
</script>

<style scoped>

</style>
