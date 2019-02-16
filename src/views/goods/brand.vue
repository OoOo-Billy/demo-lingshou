<template>
    <div>
        <subTitle :subTitle="'品牌管理'"/>
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
                    <el-input class="search-input" v-model="brandName" @clear="search" @keyup.enter.native="search"
                              placeholder="品牌名称/关键字" clearable></el-input>
                </div>
            </div>

            <!--表格头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button @click="$router.push('/goods/brand/addBrand')">添加品牌</el-button>
                </div>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading" ref="table"
                      @selection-change="tableSelection" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="品牌昵称" prop="name"></el-table-column>
                <el-table-column label="品牌首字母" prop="firstChar"></el-table-column>
                <el-table-column label="排序" prop="sorting"></el-table-column>
                <el-table-column label="是否显示">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.isShow" @change="handleShow($event, scope.row)" :active-value="1" :inactive-value="0" active-color="#5BC0BF" inactive-color="#dedede"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="相关">
                    <template slot-scope="scope">
                        <span>商品：{{ scope.row.goodsTotal}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="$router.push('/goods/brand/addBrand?id=' + scope.row.id)">编辑</span>
                        <span class="table-btn" @click="remove([scope.row.id])">删除</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :total="total" :pageSize="pageSize" ref="pagination" :optionsList="optionsList"
                        @confirmBatch="confirmBatch" @next="next" @handleChangeAll="handleChangeAll"></pagination>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    import pagination from '@/components/pagination'
    import mixin from '@/utils/mixin'

    export default {
        name: "brand",
        components: {
            subTitle,
            pagination
        },
        mixins: [mixin],
        data() {
            return {
                //表格数据
                tableData: [],
                checkItemId: [],

                //分页组件数据
                optionsList: {
                    'delete': '删除',
                    'show': '显示品牌',
                    'hide': '隐藏品牌',
                },

                //筛选栏数据
                brandName: '',
            }
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList() {
                this.loading =true;
                this.$ajax.post("merchant_goods_brand/query_for_page",{
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    name: this.brandName,
                }).then((res) => {
                    this.tableData = res.list;
                    this.total = res.totalCount;
                },(err) => {
                    this.$msgErr(err.msg);
                }).finally(()=>{
                    this.loading = false;
                })
            },

            handleShow($event,data){
                let form = {
                    id: data.id,
                    name: data.name,
                    logo: data.logo,
                    areaLogo: data.areaLogo,
                    story: data.story,
                    firstChar: data.firstChar,
                    sorting: data.sorting,
                    isShow: $event,
                };
                this.$ajax.post("merchant_goods_brand/update",form).then((res) => {
                    this.$msgSuc("操作成功");
                },(err) => {
                    this.$msgErr(err.msg);
                })
            },


            remove(id){
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("merchant_goods_brand/delete_batch",id).then(() => {
                        this.$msgSuc("删除成功");
                        this.getList();
                    },(err) => {
                        this.$msgErr(err.msg);
                    })
                },(err) => {
                    // console.log("取消删除");
                })
            },

            batchShow(id,val){
                this.$ajax.post("merchant_goods_brand/hidden_batch",{
                    type: val,
                    ids: id
                }).then(() => {
                    this.$msgSuc("操作成功");
                    this.getList();
                },(err) => {
                    this.$msgErr(err.msg);
                })
            }
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