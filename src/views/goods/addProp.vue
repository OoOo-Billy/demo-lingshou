<template>
    <div>
        <subTitle :subTitle="'添加属性'" :isBack="true"/>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    export default {
        name: "addProp",
        components:{
            subTitle
        },
    }
</script>

<style scoped>

</style>