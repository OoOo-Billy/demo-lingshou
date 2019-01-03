<template>
    <div class="pagination-wrap flex h-center between">
        <div>
            <div class="batch-wrap flex h-center" v-if="isBatch">
                <el-checkbox v-model="checkAll" @change="handleChangeAll">全选</el-checkbox>
                <el-select @change="batchChange" :clearable="isClear" v-model="checkBatch" placeholder="批量操作" size="mini" class="select">
                    <el-option :value="index" :label="item" v-for="(item, index) in optionsList" :key="index"></el-option>
                </el-select>
                <el-button size="mini" @click="confirmBatch">确定</el-button>
            </div>
        </div>
        <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :total="total"
                :page-size="pageSize"
                background
                layout="total, prev, pager, next, jumper">
        </el-pagination>
        <!--element-ui 里的分页组件-->
    </div>
</template>

<script>
    export default {
        name: "pagination",
        props: {
            isBatch: {
                type: Boolean,
                default: true
            },
            isClear: {
                type: Boolean,
                default: false
            },
            total: Number,
            pageCount: Number,
            pageSize: Number,
            optionsList: Object,
        },
        data(){
            return{
                checkAll: false,
                checkBatch: '',
                currentPage: 1,
            }
        },
        methods: {
            handleChangeAll(val){
                this.$emit('handleChangeAll', val);
            },
            handleCurrentChange($event){
                this.$emit('next', $event)
            },
            confirmBatch(){
                this.$emit('confirmBatch', this.checkBatch);
            },
            batchChange($event){
                this.$emit('batchChange', $event);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .el-pagination.is-background .el-pager li:not(.disabled).active{
        background-color: #5BC0BF !important;
    }
    .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li{
        background-color: #fff !important;
    }
    .pagination-wrap{
        padding: 0 20px;
        height: 44px;
        background-color: $bgColor;
        border: $border;
        border-top-color: transparent;
    }
    .select{
        margin: 0 20px;
        width: 150px;
    }
</style>