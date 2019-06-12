import Vue from 'vue'
import Router from 'vue-router'

import Admin from '@/views/admin/Admin'
import admin_edit from '@/views/admin/admin_edit'
import user_edit from '@/views/admin/user_edit'
import category from '@/views/admin/category'
import goods from '@/views/admin/goods'
import goods_add from '@/views/admin/goods_add'
import goods_edit from '@/views/admin/goods_edit'
import record from '@/views/admin/recorddetail'

import GoodsList from '@/views/GoodsList'
import Register from '@/views/Register'
import Home from '@/views/Home'
import GoodDetail from '@/views/GoodDetail'
import GoodUpload from '@/views/GoodUpload'
import Solding from '@/views/Solding'
import DealRecord from '@/views/DealRecord'
import BuyRecord from '@/views/BuyRecord'
import EditPersonal from '@/views/EditPersonal'
import EditSolding from '@/views/Edit_Solding'

Vue.use(Router)

const router= new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
    },
    {
      path:'/gooddetail',
      name:'gooddetail',
      component:GoodDetail
    },
    {
      path:'/register',
      name:'Register',
      component:Register

    },
    {
      path:'/goodupload',
      name:'GoodUpload',
      component:GoodUpload
    },
    {
      path:'/solding',
      name:'Solding',
      component:Solding
    },
    {
      path:'/buyrecord',
      name:'BuyRecord',
      component:BuyRecord
    },
    {
      path:'/dealrecord',
      name:'DealRecord',
      component:DealRecord
    },
    {
      path:'/editpersonal',
      name:'EditPersonal',
      component:EditPersonal
    },
    {
      path:'/editsolding',
      name:'EditSolding',
      component:EditSolding
    },
    {
      path:'/adminlogin',
      name:'AdminLogin',
      component:()=>import('@/views/admin/adminLogin.vue')
    },
    {
      path: '/admin',
      name: 'Admin',
      redirect: '/admin/adminedit',
      component: Admin,

      children: [
        {
          path: 'adminedit',
          component: admin_edit
        },
        {
          path: 'useredit',
          component: user_edit
        },
        {
          path: 'category',
          component: category
        },
        {
          path: 'goods',
          component: goods
        },
        {
          path: 'goods_add',
          name: 'goods_add',
          component: goods_add
        },
        {
          path: 'goods_edit',
          name: 'goods_edit',
          component: goods_edit
        },
        {
          path:'record',
          name:'record',
          component:record
        }
      ]
    }
  ]
})

// router.beforeEach((to, from, next) => {

// })
export default router