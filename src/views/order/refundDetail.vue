<template>
    <div>
        <subTitle :subTitle="'服务单详情'" :isBack="true"/>
        <div class="body">
            <!---->
            <table class="table-middle">
                <tbody>
                <tr>
                    <td>服务单号</td>
                    <td>{{tableData.code}}</td>
                </tr>
                <tr>
                    <td>申请状态</td>
                    <td>否</td>
                </tr>
                <tr>
                    <td>订单编号</td>
                    <td>{{tableData.orderCode}}</td>
                </tr>
                <tr>
                    <td>申请时间</td>
                    <td>{{tableData.resloveTime}}</td>
                </tr>
                <tr>
                    <td>用户账号</td>
                    <td>{{tableData.mobilePhone}}</td>
                </tr>
                </tbody>
            </table>

            <table class="table-middle">
                <tbody>
                <tr>
                    <td>订单金额</td>
                    <td>{{tableData.returnMoney}}</td>
                </tr>
                <tr>
                    <td>确认退款金额</td>
                    <td>{{tableData.returnMoney}}</td>
                </tr>
                <tr>
                    <td>退款方式</td>
                    <td>退回到原支付渠道</td>
                </tr>
                <tr>
                    <td>退款类型</td>
                    <td>{{tableData.returnReason}}</td>
                </tr>
                </tbody>
            </table>

            <table class="table-middle">
                <tr>
                    <td>处理备注</td>
                    <td>
                        <span><el-input v-model="resolveRemark"></el-input> </span>
                    </td>
                </tr>
            </table>

            <div class="btn">
                <el-button class="sure" @click="sure(tableData.id)">确定退款</el-button>
                <el-button class="cancel" @click="cancel(tableData.id)">拒绝退款</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import mixin from "@/utils/mixin"

    export default {
        name: "returnGoodsDetail",
        mixins: [mixin],
        components: {
            subTitle
        },
        data() {
            return {
                merchantId: '',
                tableData: {
                    id: '111111',
                    code: 'abc12173',
                    orderCode: 'a111213141241414',
                    resloveTime: '2001-1-1',
                    mobilePhone: '13888288868',
                    returnMoney: 255,
                    returnReason: '',
                },//退货订单信息

                resolveRemark: '',
            }
        },
       /* created() {
            this.merchantId = JSON.parse(this.$store.getters.userInfo).merchantId;
            this.$ajax.post("merchant_return_goods/query_By_Id", {
                id: this.$route.query.id,
                merchantId: this.merchantId
            }).then((res) => {
                this.tableData = res;
            }, (err) => {
                this.$msgErr(err.msg);
            })
        },*/
        methods: {
            sure(id) {
                this.$ajax.post("merchant/return_money", {
                    id: id,
                    merchantId: this.merchantId,
                    resolveRemark: this.resolveRemark,
                }).then(() => {
                    this.$msgSuc('确定退钱操作成功');
                    this.$router.push('/order/refund');
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },
            cancel(id) {
                this.$ajax.post("merchant_return_goods/update", {
                    id: id,
                    status: 5,
                    resolveRemark: this.resolveRemark,
                }).then(() => {
                    this.$msgSuc('拒绝退钱操作成功');
                    this.$router.push('/order/refund');
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .body {
        width: 80%;
        min-width: 800px;
        margin: 0 auto;
        text-align: center;

        .table-middle {
            width: 100%;
            margin: 0 auto 30px;
            border-right: 1px solid #b4b4b4;
            border-bottom: 1px solid #b4b4b4;

            tr {
                height: 50px;
                font-size: 14px;
                background-color: #fff;
            }

            td {
                padding: 0 20px;
                text-align: left;
                border-left: 1px solid #b4b4b4;
                border-top: 1px solid #b4b4b4;
                color: #5a5a5a;

                &:first-child {
                    width: 100px;
                    background-color: #F9FAFC;
                }
            }
        }

        .btn {
            .el-button {
                color: #fff;
            }

            .sure {
                background: rgba(26, 188, 156, 1);
            }

            .cancel {
                background: rgba(240, 72, 68, 1)
            }
        }
    }
</style>