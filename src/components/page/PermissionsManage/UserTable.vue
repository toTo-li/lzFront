<template>
		<div>
			<el-table
			    :data="tableData"
			    max-height="450"
			    style="width: 100%">
			    
			    <el-table-column
			      label="用户ID"
			      width="180">
			      <template slot-scope="scope">
			        <!--<i class="el-icon-time"></i>-->
			        <span style="margin-left: 10px">{{ scope.row.id }}</span>
			      </template>
			    </el-table-column>
			    
			    <el-table-column
			      label="用户名"
			      width="180">
			      <template slot-scope="scope">
			        <!--<el-popover trigger="hover" placement="top">
			          <p>姓名: {{ scope.row.name }}</p>
			          <p>住址: {{ scope.row.address }}</p>
			          <div slot="reference" class="name-wrapper">
			            <el-tag size="medium">{{ scope.row.name }}</el-tag>
			          </div>
			        </el-popover>-->
			        <span>{{ scope.row.name }}</span>
			        
			      </template>
			    </el-table-column>
			    
			    <el-table-column
			      label="角色权限"
			      width="180">
			      <template slot-scope="scope">
			        <!--<i class="el-icon-time"></i>-->
			        <span>{{ scope.row.userPermis }}</span>
			      </template>
			    </el-table-column>
			    
			     <el-table-column
			      label="关联账号"
			      width="180">
			      <template slot-scope="scope">
			        <!--<i class="el-icon-time"></i>-->
			        <span>{{ scope.row.relatedAccount }}</span>
			      </template>
			    </el-table-column>
			    
			    <el-table-column label="操作">
			      <template slot-scope="scope">
			        <el-button 
			          size="mini"
			          @click="handleEdit(scope.$index, scope.row)"
			          v-if="scope.row.Operations.see"
			          >查看</el-button>
			        <el-button
			          size="mini"
			          type="danger"
			          @click="handleDelete(scope.$index, scope.row)"
			          v-if="scope.row.Operations.update"
			          >修改</el-button>
			        <el-button
			          size="mini"
			          type="danger"
			          @click="handleDelete(scope.$index, scope.row)"
			          v-if="scope.row.Operations.dele"
			          >删除</el-button>
			        <el-button
			          size="mini"
			          type="danger"
			          @click="handleDelete(scope.$index, scope.row)"
			          v-if="scope.row.Operations.stop"
			          >暂停</el-button>
			      </template>
			    </el-table-column>
			    
			     <el-table-column
			      label="状态"
			      width="180">
			      <template slot-scope="scope">
			        <!--<i class="el-icon-time"></i>-->
			        <span >{{ scope.row.state }}</span>
			      </template>
			    </el-table-column>
			    
		  </el-table>
		</div>
</template>

<script>
	export default {
	    data() {
	      return {
	        tableData: [{
	          id:1,
	          name: '王小虎1',
	          userPermis: '系统管理员',
	          relatedAccount:'shenhe1',
	          Operations:{
	          	see:false,
	          	update:true,
	          	dele:false,
	          	stop:true
	          },
	          state:"启用"
	        }, {
	          id:2,
	          name: '王小虎2',
	          userPermis: '系统管理员',
	          relatedAccount:'shenhe1',
	          Operations:{
	          	see:true,
	          	update:true,
	          	dele:false,
	          	stop:false
	          },
	          state:"启用"
	        }, {
	          id:3,
	          name: '王小虎3',
	          userPermis: '系统管理员',
	          relatedAccount:'shenhe1',
	          Operations:{
	          	see:true,
	          	update:true,
	          	dele:true,
	          	stop:false
	          },
	          state:"启用"
	        }, {
	          id:4,
	          name: '王小虎4',
	          userPermis: '系统管理员',
	          relatedAccount:'shenhe1',
	          Operations:{
	          	see:true,
	          	update:true,
	          	dele:false,
	          	stop:false
	          },
	          state:"暂停"
	        }]
	      }
	    },
	    methods: {
	      handleEdit(index, row) {
	        console.log(index, row);
	      },
	      handleDelete(index, row) {
	        console.log(index, row);
	      }
	    }
	  }
</script>

<style>
	.el-table{
		margin-top:10px;
	}
</style>