<template>
    <div>
        <subTitle :subTitle="'商品回收站'" :isRefresh="true" @refresh="search"/>
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
                    <el-input class="search-input" v-model="goodsName" @clear="search" @keyup.enter.native="search"
                              placeholder="商品名称/商品货号" clearable></el-input>
                    <span class="font-14 gray">选择分类:</span>
                    <el-select class="search-input" v-model="typeId" placeholder="请选择商品分类" @change="search" clearable>
                        <el-option v-for="item in categoryList" :label="item.typeName" :value="item.id"></el-option>
                    </el-select>
                    <span class="font-14 gray">选择品牌:</span>
                    <el-select class="search-input" v-model="brandId" @change="search" placeholder="请选择商品品牌" clearable>
                        <el-option v-for="item in brandList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div>
            </div>

            <!--表格头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <!-- <el-select v-model="input" placeholder="显示条数" class="search-input">
                      <el-option key="1" value="1" label="1"></el-option>
                    </el-select>
                    <el-select v-model="input" placeholder="排序方式" class="search-input">
                      <el-option key="1" value="1" label="1"></el-option>
                    </el-select>-->
                </div>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading" ref="table"
                      @selection-change="tableSelection" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column type="selection" prop="id" width="55"></el-table-column>
                <el-table-column label="编号" prop="id" width="100"></el-table-column>
                <el-table-column label="商品图片" width="100">
                    <template slot-scope="scope">
                        <img :src="getGoodImg(scope.row.goodsImg)" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="goodsName"></el-table-column>
                <el-table-column label="商品分类" prop="typeName"></el-table-column>
                <el-table-column label="价格" prop="goodsPrice"></el-table-column>
                <el-table-column label="货号" prop="goodsNo"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="update(scope.row.id)">编辑</span>
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
    import subTitle from '../../components/subTitle'
    import pagination from '../../components/pagination'
    import mixin from '../../utils/mixin'

    export default {
        name: "recycle",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                tableData: [
                    {
                        id: 52131,
                        goodsImg: '@/assets/image.png',
                        goodsName: '超厚羽绒服',
                        typeName: '服装',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                    },
                    {
                        id: 52131,
                        goodsImg: '@/assets/image.png',
                        goodsName: '超厚羽绒服',
                        typeName: '服装',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                    },
                    {
                        id: 52131,
                        goodsImg: '@/assets/image.png',
                        goodsName: '超厚羽绒服',
                        typeName: '服装',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                    },
                    {
                        id: 52131,
                        goodsImg: '@/assets/image.png',
                        goodsName: '超厚羽绒服',
                        typeName: '服装',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                    },
                    {
                        id: 52131,
                        goodsImg: '@/assets/image.png',
                        goodsName: '超厚羽绒服',
                        typeName: '服装',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                    },
                    {
                        id: 52131,
                        goodsImg: '@/assets/image.png',
                        goodsName: '超厚羽绒服',
                        typeName: '服装',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                    },
                    {
                        id: 52131,
                        goodsImg: '@/assets/image.png',
                        goodsName: '超厚羽绒服',
                        typeName: '服装',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                    },
                ],//商品回收站表格数据

                //搜索数据
                goodsName: '',
                typeId: '',
                brandId: '',

                //筛选栏数据
                categoryList: [],
                // categoryList: [{typeName: '大衣', id: 0}, {typeName: '长裙', id: 1}],
                brandList: [],
                // brandList: [{name: '安踏', id: 0}, {name: '贵人鸟', id: 1}]
                checkItemId: [],//选中的物品ID
                optionsList: {
                    'delete': '删除',
                    'restore': '还原'
                },//分页组件下拉操作选项
            }
        },
        mounted() {//与list组件一样
            //初始化筛选框中的分类列表
            /*this.$ajax.post('merchantGoodsType/query_goods_type_tree').then((res) => {
                this.categoryList = res;
            });*/
            //初始化筛选框中的品牌列表
            /*this.$ajax.post('merchant_goods_brand/query_list').then((res) => {
                this.brandList = res;
            });*/
            //初始化表格数据
            //this.getList();
        },
        methods: {
            /**
             * 从服务器获取表格数据
             */
            getList() {
                //修改mixin里的loading属性，表示正在加载
                this.loading = true;
                //向服务器请求数据
                this.$ajax.post('/merchantGoods/merchant_goods_recycling', {
                    //上传的数据
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    goodsName: this.goodsName,
                    typeId: this.typeId,
                    brandId: this.brandId
                }).then((res) => {
                    //处理服务器相应
                    this.total = res.totalCount;
                    this.tableData = res.list;
                }, (err) => {
                    //请求错误的处理
                    this.$msgErr(err.msg);
                }).finally(() => {
                    //结束加载状态
                    this.loading = false;
                })
            },

            /**
             * 还原商品（单个）
             * @param {String}id
             */
            update(id) {
                this.$confirm("确认还原商品？").then(() => {
                    this.$ajax.post("/merchantGoods/merchant_goods_recycling_reduction", {
                        id: id
                    }).then(() => {
                        this.$msgSuc("还原成功");
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                })
            },

            /**
             * 删除商品
             * @param {Array}id
             */
            remove(id) {
                this.$confirm("确认删除商品？").then(() => {
                    this.$ajax.post("/merchantGoods/delete_batch_recycling", id).then(() => {
                        this.$msgSuc("删除成功");
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                })
            },

            /**
             * 还原商品（批量）
             * @param {Array}id
             */
            restore(id) {
                this.$confirm("确认还原商品？").then(() => {
                    this.$ajax.post("merchantGoods/merchant_goods_batch_reduction", id).then(() => {
                        this.$msgSuc("还原成功");
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
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
    }

    .search-input {
        width: 200px;
        margin: 0 15px;
    }

    .box-title {
        padding-right: 20px;
        /*.search-input{
            width: 150px;
            margin-left: 20px;
        }*/
    }
</style>