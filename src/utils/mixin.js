export default {
    data(){
        return {
            loading: false,//默认为true
            visibleSearch: false,
            currentPage: 1,//当前页数
            pageSize: 10,//页数大小
            total: 0,//数据总数
        }
    },
    methods:{
        showSearch(){
            this.visibleSearch = !this.visibleSearch;
        }
    }
}