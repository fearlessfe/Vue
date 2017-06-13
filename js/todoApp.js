//存取localStorage中的数据
var store = {
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}

var list=store.fetch("todolist");




var vm = new Vue({
	el:".main",
	data:{
		list:list,
		todo:"",
		editTodos:"",//记录正在编辑的数据
		beforeTitle:"",
		visibility:"all",//通过该属性值得变化进行筛选
	},
	watch:{
		// list:function(){//监控list属性，当属性对于的值发生变化，就会执行函数
		// 	store.save("todolist",this.list);//不能对list内的属性进行监控
		// },
		list:{//对list进行深度监控
			handler:function(){
				store.save("todolist",this.list);
			},
			deep:true
		}
	},
	methods:{
		addTodo:function(){ //添加任务
			//向list中添加一项任务
			/*
				{
					title:
				}
			*/
			//事件处理函数中的this指向的是当前的根实例，当前即.main
			
			this.list.push({
				title:this.todo,
				isChecked:false,
			});
			this.todo="";
			
		},
		deleteTodo(todo){
			var index = this.list.indexOf(todo);
			this.list.splice(index,1);
		},
		editTodo(todo){
			this.beforeTitle=todo.title;
			this.editTodos = todo;
		},

		editTodoed(todo){
			this.editTodos = "";
		},
		cancelTodo(todo){  //取消编辑任务

			todo.title = this.beforeTitle;

			this.beforeTitle = '';

			//让div显示出来，input隐藏
			this.editTodos = '';
		}
	},
	directives:{
		"focus":{
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	},
	computed:{
		noCheckdLength:function(){
			return this.list.filter(function(item){
						return !item.isChecked
					}).length
		},
		filteredList:function(){
			//过滤的三种情况：all finished unfinished
			
			var filter={
				all:function(list){
					return list;
				},
				finished:function(list){
					return list.filter(function(item){
						return item.isChecked;
					})
				},
				unfinished:function(){
					return list.filter(function(item){
						return !item.isChecked;
					})
				},
			};
			return filter[this.visibility]? filter[this.visibility](list) : list;
		},
	},
});

function watchHashChange(){
	var hash=window.location.hash.slice(1);

	vm.visibility=hash;
	
}

window.addEventListener('hashchange',watchHashChange);