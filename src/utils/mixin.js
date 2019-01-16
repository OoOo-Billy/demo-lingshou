export default {
    data(){
        return {
            loading: false,//默认为true
            visibleSearch: false,
            currentPage: 1,//当前页数
            pageSize: 10,//页数大小
            total: 0,//数据总数
            isAdd: true,//是否添加(true)/修改(false)商品
            input: '',//
        }
    },
    methods:{
        /**
         * 搜索框显示/隐藏
         */
        showSearch(){
            this.visibleSearch = !this.visibleSearch;
        },

        /**
         * 上传图片文件
         * @param file
         * @returns {Promise<any>}
         */
        uploadFiles(file){
            return new Promise((resolve, reject) => {
                let formData = new FormData();
                formData.append('file', file);
                this.$ajax.post('merchant/upload_file',formData, {
                    type: 'form',
                    file: 'image'
                }).then((res) => {
                    resolve({
                        //图片文件上传至后台服务器，通过后台的处理转换成图片链接
                        imgUrl: res.imgUrl + res.image
                        //连接+后缀名
                    });
                },(err) => {
                    this.$msgErr(err);
                    reject(err);
                })
            })
        },

        /**
         * 返回上一个页面
         */
        back(){
            this.$router.go(-1);
        }
    }
}