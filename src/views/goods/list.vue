<template>
    <div class="container">
        <!--头部-->
        <subTitle :subTitle="'商品列表'"/>
        <!--body-->
        <div class="content">
            <!--筛选栏-->
            <div class="filter-wrap">
                <div class="filter-up">
                    <div>
                        <i class="el-icon-search">筛选查询</i>
                    </div>
                    <div>
                        <i class="el-icon-arrow-down" @click="showSearch" v-show="!visibleSearch">打开筛选</i>
                        <i class="el-icon-arrow-up" @click="showSearch" v-show="visibleSearch">收起筛选</i>
                        <el-button>查询结果</el-button>
                    </div>
                </div>
                <div class="filter-down" v-show="visibleSearch">
                    <span>输入搜索:</span>
                    <el-input v-model="goodsName" placeholder="商品名称/商品货号"></el-input>
                    <span>选择分类:</span>
                    <el-select v-model="typeId" placeholder="请选择商品分类">
                        <el-option v-for="item in categoryList" :label="item.typeName" :value="item.id"></el-option>
                    </el-select>
                    <span>选择品牌:</span>
                    <el-select v-model="brandId" placeholder="请选择商品品牌">
                        <el-option v-for="item in brandList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div>
            </div>
            <!--表格头部-->
            <div class="table-title">
                <span>数据列表</span>
                <div class="">
                    <el-button>添加商品</el-button>
                </div>
            </div>
            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading">
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
                        <img src="@/assets/icon-edit.png" alt="" @click="dialogVisible = true">
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
                        <span class="table-btn">{{ scope.row.status === 0 ? '上架' : '下架'}}</span>
                        <span class="table-btn">编辑</span>
                        <span class="table-btn">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination></pagination>
            <!--库存编辑弹窗-->
            <el-dialog title="编辑货品信息" :visible.sync="dialogVisible" :append-to-body="true">
                <div class="dialog-header" v-loading="">
                    <div>
                        <p>商品货号:{{goodsNo}}</p>
                    </div>
                    <table>
                        <thead>
                        <td>item</td>
                        <td>销售价格</td>
                        <td>商品库存</td>
                        <td>库存预警值</td>
                        </thead>
                        <tbody>
                        <tr>
                            <td>大衣:女</td>
                            <td>
                                <el-input type="number"></el-input>
                            </td>
                            <td>
                                <el-input type="number"></el-input>
                            </td>
                            <td>
                                <el-input type="number"></el-input>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确定</el-button>
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
                goodsNo: 'abcdefa95dag47gagd245d2',

                //搜索数据

                goodsName: '',
                typeId: '',
                brandId: '',

                //其他数据
                dialogVisible: false,
                categoryList: [{typeName: '大衣', id: 0}, {typeName: '长裙', id: 1}],
                brandList: [{name: '安踏', id: 0}, {name: '贵人鸟', id: 1}],
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
            //从服务器获取表格数据
            /*getList(){
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
            },*/
            editStock(id){

            }
        }
    }
</script>

<style scoped lang="scss">
    .filter-down {
        overflow: hidden;
        border: 1px solid #ddd;
        box-sizing: border-box;
    }
</style>