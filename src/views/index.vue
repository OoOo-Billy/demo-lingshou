<template>
    <div class="container">
        <header class="header">
            <div class="logo"></div>
            <div class="nav-item" :key="index" @click="switchNav(item.path)"
                 v-for="(item,index) in nav">
                {{item.title}}
            </div>
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
    import nav from '../utils/nav'

    export default {
        name: "index",
        computed: {//计算属性
            menu() {//根据vuex状态管理里的activeNav动态改变menu的值，然后重新生成菜单
                //return nav[this.$store.getters.activeNav].child
                return nav['index'].child
            },
            userInfo(){
                return JSON.parse(this.$store.getters.userInfo);
            },
            //activeNav(){}
        },
        data() {
            return {
                nav,
                mainHeight: window.innerHeight - 90,
                loginData: [{}, {}]
            }
        },
        methods: {
            switchNav(path) {
                this.$router.push(path);
            }
        }
    }
</script>

<style lang="scss" scoped>
    /*.container{*/
        /*position: fixed;*/
        /*width: 100vw;*/
        /*height: 100vh;*/
        /*left: 0;*/
        /*top: 0;*/
        /*overflow: auto;*/
    /*}*/
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
        }
        .content{
            position: relative;
            flex: 1;
            /*min-width: 1040px;*/
        }
    }
</style>