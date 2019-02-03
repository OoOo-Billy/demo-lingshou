<template>
    <div>
        <subTitle :subTitle="'系统信息'"/>
        <div class="body">
            <table class="table-middle" border="1">
                <tbody>
                <tr>
                    <td>服务器操作系统:</td>
                    <td>Linux(000.00.00.000)</td>
                    <td>web服务器:</td>
                    <td>xxx/0.0.0</td>
                </tr>
                <tr>
                    <td>PHP版本:</td>
                    <td>0.0.0</td>
                    <td>MySQL版本:</td>
                    <td>--</td>
                </tr>
                <tr>
                    <td>安全模式:</td>
                    <td>--</td>
                    <td>安全模式GID:</td>
                    <td>--</td>
                </tr>
                <tr>
                    <td>Socket支持:</td>
                    <td>--</td>
                    <td>时区设置:</td>
                    <td>Asia/Shanghai</td>
                </tr>
                <tr>
                    <td>GD版本:</td>
                    <td>GD2(JPED GIF PNG)</td>
                    <td>Zilb支持:</td>
                    <td>--</td>
                </tr>
                <tr>
                    <td>IP库版本:</td>
                    <td>xxxxxxxx</td>
                    <td>文件上传的最大大小:</td>
                    <td>40M</td>
                </tr>
                <tr>
                    <td>程序版本:</td>
                    <td>v0.0.0 RELEASE xxxxxxxx</td>
                    <td>安装日期:</td>
                    <td>xxxx-xx-xx</td>
                </tr>
                <tr>
                    <td>编码:</td>
                    <td>UTF-8</td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'

    export default {
        name: "systemInfo",
        components: {
            subTitle,
        },
    }
</script>

<style scoped lang="scss">
    .table-middle {
        width: 70%;
        margin: 0 auto 30px;
        border-right: 1px solid #b4b4b4;
        border-bottom: 1px solid #b4b4b4;

        tr {
            height: 60px;
            background-color: #fff;
        }

        td {
            padding: 0 20px;
            border-left: 1px solid #b4b4b4;
            border-top: 1px solid #b4b4b4;
            color: #5a5a5a;

            &:nth-child(1) {
                background-color: #F9FAFC;
            }

            &:nth-child(3) {
                background-color: #F9FAFC;
            }
        }
    }
</style>