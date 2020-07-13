<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区-->
        <el-card class="box-card">
            <!-- 搜索与添加区 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                queryInfo: {
                    pageNum: 1,
                    pageSize: 2
                }
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                this.queryInfo.columnFilters = {name: {name:'name', value:''}}
                const {data:res} = await this.$http.post('managers', this.queryInfo)
                console.log(res)
            }
        }
    }
</script>

<style scoped>

</style>