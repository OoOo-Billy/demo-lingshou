<template>
    <div>
        <subTitle :subTitle="'添加分类'"/>
        <!--这里缺少是添加分类还是编辑分类的判断,可以卸载created里，通过$router.query.id判断-->
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    export default {
        name: "addCategory",
        components:{
            subTitle
        }
    }
</script>

<style scoped>

</style>