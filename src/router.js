import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Home from './views/Home'
Vue.use(Router)

const router = new Router({
    routes: [
        { path: "/", redirect: '/login'},
        { path: '/login', component: Login},
        { path: '/home', component: Home}
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
