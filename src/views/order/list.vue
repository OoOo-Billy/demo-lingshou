<template>
    <div>
        <subTitle :subTitle="'订单列表'"/>
        <div class="body2">
            <!--头部信息-->
            <div class="table-nav">
                <button class="mall-btn" :class="isactive === '' ? 'active' : ''" @click="onSubmit('')">全部订单(<em
                        class="grid-content bg-purple">{{ orderData.allOrder}}</em>)
                </button>
                <button class="mall-btn" :class="isactive === 1 ? 'active' : ''" @click="onSubmit(1)">待付款(<em
                        class="grid-content bg-purple">{{ orderData.dfk}}</em>)
                </button>
                <button class="mall-btn" :class="isactive === 2 ? 'active' : ''" @click="onSubmit(2)">待发货(<em
                        class="grid-content bg-purple">{{ orderData.dfh}}</em>)
                </button>
                <button class="mall-btn" :class="isactive === 3 ? 'active' : ''" @click="onSubmit(3)">已发货(<em
                        class="grid-content bg-purple">{{ orderData.dsh}}</em>)
                </button>
                <button class="mall-btn" :class="isactive === 5 ? 'active' : ''" @click="onSubmit(5)">已完成(<em
                        class="grid-content bg-purple">{{ orderData.ywc}}</em>)
                </button>
                <button class="mall-btn" :class="isactive === 0 ? 'active' : ''" @click="onSubmit(0)">已关闭(<em
                        class="grid-content bg-purple">{{ orderData.ygb}}</em>)
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
                    <el-input class="search-input" v-model="receiver" placeholder="请输入用户账号" @clear="search"
                              @keyup.enter.native="search" clearable>
                    </el-input>
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
            <el-table id="wb" class="mall-table" :data="tableData" v-loading="loading" ref="table"
                      @selection-change="tableSelection" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column type="selection" :selectable="disableSelect" width="55"></el-table-column>
                <el-table-column label="订单编号" prop="code"></el-table-column>
                <el-table-column label="提交时间" prop="creatTime"></el-table-column>
                <el-table-column label="用户账号" prop="mobilePhone"></el-table-column>
                <el-table-column label="订单金额" prop="totalMoeny"></el-table-column>
                <el-table-column label="支付方式">
                    <template slot-scope="scope">微信小程序支付</template>
                </el-table-column>
                <el-table-column label="订单来源">
                    <template slot-scope="scope">微信小程序</template>
                </el-table-column>
                <el-table-column label="订单状态" prop="statuse"></el-table-column>
                <el-table-column label="操作订单">
                    <template slot-scope="scope">
                        <span class="table-btn"
                              @click="$router.push('/order/list/orderDetail?id=' + scope.row.id + '&mobilePhone=' + scope.row.mobilePhone)">查看订单</span>
                        <span class="table-btn" v-if="scope.row.status === 2"
                              @click="deliver(scope.row.id)">订单发货</span>
                        <span class="table-btn" v-if="scope.row.status === 4 || scope.row.status === 5"
                              @click="delivered(scope.row.id)">订单追踪</span>
                        <span class="table-btn" v-if="scope.row.status === 0"
                              @click="remove([scope.row.id])">删除订单</span>
                        <span class="table-btn" v-if="scope.row.status === 1"
                              @click="closeItem([scope.row.id])">关闭订单</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :total="total" :pageSize="pageSize" :isClear="true" ref="pagination" :optionsList="optionsList"
                        @batchChange="batchChange"
                        @confirmBatch="confirmBatch" @next="next" @handleChangeAll="handleChangeAll"></pagination>

            <!--订单发货弹窗-->
            <el-dialog
                    title="订单发货"
                    :visible.sync="dialogVisible"
                    :append-to-body="true">
                <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm" class="form">
                    <el-form-item label="快递公司：" prop="sendCompany">
                        <el-input v-model="ruleForm.sendCompany"></el-input>
                    </el-form-item>
                    <el-form-item label="快递单号：" prop="sendCode">
                        <el-input v-model="ruleForm.sendCode"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="send()">确 定</el-button>
        </span>
            </el-dialog>

            <!--快递跟踪弹窗-->
            <el-dialog
                    title="快递追踪"
                    :visible.sync="dialogVisibled"
                    :append-to-body="true">
                <el-form :model="ruleForm1" label-width="100px" class="form">
                    <el-form-item label="快递公司：">
                        <el-input readonly v-model="ruleForm1.company"></el-input>
                    </el-form-item>
                    <el-form-item label="快递单号：">
                        <el-input readonly v-model="ruleForm1.code"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisibled = false">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    import mixin from "@/utils/mixin"
    import pagination from "@/components/pagination"
    import XLSX from 'xlsx'
    import FileSaver from 'file-saver'

    export default {
        name: "list",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                merchantId: '',
                isactive: '',
                dialogVisible: false,
                dialogVisibled: false,
                orderData: {
                    allOrder: '115',//全部订单
                    dfk: '5',//待付款
                    dfh: '7',//代发货
                    dsh: '15',//已发货
                    ywc: '86',//已完成
                    ygb: '2',//已关闭
                },
                tableData: [
                    {
                        id: '10061',
                        code: '78ab52147pokf1254d42',
                        creatTime: '2019-1-31',
                        mobilePhone: '18888888888',
                        totalMoeny: '5000',
                        status: 0,
                        statuse: '已关闭',
                    },
                    {
                        id: '10062',
                        code: '78adag7521addg125df42',
                        creatTime: '2019-1-31',
                        mobilePhone: '18888888888',
                        totalMoeny: '5000',
                        status: 1,
                        statuse: '待付款',
                    },
                    {
                        id: '10063',
                        code: 'dsadsga41316dsa96hgah',
                        creatTime: '2019-1-31',
                        mobilePhone: '18888888888',
                        totalMoeny: '5000',
                        status: 2,
                        statuse: '代发货',
                    },
                    {
                        id: '10064',
                        code: 'do3892ngagaiadsgo322',
                        creatTime: '2019-1-31',
                        mobilePhone: '18888888888',
                        totalMoeny: '5000',
                        status: 3,
                        statuse: '已发货',
                    },
                    {
                        id: '10065',
                        code: 'dagao3u29yutogjha8932',
                        creatTime: '2019-1-31',
                        mobilePhone: '18888888888',
                        totalMoeny: '5000',
                        status: 4,
                        statuse: '已收货',
                    },
                    {
                        id: '10066',
                        code: '1tsdag94924sada9827',
                        creatTime: '2019-1-31',
                        mobilePhone: '18888888888',
                        totalMoeny: '5000',
                        status: 5,
                        statuse: '已评价',
                    },
                    {
                        id: '10067',
                        code: '15t972hgasih9bay4',
                        creatTime: '2019-1-31',
                        mobilePhone: '18888888888',
                        totalMoeny: '5000',
                        status: 6,
                        statuse: '已完成',
                    },
                    {
                        id: '10068',
                        code: 'vas0u2399298hsabihb',
                        creatTime: '2019-1-31',
                        mobilePhone: '18888888888',
                        totalMoeny: '5000',
                        status: 20,
                        statuse: '已删除',
                    },
                ],

                //搜索栏数据
                searchcode: '',
                receiver: '',

                optionsList: {
                    'close': '关闭订单',
                    'delete': '删除订单'
                },

                ruleForm: {
                    id: '',
                    sendCompany: '',
                    sendCode: '',
                },
                ruleForm1: {
                    company: '顺丰快递',
                    code: '8752x4gaeagzavv844da3g6',
                },
                rules: {
                    sendCompany: [
                        {required: true, message: '请填写快递公司', trigger: 'blur'}
                    ],
                    sendCode: [
                        {required: true, message: '请填写快递单号', trigger: 'blur'}
                    ],
                },
                checkItemId: [],
                statusList: {
                    '0': '已关闭',
                    '1': '待付款',
                    '2': '待发货',
                    '3': '已发货',
                    '4': '已收货',
                    '5': '已评价',
                    '6': '已完成',
                    '20': '已删除',
                },

                batchVal: '',
            }
        },
        /*created(){
            this.merchantId = JSON.parse(this.$store.getters.userInfo).merchantId;
            this.getList(1,this.status);
        },*/
        methods: {
            /**
             * 获取列表数据
             */
            getList() {
                this.loading = true;
                this.$ajax.post("merchant_order/getOrderAllCount", {
                    merchantId: this.merchantId
                }).then((res) => {
                    this.orderData = res;
                    this.$ajax.post("merchant_order/query_for_page", {
                        currentPage: this.currentPage,
                        pageSize: this.pageSize,
                        phone: this.receiver,
                        code: this.searchcode,
                        status: this.isactive,
                        merchantId: this.merchantId
                    }).then((res) => {
                        //0关闭1待付款2待发货3已发货 4已收货5已评价 6已完成 20删除
                        this.tableData = res.list.map((item) => {
                            item.statuse = this.statusList[String(item.status)];
                            return item
                        });
                        this.total = res.totalCount;
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                }, (err) => {
                    this.$msgErr(err.msg);
                }).finally(() => {
                    this.loading = false;
                });
            },

            /**
             * 头部按钮点击事件
             * @param val
             */
            onSubmit(val) {
                this.isactive = val;
                this.getList();
            },

            /**
             * 到处表格事件
             */
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
                if (this.batchVal === 'delete') {
                    if (row.status === 0) {
                        return true
                    }
                } else if (this.batchVal === 'close') {
                    if (row.status === 1) {
                        return true
                    }
                }
                return false
            },

            /**
             * 订单发货
             * @param id
             */
            deliver(id) {
                this.dialogVisible = true;
                // this.id = id;
                this.ruleForm.id = id;
            },

            /**
             * 订单追踪
             * @param id
             */
            delivered(id) {
                this.dialogVisibled = true;
                /* this.$ajax.post("merchant_order/query_By_Id",{
                     id: id,
                     merchantId: this.merchantId
                 }).then((res) => {
                     this.ruleForm1.company = res.sendCompany;
                     this.ruleForm1.code = res.sendCode;
                 },(err) => {
                     this.$msgErr(err.msg);
                 })*/
            },

            /**
             * 删除订单
             * @param {Array}ids
             */
            remove(ids) {
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("merchant_order/delete", {
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

            /**
             * 关闭订单
             * @param {Array}ids
             */
            closeItem(ids) {
                this.$confirm("确认关闭订单吗?").then(() => {
                    this.$ajax.post("/merchant_order/close", {
                        ids: ids
                    }).then(() => {
                        this.$msgSuc('关闭成功');
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                },() => {
                    // console.log("取消关闭订单");
                })
            },

            /**
             *
             *
             */
            batchChange(val) {
                if ('delete' === val) {
                    this.isactive = 0;
                    this.onSubmit(0);
                } else if ('close' === val) {
                    this.isactive = 1;
                    this.onSubmit(1);
                } else {
                    this.isactive = '';
                    this.onSubmit('');
                }
                this.batchVal = val;
            },

            /**
             * 订单发货确定按钮事件
             */
            send() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid){
                        let formData = {...this.ruleForm,...{status: 3}};
                        this.$ajax.post("/merchant_order/update",formData).then(() => {
                            this.$msgSuc("发货成功");
                            this.getList();
                            this.ruleForm.id = '';
                            this.ruleForm.sendCompany = '';
                            this.ruleForm.sendCode = '';
                            this.dialogVisible = false;
                        },(err) => {
                            this.$msgErr(err.msg);
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .table-nav{
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
    .form {
        width: 400px;
    }
    .dialog-footer {
        button:last-child {
            margin-right: 0;
        }
    }
</style>