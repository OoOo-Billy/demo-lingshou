<template>
    <div>
        <subTitle :subTitle="'退货原因设置'"/>
        <div class="body">
            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button @click="update()">添加原因</el-button>
                </div>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading"
                      @selection-change="tableSelection" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle" ref="table">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="原因类型" prop="reasonType"></el-table-column>
                <el-table-column label="排序" prop="sorts"></el-table-column>
                <el-table-column label="是否启用" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-switch @change="handleStatus($event, scope.row.id)" v-model="scope.row.isUse"
                                   :active-value="1" :inactive-value="0" active-color="#5BC0BF"
                                   inactive-color="#dedede"/>
                    </template>
                </el-table-column>
                <el-table-column label="添加时间" show-overflow-tooltip prop="creatTime"></el-table-column>
                <el-table-column label="编辑" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="table-btn" @click="update(scope.row.id)">编辑</span>
                        <span class="table-btn" @click="remove([scope.row.id])">删除</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :total="total" :pageSize="pageSize" ref="pagination" :optionsList="optionsList"
                        @confirmBatch="confirmBatch" @next="next" @handleChangeAll="handleChangeAll"></pagination>

            <!--退货原因弹窗-->
            <el-dialog
                    title="退货原因"
                    :visible.sync="dialogVisible"
                    :append-to-body="true">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="form">
                    <el-form-item label="原因类型" prop="reasonType">
                        <el-input v-model="ruleForm.reasonType"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sorts">
                        <el-input v-model="ruleForm.sorts" type="number" @keyup.native="number"></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示">
                        <el-switch v-model="ruleForm.isUse" :active-value="1" :inactive-value="0" active-color="#5BC0BF"
                                   inactive-color="#dedede"/>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                </span>
            </el-dialog>


        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import pagination from "@/components/pagination"
    import mixin from "@/utils/mixin"

    export default {
        name: "returnCause",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                merchantId: '',
                dialogVisible: false,
                tableData: [
                    {
                        id: '68763',
                        reasonType: '',
                        sorts: '',
                        isUse: 1,
                        creatTime: '',
                    },
                ],
                ruleForm: {
                    id: '',
                    reasonType: '',
                    sorts: '',
                    isUse: 1,
                },
                rules: {
                    reasonType: [
                        {required: true, message: "请输入退货原因", trigger: 'blur'}
                    ],
                    sorts: [
                        {required: true, message: "请输入排序", trigger: 'blur'}
                    ],
                },

                optionsList: {
                    'delete': '删除'
                },
                checkItemId: []
            }
        },
        /*created() {
            this.merchantId = JSON.parse(localStorage.userInfo).merchantId;
            this.getList();
        },*/
        methods: {
            getList() {
                this.loading = true;
                this.$ajax.post("return_reason/query_for_pageB", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    merchantId: this.merchantId
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
             * 编辑退货原因
             * @param {String}id
             */
            update(id) {
                if (id) {
                    this.ruleForm.id = id;
                    this.$ajax.post("return_reason/selectOne", {
                        id: id,
                        merchantId: this.merchantId
                    }).then((res) => {
                        this.$set(this.ruleForm, 'reasonType', res.reasonType);
                        this.$set(this.ruleForm, 'sorts', res.sorts);
                        this.$set(this.ruleForm, 'isUse', res.isUse);
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                }
                this.dialogVisible = true;
            },

            /**
             * 控制是否显示的switch
             * @param {Number}$event
             * @param {String}id
             */
            handleStatus($event, id) {
                this.$ajax.post("return_reason/add", {
                    id: id,
                    isUse: $event,
                    merchantId: this.merchantId
                }).then(() => {
                    this.$msgSuc("操作成功");
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },

            /**
             * 删除退货原因
             * @param {Array}ids
             */
            remove(ids) {
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("return_reason/delete", {
                        ids: ids
                    }).then(() => {
                        this.$msgSuc("删除成功");
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                })
            },

            /**
             * 处理排序
             */
            number() {
                this.ruleForm.sorts = this.sorts.replace(/[^\.\d]/g, '');
                this.ruleForm.sorts = this.sorts.replace('.', '');
            },

            /**
             * 提交表单
             */
            submitForm() {
                let formData = {...this.ruleForm, ...{merchantId: this.merchantId}};
                this.$ajax.post("return_reason/add", formData).then(() => {
                    this.$msgSuc('添加成功');
                    this.dialogVisible = false;
                    this.getList();
                    this.ruleForm = {isUse: 1,};
                }, (err) => {
                    this.$msgErr(err.msg);
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

</style>