<template>
  <div>
    <h3>测试</h3>
    <router-link to="/test/:12?aid=yes">ttt</router-link>
    <div>
      2 <p>当前路径：{{$route.path}}</p>
      3 <p>当前参数：{{$route.params }}</p>
      4 <p>路由名称：{{$route.name}}</p>
      5 <p>路由查询参数：{{$route.query|json }}</p>
      6 <p>路由匹配项：{{$route.matched |json}}</p>
    </div>

  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>
