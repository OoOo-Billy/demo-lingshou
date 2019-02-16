<template>
    <div>
        <subTitle :subTitle="'广告列表'"/>
        <div class="body2">
            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button @click="$router.push('/operate/addAdvertising')">添加广告</el-button>
                </div>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" ref="table"
                      @selection-change="tableSelection" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="广告名称" prop="adName"></el-table-column>
                <el-table-column label="广告位置">
                    <template slot-scope="scope">
                        {{ scope.row.adPosition | getAdPosition }}
                    </template>
                </el-table-column>
                <el-table-column label="广告图片">
                    <template slot-scope="scope">
                        <img :src="getGoodImg(scope.row.adPicture)" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="上线/下线">
                    <template slot-scope="scope">
                        {{ scope.row.online === '1' ? '上线' : '下线' }}
                    </template>
                </el-table-column>
                <el-table-column label="点击次数" prop="clickNumber"></el-table-column>
                <el-table-column label="订单状态" prop="statuse"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn"
                              @click="$router.push('/operate/addAdvertising?id=' + scope.row.id)">编辑</span>
                        <span class="table-btn"
                              @click="updateTop(scope.row.id, scope.row.topState)">{{ scope.row.topState === '1' ? '取消置顶' : '置顶' }}</span>
                        <span class="table-btn" @click="remove(scope.row.id)">删除</span>
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
    import subTitle from "@/components/subTitle"
    import pagination from "@/components/pagination"
    import mixin from "@/utils/mixin"
    import filters from "@/utils/filters"
    export default {
        name: "advertising",
        mixins: [mixin],
        filters: filters,
        components: {
            subTitle,
            pagination
        },
        data(){
            return {
                tableData: [],
                checkItemId: [],
                optionsList: {
                    'delete': '删除'
                }
            }
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList(){
                this.$ajax.post("merchant_ad/get_merchant_ad_list", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                }).then((res) => {
                    this.total = res.totalCount;
                    this.tableData = res.list;
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },

            /**
             * 表格置顶事件
             * @param id
             * @param state
             */
            updateTop(id, state){
                this.$ajax.post("merchant_ad/change_merchant_ad", {
                    id: id,
                    topState: state === '1' ? '0' : '1',
                }).then(() => {
                    this.$msgSuc("操作成功");
                    this.getList();
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },

            /**
             * 删除
             * @param id
             */
            remove(id){
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("merchant_ad/delete_merchant_ad", {
                        remark: id
                    }).then(() => {
                        this.$msgSuc("删除成功");
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                },() => {
                    // console.log("取消了删除");
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";
</style>