<template>
    <div>
        <subTitle :subTitle="'登录日志'"/>
        <div class="body">
            <p><img src="@/assets/index/icon-6.png" alt="">数据列表</p>
            <table class="table-middle">
                <thead>
                <tr>
                    <th>时间</th>
                    <th>IP</th>
                    <th>地区</th>
                    <th>浏览器</th>
                </tr>
                </thead>
                <tbody id="didi-navigator">
                <tr v-for="tab in table" align="center">
                    <td>{{ tab.operateTime}}</td>
                    <td>{{ tab.ip}}</td>
                    <td v-if="tab.description.data">{{
                        tab.description.data.country}}-{{tab.description.data.region}}-{{tab.description.data.city}}
                    </td>
                    <td v-else></td>
                    <td>{{ tab.pack}}</td>
                </tr>
                </tbody>
            </table>
            <pagination @next="next" :isBatch="false" :total="total"/>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    import pagination from '@/components/pagination'

    export default {
        name: "conLog",
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                tableData: [],
                table: [],
                currentPage: 1,
                total: 0,
                pageSize: 10,
            }
        },
        created() {
            this.getList(1);
        },
        methods: {
            /**
             * 获取登录日志列表
             * @param pageNum
             */
            getList(pageNum) {
                let formData = {
                    currentPage: pageNum,
                    pageSize: this.pageSize,
                    orderBy: 'operate_time desc'
                };
                this.$ajax.post("merchant/get_merchant_login_info_list", formData, {
                    type: 'form'
                }).then((res) => {
                    this.tableData = res.list;
                    this.total = res.tatalCount;
                    for (let i = 0; i < res.list.length; i++) {
                        if (res.list[i].description !== '') {
                            if (res.list[i].description !== '成功') {
                                res.list[i].description = eval("(" + res.list[i].description + ")");
                            }
                        }
                    }
                    this.table = res.list;
                })
            },

            /**
             * 分页组件前往第n页
             * @param val
             */
            next(val) {
                this.getList(val);
                this.currentPage = val;
            }
        }
    }
</script>

<style scoped lang="scss">
    .body {
        width: 70%;
        min-width: 600px;
        margin: 0 auto;
        p {
            border: 1px solid #b4b4b4;
            border-bottom: none;
            box-sizing: border-box;
            img {
                width: 25px;
                margin-left: 10px;
                margin-bottom: -7px;
            }
            height: 50px;
            width: 100%;
            line-height: 50px;
            background: #efefef;
        }
        .table-middle {
            width: 100%;
            margin: 0 auto;
            border-right: 1px solid #b4b4b4;
            border-bottom: 1px solid #b4b4b4;
            tbody, thead {
                width: 100%;
            }
            tr {
                height: 50px;
                background-color: #fff;
            }
            td, th {
                padding: 0 20px;
                border-left: 1px solid #b4b4b4;
                border-top: 1px solid #b4b4b4;
                color: #5a5a5a;
            }
        }
    }
</style>