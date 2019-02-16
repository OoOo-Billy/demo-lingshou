<template>
    <div>
        <subTitle :subTitle="'属性列表'"/>
        <div class="body">
            <!--表格头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button @click="back">返回</el-button>
                    <el-button @click="$router.push('/goods/type/addProp')">添加属性</el-button>
                </div>
            </div>

            <!--表格区域-->
            <el-table ref="table" class="mall-table" v-loading="loading" @selection-change="tableSelection" :data="tableData" :header-cell-style="headerStyle" :cell-style="tdStyle">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="编号" width="80" prop="id"></el-table-column>
                <el-table-column label="属性名称" prop="propertyName"></el-table-column>
                <el-table-column label="商品类型" width="120" prop="styleName"></el-table-column>
                <el-table-column label="属性是否可选" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.propertySelect | getPropSelect }}
                    </template>
                </el-table-column>
                <el-table-column label="可选值列表">
                    <template slot-scope="scope">
                        {{ scope.row.propertyList }}
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="120" prop="propertyOrder"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="$router.push('/goods/type/addProp?id=' + scope.row.id)">编辑</span>
                        <span class="table-btn" @click="remove([scope.row.id])">删除</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination @confirmBatch="confirmBatch" @handleChangeAll="handleChangeAll" @next="next" :optionsList="optionsList" :total="total" :pageSize="pageSize" ref="pagination"/>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    import pagination from '@/components/pagination'
    import mixin from '@/utils/mixin'
    import filters from '@/utils/filters'
    export default {
        name: "prop",
        mixins: [mixin],
        filters: filters,
        components:{
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
            this.getList("merchantGoodsProperty/merchant_goods_property_list_page",{
                styleId: this.$route.params.id
            })
        },
        methods: {
            /**
             * 删除属性
             * @param {Array}id
             */
            remove(id){
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("merchantGoodsProperty/delete_batch",id).then(() => {
                        this.getList("merchantGoodsProperty/merchant_goods_property_list_page",{
                            styleId: this.$route.params.id
                        });
                        this.$msgSuc("删除成功");
                    },(err) => {
                        this.$msgErr(err.msg);
                    })
                },() => {
                    // console.log("取消了删除");
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";
</style>