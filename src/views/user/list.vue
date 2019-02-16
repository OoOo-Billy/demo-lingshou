<template>
    <div>
        <subTitle :subTitle="'用户列表'"/>
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
                    <span class="font-14 gray">用户昵称:</span>
                    <el-input class="search-input" v-model="realName" @clear="search" @keyup.enter.native="search"
                              placeholder="请输入昵称" clearable></el-input>
                    <span class="font-14 gray">用户手机:</span>
                    <el-input class="search-input" v-model="mobilePhone" placeholder="请输入手机号" @change="search" @keyup.enter.native="search" clearable>
                    </el-input>
                    <span class="font-14 gray">注册时间</span>
                    <el-date-picker
                            v-model="datePicker"
                            type="datetimerange"
                            @change="getList"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            clearable
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>

            <!--数据头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
            </div>

            <!--数据区域-->
            <el-table class="mall-table" :data="tableData" v-loading="loading" @selection-change="tableSelection" max-height="800" :header-cell-style="headerStyle" ref="table" :cell-style="tdStyle">
                <el-table-column label="ID" prop="id"></el-table-column>
                <el-table-column label="微信头像">
                    <template slot-scope="scope">
                        <img :src="getGoodImg(scope.row.headImg)" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="手机号/微信号" prop="mobilePhone"></el-table-column>
                <el-table-column label="微信昵称" prop="userName"></el-table-column>
                <el-table-column label="openId" prop="openId"></el-table-column>
                <el-table-column label="创建时间" prop="createTime"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="$router.push('/user/list/info/' + scope.row.id)">查看</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination :isBatch="false" :total="total" :pageSize="pageSize" ref="pagination" @next="next"></pagination>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import pagination from "@/components/pagination"
    import mixin from "@/utils/mixin"
    export default {
        name: "list",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data(){
            return {
                //搜索栏数据
                realName: '',
                mobilePhone: '',
                beginTime: '',
                endTime: '',

                datePicker: [],

                tableData: [],

            }
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                this.$ajax.post("user_detail/list", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    mobilePhone: this.mobilePhone,
                    realName: this.realName,
                    beginTime: this.beginTime,
                    endTime: this.endTime,
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