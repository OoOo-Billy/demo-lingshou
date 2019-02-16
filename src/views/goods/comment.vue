<template>
    <div>
        <subTitle :subTitle="'商品评价'"/>
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
                    <span class="font-14 gray">用户昵称:</span>
                    <el-input class="search-input" v-model="userName" placeholder="输入用户昵称" @clear="search" @keyup.enter.native="search" clearable></el-input>
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
                <el-table-column label="用户昵称" prop="userName"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName"></el-table-column>
                <el-table-column label="商品评价" width="140">
                    <template slot-scope="scope">
                        <img v-for="num in scope.row.commentLevel" src="@/assets/starOn.png" class="icon-star">
                        <img v-for="num in scope.row.commentLevel1" src="@/assets/starOff.png" class="icon-star">
                    </template>
                </el-table-column>
                <el-table-column label="IP地址" prop="commentIp"></el-table-column>
                <el-table-column label="评论时间" prop="createTime" width="180"></el-table-column>
                <el-table-column label="是否显示" width="120">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="handleStatus($event, scope.row.id)" :active-value="0" :inactive-value="2" active-color="#5BC0BF" inactive-color="#dedede"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="$router.push('/goods/comment/detail?id=' + scope.row.id)">查看</span>
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
    import mixin from '../../utils/mixin'

    export default {
        name: "comment",
        components:{
            subTitle,
            pagination
        },
        mixins: [mixin],
        data(){
            return {
                //表格数据
                tableData: [],
                checkItemId: [],

                //分页组件数据
                optionsList: {
                    'delete': '删除'
                },

                //筛选栏数据
                goodsName: '',
                userName: '',

            }
        },
        mounted(){
            this.getList();
        },
        methods:{
            /**
             * 获取表格数据
             */
            getList(){
                this.loading = true;
                this.$ajax.post("/merchantGoodsComment/merchant_goods_type_list_page",{
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    goodsName: this.goodsName,
                    userName: this.userName,
                }).then((res) => {
                    this.total = res.totalCount;
                    for (let i = 0;i < res.list.length; i++){
                        res.list[i].commentLevel1 = 5 - res.list[i].commentLevel;
                    }
                    this.tableData = res.list;
                }).finally(() => {
                    this.loading = false;
                })
            },

            /**
             * 表格中处理是否显示按钮
             * @param $event
             * @param id
             */
            handleStatus($event,id){
                this.$ajax.post("/merchantGoodsComment/delete_not_show",{
                    id: id,
                    status: $event
                }).then(() => {
                    this.$msgSuc("操作成功");
                },(err) => {
                    this.$msgErr(err.msg);
                })
            },

            /**
             * 删除商品评价
             * @param {Array}id
             */
            remove(id){
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("/merchantGoodsComment/delete_batch",id).then(() => {
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
    .filter-wrap{
        border: $border;
        margin-bottom: 24px;
        >div{
            padding: 0 22px;
            height: 56px;
            &:last-child{
                background-color: $bgColor;
            }
        }
        .search{
            margin-left: 20px;
        }
        .search-input{
            width: 200px;
            margin: 0 15px;
        }
    }
    .icon-star{
        display: inline !important;
    }
</style>