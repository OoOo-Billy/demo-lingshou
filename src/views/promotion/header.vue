<template>
    <div>
        <subTitle :subTitle="'类目列表'"/>
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
                    <span class="font-14 gray">类目名称:</span>
                    <el-input class="search-input" v-model="navName" @clear="search" @keyup.enter.native="search"
                              placeholder="请输入类目名称" clearable></el-input>
                    <span class="font-14 gray">类目状态:</span>
                    <el-select class="search-input" v-model="status" placeholder="请选择类目状态" @change="search" clearable>
                        <el-option :label="item" :value="index" v-for="(item,index) in recommendStatus"></el-option>
                    </el-select>
                </div>
            </div>

            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button v-if="second" @click="switchQuery(false)">返回</el-button>
                    <el-button @click="$router.push('/promotion/addHeader')">添加类目</el-button>
                </div>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading" ref="table"
                      @selection-change="tableSelection" max-height="800" :header-cell-style="headerStyle"
                      :cell-style="tdStyle">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="类目名称" prop="navName"></el-table-column>
                <el-table-column label="图标">
                    <template slot-scope="scope">
                        <img :src="getGoodImg(scope.row.navIcon)" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="级别">
                    <template slot-scope="scope">
                        {{ scope.row.parentId === '0' ? '一级' : '二级' }}
                    </template>
                </el-table-column>
                <el-table-column label="是否推荐">
                    <template slot-scope="scope">
                        <el-switch @change="handleShow($event, scope.row)" v-model="scope.row.status" :active-value="0" :inactive-value="2" active-color="#5BC0BF" inactive-color="#dedede"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.navSort" @blur="handleNavSort($event, scope.row)" size="small" class="text-center"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.status === 2 ? '未推荐' : '推荐中' }}
                    </template>
                </el-table-column>
                <el-table-column label="设置" width="200" v-if="!second">
                    <template slot-scope="scope">
                        <span class="table-btn"
                              @click="$router.push('/promotion/addHeader?parentId=' + scope.row.id)">新增下级</span>
                        <span class="table-btn" @click="switchQuery(true, scope.row.id)">查看下级</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="setTop(scope.row.id, scope.row.navTop)">{{ scope.row.navTop === 0 ? '置顶' : '取消置顶' }}</span>
                        <span class="table-btn" @click="remove([scope.row.id])">删除</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :total="total" :pageSize="pageSize" ref="pagination" :optionsList="optionsList" :isClear="true" @confirmBatch="confirmBatch" @next="next" @handleChangeAll="handleChangeAll"></pagination>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import pagination from "@/components/pagination"
    import mixin from "@/utils/mixin"
    export default {
        name: "headerList",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data(){
            return{
                //搜索栏数据
                navName: '',
                status: '',
                recommendStatus: '',

                second: false,
                headerId: 0,

                tableData: [],

                optionsList: {
                    'hide': '取消推荐',
                    'show': '设为推荐',
                    'delete': '删除',
                }
            }
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList(){
                this.loading = true;
                this.$ajax.post("merchantNavigation/merchant_navigation_list_page", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    parentId: this.headerId,
                    navName: this.navName,
                    status: this.status,
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
             *
             * @param {Boolean}flag
             * @param id
             */
            switchQuery(flag, id){
                this.currentPage = 1;
                this.headerId = flag ? id : 0;
                this.second = flag;
                this.getList();
            },

            /**
             * 控制显示switch事件
             * @param {value}$event
             * @param {Object}data
             */
            handleShow($event, data){
                data.status = $event;
                this.$ajax.post("merchantNavigation/merchant_navigation_update", data).then(() => {
                    this.$msgSuc("操作成功");
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },

            /**
             * 排序事件
             * @param {event}$event
             * @param data
             */
            handleNavSort($event, data){
                if ($event.target.value < 0 || $event.target.value > 999){
                    this.$msgWar("排序在0 - 999之间");
                    return
                }
                data.navSort = $event.target.value;
                this.$ajax.post("merchantNavigation/merchant_navigation_update", data).then(() => {
                    this.$msgSuc("操作成功");
                    this.getList();
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },

            /**
             * 置顶
             * @param id
             * @param value
             */
            setTop(id, value){
                this.$ajax.post("merchantNavigation/set_nav_top", {
                    id: id,
                    navTop: value === 0 ? '' : 0
                }).then(() => {
                    this.$msgSuc("操作成功");
                    this.getList();
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },

            /**
             * 删除
             * @param {Array}ids
             */
            remove(ids){
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("merchantNavigation/merchant_nav_batch", {
                        ids: ids,
                        oprate: 1
                    }).then(() => {
                        this.$msgSuc("删除成功");
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                },() => {
                    console.log("取消了删除");
                })
            },

            /**
             *
             * @param {Array}ids
             * @param {value}status
             */
            batchShow(ids,status){
                let oprate;
                if (status === 0){
                    oprate = 2;
                } else if (status === 1){
                    oprate = 0;
                }
                this.$ajax.post("merchantNavigation/merchant_nav_batch", {
                    ids: ids,
                    oprate: oprate
                }).then(() => {
                    this.$msgSuc("操作成功");
                    this.getList();
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            }
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