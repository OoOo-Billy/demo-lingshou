<template>
    <div class="">
        <subTitle :subTitle="'商品分类'"/>
        <div class="body">
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button v-if="second" @click="getList()">返回</el-button>
                    <el-button @click="$router.push('category/addCategory')">添加分类</el-button>
                </div>
            </div>
            <el-table class="mall-table" v-loading="loading" :data="tableData" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="分类名称" prop="typeName"></el-table-column>
                <el-table-column label="级别">
                    <template slot-scope="scope">
                        {{ scope.row.parentId === '0' ? '一级' : '二级'}}
                    </template>
                </el-table-column>
                <el-table-column label="商品数量" prop="goodsNum"></el-table-column>
                <el-table-column label="数量单位" prop="goodsUnit"></el-table-column>
                <el-table-column label="是否显示">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.showStatus" @change="handleShow($event, scope.row)"
                                   :active-value="0" :inactive-value="1" active-color="#5BC0BF"
                                   inactive-color="#dedede"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="排序" prop="goodsSort"></el-table-column>
                <el-table-column label="设置" width="260">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="shiftGoods(scope.row.id)">转移商品</span>
                        <span class="table-btn" v-if="scope.row.parentId === '0'"
                              @click="$router.push('/goods/category/addCategory?parentId=' + scope.row.id)">新增下级</span>
                        <span class="table-btn" v-if="scope.row.parentId === '0'"
                              @click="getList(scope.row.id)">查看下级</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn"
                              @click="$router.push('category/addCategory?id=' + scope.row.id)">编辑</span>
                        <span class="table-btn" @click="remove(scope.row.id)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :isBatch="false" @next="next" :total="total" :pageSize="pageSize"/>
            <el-dialog
                    title="转移商品"
                    :visible.sync="dialogVisible"
                    :append-to-body="true"
            >
                <div class="flex">
                    <div class="">
                        <p>原商品分类：</p>
                        <el-select v-model="originalId" placeholder="未选择分类" class="search-input" disabled>
                            <el-option v-for="item in addCategoryList" :value="item.id"
                                       :label="item.typeName"></el-option>
                        </el-select>
                    </div>
                    <div class="">
                        <p>目标商品分类：</p>
                        <el-select v-model="lastId" placeholder="请选择商品分类" class="search-input">
                            <el-option v-for="item in addCategoryList" :value="item.id"
                                       :label="item.typeName"></el-option>
                        </el-select>
                    </div>
                </div>
                <span slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateCategoryGoods">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    import pagination from '@/components/pagination'
    import mixin from "@/utils/mixin"

    export default {
        name: "category",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                dialogVisible: false,//默认false
                second: false,//默认false
                tableData: [
                    {
                        id: '666',
                        typeName: '服装',
                        parentId: '0',
                        goodsNum: '8999',
                        goodsUnit: '件',
                        showStatus: 0,
                        goodsSort: '1',
                        typeIcon: ''
                    },
                    {
                        id: '5299',
                        typeName: '丝袜',
                        parentId: '1',
                        goodsNum: '8999',
                        goodsUnit: '件',
                        showStatus: 0,
                        goodsSort: '2',
                        typeIcon: ''
                    },
                    {
                        id: '1128',
                        typeName: '保暖裤',
                        parentId: '1',
                        goodsNum: '89',
                        goodsUnit: '件',
                        showStatus: 1,
                        goodsSort: '8',
                        typeIcon: ''
                    },
                ],//表格数据
                originalId: '',//原商品分类的ID
                lastId: '',//商品欲转移分类的ID
                addCategoryList: [
                    {id: '666', typeName: '服装'},
                    {id: '123', typeName: '鞋包'},
                    {id: '998', typeName: '奢侈品'},
                    {id: '5299', typeName: '情趣丝袜'},
                    {id: '1128', typeName: '性感蕾丝丝袜'},
                ],//所有商品分类列表
                childCategoryId: '',//二级分类ID
            }
        },
        /* mounted(){
             this.getList();
             this.$ajax.post("merchantGoodsType/merchant_goods_type_list").then((res) => {
                 this.addCategoryList = res;
             },() => {
                 this.$msgErr("请求数据失败");
             })
         },*/
        methods: {
            /**
             * 获取一级分类列表
             * 根据ID获取二级分类列表
             *  @param id
             */
            getList(id) {
                let parentId;
                //1.判断是获取一级分类列表还是二级分类列表
                if (id) {
                    parentId = id;
                    this.childCategoryId = id;
                    this.second = true;//提供表头返回键
                } else {
                    parentId = 0;
                    this.second = false;
                }
                this.loading = true;
                this.currentPage = 1;
                this.$ajax.post("merchantGoodsType/merchant_goods_type_list_page", {
                    parentId: parentId,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }).then((res) => {
                    this.tableData = res.list;
                    this.total = res.totalCount;
                }).finally(() => {
                    this.loading = false;
                })
            },

            /**
             *
             * @param {Number}$event
             * @param {Object}data
             */
            handleShow($event, data) {
                let form = {
                    id: data.id,
                    typeName: data.typeName,
                    parentId: data.parentId,
                    goodsUnit: data.goodsUnit,
                    goodsSort: data.goodsSort,
                    showStatus: $event,
                    typeIcon: data.typeIcon,
                };
                this.$ajax.post("merchantGoodsType/merchant_goods_type_update", form).then((res) => {
                    this.$msgSuc("操作成功");
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },

            /**
             * 转移商品事件
             * @param id
             */
            shiftGoods(id) {
                this.dialogVisible = true;
                this.originalId = id;
            },

            /**
             * 删除分类(单个)
             * @param id
             */
            remove(id) {
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("merchantGoodsType/merchant_goods_type_delete", {
                        id: id
                    }).then(() => {
                        this.$msgSuc("删除成功");
                        this.getList();
                    })
                }, () => {

                })
            },

            /**
             * 分页组件前往第n页
             */
            next() {
                if (this.second) {
                    this.getList(this.childCategoryId);
                } else {
                    this.getList();
                }
            },

            /**
             * 弹窗转移商品确定事件
             */
            updateCategoryGoods() {
                this.$ajax.post("merchantGoodsType/merchant_goods_type_transfer", {
                    originalId: this.originalId,
                    lastId: this.lastId
                }).then(() => {
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

    .el-dialog {
        .flex {
            > div {
                padding: 0 20px;
                .search-input {
                    width: 200px;
                    margin-top: 20px;
                }
            }
        }
    }
</style>