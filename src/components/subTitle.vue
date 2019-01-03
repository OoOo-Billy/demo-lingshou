<template>
    <div class="sub-title">
        <p>{{ subTitle }}</p>
        <div>
            <el-button v-if="isRefresh" @click="refresh">刷新</el-button>
            <el-button v-if="isBack" @click="back">返回</el-button>
            <el-button v-if="isClose" @click="close">关闭</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "subTitle",
        props: {
            subTitle: String,
            //设置isRefresh\isBack\isClose的意义是父组件可以选择是否需要这3个选项
            isRefresh: {
                type: Boolean,
                default: false
            },
            isBack: {
                type: Boolean,
                default: false
            },
            isClose: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            refresh() {
                this.$emit('refresh');
            },
            back() {
                this.$router.go(-1);
            },
            close() {
                this.$emit('close');
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";
    .sub-title {
        width: 100%;
        height: 60px;
        background-color: #efefef;
        padding: 20px 30px 0 0;
        box-sizing: border-box;
        p {
            color: #5a5a5a;
            font-size: 22px;
            font-weight: bold;
            line-height: 24px;
            padding-left: 22px;
            border-left: 8px solid #5BC0BF;
        }
        div{
            float: right;
            margin-top: -32px;
        }
    }
</style>