<template>
  <div class="category">
    <el-table
            v-loading="listLoading"
            :data="tableData"
            size="small"
            header-align="center"
            style="width: 100%"
    >
      <el-table-column
              sortable
              prop="name"
              label="角色名称"
              header-align="center"
              align="center"
      />
      <el-table-column
              :show-overflow-tooltip="true"
              prop="id"
              label="角色标识"
              align="center"
              header-align="center"/>
      <el-table-column
              :show-overflow-tooltip="true"
              sortable
              prop="statess"
              label="启用状态"
              header-align="center"
              align="center"
      >
        <template slot-scope="scope">
          <i v-if="scope.row.statess!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
          <i v-if="scope.row.statess==1" class="fa fa-circle text-success ml5" style="color: #15db81"/>
        </template>
      </el-table-column>
      <el-table-column
              prop="userOnline"
              label="操作"
              width="120">
        <template slot-scope="scope">
          <el-dropdown @command="dropdownCommand">
            <el-button size="mini">
              <i class="el-icon-setting"/>
              <span class="el-icon-arrow-down"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{type:'menu'}">
                分配权限
              </el-dropdown-item>
              <el-dropdown-item :command="{type:'user'}">
                用户列表
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
            :current-page="pageForm.pageNumber"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageForm.pageSize"
            :total="pageForm.totalCount"
            style="margin-top: 20px"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="pageSizeChange"
            @current-change="pageNumberChange"/>
    <!--权限列表分页-->

    <el-dialog
            title="分配权限"
            :visible.sync="dialogVisible"
            width="70%"
            :before-close="handleClose">
      <el-tree
              :data="data2"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[2, 3]"
              :default-checked-keys="checheds"
              :props="defaultProps"
              @current-change="abo"
              @check-change="handleCheckChange">
        <span slot-scope="scope" class="custom-tree-node">
          <span>{{scope.data.label}}</span>
          <span>
            <span  style="font-weight: bold">菜单权限 </span>
          </span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
      <el-button @click="Abolitionclose">取 消</el-button>
      <el-button type="primary" @click="AbolitionOk">确 定</el-button>
      </span>
    </el-dialog>


    <!--分配用户到角色-->
    <el-dialog
            title="角色的用户列表"
            :visible.sync="userDialogVisible"
            append-to-body
            width="70%">
      <div class="block">
      </div>
      <el-table
              :data="tableData"
              size="small"
              header-align="center"
              style="width: 100%"
      >

        <el-table-column
                sortable
                prop="name"
                label="用户名"
                center
                align="center"
                header-align="center"/>
        <el-table-column
                :show-overflow-tooltip="true"
                sortable
                prop="statess"
                label="帐号状态"
                header-align="center"
                align="center"
        >
          <template slot-scope="scope">
            <i v-if="scope.row.statess!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
            <i v-if="scope.row.statess==1" class="fa fa-circle text-success ml5" style="color: #15db81"/>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              :total="UserpageForm.totalCount"
              :current-page="UserpageForm.pageNumber"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="UserpageForm.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="userPageSizeChange"
              @current-change="userPageNumberChange"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

    export default {
        data() {
            return {
                listLoading:true,
                tableKey: 0,
                checheds:[],
                tableData:[
                {id:1,name:'阿波',statess:1},
                    {id:1,name:'阿波',statess:1},{id:1,name:'阿波',statess:1},{id:1,name:'阿波',statess:1},
                ],
                // 分页查询参数
                pageForm: {
                    pageNum: 1,
                    pageSize: 10,
                    dataType: 1,
                    totalCount:4,
                },
                UserpageForm:{
                    pageNum: 1,
                    pageSize: 10,
                    dataType: 1,
                    totalCount:4,
                },
                dialogVisible:false,
                userDialogVisible:false,
                data2: [{
                    id: 1,
                    label: '一级 1',
                    flag:false,
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        flag:false,
                        children: [{
                            id: 9,
                            label: '三级 1-1-1',
                            flag:false,
                        }, {
                            id: 10,
                            label: '三级 1-1-2',
                            flag:false,
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    flag:false,
                    children: [{
                        id: 5,
                        label: '二级 2-1',
                        flag:false,
                    }, {
                        id: 6,
                        label: '二级 2-2',
                        flag:false,
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    flag:false,
                    children: [{
                        id: 7,
                        label: '二级 3-1',
                        flag:false,
                    }, {
                        id: 8,
                        label: '二级 3-2',
                        flag:false,
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }

            }
        },
        created(){
            var _this=this
            setTimeout(()=>{
                _this.listLoading=false
            },1000)
        }  ,
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            dropdownCommand(command){
                console.log(command)
                if(command.type=='menu'){
                    this.dialogVisible=true
                    return
                }
                if(command.type=='user'){
                    this.userDialogVisible=true
                    return
                }
            },
            handleCheckChange(val){
                if(!val.flag&&val.children==undefined){
                    val.flag=true
                    this.checheds.push(val.id)
                    console.log(this.checheds)
                    return
                }
                if(val.flag&&val.children==undefined){

                    val.flag=false
                    this.checheds.forEach((item,index)=>{
                        if(val.id==item){
                            console.log("haha")
                            this.checheds.splice(index,1)
                            return
                        }
                    })
                    console.log(this.checheds)
                }

            },
            //权限取消
            Abolitionclose(){
                this.checheds=[]
                this.dialogVisible=false
            },
            //权限确定
            AbolitionOk(){
                this.dialogVisible=false
            },
            pageSizeChange(){

            },
            abo(){
              console.log("eeee")
            },
            userPageSizeChange(){

            },
            pageNumberChange(){

            },
            userPageNumberChange(){

            }


        },
        components: {

        },
        mounted: function () {

        }
    }
</script>
<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

</style>
