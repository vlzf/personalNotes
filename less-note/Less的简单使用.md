# Less 的简单使用  



## Less 简介  

* Less 是一门 CSS 预处理语言，它扩展了 CSS 语言，增加了变量、Mixin、函数等特性，使 CSS 更易维护和扩展。

* Less 可以运行在 Node 或浏览器端。

* .less 文件在运行时会被编译成 .css 文件



## Less 客户端引用

* 先用 link 引用 .less 文件

* 再用 script 引用 less.min.js 文件（在网上下载）

    `<link rel="stylesheet/less" href="style.less"/>`  
    `<script src="less.min.js"></script>`

* 写 .less 文件时，先在加上 @charset "UTF-8" 以防乱码



## Less 语法

## 1、注释  
Less 有两种注释方法：// 和 /**/  

    // 注释方法，在编译时不会被编译进 .css 中  

    /**/ 注释方法，会被编译进 .css 中，成为 .css 里的注释



## 2、变量  
Less 中可以像 C 语言一样声明变量，注意：变量名必须以@开头

    @first: 10px;
    @second: solid;
    @third: red;  
    
变量的引用

    .demo {
        border: @first @second @third;
    }
    
以上代码编译成 .css 后
    
    .demo {
        border: 10px solid red;
    }
    


## 3、混合写法
Less 支持样式的混合
    
    .demo1 {
        height: 100px;
        width: 100px;
        border: 10px solid black;
    }

    .demo2 {
        background: red;
        .demo1;     // 这里混合了 .demo1 的样式
    }
    
编译成 .css 后  

    .demo1 {
        height: 100px;
        width: 100px;
        border: 10px solid black;
    }

    .demo2 {
        background: red;
        height: 100px;
        width: 100px;
        border: 10px solid black;
    }



## 4、传参
Less 可以像函数一样传参
    
    .demo4_1(@color) {
        background-color: @color;
    }

    .demo4_2 {
        width: 100px;
        height: 100px;
        .demo1(red);
    }

编译成 .css
    
    .demo4_2 {
        width: 100px;
        height: 100px;
        background-color: red;
    }

参数设置默认值  
    
    // 将上个例子的 .demo1 改成：
    .demo1(@color: blue) {
        background-color: @color;
    }
    // 当不传值时，即调用 .demo1() ，默认 background-color: blue

注意：这种像函数一样带括号的样式，不设置默认值又不传参，会报错



## 5、匹配模式  
Less 匹配模式好比 java 的重载函数的匹配模式，Less 是根据标识符匹配
    
    .triangle(top,@height,@color) {        // 1 匹配符 'top'
        border-width: @height 0 0 0;
        border-style: solid dashed dashed dashed;
        border-color: @color transparent transparent transparent;
    }
    .triangle(right,@height,@color) {      // 2 匹配符 'right'
        border-width: 0 @height 0 0;
        border-style: dashed solid dashed dashed;
        border-color: transparent @color transparent transparent;
    }
    .triangle(bottom,@height,@color) {     // 3 匹配符 'bottom'
        border-width: 0 0 @height 0;
        border-style: dashed dashed solid dashed;
        border-color: transparent transparent @color transparent;
    }
    .triangle(left,@height,@color) {      // 4 匹配符 'left'
        border-width: 0 0 0 @height;
        border-style: dashed dashed dashed solid;
        border-color: transparent transparent transparent @color;
    }
    .triangle(@_,@height,@color) {       // 5 全匹配符 '@_'，必定匹配到
        width: 0;
        height: 0;
        overflow: hidden;
    }
    
以上为 4 种方向的三角形，top / right / bottom / left 是标识符（匹配符），可以看出标识符与变量的区别在于 —— 标识符没有 '@'，另外 '@_' 是全匹配符，比如：

    .demo5 {
        .triangle(top,10px,blue);
    }

编译成 .css 后

    .demo5 {
        border-width: @height 0 0 0;
        border-style: solid dashed dashed dashed;
        border-color: @color transparent transparent transparent;
        width: 0;
        height: 0;
        overflow: hidden;
    }

匹配到标识符为 'top' 的三角形样式，和全匹配符的 '@_' 的三角形样式



## 6、运算  
Less 中可以进行数学运算
    
    @width: 100px - 10px;  // 90px;
    @width: 100px - 10;    // 90px;
    
Less 会自动推断出单位，并补全



## 7、嵌套规则
Less 可以像 js 的函数嵌套一样，进行样式嵌套
    
    .demo7 {
        li {
            display: inlineblock;
            padding: 5px;
        }
        a {
            font-size: 20px;
            &:hover {
                color: red;
            }
        }
    }

编译成 .css
    
    .demo7 li {
        display: inlineblock;
        padding: 5px;
    }
    .demo7 a {
        font-size: 20px;
    }
    .demo7 a:hover {
        color: red;
    }



## 8、@arguments 变量
Less 里的 @arguments 类似于 js 里的 arguments
    
    .demo8_1(@weight,@style,@color) {
        border: @arguments;
    }
    .demo8_2 {
        .demo8_1(10px, solid, red);
    }
    
编译成 .css
    
    .demo8_2 {
        border: 10px, solid, red;
    }



## 9、避免编译
Less 里会自动进行运算，但有时候运算是交给浏览器，而不是让 Less 运算时
    
    .demo9_1() {
        width: ~'calc(100px - 10px)'; 
    }
    .demo9_2 {
        height: 100px;
        background: black;
        .demo9_1();
        border: ~'calc(5px + 5px)' solid red;
    }
    
编译成 .css
    
    .demo9_2 {
        height: 100px;
        background: black;
        width: calc(100px - 10px); 
        border: calc(5px + 5px) solid red;
    }



## 10、!important
!important 在 .css / .less 是提升优先级的关键字
    
    .demo10_1(){
        font-size: 20px;
        border: 10px solid red;
        bcakground: black;
    }
    .demo10_2 {
        width: 60px;
        height: 60px;
        .demo10_1() !important;
    }
    
编译成 .css

    .demo10_2 {
        width: 60px;
        height: 60px;
        font-size: 20px  !important;
        border: 10px solid red  !important;
        bcakground: black  !important;
    }
