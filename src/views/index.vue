<template>
    <div class="container">
        <header class="header">
            <div class="logo"></div>
            <div class="nav-item" :class="index === activeNav ? 'active' : ''" :key="index"
                 @click="switchNav(item.path)"
                 v-for="(item,index) in nav">
                {{item.title}}
            </div>
            <!--<div class="flex-1">
                <el-popover placement="top-start" width="360" ref="popover" trigger="hover">
                    <div class="popover">
                        <p class="title clearFix">
                            <span>登录信息</span>
                            <span class="fr" @click="$router.push('/index/accountSetting')">账户设置</span>
                        </p>
                        <p>• 本次登录：{{ loginData[0].operateTime }}</p>
                        <p>• 登录地区：广东省深圳市 (IP：{{ loginData[0].ip }})</p>
                        <p>• 上次登录：{{ loginData[1].operateTime }}</p>
                    </div>
                </el-popover>
                <img class="avatar" :src="userInfo.imgUrl + userInfo.merchantLogo || '@/assets/headpto.png'" alt="" title="头像">
                <span v-popover:popover>{{ userInfo.merchantName }}</span>
                <img src="@/assets/icon-index.png" title="回到首页" @click="linkIndex">
                <img @click="loginOut" src="@/assets/icon-exit.png" title="退出">
            </div>-->
        </header>
        <div class="main">
            <div class="menu">
                <ul v-for="(item,index) in menu" :key="index">
                    <li class="menu-sub menu-item">{{item.sub}}</li>
                    <router-link tag="li" class="menu-item" active-class="active"
                                 v-for="(child,idx) in item.menu" :to="child.path" :key="idx">
                        {{child.name}}
                    </router-link>
                </ul>
            </div>
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import nav from '../utils/nav'
    // import subTitle from '../components/subTitle'
    // import pagination from '../components/pagination'
    export default {
        name: "index",
        computed: {//计算属性
            menu() {//根据vuex状态管理里的activeNav动态改变menu的值，然后重新生成菜单
                return nav[this.$store.getters.activeNav].child
                // return nav['index'].child
            },
            userInfo(){
                return JSON.parse(this.$store.getters.userInfo);
            },
            activeNav(){
                return this.$store.getters.activeNav
            }
        },
        data() {
            return {
                nav,
                mainHeight: window.innerHeight - 90,
                loginData: [{}, {}],
            }
        },
        methods: {
            switchNav(path) {
                this.$router.push(path);
            },
            /*refresh(){
                alert("点击了刷新")
            }*/
        },
        /*components: {
            // subTitle,
            // pagination,
        }*/
    }
</script>

<style lang="scss" scoped>
    .header{
        width: 100%;
        /*min-width: 1240px;*/
        height: 90px;
        background-color: #5BC0BF;
        .logo{
            display: inline-block;
            width: 200px;
            height: 100%;
            background: url("../assets/logo.png") no-repeat;
            background-size: contain;
            vertical-align: top;
        }
        .active{
            background-color: #7CCDCC;
        }
        .nav-item{
            display: inline-block;
            line-height: 90px;
            width: 100px;
            padding: 0 20px;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            text-align: center;
            box-sizing: border-box;
        }
    }
    .main{
        display: flex;
        width: 100%;
        .menu{
            width: 200px;
            height: 100%;
            flex-shrink: 0;/*当空间不足时，不缩小*/
            .menu-sub{
                color: #B9B9BA !important;
                cursor: auto !important;
            }
            .menu-item{
                display: block;
                line-height: 60px;
                color: #595757;
                text-align: center;
                background-color: #EFEFEF;
                box-sizing: border-box;
                cursor: pointer;
            }
            .active{
                color: #5BC0BF;
                border-bottom: 1px solid #5BC0BF;
                background-color: #fff;
            }
        }
        .content{
            position: relative;
            flex: 1;
            /*min-width: 1040px;*/
            overflow: auto;
        }
    }
</style>