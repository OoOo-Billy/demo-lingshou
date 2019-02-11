<template>
    <div>
        <subTitle :subTitle="'用户信息'" :isBack="true"/>
        <div class="body2" v-loading="loading">
            <!--用户基本信息-->
            <div class="flex info">
                <!--用户头像-->
                <div class="flex h-center">
                    <img class="avatar" :src="getGoodImg(data.user.remark2)" alt="头像">
                </div>

                <!--用户信息1-->
                <div class="flex-1">
                    <div>
                        <span>用户ID</span>
                        <span>{{ data.user.id }}</span>
                    </div>
                    <div>
                        <span>昵称</span>
                        <span>{{ data.user.realName }}</span>
                    </div>
                    <div>
                        <span>性别</span>
                        <span>{{ data.user.sex | getSex }}</span>
                    </div>
                    <div>
                        <span>生日</span>
                        <span>{{ data.user.birthday }}</span>
                    </div>
                    <div>
                        <span>城市</span>
                        <span>{{ data.user.remark5 }}</span>
                    </div>
                </div>

                <!--用户信息2-->
                <div class="flex-1">
                    <div>
                        <span>职业</span>
                        <span>无</span>
                    </div>
                    <div>
                        <span>个性签名</span>
                        <span>无</span>
                    </div>
                    <div>
                        <span>喜欢的分类</span>
                        <span>无</span>
                    </div>
                    <div>
                        <span>注册时间</span>
                        <span>{{ data.user.createTime }}</span>
                    </div>
                    <div>
                        <span>用户来源</span>
                        <span>小程序</span>
                    </div>
                </div>
            </div>


            <!--统计信息-->
            <div class="statistics flex">
                <p class="title">统计信息</p>
                <div>
                    <span>消费金额</span>
                    <span>{{ data.consumption || 0 }}</span>
                </div>
                <div>
                    <span>订单数量</span>
                    <span>{{ data.order_count || 0 }}</span>
                </div>
                <div>
                    <span>收藏商品</span>
                    <span>{{ data.collection || 0 }}</span>
                </div>
                <div>
                    <span>商品评价</span>
                    <span>{{ data.evaluation }}</span>
                </div>
                <div>
                    <span>退货记录</span>
                    <span>{{ data.return_record || 0 }}</span>
                </div>
                <div>
                    <span>登录次数</span>
                    <span>{{ data.login_count || 0 }}</span>
                </div>
            </div>

            <!--收货地址-->
            <p class="address-title">收货地址</p>
            <el-table class="mall-table" :data="data.addressList" :header-cell-style="headerStyle" :cell-style="tdStyle">
                <el-table-column label="姓名" prop="userName"></el-table-column>
                <el-table-column label="手机号" prop="phone" width="140"></el-table-column>
                <el-table-column label="详细地址" prop="address"></el-table-column>
                <el-table-column label="邮政编码" prop="postalCode" width="140"></el-table-column>
                <el-table-column label="默认地址" width="140">
                    <template slot-scope="scope">
                        <el-switch disabled v-model="scope.row.defaultState" :active-value="1" :inactive-value="2" active-color="#5BC0BF" inactive-color="#dedede"></el-switch>
                    </template>
                </el-table-column>
            </el-table>

            <!--订单记录-->
            <p class="address-title">订单记录</p>
            <el-table class="mall-table" :data="list" :header-cell-style="headerStyle" :cell-style="tdStyle">
                <el-table-column label="订单编号" prop="code"></el-table-column>
                <el-table-column label="提交时间" prop="creatTime" width="140"></el-table-column>
                <el-table-column label="用户账号" prop="mobilePhone"></el-table-column>
                <el-table-column label="订单金额" prop="totalMoeny" width="140"></el-table-column>
                <el-table-column label="支付方式" width="140">
                    <template slot-scope="scope">
                        <span>微信</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单来源" width="140">
                    <template slot-scope="scope">
                        <span>小程序</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" width="140">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status | getOrderStatus }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="$router.push('/order/list/orderDetail?id=' + scope.row.id)">查看订单</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :isBatch="false" :total="total" :pageSize="pageSize" @next="next"></pagination>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import pagination from "@/components/pagination"
    import mixin from "@/utils/mixin"
    import filters from "@/utils/filters"
    export default {
        name: "info",
        mixins: [mixin],
        filters: filters,
        components: {
            subTitle,
            pagination
        },
        data(){
            return {
                data: {
                    user: {
                        remark2: '',
                        id: '88585858',
                        realName: '',
                        sex: '0',
                        birthday: '',
                        remark5: '',
                        createTime: '',
                    },
                    consumption: '',
                    order_count: '',
                    collection: '',
                    evaluation: '',
                    return_record: '',
                    login_count: '',
                    addressList: [
                        {
                            userName: '',
                            phone: '',
                            address: '',
                            postalCode: '',
                            defaultState: 2,
                        },
                    ],
                },
                list: [
                    {
                        id: '555',
                        code: '',
                        creatTime: '',
                        mobilePhone: '',
                        totalMoeny: '',
                        status: 2,
                    },
                ],
            }
        },
       /* mounted(){
            this.getList();
        },*/
        methods: {
            getList(){
                this.loading = true;
                this.$ajax.post("user_detail/query/" + this.$route.query.id).then((res) => {
                    this.data = res;
                }, (err) => {
                    this.$msgErr(err.msg);
                });
                this.$ajax.post("merchant_order/query_for_page", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    merchantId: JSON.parse(localStorage.getItem('userInfo')).merchantId,
                    userId: this.$route.params.id
                }).then((res) => {
                    this.list = res.list;
                    this.total = res.totalCount;
                }, (err) => {
                    this.$msgErr(err.msg);
                }).finally(() => {
                    this.loading = false;
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";
    .avatar{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 0 50px;
    }
    .info{
        border: $border;
        >div{
            border-right: $border;
            &:last-child{
                border-right: none;
            }
            >div{
                display: flex;
                line-height: 36px;
                font-size: 14px;
                border-bottom: $border;
                >span{
                    padding: 0 10px;
                    &:first-child{
                        width: 30%;
                        color: $gray;
                        background-color: #F6F6F6;
                        border-right: $border;
                    }
                }
                &:last-child{
                    border-bottom: none;
                }
            }
        }
    }

    .statistics{
        margin-top: 30px;
        border: $border;
        .title{
            width: 100%;
            border-bottom: $border;
            line-height: 40px;
            font-weight: bold;
            padding-left: 20px;
            box-sizing: border-box;
            background-color: #EFEFEF;
        }
        >div{
            display: flex;
            flex: 1;
            border-right: $border;
            &:last-child{
                border-right: none;
            }
            >span{
                flex: 1;
                line-height: 49px;
                font-size: 15px;
                text-align: center;
                &:first-child{
                    display: inline-block;
                    height: 100%;
                    line-height: 49px;
                    color: $gray;
                    font-weight: 700;
                    background-color: #F6F6F6;
                    border-right: $border;
                }
            }
        }
    }

    .address-title{
        border: $border;
        border-bottom: none;
        line-height: 40px;
        font-weight: bold;
        padding-left: 20px;
        box-sizing: border-box;
        background-color: #EFEFEF;
        margin-top: 30px;
    }
</style>