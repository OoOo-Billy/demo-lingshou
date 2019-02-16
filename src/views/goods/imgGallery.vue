<template>
    <div>
        <subTitle :subTitle="'商品图片库'"/>
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
                    <el-input class="search-input" v-model="imgName" @clear="search" @keyup.enter.native="search"
                              placeholder="品牌名称/关键字" clearable></el-input>
                </div>
            </div>

            <!--表格头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button @click="$router.push('/goods/imgGallery/addImage')">添加相册</el-button>
                </div>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading" ref="table"
                      @selection-change="tableSelection" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column type="selection" prop="id" width="55"></el-table-column>
                <el-table-column label="编号" prop="id" width="55"></el-table-column>
                <el-table-column label="相册名称" prop="name"></el-table-column>
                <el-table-column label="封面">
                    <template slot-scope="scope">
                        <img :src="scope.row.cover" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="图片数量" prop="imgTotal"></el-table-column>
                <el-table-column label="排序" prop="sorting"></el-table-column>
                <el-table-column label="描述" prop="description" width="300"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="$router.push('/goods/imgGallery/' + scope.row.id)">查看</span>
                        <span class="table-btn" @click="$router.push('/goods/imgGallery/addImage?id=' + scope.row.id)">编辑</span>
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
        name: "imgGallery",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                //筛选栏数据
                imgName: '',
                tableData: [],
                checkItemId: [],
                optionsList: {
                    'delete': '删除'
                },
            }
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                this.$ajax.post("merchant_goods_galleries/query_for_page",{
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    name: this.imgName
                }).then((res) => {
                    this.total = res.totalCount;
                    this.tableData = res.list;
                },(err) => {
                    this.$msgErr(err.msg);
                }).finally(() => {
                    this.loading = false;
                })
            },

            remove(id) {
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("/merchant_goods_galleries/delete_batch",id).then(() => {
                        this.$msgSuc("删除成功");
                        this.getList();
                    },(err) => {
                        this.$msgErr(err.msg);
                    })
                },(err) => {
                    // console.log("取消删除");
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