<template>
    <div class="container">
        <!--头部-->
        <subTitle :subTitle="'商品列表'"/>
        <!--body-->
        <div class="content">
            <!--筛选栏-->
            <div class="filter-wrap">
                <div class="flex h-center between">
                    <div class="font-14 gray">
                        <i class="el-icon-search">筛选查询</i>
                    </div>
                    <div class="search-wrap font-14 gray">
                        <i class="el-icon-arrow-down" @click="showSearch" v-show="!visibleSearch">打开筛选</i>
                        <i class="el-icon-arrow-up" @click="showSearch" v-show="visibleSearch">收起筛选</i>
                        <el-button class="search">查询结果</el-button>
                    </div>
                </div>
                <div class="flex h-center" v-show="visibleSearch">
                    <span class="font-14 gray">输入搜索:</span>
                    <el-input class="search-input" v-model="goodsName" placeholder="商品名称/商品货号"></el-input>
                    <span class="font-14 gray">选择分类:</span>
                    <el-select class="search-input" v-model="typeId" placeholder="请选择商品分类">
                        <el-option v-for="item in categoryList" :label="item.typeName" :value="item.id"></el-option>
                    </el-select>
                    <span class="font-14 gray">选择品牌:</span>
                    <el-select class="search-input" v-model="brandId" placeholder="请选择商品品牌">
                        <el-option v-for="item in brandList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div>
            </div>
            <!--表格头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button>添加商品</el-button>
                </div>
            </div>
            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading" height="800">
                <el-table-column type="selection" prop="id"></el-table-column>
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.goodsImg" alt="">
                        <!--<img src="@/assets/image.png" alt="">-->
                    </template>
                </el-table-column>
                <el-table-column label="商品名称">
                    <template slot-scope="scope">
                        <p>{{ scope.row.goodsName }}</p>
                        <p>品牌:{{ scope.row.brandName }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="价格/货号">
                    <template slot-scope="scope">
                        <p>价格:{{ scope.row.goodsPrice }}</p>
                        <p>货号:{{ scope.row.goodsNo }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="SKU库存">
                    <template slot-scope="scope">
                        <img src="@/assets/icon-edit.png" alt="" @click="editStock(scope.row.id)">
                    </template>
                </el-table-column>
                <el-table-column label="销量" prop="buyNum"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.status === 0 ? '未上架' : '已上架' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="outGoods(scope.row.id,scope.row.status)">{{ scope.row.status === 0 ? '上架' : '下架'}}</span>
                        <span class="table-btn">编辑</span>
                        <span class="table-btn" @click="remove([scope.row.id])">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination :total="total" :pageSize="pageSize" ref="pagination" :optionsList="optionsList"></pagination>
            <!--库存编辑弹窗-->
            <el-dialog title="编辑货品信息" :visible.sync="dialogVisible" :append-to-body="true">
                <div class="dialog-header" v-loading="dialogLoading">
                    <div class="flex h-center">
                        <p>商品货号:{{goodsNo}}</p>
                    </div>
                    <table class="mall-table dialog-table">
                        <thead>
                        <td v-for="item in stockHeader">{{item}}</td>
                        <td>销售价格</td>
                        <td>商品库存</td>
                        <td>库存预警值</td>
                        </thead>
                        <tbody>
                        <tr v-for="item in stockList">
                            <td v-for="prop in item.nameValue">{{ prop.value }}</td>
                            <td><el-input type="number" v-model="item.goodsSalePrice"></el-input></td>
                            <td><el-input type="number" v-model="item.goodsStock"></el-input></td>
                            <td><el-input type="number" v-model="item.stockWarning"></el-input></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <span slot="footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateStock">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import subTitle from '../../components/subTitle'
    import pagination from '../../components/pagination'
    import mixin from '../../utils/mixin'

    export default {
        name: "list",
        mixins: [mixin],
        components: {
            subTitle,
            pagination,
        },
        data() {
            return {
                //表格数据
                tableData: [
                    {
                        id: 52131,
                        goodsImg: '@/assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 0
                    },
                    {
                        id: 52131,
                        goodsImg: '@/assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 1
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 1
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 1
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 0
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 0
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 1
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 0
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 0
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 1
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 0
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 0
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 1
                    },
                    {
                        id: 52131,
                        goodsImg: '../../assets/image.png',
                        goodsName: '商品1',
                        brandName: '品牌1',
                        goodsPrice: 9000,
                        goodsNo: 'abcdefa95dag47gagd245d2',
                        buyNum: 8851,
                        status: 1
                    },
                ],

                //库存编辑弹窗数据
                dialogVisible: false,
                dialogLoading: false,
                goodsNo: '',
                stockHeader: [],
                goodsId: '',
                stockList: [],

                //搜索数据
                goodsName: '',
                typeId: '',
                brandId: '',

                //其他数据
                categoryList: [],
                // categoryList: [{typeName: '大衣', id: 0}, {typeName: '长裙', id: 1}],
                brandList: [],
                // brandList: [{name: '安踏', id: 0}, {name: '贵人鸟', id: 1}],

                optionsList:{
                    'delete': '删除'
                },
            }
        },
        mounted() {
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
            getList(){
                //修改mixin里的loading属性，表示正在加载
                this.loading = true;
                //向服务器请求数据
                this.$ajax.post('merchantGoods/merchant_goods_list_page',{
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
                },(err) => {
                    //请求错误的处理
                    this.$msgErr(err.msg);
                }).finally(() => {
                    //结束加载状态
                    this.loading = false;
                })
            },
            /**
             * 库存弹窗编辑
             * @param id
             */
            editStock(id){
                //初始化表头数据
                this.stockHeader = [];
                //打开库存弹窗窗口，并修改加载状态
                this.dialogVisible = true;
                this.dialogLoading = true;
                //向服务器发送请求
                this.$ajax.post("merchantGoods/merchant_goods_by_id",{
                    id: id
                }).then((res) => {
                    //处理服务器响应
                    this.dialogLoading = false;
                    this.goodsNo = res.goodsNo;
                    this.goodsId = id;
                    this.stockList = res.merchantGoodsTypePropertyList;
                    res.map.map((item) => {
                        //插入表头数据
                        this.stockHeader.push(item.name);
                    })
                })
            },
            /**
             * 更新商品库存
             */
            updateStock(){
                //条件判断
                for (let i = 0; i < this.stockList.length; i++){
                    if (!this.stockList[i].goodsSalePrice || !this.stockList[i].goodsStock || !this.stockList[i].stockWarning){
                        this.$msgWar("请完整填写信息");
                        return
                    }
                }
                this.$ajax.post("merchantGoods/merchant_goods_update_sku",{
                    merchantGoodsTypePropertyList: this.stockList,
                    id: this.goodsId
                }).then((res) => {
                    this.$msgSuc("操作成功");
                    this.dialogVisible = false;
                },(err) => {
                    this.$msgErr(err.msg);
                })
            },
            /**
             * 下架商品
             * @param id
             * @param status \ 0 : 1
             */
            outGoods(id,status){
                //判断是否已上架
                if (status === 0){
                    //未上架
                    this.$ajax.post('merchantGoods/merchant_goods_put',{
                        id: id
                    }).then(() => {
                        this.$msgSuc('上架成功');
                        this.getList();
                    },(err) => {
                        this.$msgErr(err.msg);
                    })
                } else {
                    //已上架
                    this.$ajax.post('merchantGoods/merchant_goods_pull',{
                        id: id
                    }).then(() => {
                        this.$msgSuc('下架成功');
                        this.getList();
                    },(err) => {
                        this.$msgErr(err.msg);
                    })
                }
            },
            /**
             * 删除商品
             * @param id
             */
            remove(id){
                this.$confirm("确认删除商品？").then(() => {
                    this.$ajax.post("merchantGoods/delete_batch",id).then(() =>{
                        this.$msgSuc("删除成功");
                        this.getList();
                    },(err) => {
                        this.$msgErr(err.msg);
                    })
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";
    .content{
        padding: 10px 20px;
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
            .search{
                margin-left: 20px;
            }
        }
        .search-input{
            width: 200px;
            margin: 0 15px;
        }
        .box-title{
            padding-right: 20px;
        }
        .mall-table{
            border-left: $border;
            border-top:  $border;
        }
    }
</style>