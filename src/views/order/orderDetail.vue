<template>
    <div>
        <subTitle :subTitle="'订单详情'"/>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    export default {
        name: "orderDetail",
        components: {
            subTitle,
        }
    }
</script>

<style scoped>

</style>