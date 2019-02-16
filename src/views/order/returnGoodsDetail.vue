<template>
    <div>
        <subTitle :subTitle="'退货详情'" :isBack="true"/>
        <div class="body2">
            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-14">退货商品</span>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <img :src="getGoodImg(scope.row.goodsPic)" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="goodsName" width="200"></el-table-column>
                <el-table-column label="价格/货号" prop="goodsPrice"></el-table-column>
                <el-table-column label="属性">
                    <template slot-scope="scope">
                        {{ scope.row.goodsSize }}-{{scope.row.goodsBrand}}-{{scope.row.goodsColor}}
                    </template>
                </el-table-column>
                <el-table-column label="数量" prop="buyNum"></el-table-column>
                <el-table-column label="小计" prop="totalMoney"></el-table-column>
            </el-table>

            <!---->
            <div class="box-title mt30 flex between h-center">
                <span class="font-14">服务单信息</span>
            </div>

            <!---->
            <table class="table-middle">
                <tbody>
                <tr>
                    <td>服务单号</td>
                    <td>{{tableData1.code}}</td>
                </tr>
                <tr>
                    <td>申请状态</td>
                    <td v-if="tableData1.status === 1">未处理</td>
                    <td v-else-if="tableData1.status === 2">同意退货</td>
                    <td v-else>拒绝退货</td>
                </tr>
                <tr>
                    <td>订单编号</td>
                    <td>{{tableData1.orderCode}}</td>
                </tr>
                <tr>
                    <td>申请时间</td>
                    <td>{{tableData1.creatTime}}</td>
                </tr>
                <tr>
                    <td>用户账号</td>
                    <td>{{tableData1.mobilePhone}}</td>
                </tr>
                <tr>
                    <td>联系人</td>
                    <td>{{tableData1.contact}}</td>
                </tr>
                <tr>
                    <td>联系电话</td>
                    <td>{{tableData1.phone}}</td>
                </tr>
                <tr>
                    <td>退货原因</td>
                    <td>{{tableData1.returnReason}}</td>
                </tr>
                <tr>
                    <td>问题描述</td>
                    <td>{{tableData1.problemDescription}}</td>
                </tr>
                <tr>
                    <td>凭证照片</td>
                    <td>
                        <span v-for="i in picArray">
                            <img :src="i"/>
                        </span>
                    </td>
                </tr>
                </tbody>
            </table>

            <table class="table-middle">
                <tbody>
                <tr>
                    <td>订单金额</td>
                    <td>{{tableData1.applicationReturnMoney}}</td>
                </tr>
                <tr>
                    <td>确认退款金额</td>
                    <td>
                        <span>
                            <el-input v-model="returnMoney" @keyup.native="returnMoneychange"></el-input>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>选择收货点</td>
                    <td>
                        <el-select v-model="typeId" @change='search' placeholder="请选择收货点">
                            <el-option v-for="item in returnSend" :label="item.returnPname"
                                       :value="item.id"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td>收货人姓名</td>
                    <td>{{returnAdress.returnName || ''}}</td>
                </tr>
                <tr>
                    <td>详细地址</td>
                    <td>{{returnAdress.returnAddress || ''}}</td>
                </tr>
                <tr>
                    <td>联系电话</td>
                    <td>{{returnAdress.returnPhone || ''}}</td>
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
                <el-button class="sure" @click="sure(tableData1.id)">确定退货</el-button>
                <el-button class="cancel" @click="cancel(tableData1.id)">拒绝退货</el-button>
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
                tableData: [],//退货商品信息
                tableData1: {
                    id: '',
                    code: '',
                    status: 1,
                    orderCode: '',
                    creatTime: '',
                    mobilePhone: '',
                    contact: '',
                    phone: '',
                    returnReason: '',
                    problemDescription: '',
                    applicationReturnMoney: '',
                    problemPhoto: '',
                },//退货订单信息
                picArray: [
                    require('@/assets/image.png'),
                    require('@/assets/image.png')
                ],
                returnSend: {
                    id: '',
                    returnPname: '',
                },//退货地址列表

                //退货信息
                returnMoney: '',
                returnOriginal: 100000000,
                typeId: '',
                returnAdress: {
                    returnName: '',
                    returnAddress: '',
                    returnPhone: '',
                },
                resolveRemark: '',
            }
        },
        created() {
            this.merchantId = JSON.parse(this.$store.getters.userInfo).merchantId;
            this.$ajax.post("merchant_return_goods/query_for_page",{
                currentPage: 1,
                pageSize: 10000,
                merchantId: this.merchantId
            }).then((res) => {
                this.returnSend = res.list;
            },(err) => {
                this.$msgErr(err.msg);
            });
            this.$ajax.post("merchant_return_goods/query_By_Id", {
                id: this.$route.query.id
            }).then((res) => {
                this.tableData1 = res;
                this.returnMoney = res.returnMoney;
                this.returnOriginal = res.applicationReturnMoney;
                if (this.tableData1.problemPhoto.length > 0){
                    this.picArray = this.tableData1.problemPhoto.split(',');
                }
                this.tableData.push(res.merchantOrderDetail);
            },(err) => {
                this.$msgErr(err.msg);
            })
        },
        methods: {
            returnMoneychange() {
                this.returnMoney = this.num(this.returnMoney);
                if (this.returnMoney > this.returnOriginal) {
                    this.returnMoney = this.returnOriginal;
                }
            },

            /**
             * 选择收货地点
             */
            search() {
                this.$ajax.post("merchant_return_send/query_By_Id",{
                    id: this.typeId
                }).then((res) => {
                    this.returnAdress = res;
                },(err) => {
                    this.$msgErr(err.msg);
                })
            },

            sure(id) {
                if(this.typeId === ''){
                    this.$msgErr('请选择收货点');
                    return
                }
                if(this.returnMoney === ''){
                    this.$msgErr('请输入退款金额');
                    return
                }
                if(this.returnMoney < 0){
                    this.$msgErr('退款金额必须大于0');
                    return
                }
                this.$ajax.post("merchant_return_goods/update", {
                    id :id,
                    status : 2,
                    returnSendId: this.typeId,
                    returnMoney : this.returnMoney ,
                    resolveRemark : this.resolveRemark,
                }).then(() => {
                    this.$msgSuc('确定退货操作成功');
                    this.$router.push('/order/returnGoods');
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },
            cancel(id) {
                this.$ajax.post("merchant_return_goods/update", {
                    id :id,
                    status : 3,
                    resolveRemark : this.resolveRemark,
                }).then(() => {
                    this.$msgSuc('拒绝退货操作成功');
                    this.$router.push('/order/returnGoods');
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },

            num(obj) {
                obj = obj.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
                obj = obj.replace(/^\./g,""); //验证第一个字符是数字
                obj = obj.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
                obj = obj.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
                obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
                obj = obj.replace(/^[0][0-9]$/,"0."+Number(obj));
                return obj;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .body2 {
        width: 80%;
        min-width: 800px;
        margin: 0 auto;
        text-align: center;
        .mt30 {
            margin-top: 30px;
        }

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
                text-align:left;
                border-left: 1px solid #b4b4b4;
                border-top: 1px solid #b4b4b4;
                color: #5a5a5a;

                img {
                    width: 100px;
                    height: 100px;
                }

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