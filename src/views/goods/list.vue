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
                        <span><i class="el-icon-search"></i>筛选查询</span>
                    </div>
                    <div>
                        <span><i class="el-icon-arrow-down"></i>打开筛选</span>
                        <span><i class="el-icon-arrow-up"></i>收起筛选</span>
                        <el-button>查询结果</el-button>
                    </div>
                </div>
                <div class="filter-down">
                    <span>输入搜索:</span>
                    <el-input></el-input>
                    <span>选择分类:</span>
                    <el-select>
                        <el-option>1</el-option>
                    </el-select>
                    <span>选择品牌:</span>
                    <el-select>
                        <el-option>2</el-option>
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
            <el-table class="mall-table" :data="goodsList">
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
                        <img src="@/assets/icon-edit.png" alt="" @click="">
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
            <div></div>
        </div>
    </div>
</template>

<script>
    import subTitle from '../../components/subTitle'
    import pagination from '../../components/pagination'

    export default {
        name: "list",
        components: {
            subTitle,
            pagination,
        },
        data() {
            return {
                goodsList: [
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
                ]
            }
        }
    }
</script>

<style scoped lang="scss">


</style>