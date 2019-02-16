<template>
    <div>
        <subTitle :subTitle="'订单管理'"/>
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
                        <el-button class="search" @click="back" v-if="groupManageId">返回</el-button>
                        <el-button class="search" @click="search">查询结果</el-button>
                    </div>
                </div>
                <div class="flex h-center" v-show="visibleSearch">
                    <span class="font-14 gray">商品名称:</span>
                    <el-input class="search-input" v-model="goodName" @clear="search" @keyup.enter.native="search"
                              placeholder="请输入商品名称" clearable></el-input>
                    <span class="font-14 gray">订单编号:</span>
                    <el-input class="search-input" v-model="code" placeholder="请输入订单编号" @change="search"
                              clearable></el-input>
                    <span class="font-14 gray">订单状态:</span>
                    <el-select v-model="status" @change="search" placeholder="请选择订单状态" clearable class="search-input">
                        <el-option :label="item" :value="index"
                                   v-for="(item,index) in promotionOrderStatus"></el-option>
                    </el-select>
                    <span class="font-14 gray">拼团状态:</span>
                    <el-select v-model="groupStatus" @change="search" placeholder="请选择拼团状态" clearable
                               class="search-input">
                        <el-option :label="item" :value="index" v-for="(item,index) in promotionStatus"></el-option>
                    </el-select>
                </div>
            </div>

            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading" max-height="800"
                      :header-cell-style="headerStyle" :cell-style="tdStyle">
                <el-table-column label="订单编号" prop="code"></el-table-column>
                <el-table-column label="拼团编号" prop="groupManageId"></el-table-column>
                <el-table-column label="商品名称">
                    <template slot-scope="scope">
                        {{ scope.row.details[0].goodsName }}
                    </template>
                </el-table-column>
                <el-table-column label="拼团状态">
                    <template slot-scope="scope">
                        {{ scope.row.groupStatus | getPromotionStatus }}
                    </template>
                </el-table-column>
                <el-table-column label="订单金额" prop="totalMoeny"></el-table-column>
                <el-table-column label="订单状态">
                    <template slot-scope="scope">
                        {{ scope.row.status | getPromotionOrderStatus }}
                    </template>
                </el-table-column>
                <el-table-column label="用户名" prop="mobilePhone"></el-table-column>
                <el-table-column label="收货人" prop="receiver"></el-table-column>
                <el-table-column label="收货人手机" prop="phone"></el-table-column>
                <el-table-column label="收货地址" prop="address"></el-table-column>
                <el-table-column label="支付方式">
                    <template slot-scope="scope">{{ '微信支付' }}</template>
                </el-table-column>
                <el-table-column label="下单时间" prop="creatTime"></el-table-column>
                <el-table-column label="已取消退款状态">
                    <template slot-scope="scope">
                        {{ scope.row.returnStatus === 0 ? '未退款' : '已退款' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" v-if="scope.row.status === 2"
                              @click="ruleForm.id = scope.row.id; dialogVisible = true">发货</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :isBatch="false" :total="total" :pageSize="pageSize" ref="pagination" @next="next"></pagination>

            <!--日记弹窗-->
            <el-dialog
                    title="拼团发货"
                    :append-to-body="true"
                    :visible.sync="dialogVisible">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                    <el-form-item label="快递公司" prop="sendCompany">
                        <el-input v-model="ruleForm.sendCompany"></el-input>
                    </el-form-item>
                    <el-form-item label="快递单号" prop="sendCode">
                        <el-input v-model="ruleForm.sendCode"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button @click="sendGoods" type="primary">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import pagination from "@/components/pagination"
    import mixin from "@/utils/mixin"
    import filters from "@/utils/filters"

    export default {
        name: "groupOrder",
        mixins: [mixin],
        filters: filters,
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                groupManageId: '',
                merchantId: '',

                //搜索栏数据
                goodName: '',
                code: '',
                status: '',
                groupStatus: '',
                promotionOrderStatus: '',
                promotionStatus: '',

                tableData: [],

                dialogVisible: false,

                ruleForm: {
                    id: '',
                    sendCompany: '',
                    sendCode: '',
                },
                rules: {
                    sendCompany: [],
                    sendCode: [],
                }
            }
        },
        mounted() {
            if (this.$route.query.id) {
                this.groupManageId = this.$route.query.id;
            }
            this.merchantId = JSON.parse(localStorage.getItem('userInfo')).merchantId;
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                this.$ajax.post("merchant_order/groupOrderList", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    goodName: this.goodName,
                    code: this.code,
                    groupStatus: this.groupStatus,
                    status: this.status,
                    groupManageId: this.groupManageId,
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

            sendGoods() {
                let formData = {...this.ruleForm, ...{merchantId: this.merchantId, status: 3,}};
                this.refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        this.$ajax.post("merchant_order/update", formData).then(() => {
                            this.$msgSuc("发货成功");
                            this.dialogVisible = false;
                            this.ruleForm = {
                                id: '',
                                sendCompany: '',
                                sendCode: '',
                            };
                        }, (err) => {
                            this.$msgErr(err.mag);
                        })
                    } else {
                        return false
                    }
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
            width: 150px;
            margin: 0 15px;
        }
    }
</style>