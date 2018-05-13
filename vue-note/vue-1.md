# Vue.js 模板语法

* Vue.js 使用基于 HTML 的模板语法  

* 核心是一个允许采用简洁的模块语法来声明式的将数据渲染进
DOM的系统  

* 结合响应系统，在应用状态改变时，Vue 能够智能地计算出重新渲染组件的最小代价并应用到 DOM 操作上  

## 插值 

### 文本  
数据绑定最常用的形式是用 {{...}} 双括号（双大括号）的文本插值： 
><div>
    <div id="app">
        <p>{{ message }}</p>  
    </div>

    <script>
        var app = new Vue({
            el: '#app',
            data: {
                message: '菜鸟教程'
            }
        })
    </script>  


### HTNL  
使用 v-html 指令用于输出 html 代码：  
><div>
    <div id="app">  
        <div v-html="message"></div>  
    </div>
    
    <script>  
        var vue = new Vue({
            el: '#app',
            data: {
                message: '<h1>菜鸟教程</h1>'
            }
        })
    </script>  


### 属性  
html 属性中的值应使用 v-bind 指令  
><div>
    <div id="app">
        <div v-bind:class="{'class1': class1}">
            directiva v-bind:class
        </div>
    </div>
        
    <script>
        var app = new Vue({
            el: '#app',
            data:{
                class1: false
            }
        });
    </script>  


### 条件语句控制可见性
控制切换一个元素是否显示，使用 v-if 指令  
><div>
    <div id="app">
        <p v-if="see">菜鸟教程</p>
    </div>

    <script>
        var app = new Vue({
            el: '#app',
            data: {
                see: false
            }
        })
    </script>  


### 循环语句  
循环输出列表数据（元素），使用 v-for 指令  
><div>
    <div id="app">
        <p v-for="person in sites">{{person.name}}</p>
    </div>

    <script>
        var app = new Vue({
            el: '#app',
            data: {
                sites: [
                    {
                        name: 'Tom'
                    },
                    {
                        name: 'Jon'
                    },
                    {
                        name: 'Mary'
                    }
                ]
            }
        })
    </script>



### 处理用户输入  
用 v-on 指令添加一个事件监听器
><div>
    <div id="app-5">
        <p>{{ message }}</p>
        <button v-on:click="reverseMessage">逆转消息</button>
    </div>  

    <script>
        var app5 = new Vue({
            el: '#app-5',
            data: {
                message: 'Hello Vue.js!'
            },
            methods: {
                reverseMessage: function () {
                    this.message = this.message.split('').reverse().join('')
                }
            }
        })
    </script>


#### 实现单输入和应用状态之间的双向绑定，使用 v-model 指令
><div>
    <div id="app-6">
        <p>{{ message }}</p>
        <input v-model="message">
    </div>

    <script>
        var app6 = new Vue({
            el: '#app-6',
            data: {
                message: 'Hello Vue!'
            }
        })
    </script>