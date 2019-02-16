<template>
    <div>
        <subTitle :subTitle="'成团管理'"/>
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
                    <span class="font-14 gray">商品名称:</span>
                    <el-input class="search-input" v-model="goodsName" @clear="search" @keyup.enter.native="search"
                              placeholder="请输入商品名称" clearable></el-input>
                    <span class="font-14 gray">订单编号:</span>
                    <el-input class="search-input" v-model="id" placeholder="请输入订单编号" @change="search" @keyup.enter.native="search" clearable></el-input>
                    <span class="font-14 gray">拼团状态:</span>
                    <el-select class="search-input" v-model="assembleState" placeholder="请选择拼团状态" @change="search" clearable>
                        <el-option :label="item" :value="index" v-for="(item,index) in promotionStatus"></el-option>
                    </el-select>
                </div>
            </div>

            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading" max-height="800" :header-cell-style="headerStyle" :cell-style="tdStyle">
                <el-table-column label="拼团编号" prop="id" width="55"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName"></el-table-column>
                <el-table-column label="拼团状态">
                    <template slot-scope="scope">
                        {{ scope.row.assembleState | getPromotionStatus }}
                    </template>
                </el-table-column>
                <el-table-column label="团规格" prop="groupSpec"></el-table-column>
                <el-table-column label="团价/元">
                    <template slot-scope="scope">
                        {{ '¥' + scope.row.groupPrice }}
                    </template>
                </el-table-column>
                <el-table-column label="已参团人数" prop="groupNum"></el-table-column>
                <el-table-column label="团长" prop="commanderName"></el-table-column>
                <el-table-column label="邀请次数" prop="invitationTimes"></el-table-column>
                <el-table-column label="开团时间" prop="createTime"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn"
                              @click="$router.push('/promotion/groupOrder?id=' + scope.row.id)">查看</span>
                        <span class="table-btn" v-if="scope.row.assembleState === 4" @click="cancelPromotion(scope.row.id)">取消</span>
                        <span class="table-btn" @click="showLog(scope.row.id)">日记</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :isBatch="false" :total="total" :pageSize="pageSize" ref="pagination" @next="next"></pagination>

            <!--日记弹窗-->
            <el-dialog
                    title="操作日记"
                    :append-to-body="true"
                    :visible.sync="dialogVisible">
                <el-table :data="dialogData" class="promotion-table">
                    <el-table-column label="操作时间" prop="createTime"></el-table-column>
                    <el-table-column label="操作内容" prop="content"></el-table-column>
                    <el-table-column label="操作者" prop="merchantName"></el-table-column>
                </el-table>
                <div class="dialog-pagination-wrap">
                    <el-pagination
                            @current-change="dialoghandleCurrentChange"
                            :current-page.sync="dialogCurrentPage"
                            :total="dialogTotal"
                            :page-size="dialogPageSize"
                            background
                            layout="total, prev, pager, next, jumper"/>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import pagination from "@/components/pagination"
    import mixin from "@/utils/mixin"
    import filters from "@/utils/filters"
    export default {
        name: "groupList",
        mixins: [mixin],
        filters: filters,
        components: {
            subTitle,
            pagination
        },
        data(){
            return {
                //搜索栏数据
                goodsName: '',
                id: '',
                assembleState: '',
                promotionStatus:filters.promotionStatus,

                tableData: [
                ],
                dialogVisible: false,

                dialogData: [],
                //弹窗分页组件数据
                orderId: '',
                dialogCurrentPage: 1,
                dialogTotal: 100,
                dialogPageSize: 10,
            }
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList(){
                this.loading = true;
                this.$ajax.post("group_manage/list", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    goodsName: this.goodsName,
                    id: this.id,
                    assembleState: this.assembleState,
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
             * 取消拼团
             * @param id
             */
            cancelPromotion(id){
                this.$confirm("确认取消拼团吗?取消后该团下面所有订单将会全部取消").then(() => {
                    this.$ajax.post("group_manage/cancel/" + id).then((res) => {
                        this.$msgSuc("操作成功");
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                },() => {
                    // console.log("取消删除");
                })
            },

            /**
             * 打开日志弹窗
             * @param id
             */
            showLog(id) {
                this.dialogVisible = true;
                this.orderId = id;
                this.$ajax.post("group_manage_log/list", {
                    currentPage: this.dialogCurrentPage,
                    pageSize: this.dialogPageSize,
                    id: id
                }).then((res) => {
                    this.dialogData = res.list;
                    this.dialogTotal = res.totalCount;
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },

            /**
             * 弹窗分页组件控制翻页事件
             * @param val
             */
            dialoghandleCurrentChange(val) {
                this.dialogCurrentPage = val;
                this.showLog(this.orderId);
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

    .promotion-table{
        /deep/ .el-table__empty-block{
            border: none;
        }
    }

    .dialog-pagination-wrap{
        margin-top: 20px;
        text-align: right;
    }
</style>