<template>
    <div>
        <subTitle :subTitle="'商品详情'" :isClose="true" @close="back"/>
        <div class="body">
            <div class="flex">
                <!--用户信息-->
                <div class="comment-user flex flex-col">
                    <div class="text-center">
                        <img src="https://img.xinzhibang168.com/FmR88ILyONmakl5P1khxHlEt3qxc.jpg" alt="">
                        <p class="text-center">{{ tableData.userName}}</p>
                    </div>
                    <div class="flex flex-col">
                        <p>商品：{{ tableData.goodsName}}</p>
                        <!--<p>购买：肤色/M</p>-->
                        <p>评价：
                            <img v-for="num in tableData.commentLevel" src="@/assets/starOn.png" class="icon-star">
                            <img v-for="num in tableData.commentLevel1" src="@/assets/starOff.png" class="icon-star">
                        </p>
                        <p>日期：{{ tableData.createTime}}</p>
                        <p>IP地址：{{ tableData.commentIp}}</p>
                    </div>
                </div>

                <!--商品评论-->
                <div class="comment-right flex-1">
                    <div class="comment-content">
                        <p>{{ tableData.commentContent}}</p>
                        <span v-for="url in picArray" class="clear">
                            <a :href="url" target="_blank">
                                <img :src="getGoodImg(url)" alt="">
                            </a>
                        </span>
                    </div>
                    <div class="review">
                        <p class="font-16 gray bold">回复评论</p>
                        <el-form class="form" ref="ruleForm" :model="ruleForm" label-width="100px">
                            <el-form-item label="用户名:">
                                <el-input v-model="ruleForm.name" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="回复内容:">
                                <el-input type="textarea" :rows="7" class="textarea" v-model="ruleForm.commentContent" resize="none"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm(ruleForm)">提交</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    import mixin from '@/utils/mixin'

    export default {
        name: "commentDetail",
        mixins: [mixin],
        components: {
            subTitle
        },
        data() {
            return {
                tableData: {
                    id: null,
                    userName: '',
                    goodsName: '',
                    commentLevel: null,
                    commentLevel1: null,
                    createTime: '',
                    commentIp: '',
                    commentContent: '',
                    status: 0,//0 or 2,
                    imgUrl: '',
                },
                picArray: [],
                ruleForm: {
                    name: JSON.parse(localStorage.userInfo).merchantName,
                    commentContent: '',
                },
            }
        },
        mounted(){
            this.$ajax.post("merchantGoodsComment/merchant_goods_type_list_page",{
                id: this.$route.query.id
            }).then((res) => {
                for (let i =0; i < res.list.length; i++){
                    res.list[i].commentLevel1 = 5 - res.list[i].commentLevel;
                }
                this.tableData = res.list[0];
                if (this.tableData.imgUrl.length > 0){
                    this.picArray = this.tableData.imgUrl.split(',');
                }
            })
        },
        methods:{
            submitForm(){
                if (this.ruleForm.commentContent === ''){
                    this.$msgWar("请输入评价内容");
                    return;
                }
                this.$confirm("确认提交回复内容？").then(() => {

                    this.$ajax.post("/merchantGoodsComment/merchant_comment_reply",{
                        commentReplyContent: this.ruleForm.commentContent,
                        id: this.tableData.id
                    }).then(() => {
                        this.$msgSuc("回复成功！");
                    },(err) => {
                        this.$msgErr(err);
                    })
                },() => {
                    // console.log("取消了提交");
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    $border: 1px solid #dedede;
    $gray: #5a5a5a;
    .body{
        >div{
            width: 80%;
            margin: 0 auto;
        }
        .comment-user{
            padding:0 20px;
            border: $border;
            border-right: none;
            img{
                width: 100px;
                height: 100px;
                border-radius: 50%;
                margin: 10px 0
            }
            .flex{
                margin-left: 20px;
                p{
                    margin-top: 10px;
                    color: $gray;
                    font-size: 15px;
                }
                .icon-star{
                    width: 20px;
                    height: 20px;
                    margin: 0 0 -4px 0;
                }
            }
        }
        .comment-right{
            border: $border;
            .comment-content{
                padding: 20px;
                border-bottom: 1px solid #b4b4b4;
                p{
                    padding-bottom: 20px;
                    font-size: 15px;
                    line-height: 28px;
                    color: $gray;
                }
                img{
                    width: 100px;
                    margin: 0 5px;
                }
            }
            .review{
                padding:30px;
                .form{
                    width: 500px;
                    margin-top: 30px;
                }
            }
        }
    }
</style>