<template>
    <div>
        <subTitle :subTitle="'系统首页'"/>
        <div class="body">
            <!--头部销售额信息-->
            <div class="row-top flex between">
                <div>
                    <img src="@/assets/index/icon-1.png" alt="">
                    <div>
                        <p class="font-18 gray">今日订单总数</p>
                        <p class="font-18 red bold">{{ data.todayOrderNum}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/index/icon-2.png" alt="">
                    <div>
                        <p class="font-18 gray">今日销售额</p>
                        <p class="font-18 red bold">{{'￥' + data.todayOrderMoney}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/index/icon-3.png" alt="">
                    <div>
                        <p class="font-18 gray">昨日销售额</p>
                        <p class="font-18 red bold">{{'￥' + data.yesterdayOrderMoney}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/index/icon-4.png" alt="">
                    <div>
                        <p class="font-18 gray">近七日销售总额</p>
                        <p class="font-18 red bold">{{'￥' + data.nearlySevenDayOrderMoney}}</p>
                    </div>
                </div>
            </div>
            <!--待处理事务表格-->
            <table class="table-middle" border="1">
                <caption class="box-title">待处理事务</caption>
                <tbody>
                <tr>
                    <td @click="linkOrder">待付款订单<em>({{ data.dfk}})</em></td>
                    <td @click="linkOrder">已完成订单<em>({{ data.ywc}})</em></td>
                    <td @click="linkOrder">待确认退货订单<em>({{ data.dqrth }})</em></td>
                </tr>
                <tr>
                    <td @click="linkOrder">待发货订单<em>({{ data.dfh }})</em></td>
                    <td @click="linkOrder">待处理退款申请<em>({{ data.dcltk }})</em></td>
                    <td @click="linkOrder">已发货订单<em>({{ data.dsh }})</em></td>
                </tr>
                <tr>
                    <!--<td @click="linkOrder">待处理退货订单</td>-->
                    <td @click="linkAdvertising">广告位即将到期<em>(0)</em></td>
                </tr>
                </tbody>
            </table>
            <!--运营快捷入口-->
            <div>
                <div class="box-title">运营快捷入口</div>
                <ul class="list flex">
                    <li class="flex-1" v-for="(item,index) in entryList" :key="index" @click="linkUrl(item.path)">
                        <img class="list-icon" :src="item.icon" alt="">
                        <p class="font-18 gray text-center">{{ item.text}}</p>
                    </li>
                </ul>
            </div>
            <!--用户、商品信息-->
            <div class="info">
                <el-row :gutter="50">
                    <el-col :span="12">
                        <div class="box-title">商品总览</div>
                        <div class="flex">
                            <div>
                                <p class="font-22 red">{{ goodsData.notpull || 0 }}</p>
                                <p class="font-18 gray">已下架</p>
                            </div>
                            <div>
                                <p class="font-22 red">{{ goodsData.put || 0 }}</p>
                                <p class="font-18 gray">已上架</p>
                            </div>
                            <div>
                                <p class="font-22 red">{{ goodsData.all || 0 }}</p>
                                <p class="font-18 gray">全部商品</p>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="box-title">用户总览</div>
                        <div class="flex">
                            <div>
                                <p class="font-22 red">{{ userData.yesterdayAddUserCount  || 0 }}</p>
                                <p class="font-18 gray">昨日新增</p>
                            </div>
                            <div>
                                <p class="font-22 red">{{ userData.monthAddUserCount  || 0 }}</p>
                                <p class="font-18 gray">本月新增</p>
                            </div>
                            <div>
                                <p class="font-22 red">{{ userData.allUserCount  || 0 }}</p>
                                <p class="font-18 gray">会员总数</p>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'

    export default {
        name: "systemIndex",
        components: {
            subTitle,
        },
        data() {
            return {
                userData: {},
                goodsData: {},
                data: {
                    todayOrderNum: 1111,//今日订单总数
                    todayOrderMoney: 100000,//今日销售额
                    yesterdayOrderMoney: 120203,//昨日销售额
                    nearlySevenDayOrderMoney: 1005000,//近七日销售总额
                    dfk: 0,//待付款数
                    ywc: 0,//已完成数
                    dqrth: 0,//待确认退货数
                    dfh: 0,//代发货数
                    dcltk: 0,//待处理退款数
                    dsh: 0,//已发货数
                },
                entryList:[
                    {
                        icon: require("@/assets/index/icon-5.png"),
                        text: '添加商品',
                        path: '/goods/add'
                    },
                    {
                        icon: require("@/assets/index/icon-6.png"),
                        text: '订单列表',
                        path: '/order/list'
                    },
                    {
                        icon: require("@/assets/index/icon-7.png"),
                        text: '用户管理',
                        path: '/user/list'
                    },
                    {
                        icon: require("@/assets/index/icon-8.png"),
                        text: '交易统计',
                        path: '/statistics/deal'
                    },
                    {
                        icon: require("@/assets/index/icon-10.png"),
                        text: '广告管理',
                        path: '/operate/advertising'
                    }
                ],
            }
        },
        /*mounted() {
            this.$ajax.post("merchant_order/getOrderAllCount", {
                merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
            }).then((res) => {
                this.data = res;
            });
            this.$ajax.post("merchant/merchant_index").then((res) => {
                this.userData = res;
            });
            this.$ajax.post("merchantGoods/goodsCountStatistics").then((res) => {
                this.goodsData = res;
            })
        },*/
        methods: {
            linkUrl(path){
                alert(`页面${path}未完成，无法跳转`)
                // this.$router.push(path);
            },
            linkOrder() {
                alert('页面未完成，无法跳转')
                // this.$router.push('order/list');
            },
            linkAdvertising(){
                alert('页面未完成，无法跳转')
                // this.$router.push('/operate/advertising');
            }
        },

    }
</script>

<style scoped lang="scss">
    .row-top {
        > div {
            flex: 1;
            display: flex;
            align-items: center;
            margin-right: 20px;
            margin-bottom: 30px;
            height: 105px;
            box-sizing: border-box;
            background-color: #F7F8F8;
            border: 1px solid #5BC0BF;
            img {
                margin: 0 15px;
            }
            div p {
                line-height: 28px;
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .box-title {
        line-height: 60px;
        color: #5a5a5a;
        font-weight: bold;
        font-size: 22px;
        background-color: #efefef;
        text-align: left;
        padding-left: 20px;
        border: 1px solid #b4b4b4;
        border-bottom-color: transparent;
    }
    .table-middle {
        width: 100%;
        margin-bottom: 30px;
        border-right: 1px solid #b4b4b4;
        border-bottom: 1px solid #b4b4b4;
        tr {
            height: 60px;
            background-color: #fff;
        }
        td {
            padding: 0 20px;
            border-left: 1px solid #b4b4b4;
            border-top: 1px solid #b4b4b4;
            color: #5a5a5a;
            &:hover {
                text-decoration: underline;
                cursor: pointer;
            }
        }
    }
    em{
        font-style: normal;
        color:red;
        float: right;
    }
    .list{
        padding: 20px 0 35px;
        border: 1px solid #b4b4b4;
        margin-bottom: 30px;
        li:hover>p{
            cursor: pointer;
            color: #5AC2C0;
        }
        img{
            display: block;
            margin: 0 auto;
        }
    }
    .info{
        .flex{
            border: 1px solid #b4b4b4;
            div{
                flex: 1;
                text-align: center;
                padding: 20px 0;
                p{
                    line-height: 36px;
                }
            }
        }
    }
</style>