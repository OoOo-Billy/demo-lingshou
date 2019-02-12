<template>
  <div>
    <sub-title :subTitle="'交易统计'"></sub-title>
    <div class="body">
    </div>
  </div>
</template>

<script>
  import subTitle from "@/components/subTitle"
  import mixin from "@/utils/mixin"
  export default {
    components: {
      subTitle,
    },
    mixins: [mixin],
    data(){
      return{

      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="scss">
  @import "~@/assets/css/common";
</style>