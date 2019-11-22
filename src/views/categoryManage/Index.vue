<template>
  <div class="category">
    <el-table
            v-loading="listLoading"
            :key="tableKey"
            border
            fit
            highlight-current-row
            style="width: 100%;margin-top: 40px;float: left;clear: both;"
           >
      <el-table-column label="消费地点"  align="center" width="200">
        <template slot-scope="scope">
          <span>dsadsa</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆信息" width="180px" align="center">
        <template slot-scope="scope">
          <span>dsada</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="消费地点" width="150px" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.address }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="员工信息" width="250px" align="center">
        <template slot-scope="scope">
          <span>dsadsa</span>
        </template>
      </el-table-column>
      <el-table-column label="销售金额" width="250px" align="center">
        <template slot-scope="scope">
          <span>vv</span>
        </template>
      </el-table-column>
      <el-table-column label="消费时间" width="250px" align="center">
        <template slot-scope="scope">
          <span>aa</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    data() {
      return {
          listLoading:true,
          tableKey: 0,
      }
    },
    created(){
        var _this=this
        setTimeout(()=>{
            _this.listLoading=false
        },1000)
    }  ,
    methods: {


    },
    components: {

    },
    mounted: function () {

    }
  }
</script>
<style lang="scss">


</style>
