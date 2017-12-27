<template>
		<div class="datasource">
            <datasource language="zh-CN" :table-data="getData" :columns="columns" :pagination="information.pagination"
                        :actions="actions"
                        v-on:change="changePage"
                        v-on:searching="onSearch"></datasource>
		</div>
</template>

<script>
    import axios from 'axios';
    import Datasource from 'vue-datasource';
    /*
    *       {
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
	        }
    * */
	export default {

	    data() {
          const self = this;
	      return {
              url: './static/datasource.json',
              information:{
                  pagination:{},
                  data:[]
              },
	          columns: [
                    {
                        name:'用户ID',
                        key:'id'
                    },
                    {
                        name:"用户名",
                        key:'name'
                    },
                    {
                        name:"角色权限",
                        key:'email'
                    },
                    {
                        name:"关联账号",
                        key:'ip'
                    },
                    {
                        name:"操作",
                        key:'email'
                    },
                    {
                        name:"状态",
                        key:'email'
                    }
              ],
                actions: [
                    {
                        text: 'Click',
                        class: 'btn-primary',
                        event(e, row) {
                            self.$message('选中的行数： ' + row.row.id);
                        }
                    }
                ],
              query:'',
              limits: [1, 5, 10, 15],
              perpage: 5,

	      }
	    },
	    methods: {
            changePage(values) {
                console.log(values);
                this.information.pagination.per_page = values.perpage;
                this.information.data = this.information.data;
            },
            onSearch(searchQuery) {
                this.query = searchQuery;
            }
	    },
        components:{
            Datasource
        },
        computed:{
            getData(){
                const self = this;
                return self.information.data.filter(function (d) {
                    if(d.name.indexOf(self.query) > -1){
                        return d;
                    }
                })
            }
        },
        beforeMount(){
	        this.limits = [1, 5, 10, 15];
            if(process.env.NODE_ENV === 'development'){
//                this.url = '/ms/table/source';
                this.url = '/static/datasource.json';

            };
            axios.get(this.url).then( (res) => {
                this.information = res.data;

            })
        }
	  }
</script>

<style>
.datasource{
    margin-top:10px;
}
</style>
<style src="../../../../static/css/datasource.css"></style>

