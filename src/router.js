import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Home from './views/Home'
import Welcome from "@/views/Welcome";
import Users from "@/views/user/Users"
import Rights from "@/views/permission/Rights";
import Roles from "@/views/permission/Roles";
import Cate from "@/views/goods/Cate";

Vue.use(Router)

const router = new Router({
    routes: [
        {path: "/", redirect: '/login'},
        {path: '/login', component: Login},
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {path: '/welcome', component: Welcome},
                {path: '/users', component: Users},
                {path: '/rights', component: Rights},
                {path: '/roles', component: Roles},
                {path: '/categories', component: Cate}
            ]
        },
    ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // next() 放行  next('/login')  强制跳转
    if (to.path == '/login') return next();
    const tokenStr = sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router
