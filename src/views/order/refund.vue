<template>
    <div>
        <subTitle :subTitle="'退款申请'"/>
        <div class="body2">
            <!--头部信息-->
            <div class="table-nav">
                <button class="mall-btn" :class="isactive === '' ? 'active' : ''" @click="onSubmit('')">全部申请(<em
                        class="grid-content bg-purple">{{ refundData.all }}</em>)
                </button>
                <button class="mall-btn" :class="isactive === 2 ? 'active' : ''" @click="onSubmit(2)">待处理(<em
                        class="grid-content bg-purple">{{ refundData.all_wei }}</em>)
                </button>
                <button class="mall-btn" :class="isactive === 4 ? 'active' : ''" @click="onSubmit(4)">已处理(<em
                        class="grid-content bg-purple">{{ refundData.all_return }}</em>)
                </button>
                <button class="mall-btn" :class="isactive === 5 ? 'active' : ''" @click="onSubmit(5)">已拒绝(<em
                        class="grid-content bg-purple">{{ refundData.all_refuse }}</em>)
                </button>
            </div>

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
                    <span class="font-14 gray">订单编号:</span>
                    <el-input class="search-input" v-model="searchcode" @clear="search" @keyup.enter.native="search"
                              placeholder="请输入订单编号" clearable></el-input>
                    <span class="font-14 gray">用户账号:</span>
                    <el-input class="search-input" v-model="receiver" placeholder="用户账号" @clear="search"
                              @keyup.enter.native="search" clearable>
                    </el-input>
                    <span class="font-14 gray">提价时间:</span>
                    <el-date-picker
                            v-model="creatTime"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            formatas="yyyy-MM-dd"
                            value-format="yyyy-MM-dd hh:mm:ss"
                            class="search-input"
                            :picker-option="pickerOptions" @change="search">
                    </el-date-picker>
                </div>
            </div>

            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">订单列表</span>
                <div class="flex h-center">
                    <el-button @click="exportExcel()">导出订单</el-button>
                </div>
            </div>

            <!--数据区域-->
            <el-table id="wb" class="mall-table" :data="tableData" v-loading="loading"
                      @selection-change="tableSelection" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle" ref="table">
                <el-table-column type="selection" :selectable="disableSelect" width="55"></el-table-column>
                <el-table-column label="服务单号" prop="code"></el-table-column>
                <el-table-column label="申请时间" prop="creatTime"></el-table-column>
                <el-table-column label="用户账号" prop="mobilePhone"></el-table-column>
                <el-table-column label="退款金额" prop="applicationReturnMoney"></el-table-column>
                <el-table-column label="联系人" prop="contact"></el-table-column>
                <el-table-column label="申请状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1">退货待处理</span>
                        <span v-else-if="scope.row.status === 2">待处理</span>
                        <span v-else-if="scope.row.status === 3">拒绝退货</span>
                        <span v-else-if="scope.row.status === 4">收到货确认退款</span>
                        <span v-else-if="scope.row.status === 5">收到货拒绝退款</span>
                        <span v-else>完成</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" v-if="scope.row.status === 2"
                              @click="$router.push('/order/refund/refundDetail?id=' + scope.row.id)">查看详情</span>
                        <span class="table-btn" v-else-if="scope.row.status === 5"
                              @click="remove([scope.row.id])">删除</span>
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
    import mixin from "@/utils/mixin"
    import pagination from "@/components/pagination"
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'

    export default {
        name: "refund",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                merchantId: '',
                isactive: '',
                refundData: {
                    all: '',
                    all_wei: '',
                    all_return: '',
                    all_refuse: '',
                },

                //搜索数据
                searchcode: '',
                receiver: '',
                creatTime: '',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [
                        {
                            text: '今天',
                            onClick(picker) {
                                picker.$emit('pick', new Date());
                            }
                        },
                        {
                            text: '昨天',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                            }
                        },
                        {
                            text: '一周前',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', date);
                            }
                        }
                    ]
                },

                tableData: [],

                checkItemId: [],
                optionsList: {
                    'delete': '删除'
                }
            }
        },
        created(){
            this.merchantId = JSON.parse(localStorage.userInfo).merchantId;
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                this.getAllCount();
                this.$ajax.post("merchant_return_goods/query_for_page", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    phone: this.receiver,
                    code: this.searchcode,
                    status: this.isactive,
                    creatTime: this.creatTime,
                    merchantId: this.merchantId
                }).then((res) => {
                    this.tableData = res.list;
                    this.total = res.totalCount;
                }, (err) => {
                    this.$msgErr(err.msg);
                }).finally(() => {
                    this.loading = false;
                })
            },

            /**
             * 头部按钮点击事件
             * @param val
             */
            onSubmit(val) {
                this.isactive = val;
                this.getList();
            },

            exportExcel() {
                //1.获取数据
                let date = new Date().getTime();
                let wb = XLSX.utils.table_to_book(document.querySelector('#wb'));
                //2.转换数据
                let wbout = XLSX.write(wb, {
                    bookType: 'xlsx',
                    bookSST: true,
                    type: 'array'
                });
                // 3.保存数据：FileSaver.saveAs(file,fileName);
                try {
                    FileSaver.saveAs(new Blob([wbout], {
                        type: 'application/octet-stream'
                    }), date + '.xlsx')
                } catch (e) {
                    console.log(e, wbout)
                }
                return wbout
            },

            /**
             * 表格selection是否可选
             * @param {Object}row
             * @returns {boolean}
             */
            disableSelect(row) {
                return row.status === 5
            },

            /**
             * 删除订单
             * @param {Array}ids
             */
            remove(ids) {
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("merchant_return_goods/delete", {
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

            getAllCount() {
                this.getStatusCount('', 'all');
                this.getStatusCount(2, 'all_wei');
                this.getStatusCount(4, 'all_return');
                this.getStatusCount(5, 'all_refuse');
            },
            getStatusCount(status, keyName) {
                this.$ajax.post("merchant_return_goods/getCountByStatus", {
                    status: status,
                    merchantId: this.merchantId
                }).then((res) => {
                    this.refundData[keyName] = res;
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .table-nav {
        padding: 10px 20px;
        margin-bottom: 20px;
        border: $border;
    }

    .mall-btn.active em {
        color: #fff;
    }

    em {
        font-style: normal;
        color: red;
        margin: 0 2px;
    }

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