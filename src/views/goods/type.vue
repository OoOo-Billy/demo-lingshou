<template>
    <div>
        <subTitle :subTitle="'商品类型'"/>
        <div class="body">
            <!--表格头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button @click="addType">添加类型</el-button>
                </div>
            </div>

            <!--表格区域-->
            <el-table class="mall-table" v-loading="loading" :data="tableData" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="类型名称" prop="styleName"></el-table-column>
                <el-table-column label="属性数量" prop="propertyNum"></el-table-column>
                <el-table-column label="参数数量" prop="paramNum"></el-table-column>
                <el-table-column label="设置">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="$router.push('/goods/type/prop/' + scope.row.id)">属性列表</span>
                        <!--二种写法：
                        1.type/prop/id ==> goods/type/prop/id
                        2./goods/type/prop/id ==> /goods/type/prop/id
                        3.错误写法：goods/type/prop/id ==> goods/goods/type/prop/id
                        -->
                        <span class="table-btn" @click="$router.push('/goods/type/params/' + scope.row.id)">参数列表</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="edit(scope.row)">编辑</span>
                        <span class="table-btn" @click="remove(scope.row.id)">删除</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :isBatch="false" @next="next" :total="total" :pageSize="pageSize"/>

            <!--弹窗-->
            <el-dialog
            :title="isAdd ? '添加类型' : '编辑类型'"
            :visible.sync="dialogVisible"
            :append-to-body="true">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                    <el-form-item label="类型名称：" prop="styleName">
                        <el-input v-model="ruleForm.styleName" class="form-input"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    import pagination from '@/components/pagination'
    import mixin from '@/utils/mixin'

    export default {
        name: "type",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                tableData: [
                    {
                        id: 666,
                        styleName: '服装',
                        propertyNum: 1000,
                        paramNum: 20,
                    },
                    {
                        id: 5299,
                        styleName: '袜子',
                        propertyNum: 99,
                        paramNum: 50,
                    },
                    {
                        id: 1128,
                        styleName: '保暖裤',
                        propertyNum: 9999,
                        paramNum: 180,
                    },
                ],
                dialogVisible: false,
                ruleForm: {
                    id: '',
                    styleName: '',
                },
                rules: {
                    styleName: [
                        {required: true, message: '请输入类型名称', trigger: 'blur'},
                        {max: 20, message: '长度必须小于20个字符', trigger: 'blur'},
                    ]
                }
            }
        },
        /*mounted(){
            this.getList();
        },*/
        methods: {
            getList(){
                this.loading = true;
                this.$ajax.post("merchantGoodsStyle/merchant_goods_style_list_page",{
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                },(err) => {
                    this.$msgErr(err.msg)
                }).finally(() => {
                    this.loading = false;
                })
            },

            /**
             * 表头添加类型按钮，打开dialog弹窗
             */
            addType(){
                this.isAdd = true;
                this.dialogVisible = true;
                this.ruleForm.id = '';
                this.ruleForm.styleName = '';
            },

            /**
             * 编辑类型
             * @param {Object}data
             */
            edit(data) {
                this.isAdd = false;
                this.dialogVisible = true;
                this.ruleForm.id = data.id;
                this.ruleForm.styleName = data.styleName;
            },

            /**
             *
             * @param {Number}id
             */
            remove(id) {
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("merchantGoodsStyle/merchant_goods_type_delete",{
                        id: id,
                    }).then(() => {
                        this.getList();
                        this.$msgSuc("删除成功");
                    },(err) => {
                        this.$msgErr(err.msg)
                    })
                },() => {
                    // console.log("取消删除");
                })
            },

            /**
             * 提交表单按钮事件
             * @param formName
             */
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid){
                        if (this.isAdd){
                            this.addEdit("merchantGoodsStyle/merchant_goods_type_add");
                        } else {
                            this.addEdit("merchantGoodsStyle/merchant_goods_type_update");
                        }
                    } else {
                        return false;
                    }
                })
            },

            /**
             * 向服务器提交表单
             * @param path
             */
            addEdit(path) {
                this.$ajax.post(path, this.ruleForm).then(() => {
                    this.$msgSuc("操作成功");
                    this.getList();
                    this.dialogVisible = false;
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .form-input{
        width: 200px;
    }
    .dialog-footer {
        button:last-child {
            margin-right: 0;
        }
    }
</style>