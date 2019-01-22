<template>
    <div>
        <subTitle :subTitle="'系统首页'"/>
        <div class="body">
            <div class="row-top flex between">
                <div>
                    <img src="@/assets/index/icon-1.png" alt="">
                    <div>
                        <p class="font-18 gray">今日订单总数</p>
                        <p class="font-18 red bold">{{ data.todayOrderNum}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/index/icon-2.png" alt="">
                    <div>
                        <p class="font-18 gray">今日销售额</p>
                        <p class="font-18 red bold">{{'￥' + data.todayOrderMoney}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/index/icon-3.png" alt="">
                    <div>
                        <p class="font-18 gray">昨日销售额</p>
                        <p class="font-18 red bold">{{'￥' + data.yesterdayOrderMoney}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/index/icon-4.png" alt="">
                    <div>
                        <p class="font-18 gray">近七日销售总额</p>
                        <p class="font-18 red bold">{{'￥' + data.nearlySevenDayOrderMoney}}</p>
                    </div>
                </div>
            </div>
            <table class="table-middle" border="1">
                <caption></caption>
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    export default {
        name: "systemIndex",
        components:{
            subTitle,
        },
        data(){
            return {
                data:{
                    todayOrderNum: 1111,//今日订单总数
                    todayOrderMoney: 100000,//今日销售额
                    yesterdayOrderMoney: 120203,//昨日销售额
                    nearlySevenDayOrderMoney: 1005000//近七日销售总额
                },
            }
        },

    }
</script>

<style scoped lang="scss">

</style>