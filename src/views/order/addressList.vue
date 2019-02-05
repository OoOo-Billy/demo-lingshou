<template>
    <div>
        <subTitle :subTitle="'发货点信息管理'"/>
        <div class="body2">
            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button @click="$router.push('address/addAddress')">添加发货点</el-button>
                </div>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading" ref="table"
                      @selection-change="tableSelection" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="发货点名称" prop="returnPname"></el-table-column>
                <el-table-column label="发货人姓名" prop="returnName"></el-table-column>
                <el-table-column label="地址" prop="returnAddress"></el-table-column>
                <el-table-column label="联系电话" prop="returnPhone"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="$router.push('address/addAddress?id=' + scope.row.id)">编辑</span>
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
    import subTitle from "@/components/subTitle"
    import pagination from "@/components/pagination"
    import mixin from "@/utils/mixin"

    export default {
        name: "addressList",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                tableData: [
                    {
                        id: '66234',
                        returnPname: '123',
                        returnName: '333',
                        returnAddress: '321',
                        returnPhone: '13887888654',
                    },
                ],
                checkItemId: [],
                optionsList: {
                    'delete': '删除'
                },
            }
        },
        /*mounted(){
            this.getList();
        },*/
        methods: {
            getList() {
                this.loading = true;
                this.$ajax.post("return_send/query_for_page", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
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
             * 删除
             * @param {Array}ids
             */
            remove(ids) {
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("return_send/delete", {
                        ids: ids
                    }).then(() => {
                        this.$msgSuc("删除成功");
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                }, () => {
                    // console.log("取消删除");
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

</style>