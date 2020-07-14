<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区-->
        <el-card>
            <el-table :data="rightList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level===1">一级</el-tag>
                        <el-tag type="success" v-if="scope.row.level===2">二级</el-tag>
                        <el-tag type="warning" v-if="scope.row.level===3">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="排序优先级" prop="order"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                rightList : []
            }
        },
        created() {
            this.getRightList()
        },
        methods : {
            async getRightList() {
                const {data: res} = await this.$http.get('rights/list')
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.rightList = res.data
                console.log(res.data)
            }
        }
    }
</script>

<style scoped>

</style>