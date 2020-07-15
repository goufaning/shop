<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <tree-table :data="cateList" :columns="columns"></tree-table>
            <!-- 分页区域 -->
            <el-pagination :current-page="queryInfo.pageNum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pageSize"
                           layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                cateList: {},
                queryInfo: {
                    // 当前页数
                    pageNum: 1,
                    // 每页多少条数据
                    pageSize: 2,
                    // 搜索用户名
                    paramMap: {type: 3}
                },
                total : 0,
                columns : [
                    {
                    label : '分类名称',
                    prob : 'name'
                    }
                ]
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.post('goods/categories/page', this.queryInfo)
                if (res.code !== 200) {
                    return this.$message.error('获取商品分类列表失败！')
                }
                this.cateList = res.data.content
                this.total = res.data.totalPage
            }
        }
    }
</script>

<style scoped>

</style>