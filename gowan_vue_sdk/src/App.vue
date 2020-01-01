<template>
  <div id="main">
    <!-- <iframe id="game" :src="gameUrl"></iframe> -->
    <div id="game"></div>
    <div id="gowan-ui">
      <router-view/>
      <!--浮标-->
    </div>
  </div>
</template>

<script>

export default {
  name: 'App'
}

</script>

<style>
*{
  margin:0;
  padding:0;
}
.left{
  float:left;
}
.right{
  float:right;
}
#main iframe{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border:none;
  /* border:3px solid red; */

}
#gowan-ui{
  position: relative;
  background: #fff;
}

</style>
