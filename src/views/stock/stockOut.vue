<template>
    <div>
        <subTitle :subTitle="'商品出库'"/>
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
                    <span class="font-14 gray">输入搜索:</span>
                    <el-input class="search-input" v-model="name" @clear="search" @keyup.enter.native="search"
                              placeholder="商品名称/商品货号" clearable></el-input>
                    <span class="font-14 gray">操作类型:</span>
                    <el-select class="search-input" v-model="operateType" placeholder="请选择操作类型" @change="search"
                               clearable>
                        <el-option :label="item.name" :value="item.code" v-for="item in stockTypeList"></el-option>
                    </el-select>
                    <span class="font-14 gray">操作时间</span>
                    <el-date-picker
                            v-model="datePicker"
                            type="daterange"
                            @change="handleDate"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>

            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading"
                      max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column label="编号" prop="id" width="55"></el-table-column>
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <img :src="getGoodImg(scope.row.goodsImg)" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="商品名称">
                    <template slot-scope="scope">
                        <p>{{ scope.row.goodsName }}</p>
                        <p>品牌: {{ scope.row.brandName }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="货号/属性">
                    <template slot-scope="scope">
                        {{ scope.row.goodsNo }}/{{ scope.row.property }}
                    </template>
                </el-table-column>
                <el-table-column label="订单号" prop="orderCode"></el-table-column>
                <el-table-column label="库存">
                    <template slot-scope="scope">
                        <p>数量: {{ scope.row.changeNumber }}</p>
                        <p>剩余: {{ scope.row.changeAfter }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作类型" prop="typeName"></el-table-column>
                <el-table-column label="操作信息" prop="createTime"></el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :isBatch="false" :total="total" :pageSize="pageSize" ref="pagination" @next="next"></pagination>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import pagination from "@/components/pagination"
    import mixin from "@/utils/mixin"
    export default {
        name: "stockOut",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                //搜索栏数据
                name: '',
                operateType: '',
                beginTime: '',
                endTime: '',
                stockTypeList: [
                    {
                        code: '',
                        name: '',
                    },
                ],
                datePicker: [],

                tableData: [
                    {
                        id: '',
                        goodsImg: '',
                        goodsName: '',
                        brandName: '',
                        goodsNo: '',
                        property: '',
                        changeNumber: '',
                        changeAfter: '',
                        typeName: '',
                        createTime: '',
                    },
                ],
            }
        },
        /*mounted() {
            this.getStockType(0);
            this.getList();
        },*/
        methods: {
            getList() {
                this.loading = true;
                this.$ajax.post("merchant_goods_log/query_for_page", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    search: this.name,
                    operateType: this.operateType,
                    beginTime: this.beginTime,
                    endTime: this.endTime,
                    type: 0
                }).then((res) => {
                    this.tableData = res.list;
                    this.total = res.totalCount;
                }, (err) => {
                    this.$msgErr(err.msg);
                }).finally(() => {
                    this.loading = false;
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