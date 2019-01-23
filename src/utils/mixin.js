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
         * 筛选框显示/隐藏
         */
        showSearch(){
            this.visibleSearch = !this.visibleSearch;
        },

        /**
         * 筛选框搜索按钮事件
         * 跟next()不同的是，重新给currentPage赋值为1
         * getList()里面已经定义上传的数据包括了搜索数据,所以这里搜索事件直接调用getList()即可
         */
        search(){
            this.currentPage = 1;
            this.getList();
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
        },

        /**
         * 分页组件前往第n页
         * @param val
         */
        next(val){
            this.currentPage = val;
            this.getList();
        },

        /**
         * 分页组件批量操作确定按钮事件
         * @param {String}val
         */
        confirmBatch(val){
            if (val && this.checkItemId.length > 0){
                //1.删除商品
                if ('delete' === val){
                    this.remove(this.checkItemId);
                }
                //2.其他操作
                else if ('restore' === val){
                    this.restore(this.checkItemId);
                }
            } else {
                this.$msgWar("未选择操作项");
            }
        },

        /**
         * 分页组件全选change事件
         * @param val
         */
        handleChangeAll(val){
            if (val){
                this.$refs.table.toggleAllSelection();
            } else {
                this.$refs.table.clearSelection();
            }
        },

        /*
         * 批量操作操作选项选择事件
         * @param val
        batchChange(val){
            console.log(typeof val,val);//string delete
        }*/

        /**
         * 表格selection事件
         * @param {Array} val
         */
        tableSelection(val){
            let checkItemId = [];
            this.$refs.pagination._data.checkAll = val.length === this.tableData.length;
            val.forEach((item) => {
                checkItemId.push(item.id);
            });
            this.checkItemId = checkItemId;
        },

        /**
         * 商品列表：显示商品图片
         * @param data
         * @returns {*}
         */
        getGoodImg(data){
            /*if (data){
                return data.split(',')[0]
            } else {
                return require('@/assets/image.png')
            }*/
            return require('@/assets/image.png')
        },

        //公共表头样式
        headerStyle(){
            return {
                color: '#595757',
                background: '#F6F6F6',
                fontSize: '15px',
                borderLeft: '1px solid #b4b4b4',
                borderTop: '1px solid #b4b4b4',
                textAlign: 'center'
            }
        },
        //公共表格样式
        tdStyle(){
            return {
                color: '#595757',
                fontSize: '15px',
                borderLeft: '1px solid #b4b4b4',
                borderTop: '1px solid #b4b4b4',
                textAlign: 'center'
            }
        },
    }
}