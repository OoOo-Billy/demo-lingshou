<template>
    <div class="container">
        <subTitle :subTitle="isAdd ? '添加商品' : '编辑商品'"></subTitle>
        <!--body-->
        <div class="body">
            <!--头部步骤条steps-->
            <el-steps :active="stepActive" align-center>
                <el-step title="选择商品分类"></el-step>
                <el-step title="填写商品信息"></el-step>
                <el-step title="填写商品属性"></el-step>
                <el-step title="选择商品关联"></el-step>
            </el-steps>

            <!--内容展示-->
            <div class="form-wrap flex" v-loading="loading">
                <!--选择商品分类-->
                <div v-if="stepActive === 0">
                    <div class="flex">
                        <div class="form-label">基本信息</div>
                        <div class="flex-1">
                            <div class="select-category flex h-center">
                                <!--一级分类-->
                                <div class="flex-1">
                                    <div class="title font-18 gray bold">选择一级分类</div>
                                    <ul class="category-list">
                                        <li :class="ruleForm.typeId === item.id ? 'active' : ''" v-for="item in categoryList" @click="getCategory(item)">
                                            <span>{{ item.typeName }}</span>
                                            <i class="el-icon-arrow-right fr"></i>
                                        </li>
                                    </ul>
                                </div>
                                <img src="@/assets/icon-arrow.png" alt="">
                                <!--二级分类-->
                                <div class="flex-1">
                                    <div class="title font-18 gray bold">选择二级分类</div>
                                    <ul class="category-list" v-if="childCategoryList.length > 0">
                                        <li :class="ruleForm.childId === item.id ? 'active' : ''" v-for="item in childCategoryList" @click="getChildCategory(item)">{{ item.typeName }}</li>
                                    </ul>
                                    <div class="category-list" v-if="childCategoryList.length === 0">
                                        <span class="empty">暂无分类</span>
                                    </div>
                                </div>
                            </div>
                            <p class="tips">您当前选择的商品类别是：
                                <span>{{ categoryName || '未选择' }}</span>
                                <span v-show="childCategoryName"> &gt; {{ childCategoryName || '未选择' }}</span>
                            </p>
                            <el-button type="primary" @click="submitType">下一步，填写商品信息</el-button>
                        </div>
                    </div>
                </div>

                <!--填写商品信息-->
                <div v-if="stepActive === 1">
                    <div class="flex">
                        <div>
                            <div class="form-label">基本信息</div>
                            <div class="form-label label-2">库存规格</div>
                        </div>
                        <el-form :model="ruleForm" :rules="rules" class="form-info" label-width="100px" ref="ruleForm">
                            <el-form-item label="商品分类：">
                                <span class="font-14 green bold point" @click="stepActive = 0">{{ categoryName }}</span>
                                <span class="font-14 green bold point" v-show="childCategoryName" @click="stepActive = 0"> &gt; {{ childCategoryName }}</span>
                            </el-form-item>
                            <el-form-item label="商品名称" prop="goodsName">
                                <el-input v-model="ruleForm.goodsName"></el-input>
                            </el-form-item>
                            <el-form-item label="副标题" prop="goodsSubtitle">
                                <el-input v-model="ruleForm.goodsSubtitle"></el-input>
                            </el-form-item>
                            <el-form-item label="商品品牌" prop="brandId">
                                <el-select v-model="ruleForm.brandId" placeholder="请选择品牌">
                                    <el-option :label="item.name" :value="item.id" v-for="item in brandList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="商品介绍" prop="goodsDesc">
                                <el-input type="textarea" v-model="ruleForm.goodsDesc" resize="none"></el-input>
                            </el-form-item>
                            <el-form-item label="商品货号">
                                <el-input v-model="ruleForm.goodsNo"></el-input>
                                <p class="form-tips">如果您不输入商品货号，系统将自动生成一个唯一的货号</p>
                            </el-form-item>
                            <el-form-item label="商品售价" prop="goodsPrice">
                                <el-input v-model="ruleForm.goodsPrice" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="市场价">
                                <el-input v-model="ruleForm.marketPrice" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品库存" prop="goodsStock">
                                <el-input v-model="ruleForm.goodsStock" type="number"></el-input>
                                <p class="form-tips">该设置只对单品有效，当商品存在多规格货品时为不可编辑状态，库存数值取决于货品数量</p>
                            </el-form-item>
                            <el-form-item label="库存预警" prop="goodsWarning">
                                <el-input v-model="ruleForm.goodsWarning" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="计量单位">
                                <el-input v-model="ruleForm.goodsUnit"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量">
                                <el-input v-model="ruleForm.goodsWeight" type="number"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="stepActive = 0">上一步,选择商品分类</el-button>
                                <el-button type="primary" @click="submitForm('ruleForm')">下一步,填写商品属性</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

                <!--选择商品属性-->
                <div v-if="stepActive === 2">
                    <div class="form-item-3 flex">
                        <div class="form-label">商品属性</div>
                        <div class="flex-1">
                            <el-form class="form-prop" label-width="100px" v-loading="propLoading">
                                <el-form-item label="商品类型：">
                                    <el-select v-model="ruleForm.styleId" :disabled="!isAdd" placeholder="请选择商品类型"
                                               @change="getProp">
                                        <el-option :label="item.styleName" :value="item.id"
                                                   v-for="item in typeList"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="商品规格：" v-if="propList.length > 0">
                                    <div class="prop-wrap">
                                        <el-checkbox-group v-model="checkProp" v-for="(item,index) in propList"
                                                           :key="index">
                                            <div class="font-14 gray">{{item.name}}</div>
                                            <el-checkbox :disabled="!isAdd" :label="item.name + prop"
                                                         v-for="prop in item.value" @change="handleCheckProp(prop, item.name, $event)">{{prop}}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                        <div>
                                            <el-button size="small" type="primary" v-if="isAdd" @click="addProps">添加</el-button>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>
                            <table class="goods-table" border="1" v-show="propSpecList.length > 0">
                                <thead>
                                <td v-for="item in propHeader">{{ item }}</td>
                                <td>销售价格</td>
                                <td>商品库存</td>
                                <td>库存预警值</td>
                                <!--<td>SKU编号</td>-->
                                </thead>
                                <tbody>
                                <tr v-for="item in propSpecList">
                                    <td v-for="val in item.nameValue">{{ val.value}}</td>
                                    <td>
                                        <el-input v-model="item.goodsSalePrice" size="mini" type="number"
                                                  :max="99999"></el-input>
                                    </td>
                                    <td>
                                        <el-input v-model="item.goodsStock" size="mini" type="number"
                                                  :max="99999"></el-input>
                                    </td>
                                    <td>
                                        <el-input v-model="item.stockWarning" size="mini" type="number"
                                                  :max="99999"></el-input>
                                    </td>
                                    <!--<td><el-input v-model="item.skuCode" size="mini"></el-input></td>-->
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="form-item-3 flex" v-loading="propLoading">
                        <div class="form-label">商品参数</div>
                        <div class="flex-1">
                            <table class="goods-table" border="1">
                                <thead>
                                <td>参数类型</td>
                                <td>录入参数</td>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in paramsList">
                                    <td>{{item.name || item.paramDetailName}}</td>
                                    <td>
                                        <el-select
                                                v-model="ruleForm.merchantParamDetailIds.merchantParamDetails[index].specificationsValue"
                                                placeholder="请选择商品参数值">
                                            <el-option :label="val" :value="val" v-for="val in item.list"></el-option>
                                        </el-select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>主材含量</td>
                                    <td>
                                        <el-input v-model="ruleForm.merchantParamDetailIds.mainMaterial"
                                                  size="mini"></el-input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>适用对象</td>
                                    <td>
                                        <el-input v-model="ruleForm.merchantParamDetailIds.paramObject"
                                                  size="mini"></el-input>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="form-item-3 flex">
                        <div class="form-label">商品相册</div>
                        <div class="flex-1">
                            <div class="flex">
                                <div class="upload-wrap" v-for="(item,index) in imgList" :key="index">
                                    <div class="img-wrap">
                                        <img :src="item" alt="">
                                        <i class="el-icon-picture" v-if="!item"></i>
                                    </div>
                                    <div class="flex h-center around">
                                        <span class="font-14 red" v-if="index === 0">商品主图</span>
                                        <span class="font-14 green table-btn" v-if="index !== 0" @click="setMainPic(item,index)">设为主图</span>
                                        <span class="font-14 green table-btn" @click="deleteImg(index)">删除图片</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex h-center">
                                <div class="upload-btn-wrap">
                                    <label for="upload">
                                        <el-button type="primary">上传图片</el-button>
                                    </label>
                                    <input id="upload" @change="uploadGoodImg" type="file" class="upload-input large"
                                           accept="image/jpeg, image/png">
                                </div>
                                <el-button type="primary" @click="dialogVisible = true">从图片库选择</el-button>
                            </div>
                            <p class="form-tips">最多可以上传5张图片，建议尺寸800*800px</p>
                        </div>
                    </div>
                    <div class="form-item-3 flex">
                        <div class="form-label">商品详情</div>
                        <div class="flex-1">
                            <div class="editor">
                                <quill-editor v-model="ruleForm.goodsMobileImg" ref="myQuillEditor"
                                              :options="editorOption" class="editor"></quill-editor>
                                <!--ruleForm.goodsMobileImg后台定义的字段，这里表示的是跟富文本内容所对应，后台没改-->
                                <el-upload
                                id="uploadEditor"
                                hidden
                                :action="serverUrl"
                                accept="image/jpeg, image/png"
                                :http-request="uploadEditor">
                                </el-upload>
                                <!--这是ele的文件上传，使用这个的原因是通过富文本编辑器上传的图片是base64的格式 ，需要将其上传至后台服务器，通过后台的处理转换成图片链接。
                                :action="serverUrl" 设置图片提交的服务器连接
                                :http-request: 字面意思，定义上传图片至服务器的事件-->
                            </div>
                            <div style="margin-top: 80px">
                                <el-button @click="stepActive = 1">上一步,填写商品信息</el-button>
                                <el-button type="primary" @click="submitProp">下一步,选择商品类目</el-button>
                            </div>
                        </div>
                    </div>
                </div>

                <!--选择关联类目-->
                <div v-if="stepActive === 3">
                    <div class="flex">
                        <div class="form-label">关联类目</div>
                        <div class="flex-1">
                            <p class="form-tips">* 类目非必须选 | 选了一级类目必须选择二级类目</p>
                            <div class="select-category flex h-center mt20">
                                <div class="flex-1">
                                    <div class="title font-18 gray bold">选择一级类目</div>
                                    <ul class="category-list">
                                        <li :class="ruleForm.navId === item.id ? 'active' : ''" v-for="item in headerList" @click="getHeader(item)">
                                            <span>{{ item.navName}}</span>
                                            <i class="el-icon-arrow-right fr"></i>
                                        </li>
                                    </ul>
                                </div>
                                <img src="@/assets/icon-arrow.png" alt="">
                                <div class="flex-1">
                                    <div class="title font-18 gray bold">选择二级类目</div>
                                    <ul class="category-list" v-if="childHeaderList.length > 0">
                                        <li :class="ruleForm.navChildId === item.id ? 'active' : ''" v-for="item in childHeaderList" @click="getChildHeader(item)">{{ item.navName}}</li>
                                    </ul>
                                    <div class="category-list" v-if="childHeaderList.length === 0">
                                        <span class="empty">暂无类目</span>
                                    </div>
                                </div>
                            </div>
                            <div class="mt20">
                                <el-button @click="stepActive = 2">上一步,填写商品属性</el-button>
                                <el-button type="primary" @click="submitGoods">完成,提交商品</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--相册库弹窗-->
            <el-dialog
            title="从图库选择"
            :visible.sync="dialogVisible"
            :append-to-body="true">
                <div class="flex between h-center">
                    <span>商品图库 &gt; 全部图片</span>
                    <el-select v-model="input" placeholder="请选择图库分类" size="small" @change="getAlbumImg">
                        <el-option v-for="item in albumList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div>
                <div class="img-table flex">
                    <div v-for="(item,index) in albumImgList" :key="index" @click="checkAlbumImg(item)">
                        <img :src="item.imgUrl" alt="">
                        <i class="el-icon-success" v-if="checkAlbumImgList.indexOf(item.imgUrl) >= 0"></i>
                    </div>
                </div>
                <pagination :isBatch="false" :total="total" :pageSize="pageSize" @next="next"></pagination>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addImg">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import subTitle from '../../components/subTitle'
    import pagination from '../../components/pagination'
    import mixin from '../../utils/mixin'
    import { quillEditor } from 'vue-quill-editor'

    const toolbarOptions = [//配置富文本编辑器的工具栏
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],
        ['link', 'image', 'video'],
        ['clean']                                         // remove formatting button
    ];
    export default {
        name: "add",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            //商品库存规则
            let validGoodsStock = (rule, value, callback) =>{
                if (value === ''){
                    callback(new Error('请输入商品库存'));
                } else if (value > 99999){
                    callback(new Error('商品库存最大值为99999'));
                } else if (value < 0){
                    callback(new Error('商品库存不能小于0'));
                } else {
                    callback();
                }
            };
            return {
                stepActive: 0,
                dialogVisible: false,//图片库弹窗可视
                categoryList: [
                    {typeName: '化妆品', id: '0', list:[{typeName: '口红', id: '0'},{typeName:'眼影',id: '1'}]},
                    {typeName: '食品', id: '1', list:[{typeName: '烧麦', id: '0'},{typeName: '包子', id: '1'},{typeName: '油条', id: '2'}]},
                    {typeName: '服装', id: '2', list:[{typeName: '大衣', id: '0'},{typeName: '裙子', id: '1'}]},
                    {typeName: '玩具', id: '3', list:[]}
                ],//一级分类列表
                childCategoryList: [],//二级分类列表
                brandList: [
                    {name: '李宁',id: '0'},
                    {name: '耐克',id: '1'},
                    {name: '阿迪达斯',id: '2'},
                ],//品牌列表
                categoryName: '',//商品一级分类名
                childCategoryName: '',//商品二级分类名
                ruleForm: {
                    typeId: '', //一级分类ID
                    childId: '', //二级分类ID
                    goodsName: '', //商品名称
                    goodsSubtitle: '', //副标题
                    brandId: '', //商品品牌
                    goodsDesc: '', //商品介绍
                    goodsNo: '', //商品货号
                    goodsPrice: '', //商品售价
                    marketPrice: '', //市场价
                    goodsStock: '', //商品库存
                    goodsWarning: '', //库存预警值
                    goodsUnit: '', //计量单位
                    goodsWeight: '', //商品重量
                    goodsMobileImg: '',//商品详情goodsDetail，后台字段没改，用这个代替
                    styleId: '', //类型ID
                    merchantSpecifications: [], //商品属性列表
                    merchantGoodsTypePropertyList: [], //商品规格列表
                    merchantParamDetailIds: {
                        merchantParamDetails: [
                            {name: '多肉', specificationsValue: ''},
                            {name: '多糖', specificationsValue: ''},
                            {name: '多菜', specificationsValue: ''},
                        ],
                        mainMaterial: '0.5',
                        paramObject: '所有人',
                    }, //商品参数值列表
                    goodsImg: '', //商品图片
                    navId: '0',//关联类目一级类目ID
                    navChildId: '1',//关联类目二级类目ID
                },
                rules: {
                    goodsName: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                        {max: 20, message: '长度必须小于20个字符', trigger: 'blur'}
                    ],
                    goodsSubtitle: [
                        {required: true, message: '请输入副标题', trigger: 'blur'},
                        {max: 20, message: '长度必须小于20个字符', trigger: 'blur'}
                    ],
                    brandId: [
                        {required: true, message: '请选择品牌', trigger: 'change'},
                    ],
                    goodsDesc: [
                        {required: true, message: '请输入商品介绍', trigger: 'blur'},
                    ],
                    goodsPrice: [
                        {required: true, message: '请输入商品售价', trigger: 'blur'},
                    ],
                    goodsStock: [
                        {required: true, validator: validGoodsStock, trigger: 'blur'},
                    ],
                    goodsWarning: [
                        {required: true, message: '请输入库存预警值', trigger: 'blur'},
                    ]
                },
                typeList: [
                    {styleName: '食品', id: 0},
                    {styleName: '服装', id: 1},
                    {styleName: '玩具', id: 2},
                ],//类型列表
                propList: [
                    {name: '烧麦', value: ['大份', '小份']},
                    {name: '包子', value: ['肉包', '菜包', "糖包"]},
                ],//step2商品总的属性列表
                propHeader: ['包子', '烧卖'],//step2选中的商品属性名
                checkProp: [],//step2商品选中的具体属性
                checkPropList: [],//商品的选中属性总列表，编辑商品时通过服务器获取，添加商品时通过选择商品属性并点“添加”更新，处理后能得到propHeader和checkProp
                propSpecList: [
                    {
                        nameValue: [{name: '烧麦', value: '大份'}, {name: '包子', value: '肉包'}],
                        goodsSalePrice: 100,
                        goodsStock: 42,
                        stockWarning: 10
                    },
                    {
                        nameValue: [{name: '烧麦', value: '小份'}, {name: '包子', value: '菜包'}],
                        goodsSalePrice: 100,
                        goodsStock: 42,
                        stockWarning: 10
                    },
                ],//step2商品规格列表
                propLoading: false,//属性loading
                paramsList: [
                    {name: '多肉', list: ['少', '中', '微']},
                    {name: '多糖', list: ['全糖', '无糖']},
                    {name: '多菜', list: ['有菜', '无菜']},
                ],//step2商品参数列表

                //保存商品旧属性
                oldStyleId: '',
                oldPropList: [],
                oldCheckProp: [],
                oldPropHeader: [],
                oldCheckPropList: [],
                oldPropSpecList: [],
                oldMerchantParamDetailIds: {},

                albumId: '',//相册id
                albumImgList: [],//相册列表
                checkAlbumImgList: [],//图片库选区图片

                headerList:[
                    {
                        navName: '鞋子',
                        id: '0',
                        list:[
                            {navName: '安踏', id: '0'},
                            {navName: '特步', id: '1'},
                            {navName: '耐克', id: '2'},
                        ]
                    },
                    {
                        navName: '数码',
                        id: '1',
                        list:[
                            {navName: '索尼', id: '0'},
                            {navName: '松下', id: '1'}
                        ]
                    },
                    {
                        navName: '服装',
                        id: '2',
                        list:[
                            {navName: '杰克琼斯', id: '0'},
                            {navName: '南极人', id: '1'},
                            {navName: '李维斯', id: '2'},
                        ]
                    },
                    {
                        navName: '眼镜',
                        id: '3',
                        list: []
                    },
                ],//关联类目一级类目列表
                childHeaderList: [
                    {navName: '安踏', id: '0'},
                    {navName: '特步', id: '1'},
                    {navName: '耐克', id: '2'},
                ],//关联类目二级类目列表
                imgList: ['@', ''],//商品图片列表
                albumList: [
                    {name:'食品',id:0},
                    {name:'服装',id:1},
                    {name:'美妆',id:2},
                ],//相册分类列表
                serverUrl: 'https://ls.diandianyuyue.com',//这里写你要上传的图片服务器地址
                editorOption: {//富文本编辑器功能
                    placeholder: '',
                    theme: 'snow',// or 'bubble' 主题
                    modules:{
                        toolbar:{
                            container: toolbarOptions, // 工具栏
                            handlers:{//handles处理事件，这里主要是图片处理
                                'image': function (value) {
                                    if (value){
                                        //如果上传图片，则触发el-upload节点，上传至服务器
                                        document.querySelector('#uploadEditor input').click();
                                    } else {
                                        //如果没有上传图片，则将图片置空
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        /*mounted(){
            this.loading = true;
            //1.第一次请求:商品一级分类列表
            this.$ajax.post("merchantGoodsType/query_goods_type_tree").then((res) => {
                //第一次请求*响应
                this.categoryList = res;
                //2.第二次请求:商品品牌列表
                this.$ajax.post("merchant_goods_brand/query_list").then((res) => {
                    //第二次请求*响应
                    this.brandList = res;
                    //3.第三次请求:商品类型列表
                    this.$ajax.post("merchantGoodsStyle/merchant_goods_style_list_page",{
                        currentPage:1,//当前页数
                        pageSize: 100,//总页数
                    }).then((res) => {
                        //第三次请求*响应
                        this.typeList = res.list;
                        //4.第四次请求:相册分类列表
                        this.$ajax.post("merchant_goods_galleries/query_for_page",{
                            currentPage: 1,
                            pageSize: 100
                        }).then((res) => {
                            //第四次请求*响应
                            this.albumList = res.list;
                            //5.第五次请求:关联类目一级类目列表
                            this.$ajax.post("merchantNavigation/query_navigation_type_tree").then((res) => {
                                //第五次请求*响应
                                this.headerList = res;

                                //6.判断是否为添加新商品
                                if (this.$route.query.id){
                                    //6.1否，编辑旧商品
                                    //注意:传参是this.$router,接收参数是this.$route,这里千万要看清了！！！
                                    this.isAdd = false;

                                    //6.1.1更新step0里的分类列表
                                    //--6.1.1.1根据id获取商品信息
                                    this.$ajax.post("merchantGoods/merchant_goods_by_id",{
                                        id: this.$route.query.id
                                    }).then((res) => {
                                        this.categoryName = res.typeName;//商品一级分类
                                        this.childCategoryName = res.childName;//商品二级分类
                                        this.$set(this.ruleForm, 'typeId', res.typeId);//一级分类ID
                                        //受ES5的限制。Vue.js不能检测到对象属性的添加或删除。因为 Vue.js在初始化实例时将属性转为getter/setter，所以属性必须在data对象上才能让Vue.js转换它，才能让它是响应的。而这里typeId是在data对象上的ruleForm属性里的，所以必须使用$set

                                        //--6.1.1.2判断商品是否有二级分类
                                        if (String(res.childId)){//是
                                            this.$set(this.ruleForm, 'childId', res.childId);//二级分类ID
                                            //把商品一级分类ID与总分类列表里匹配，从而获取二级列表
                                            this.categoryList.map((item) => {
                                                if (item.id === res.typeId) {
                                                    //更新step0里二级分类列表的数据
                                                    this.childCategoryList = item.list;
                                                }
                                            })
                                        }
                                        //6.1.2更新step1里面的表单数据
                                        this.$set(this.ruleForm, 'goodsName', res.goodsName);
                                        this.$set(this.ruleForm, 'goodsSubtitle', res.goodsSubtitle);
                                        this.$set(this.ruleForm, 'brandId', res.brandId);
                                        this.$set(this.ruleForm, 'goodsDesc', res.goodsDesc);
                                        this.$set(this.ruleForm, 'goodsNo', res.goodsNo);
                                        this.$set(this.ruleForm, 'goodsPrice', res.goodsPrice);
                                        this.$set(this.ruleForm, 'marketPrice', res.marketPrice);
                                        this.$set(this.ruleForm, 'goodsStock', res.goodsStock);
                                        this.$set(this.ruleForm, 'goodsWarning', res.goodsWarning);
                                        this.$set(this.ruleForm, 'goodsUnit', res.goodsUnit);
                                        this.$set(this.ruleForm, 'goodsWeight', res.goodsWeight);
                                        this.$set(this.ruleForm, 'goodsMobileImg', res.goodsMobileImg);
                                        this.$set(this.ruleForm, 'styleId', res.styleId);
                                        this.$set(this.ruleForm, 'merchantParamDetailIds', res.merchantParamDetailIds);
                                        this.$set(this.ruleForm, 'navId', res.navId);
                                        this.$set(this.ruleForm, 'navChildId', res.navChildId);
                                        //6.1.3更新step3里的关联类目列表
                                        if (String(res.navId)){
                                            this.headerList.map((item) => {
                                                if (item.id === res.navId){
                                                    //更新关联类目二级列表
                                                    this.childHeaderList = item.list;
                                                }
                                            })
                                        }
                                        //6.1.4更新step2商品属性里的参数/特殊属性列表
                                        this.paramsList = res.merchantParamDetailIds.merchantParamDetails;
                                        this.propSpecList = res.merchantGoodsTypePropertyList;
                                        //6.1.5根据商品类型向服务器请求step2里的商品常规属性列表
                                        this.$ajax.post("merchantGoodsProperty/merchant_goods_property_list_page",{
                                            styleId: res.styleId,
                                            currentPage: 1,
                                            pageSize: 100,
                                        }).then((res) =>{
                                            let list = [];
                                            res.list.map((item) => {
                                                list.push({
                                                    name: item.propertyName,
                                                    value: item.propertyList.split(",")
                                                });
                                            });
                                            this.propList = list;

                                            //6.1.6获取商品的选中属性
                                            this.checkPropList = res.map;//服务器获取的数据
                                            let checkProp = [];//选中的具体属性
                                            let propHeader = [];//选中的属性名
                                            //处理逻辑
                                            this.checkPropList.map((item) => {
                                                propHeader.push(item.name);
                                                item.value.map((prop) => {
                                                    checkProp.push(item.name + prop);
                                                })
                                            });
                                            //赋值
                                            this.checkProp = checkProp;
                                            this.propHeader = propHeader;

                                            //6.1.7保存商品的旧属性
                                            this.oldStyleId = res.styleId;
                                            this.oldPropList = list;
                                            this.oldCheckProp = checkProp;
                                            this.oldCheckPropList = res.map;
                                            this.oldPropHeader = propHeader;
                                            this.oldPropSpecList = res.merchantGoodsTypePropertyList;
                                            this.oldMerchantParamDetailIds = res.merchantParamDetailIds;
                                            //6.1.8保存商品图片信息
                                            if (res.goodsImg){
                                                this.imgList = res.goodsImg.split(',');
                                            }
                                            //6.1.9编辑旧商品的数据处理完毕，关闭加载状态
                                            this.loading = false;
                                        })
                                    })
                                }
                                //7.isAdd=true，是添加新商品，所有数据为空，关闭加载状态
                                this.loading = false;
                            })
                        })
                    })
                })

            })
        },*/
        methods: {
            /**
             * step0 点击商品一级分类
             */
            getCategory(item){
                //判断是否跟原有属性一样
                if (this.ruleForm.typeId !== item.id){
                    this.ruleForm.typeId = item.id;
                    this.ruleForm.childId = '';
                    this.childCategoryName = '';
                    this.childCategoryList = item.list;
                    this.categoryName = item.typeName;
                }
            },
            /**
             * step0 点击商品二级分类
             */
            getChildCategory(item){
                this.ruleForm.childId = item.id;
                this.childCategoryName = item.typeName;
            },
            /**
             * step0 提交商品分类
             */
            submitType() {
                if (!this.ruleForm.typeId){
                    this.$msgErr("请先选择商品分类");
                    return
                }
                this.stepActive = 1;
            },
            /**
             * step1提交商品信息表单
             */
            submitForm(formName){
                //Function(callback: Function(boolean, object))
                this.$refs[formName].validate((valid)=>{
                    if (valid){
                        this.stepActive = 2;
                        document.documentElement.scrollTop = 0
                    } else {
                        return false;
                    }
                });
            },
            /**
             * step2 商品属性选择商品类型
             */
            getProp(id) {
                //判断是否跟原来的类型一样
                if (id === this.oldStyleId){
                    //1.如果一样，则数据跟原来的一样，并更新参数列表
                    this.propList = this.oldPropList;
                    this.checkProp = this.oldCheckProp;
                    this.checkPropList = this.oldCheckPropList;
                    this.propHeader = this.oldPropHeader;
                    this.propSpecList = this.oldPropSpecList;
                    this.ruleForm.merchantParamDetailIds = this.oldMerchantParamDetailIds;
                    this.$ajax.post("merchantGoodsParam/merchant_goods_property_list_page",{
                        styleId: id,
                        currentPage: 1,
                        pageSize: 100
                    }).then((res) => {
                        let list = [];
                        res.list.map((item) => {
                            list.push({
                                name: item.paramName,
                                list: item.paramList.split(",")
                            })
                        });
                        this.paramsList = list;
                    })
                } else {
                    //2.如果不一样，则重新拉取数据
                    //2.1清空原有数据
                    this.checkProp = [];
                    this.checkPropList = [];
                    this.propHeader = [];
                    this.propSpecList = [];
                    this.propLoading = true;
                    //2.2请求属性列表
                     this.$ajax.post("merchantGoodsProperty/merchant_goods_property_list_page",{
                         styleId: id,
                         currentPage: 1,
                         pageSize: 100
                     }).then((res) => {
                         let list = [];
                         res.list.map((item) => {
                             list.push({
                                 name: item.propertyName,
                                 value: item.propertyList.split(",")
                             });
                         });
                         this.propList = list;
                         //2.3请求参数列表和商品参数名
                         this.$ajax.post("merchantGoodsParam/merchant_goods_property_list_page",{
                             styleId: val,
                             currentPage: 1,
                             pageSize: 100,
                         }).then((res) => {
                             let list = [];
                             let formList = [];
                             res.list.map((item) => {
                                 list.push({
                                     name: item.paramName,
                                     list: item.paramList.split(",")
                                 });
                                 formList.push({
                                     paramDetailName: item.paramName,
                                     specificationsValue: ''
                                 })
                             });
                             this.paramsList= list;
                             this.$set(this.ruleForm, 'merchantParamDetailIds', {
                                 'merchantParamDetails': formList,
                                 'mainMaterial': '',
                                 'paramObject': '',
                             });
                             this.propLoading = false;
                         });
                     },(err) => {
                         this.$msgErr('无法请求服务器')
                     })
                }
            },
            /**
             * step2 选择商品属性
             */
            handleCheckProp(prop, name, $event){
                //1.如果是勾选
                if ($event){
                    if (this.checkPropList.length === 0){
                        this.checkPropList.push({
                            name: name,
                            value: [prop]
                        })
                    } else {
                        let isExist = false;
                        for (let i = 0; i < this.checkPropList.length; i++){
                            if (this.checkPropList[i].name === name){
                                this.checkPropList[i].value.push(prop);
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist){
                            this.checkPropList.push({
                                name: name,
                                value: [prop]
                            })
                        }
                    }
                } else {
                    //如果是取消勾选
                    for (let i = 0; i < this.checkPropList.length; i++) {
                        if (this.checkPropList[i].name === name){
                            for (let j = 0; j < this.checkPropList[i].value.length; j++){
                                if (this.checkPropList[i].value[j] === prop){
                                    this.checkPropList[i].value.splice(j,1);
                                    if (this.checkPropList[i].value.length === 0){
                                        this.checkPropList.splice(i,1)
                                    }
                                    return;
                                }
                            }
                        }
                    }
                }
            },

            /**
             * step2 把选择的商品属性添加到商品ruleForm里
             */
            addProps(){
                //注意：为了测试，data里属性“食品”的ID是0，造成
                //!this.ruleForm.styleId这条判断返回为true
                // 正常服务器返回的商品类型ID不会为0
                if (!this.ruleForm.styleId){
                    this.$msgWar("请选择商品类型");
                    return
                }
                if (!this.checkPropList.length === 0){
                    this.$msgWar("请选择商品属性");
                    return
                }
                let propHeader = [];
                let propArr = [];
                this.checkPropList.map((item,index) => {
                    propHeader.push(item.name);
                    propArr[index] = [];
                    this.checkPropList[index].value.map((val) => {
                        propArr[index].push({
                            name: this.checkPropList[index].name,
                            value: val
                        })
                    })
                });
                this.propHeader = propHeader;
                let propItem = sortAll(propArr);
                this.propSpecList = [];
                propItem.map((item) => {
                    this.propSpecList.push({
                        nameValue: item instanceof Array ? item : [item],
                        goodsSalePrice: '',
                        goodsStock: '',
                        stockWarning: '',
                        skuCode: ''
                    })
                });

                //sortAll(arr)处理前：
                // propArr = [
                //     [
                //      {name: '烧麦',value: '大份'},
                //      {name: '烧麦',value: '小份'}
                //      ],
                //     [
                //      {name: '包子',value: '肉包'},
                //      {name: '包子',value: '菜包'},
                //      {name: '包子',value: '糖包'}
                //      ]
                // ]
                /**
                 * 把propArr不同属性名下的属性排列组合，得到不同的商品规格列表
                 * @param arr
                 * @returns {Array}
                 */
                function sortAll(arr) {
                    let len = arr.length;
                    if (len >= 2){
                        let len1 = arr[0].length;
                        let len2 = arr[1].length;
                        let lenBoth = len1 * len2;
                        let items = new Array(lenBoth);
                        let index = 0;
                        for (let i = 0; i < len1; i++){
                            for (let j = 0; j < len2; j++){
                                if (arr[0][i] instanceof Array){
                                    items[index] = [...arr[0][i],arr[1][j]];
                                } else {
                                    items[index] = [arr[0][i],arr[1][j]];
                                }
                                index++;
                            }
                        }
                        let newArr = new Array(len -1);
                        for (let i = 2; i <arr.length; i++){
                            newArr[i -1] = arr[i];
                        }
                        newArr[0] = items;
                        return sortAll(newArr);
                    } else {
                        return arr[0]
                    }
                }
                //sortAll(arr)处理后：
                /* newPropArr = [
                    [ { name: '烧麦', value: '大份' }, { name: '包子', value: '肉包' } ],
                    [ { name: '烧麦', value: '大份' }, { name: '包子', value: '菜包' } ],
                    [ { name: '烧麦', value: '大份' }, { name: '包子', value: '糖包' } ],
                    [ { name: '烧麦', value: '小份' }, { name: '包子', value: '肉包' } ],
                    [ { name: '烧麦', value: '小份' }, { name: '包子', value: '菜包' } ],
                    [ { name: '烧麦', value: '小份' }, { name: '包子', value: '糖包' } ]
                ]*/
            },

            /**
             * step2把图片设为主图
             */
            setMainPic(url,index){
                this.imgList.splice(index,1);
                this.imgList.unshift(url);
            },

            /**
             * step2删除图片
             */
            deleteImg(index){
                this.imgList.splice(index,1);
            },
            /**
             * step2商品上传图片
             */
            uploadGoodImg(file) {
                //1.判断是否上传过多图片
                let files = file.target.files;//获取上传的图片列表
                if (files.length + this.imgList.length > 5){
                    this.$msgWar("商品图片最多5张");
                    return
                }
                //2.处理上传的图片
                let imgUrl = this.imgList;
                let promiseList = [];
                for (let i = 0; i < files.length; i++){
                    //2.1处理空图片
                    if (files[i] === []){
                        continue;
                    }
                    //2.2用服务器处理成功上传的图片地址
                    promiseList.push(this.uploadFiles(files[i]))
                }
                //3.更新视图层图片列表
                Promise.all(promiseList).then((res) => {
                    res.map((item) => {
                        //debugger:有个疑问：这里把所有处理好的图片连接都已经加到imgUrl里面了，但是this.imgList数据好像并没有更新？是否应该在最后加上“this.imgList = imgUrl”？待解答
                        imgUrl.push(item.imgUrl)
                    })
                },() => {
                    this.$msgErr("上传失败");
                })
            },
            /**
             * step2 富文本编辑器调用的el-upload上传图片
             */
            uploadEditor(files){
                this.uploadFiles(files.file).then((res) => {
                    let imgUrl = res.imgUrl;
                    //1.检验上传是否成功
                    if (imgUrl){
                        // alert('成功上传！');
                        let quill = this.$refs.myQuillEditor.quill;//获取quill-editor这个DOM元素
                        let length = quill.getSelection().index;//getSelection()方法可以返回一个Selection对象，用于表示用户选择的文本范围或插入符的当前位置。
                        //2.插入图片
                        quill.insertEmbed(length,'image',imgUrl);
                        //第一个参数：插入的位置/长度
                        //第二个参数：插入的文件格式
                        //第一个参数：插入的内容
                        //3.调整光标到最后
                        quill.setSelection(length + 1);
                    } else {
                        this.$msgErr("上传失败");
                    }
                })
            },

            /**
             * step2 完成填写，提交商品属性
             */
            submitProp(){
                let formData = this.ruleForm;
                //1.检查商品类型是否选择
                if (!formData.styleId){
                    this.$msgWar("请填写商品类型");
                    return
                }
                //2.检查商品规格是否选择
                if (this.checkPropList.length === 0){
                    this.$msgWar("请选择商品规格");
                    return
                }
                //3检查商品规格列表是否填写
                if (this.propSpecList.length === 0){
                    this.$msgWar("请添加商品规格列表");
                    return
                }
                //4.检查商品规格列表填写是否符合规范
                for (let i = 0; i < this.propSpecList.length; i++){
                    let data = this.propSpecList[i];
                    if (!data.goodsSalePrice || !data.goodsStock || !data.stockWarning){
                        this.$msgWar("请填写完整商品规格列表");
                        return
                    }
                    if (data.goodsStock > 99999 || data.stockWarning > 99999){
                        this.$msgWar("库存最大值为99999");
                        return
                    }
                    if (data.goodsSalePrice < 0){
                        this.$msgWar("规格列表商品售价不能小于0");
                        return
                    }
                    if (data.goodsStock < 0){
                        this.$msgWar("规格列表商品库存不能小于0");
                        return
                    }
                    if(data.stockWarning < 0){
                        this.$msgWar("规格列表库存预警值不能小于0");
                        return
                    }
                }
                //5.检查商品参数是否填写
                for (let j = 0; j < formData.merchantParamDetailIds.merchantParamDetails.length; j++){
                    if (!formData.merchantParamDetailIds.merchantParamDetails[j].specificationsValue){
                        this.$msgWar("请录入商品参数");
                        return
                    }
                }
                if (!formData.merchantParamDetailIds.mainMaterial || !formData.merchantParamDetailIds.paramObject) {
                    this.$msgWar("请录入商品参数");
                    return
                }
                //6.检查商品图片是否上传
                if (this.imgList.length === 0){
                    this.$msgWar("请上传商品图片");
                    return
                }
                this.stepActive = 3;
            },

            /**
             * step3 选择关联一级类目
             */
            getHeader(item){
                if (this.ruleForm.navId !== item.id) {
                    this.ruleForm.navId = item.id;
                    this.ruleForm.navChildId = '';
                    this.childHeaderList = item.list;
                }else {
                    this.ruleForm.navId = '';
                    this.ruleForm.navChildId = '';
                    this.childHeaderList = []
                }
            },

            /**
             * step3 选择关联二级类目
             */
            getChildHeader(item){
                this.ruleForm.navChildId = item.id;
            },
            /**
             * step3 完成商品编辑并提交
             */
            submitGoods(){
                alert('完成提交！');
                //1.规则检查
                if (this.ruleForm.navId && !this.ruleForm.navChildId){
                    this.$msgWar('选了一级类目必须选择二级类目');
                    return
                }
                //2.规范商品表格数据
                let formData = JSON.parse(JSON.stringify(this.ruleForm));
                if (!formData.merchantParamDetailIds.merchantParamDetails) {
                    formData.merchantParamDetailIds.merchantParamDetails = [];
                }
                formData.goodsImg = this.imgList.join(',');
                formData.merchantSpecifications = this.checkPropList;
                formData.merchantGoodsTypePropertyList = this.propSpecList;

                //3.检查是否编辑/添加商品
                if (this.isAdd){//添加新商品
                    this.$ajax.post("merchantGoods/merchant_goods_add",formData).then(() => {
                        this.$msgSuc("添加商品成功");
                        setTimeout(() => {
                            this.back();
                        },500)
                    },(err) => {
                        this.$msgErr(err.msg);
                    })
                } else {//编辑旧商品
                    formData.id = this.$route.query.id;
                    this.$ajax.post("merchantGoods/merchant_goods_update",formData).then(() => {
                        this.$msgSuc("修改成功");
                        setTimeout(() => {
                            this.back();
                        },500)
                    },(err) => {
                        this.$msgErr(err.msg);
                    })
                }
            },

            /**
             * step2 图片库弹窗：根据选择图库分类从服务器获取图片列表
             */
            getAlbumImg(val){
                this.albumId = val;
                this.$ajax.post("merchant_goods_galleries_detail/query_for_page",{
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    galleriesId: val
                }).then((res) => {
                    this.albumImgList = res.list;
                    this.total = res.totalCount;//图片总数,需要传给分页组件
                })
            },

            /**
             * step2 图片库弹窗：点击选择商品图片
             */
            checkAlbumImg(item){
                //检查图片选区列表中是否有当前图片
                if (this.checkAlbumImgList.indexOf(item.imgUrl) < 0){
                    //没有,添加这张图片
                    if (this.checkAlbumImgList.length + this.imgList.length >= 5){
                        this.$msgWar("最多添加5张");
                        return
                    }
                    this.checkAlbumImgList.push(item.imgUrl);
                }else {
                    //有,删除这张图片
                    this.checkAlbumImgList.splice(this.checkAlbumImgList.indexOf(item.imgUrl), 1);
                }
            },

            /**
             * step2 图片库弹窗：图片库翻页
             * @param {number}val
             */
            next(val){
                this.currentPage = val;
                this.getAlbumImg(this.albumId);
            },

            /**
             * step2 图片库弹窗：确定按钮
             */
            addImg(){
                this.imgList = [...this.imgList, ...this.checkAlbumImgList];
                this.checkAlbumImgList = [];
                this.dialogVisible = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .form-wrap {
        margin-top: 50px;
        > div {
            width: 100%;
        }
        .form-label {
            width: 175px;
            height: 50px;
            line-height: 50px;
            color: #fff;
            padding: 0 20px;
            box-sizing: border-box;
            background-color: $green;
            position: relative;
            margin-right: 100px;
            &::after {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                right: -50px;
                border: 25px solid transparent;
                border-left-color: $green;
            }
        }
        .form-item-3 {
            margin-bottom: 40px;
            &:last-child > .form-label {
                margin-bottom: 20px;
            }
        }
    }

    .select-category {
        margin-top: 40px;
        .title {
            height: 48px;
            line-height: 48px;
            border: $border;
            border-bottom-color: transparent;
            padding: 0 24px;
            box-sizing: border-box;
        }
        img {
            margin: 0 36px;
        }
        .flex-1 {
            max-width: 380px;
        }
        .category-list {
            height: 380px;
            position: relative;
            border: $border;
            box-sizing: border-box;
            overflow: auto;

            li {
                height: 48px;
                line-height: 48px;
                color: $gray;
                border-bottom: $border;
                padding: 0 24px;
                cursor: pointer;

                i {
                    margin-top: 17px;
                }

            }
            .active {
                background-color: $green;
                color: #fff;
            }

            .empty {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: $gray;
            }
        }
    }

    .tips {
        font-size: 14px;
        margin: 20px 0;
        span {
            color: $green;
        }
    }

    .form-info, .form-prop {
        width: 500px;
    }

    .label-2 {
        margin-top: 274px;
    }

    .form-tips {
        font-size: 12px;
        color: $gray;
        line-height: 16px;
        margin-top: 5px;
    }

    .prop-wrap {
        padding: 20px;
        border: $border;
        border-radius: 4px;
    }

    .goods-table {
        border-radius: 4px;
        border-right: $border;
        border-bottom: $border;
        thead {
            background-color: #EEEEEE;
        }
        td {
            height: 50px;
            color: $gray;
            text-align: center;
            border-left: $border;
            border-top: $border;
            padding: 0 20px;
        }
    }

    .upload-wrap {
        margin-right: 20px;
        margin-bottom: 20px;
        border: $border;
        .img-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 160px;
            height: 160px;
            border-bottom: $border;
            i {
                color: $gray;
                font-size: 30px;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        > div:last-child {
            height: 40px;
            background-color: #f8f9fc;
        }
    }

    .upload-btn-wrap {
        margin-right: 20px;
    }

    .editor{
        width: 800px;
        height: 300px;
        padding-bottom: 20px;
    }
    .mt20{
        margin-top: 20px;
    }
    .dialog-footer{
        button:last-child{
            margin-right: 0;
        }
    }
</style>