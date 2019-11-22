<template>
  <div id="app" @click="handleTime">
    <router-view name="blank"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
      data (){
          return {
              timmer: null,
              lastTime: null
          }
      },
      mounted () {
          window.setInterval(this.tTime, 1000)
      },
      methods:{
          handleTime() {
              const curTime = new Date();
              console.log(curTime - this.lastTime)
              if (curTime - this.lastTime > 1000 * 60 * 30) {
                  if (this.$route.path == '/login') {
                      this.lastTime = new Date();
                      return
                  }
                  //退出
                  this.$message({
                      message: '因长时间未操作，请重新登录！',
                      type: 'error',
                      duration:1000
                  })
                  setTimeout(()=>{
                      sessionStorage.removeItem(this.$Config.tokenKey);
                      this.$router.push({path: '/login'});
                  },1000)
                  setTimeout(() => {
                      this.$store.dispatch('FedLogOut').then(() => {
                          this.$router.push({path: '/login'})
                          location.reload()
                      })
                  }, 2000)

              } else {
                  this.lastTime = curTime;
              }
          }
      },
      created() {
          this.lastTime = new Date();
          window.addEventListener('resize', () => {
              this.handleTime();
          })

          window.addEventListener('scroll', () => {
              if (this.timmer) {
                  clearTimeout(this.timmer);
              }

              this.timmer = setTimeout(() => {
                  this.handleTime();
              }, 3000)
          }, true)
      }
  }
</script>

<style lang="scss">
  #app {
    background-color: #222d32;
  }

</style>
