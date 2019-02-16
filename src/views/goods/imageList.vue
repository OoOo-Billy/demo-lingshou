<template>
    <div>
        <subTitle :subTitle="'相册列表'"/>
        <div class="body">
            <!--表格头部-->
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button @click="back">返回</el-button>
                    <el-button @click="dialogVisible = true">上传图片</el-button>
                </div>
            </div>

            <!--图片列表-->
            <div class="img-list" v-loading="loading">
                <el-checkbox-group class="flex" v-if="list.length > 0" v-model="checkItemId" @change="handleCheckItem">
                    <div class="img-item" v-for="(item, index) in list" :key="index">
                        <el-checkbox :label="item.id">
                            <img :src="item.imgUrl" alt="">
                        </el-checkbox>
                        <span class="table-btn" @click="shiftItem([item.id])">转移相册</span>
                        <span class="table-btn" @click="remove([item.id])">删除图片</span>
                    </div>
                </el-checkbox-group>
                <div v-else class="empty-text">
                    暂无图片
                </div>
            </div>

            <!--分页组件-->
            <pagination :total="total" :pageSize="pageSize" ref="pagination" :optionsList="optionsList"
                        @confirmBatch="confirmBatch" @next="next" @handleChangeAll="handleChangeAll"></pagination>

            <!--上传图片弹窗-->
            <el-dialog
                    title="上传图片"
                    :visible.sync="dialogVisible"
                    :append-to-body="true">
                <el-form v-loading="formLoading" element-loading-text="上传中" :model="ruleForm" :rules="rules"
                         ref="ruleForm" label-width="100px">
                    <el-form-item label="选择相册：" prop="goodsGalleriesId">
                        <el-select v-model="ruleForm.goodsGalleriesId" placeholder="请选择相册">
                            <el-option :label="item.name" :value="item.id" v-for="(item,index) in albumList"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择图片：" prop="imgUrl">
                        <div class="upload-img-list">
                            <div v-for="(item,index) in ruleForm.imgUrl" :key="index">
                                <img :src="item" alt="">
                                <i class="el-icon-circle-close-outline" @click="deleteImg(index)"></i>
                            </div>
                        </div>
                        <div class="upload-btn-wrap">
                            <label for="upload">
                                <el-button type="primary" size="small">上传图片</el-button>
                            </label>
                            <input type="file" id="upload" class="upload-input" accept="image/png, image/jpeg"
                                   @change="uploadImgUrl">
                            <p class="form-tips">可批量选择多张图片上传 (最多上传5张)</p>
                        </div>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm',submitPath.path1)">确 定</el-button>
                </span>
            </el-dialog>

            <!--转移相册弹框-->
            <el-dialog
                    title="转移相册"
                    :visible.sync="dialogVisible1"
                    :append-to-body="true">
                <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="100px">
                    <el-form-item label="选择的图片：">
                        <div class="check-img">
                            <img :src="getImgUrl(id)" alt="" v-for="id in ruleForm1.ids">
                        </div>
                    </el-form-item>
                    <el-form-item label="原图片相册：">
                        <el-select v-model="ruleForm1.subGalleries" disabled>
                            <el-option :label="item.name" :value="item.id" v-for="(item,index) in albumList"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择相册：" prop="changeToGalleries">
                        <el-select v-model="ruleForm1.changeToGalleries" placeholder="请选择相册">
                            <el-option :label="item.name" :value="item.id" v-for="(item,index) in albumList"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible1 = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm1',submitPath.path2)">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    import pagination from "@/components/pagination";
    import mixin from '@/utils/mixin'

    export default {
        name: "imageList",
        mixins: [mixin],
        components: {
            subTitle,
            pagination,
        },
        data() {
            let validImgUrl = (item, value, callBack) => {
                if (!this.ruleForm.imgUrl.length > 0) {
                    callBack(new Error("请上传图片"));
                } else {
                    callBack();
                }
            };
            return {
                galleriesId: '',//相册id
                dialogVisible: false,
                dialogVisible1: false,
                formLoading: false,
                checkItemId: [],
                pageSize: 20,
                list: [],
                ruleForm: {
                    goodsGalleriesId: '',
                    imgUrl: [],
                },
                ruleForm1: {
                    ids: [],//需要转移的图片ID
                    subGalleries: '',//原来的相册
                    changeToGalleries: '',//需要转移到的相册
                },
                rules: {
                    goodsGalleriesId: [
                        {required: true, message: '请选择相册'}
                    ],
                    imgUrl: [
                        {validator: validImgUrl, required: true, trigger: 'change'}
                    ],
                },
                rules1: {
                    changeToGalleries: [
                        {required: true, message: '请选择相册'}
                    ],
                },
                albumList: [],//相册列表
                optionsList: {
                    'delete': '删除',
                    'shift': '转移'
                },
                submitPath: {
                    path1: 'merchant_goods_galleries_detail/add_batch',
                    path2: 'merchant_goods_galleries_detail/change_galleries_batch',
                }
            }
        },
        mounted() {
            this.galleriesId = this.$route.params.id;
            this.ruleForm1.subGalleries = this.$route.params.id;
            this.getList();
            this.getAlbumList();
        },
        methods: {
            /**
             * 获取相册图片列表
             */
            getList() {
                this.loading = true;
                this.$ajax.post("merchant_goods_galleries_detail/query_for_page", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    galleriesId: this.galleriesId,
                }).then((res) => {
                    this.list = res.list;
                    this.total = res.totalCount;
                }, (err) => {
                    this.$msgErr(err.msg)
                }).finally(() => {
                    this.loading = false;
                })
            },

            /**
             * 获取相册列表
             */
            getAlbumList() {
                this.$ajax.post("merchant_goods_galleries/query").then((res) => {
                    this.albumList = res.list;
                }, (err) => {
                    this.$msgErr(err.msg)
                })
            },

            /**
             * 图片列表checkbox选取图片事件
             * @param {Array}ids
             */
            handleCheckItem(ids) {
                this.$refs.pagination._data.checkAll = ids.length === this.list.length;
            },

            /**
             * 分页组件全选change事件
             * @param {Boolean}flag
             */
            handleChangeAll(flag) {
                this.checkItemId = [];
                if (flag) {
                    this.list.map((item) => {
                        this.checkItemId.push(item.id);
                    })
                }
            },

            /**
             * 转移相册事件
             * @param {Array}id
             */
            shiftItem(id) {
                this.ruleForm1.ids = id;
                this.ruleForm1.changeToGalleries = '';
                this.checkItemId = id;
                this.$refs.pagination._data.checkAll = id.length === this.list.length;
                this.dialogVisible1 = true;
            },

            /**
             * 删除图片
             * @param {Array}id
             */
            remove(id) {
                this.$confirm("确认删除吗?").then(() => {
                    this.$ajax.post("merchant_goods_galleries_detail/delete_batch", id).then(() => {
                        this.$msgSuc("删除成功");
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                }, () => {
                    // console.log('取消删除图片');
                })
            },

            /**
             * 删除需要上传的候选图片
             * @param index
             */
            deleteImg(index) {
                this.ruleForm.imgUrl.splice(index, 1);
            },

            /**
             * 上传图片事件
             * @param $event
             */
            uploadImgUrl($event) {
                let files = $event.target.files;
                if (files.length + this.ruleForm.imgUrl.length > 5) {
                    this.$msgWar("图片最多5张");
                    return
                }
                let imgUrl = this.ruleForm.imgUrl;
                let promiseList = [];
                this.formLoading = true;
                for (let i = 0; i < files.length; i++) {
                    if (files[i] === {}) {
                        continue;
                    }
                    promiseList.push(this.uploadFiles(files[i]))
                }
                Promise.all(promiseList).then((res) => {
                    res.map((item) => {
                        imgUrl.push(item.imgUrl);
                    });
                    this.$set(this.ruleForm, 'imgUrl', imgUrl);
                }, () => {
                    this.$msgErr("上传失败");
                }).finally(() => {
                    this.formLoading = false;
                })
            },

            /**
             * 提交表单
             * @param {String}formName
             * @param {String}path
             */
            submitForm(formName, path) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$ajax.post(path, this[formName]).then(() => {
                            this.$msgSuc("提交成功");
                            this.getList();
                            this.dialogVisible = false;
                            this.dialogVisible1 = false;
                        }, (err) => {
                            this.$msgErr(err.msg);
                        })
                    } else {
                        return false;
                    }
                });
            },

            /**
             *
             * @param {String}id
             */
            getImgUrl(id) {
                let imgUrl = this.list.find((item) => {
                    return item.id === id;
                });
                //注意：Array.find(fn)方法中，fn必须返回一个Boolean值，
                //Array.find()会返回第一个符合条件的对象
                return imgUrl.imgUrl
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .img-list {
        border-left: $border;
        border-right: $border;
        padding: 20px;
        .flex {
            align-items: flex-end;
        }
        .img-item {
            width: 160px;
            margin-right: 20px;
            .el-checkbox {
                margin-bottom: 5px;
            }
            img {
                width: 100%;
                margin: 0 0 -3px -25px;
            }
            > span {
                margin-left: 10px;
            }
        }
    }

    .upload-img-list {
        display: flex;
        > div {
            position: relative;
            margin-right: 10px;
            margin-bottom: 10px;
            img {
                display: block;
                width: auto;
                height: 100px;
            }
            i {
                color: red;
                position: absolute;
                right: -8px;
                top: -8px;
                font-size: 20px;
                background-color: #fff;
                border-radius: 50%;
            }
        }
    }

    .form-tips {
        font-size: 12px;
        color: $gray;
        line-height: 16px;
        margin-top: 5px;
    }
    .check-img{
        height: 100px;
        padding-top: 10px;
        img{
            height: 100%;
            margin-right: 10px;
        }
    }
    .dialog-footer {
        button:last-child {
            margin-right: 0;
        }
    }
</style>