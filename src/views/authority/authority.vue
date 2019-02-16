<template>
    <div>
        <subTitle :subTitle="'操作日志'"/>
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
                    <span class="font-14 gray">操作日期：</span>
                    <el-date-picker
                            v-model="datePicker"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            @change="getList"
                            value-format="yyyy-MM-dd hh:mm:ss"
                            clearable
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
            </div>

            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData"  max-height="800" :header-cell-style="headerStyle" :cell-style="tdStyle">
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="操作者" prop="operator"></el-table-column>
                <el-table-column label="操作日期" prop="operationDate"></el-table-column>
                <el-table-column label="IP地址" prop="ip"></el-table-column>
                <el-table-column label="操作记录" prop="operationRecord"></el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :isBatch="false" :total="total" @next="next"></pagination>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import mixin from "@/utils/mixin"
    import pagination from "@/components/pagination"
    export default {
        name: "authority",
        mixins: [mixin],
        components: {
            subTitle,
            pagination,
        },
        data() {
            return {
                datePicker: '',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                tableData: [],
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                this.$ajax.post("user_operation_log/query_user_operation_log", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    operationDate: this.datePicker,
                    merchantId: JSON.parse(localStorage.userInfo).merchantId
                }).then((res) => {
                    this.tableData = res.list;
                    this.total = res.totalCount;
                }, (err) => {
                    this.$msgErr(err.msg);
                }).finally(() => {
                    this.loading = false;
                })
            },
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