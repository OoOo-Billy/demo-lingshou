<template>
    <div>
        <subTitle :subTitle="'拼团商品列表'"></subTitle>
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
                    <span class="font-14 gray">商品状态:</span>
                    <el-select class="search-input" v-model="status" placeholder="请选择商品状态" @change="search" clearable>
                        <el-option label="上架" value="0"></el-option>
                        <el-option label="下架" value="1"></el-option>
                    </el-select>
                </div>
            </div>

            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button @click="$router.push('/promotion/addGoods')">添加拼团商品</el-button>
                </div>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading" ref="table"
                      @selection-change="tableSelection" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column label="编号" prop="id" width="55"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName"></el-table-column>
                <el-table-column label="团个数" prop="groupMaxNum"></el-table-column>
                <el-table-column label="团规格">
                    <template slot-scope="scope">
                        {{ `${scope.row.groupUserNum}人-${scope.row.groupPrice}元` }}
                    </template>
                </el-table-column>
                <el-table-column label="原价/元">
                    <template slot-scope="scope">{{ scope.row.merchantGoodsTypeProperty.goodsSalePrice }}</template>
                </el-table-column>
                <el-table-column label="已开团" prop="openGroup"></el-table-column>
                <el-table-column label="已成团" prop="endGroup"></el-table-column>
                <el-table-column label="参团人数" prop="groupUserNum"></el-table-column>
                <el-table-column label="是否上架">
                    <template slot-scope="scope">
                        <el-switch @change="handleShow($event, scope.row.id)" v-model="scope.row.status" :active-value="0"
                                   :inactive-value="1" active-color="#5BC0BF" inactive-color="#dedede"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="上架时间" prop="createTime"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn"
                              @click="$router.push('/promotion/addGoods?id=' + scope.row.id)">编辑</span>
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

    export default {
        name: "promotionList",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                //搜索栏数据
                goodsName: '',
                status: '',

                tableData: [
                    {
                        id: '886',
                        goodsName: '耐克球鞋',
                        groupMaxNum: '100',
                        groupUserNum: '45',
                        groupPrice: '888',
                        merchantGoodsTypeProperty: {
                            goodsSalePrice: '1888',
                        },
                        openGroup: '1',
                        endGroup: '5',
                        status: 0,
                        createTime: '2018-12-22',
                    },
                ],

                dialogVisible: false,
                groupId: '',
                dialogData: [
                    {
                        createTime: '2018-12-22',
                        content: '222',
                        merchantName: 'Billy',
                    },
                ],

                //弹窗分页组件数据
                dialogCurrentPage: 1,
                dialogTotal: 100,
                dialogPageSize: 10,
            }
        },
        /*mounted() {
            this.getList();
        },*/
        methods: {
            getList() {
                this.loading = true;
                this.$ajax.post("merchantGoodsGroup/goods_group_list_page", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    goodsName: this.goodsName,
                    status: this.status
                }).then((res) => {
                    this.total = res.totalCount;
                    this.tableData = res.list;
                }, (err) => {
                    this.$msgErr(err.msg);
                }).finally(() => {
                    this.loading = false;
                })
            },

            /**
             * 控制是否上架
             * @param {status}$event
             * @param id
             */
            handleShow($event, id) {
                this.$ajax.post("merchantGoodsGroup/group_oprate", {
                    id: id,
                    status: $event
                }).then(() => {
                    this.$msgSuc('操作成功');
                    this.getList();
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },

            /**
             * 打开日志弹窗
             * @param id
             */
            showLog(id) {
                this.dialogVisible = true;
                this.groupId = id;
                this.$ajax.post("merchantGoodsGroup/query_log_pages", {
                    currentPage: this.dialogCurrentPage,
                    pageSize: this.dialogPageSize,
                    groupId: id
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
                this.showLog(this.groupId);
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