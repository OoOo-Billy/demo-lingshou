<template>
    <div>
        <subTitle :subTitle="'确认收货'"/>
        <div class="body2">
            <!--筛选栏-->
            <div class="filter-wrap">
                <div class="flex h-center between">
                    <div class="font-14 gray">
                        <i class="el-icon-search">筛选查询</i>
                    </div>
                    <div class="search-wrap font-14 gray">
                        <i class="el-icon-arrow-down" @click="showSearch" v-show="!visibleSearch">打开筛选</i>
                        <i class="el-icon-arrow-up" @click="showSearch" v-show="visibleSearch">收起筛选</i>
                        <el-button class="search" @click="search">查询结果</el-button>
                    </div>
                </div>
                <div class="flex h-center" v-show="visibleSearch">
                    <span class="font-14 gray">订单编号:</span>
                    <el-input class="search-input" v-model="searchcode" @clear="search" @keyup.enter.native="search"
                              placeholder="请输入订单编号" clearable></el-input>
                    <span class="font-14 gray">用户账号:</span>
                    <el-input class="search-input" v-model="receiver" placeholder="请输入用户账号" @clear="search"
                              @keyup.enter.native="search" clearable>
                    </el-input>
                </div>
            </div>

            <!--表头-->
            <div class="box-title flex between h-center">
                <span class="font-20">订单列表</span>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column label="订单编号" prop="code"></el-table-column>
                <el-table-column label="提交时间" prop="creatTime"></el-table-column>
                <el-table-column label="用户账号" prop="mobilePhone"></el-table-column>
                <el-table-column label="订单金额" prop="totalMoeny"></el-table-column>
                <el-table-column label="支付方式">
                    <template slot-scope="scope">微信小程序支付</template>
                </el-table-column>
                <el-table-column label="订单来源">
                    <template slot-scope="scope">微信小程序</template>
                </el-table-column>
                <el-table-column label="订单状态">
                    <template slot-scope="scope">待收货</template>
                </el-table-column>
                <el-table-column label="操作订单">
                    <template slot-scope="scope">
                        <span class="table-btn"
                              @click="$router.push('/order/list/orderDetail?id=' + scope.row.id)">查看订单</span>
                        <span class="table-btn" @click="update(scope.row.id)">确认收货</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :total="total" :pageSize="pageSize" :isBatch="false" ref="pagination" @next="next"></pagination>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import pagination from "@/components/pagination"
    import mixin from "@/utils/mixin"
    export default {
        name: "receipt",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data(){
            return {
                //搜索栏数据
                merchantId: '',
                searchcode: '',
                receiver: '',
                tableData: [
                    {
                        id: '66432',
                        code: 'abc134def765ght1335dd123',
                        creatTime: '2018-12-31',
                        mobilePhone: '18883883883',
                        totalMoeny: '200',
                    },
                ],
            }
        },
       /* created(){
            this.merchantId = JSON.parse(this.$store.getters.userInfo).merchantId;
            this.getList();
        },*/
        methods: {
            getList(){
                this.loading = true;
                this.$ajax.post("merchant_order/query_for_page", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    phone: this.receiver,
                    code: this.searchcode,
                    status: 3,
                    merchantId: this.merchantId
                }).then((res) => {
                    this.tableData = res.list;
                    this.total = res.totalCount;
                }, (err) => {
                    this.$msgErr(err.msg);
                }).finally(() => {
                    this.loading = false;
                })
            },

            /**
             * 确认收货
             * @param id
             */
            update(id){
                this.$confirm("确认收货吗?").then(() => {
                    this.$ajax.post("merchant_order/update",{
                        id: id,
                        status: 4,
                        merchantId: this.merchantId
                    }).then(() => {
                        this.$msgSuc("收货成功");
                        this.getList();
                    },(err) => {
                        this.$msgErr(err.msg);
                    })
                },() => {
                    // console.log("取消收货");
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";
    .filter-wrap {
        border: $border;
        margin-bottom: 24px;
        > div {
            padding: 0 22px;
            height: 56px;
            &:last-child {
                background-color: $bgColor;
            }
        }
        .search {
            margin-left: 20px;
        }
        .search-input {
            width: 200px;
            margin: 0 15px;
        }
    }

</style>