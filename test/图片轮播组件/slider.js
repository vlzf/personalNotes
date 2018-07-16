window.onload = function(){

  function Slider(element,arr,{
    rate = 1,
    delay = 5,
    direction = 1
  }){
    var t = this;
    this.el = element;     // demo
    this.sliderInner = null;  // div.sliderInner
    this.sliderDotBox = null; // div.sliderDotBox
    this.sliderDots = null;   // [span.sliderDot]
    this.iamgeParams = arr;// 参数图片
    this.iamges = [];      // 实际图片
    this.rate = rate;      // 移动时间
    this.delay = delay;    // 移动间隔
    this.direction = direction>0?1:-1;

    this.replaceKey = {    // 替代词
      imgArrayStr: 'imgArrayStr',
      imgUrl: 'imgUrl',
      imgStyle: 'imgStyle',
      dotStr: 'dotStr',
      dotIndex: 'dotIndex'
    }
    this.tpl = [           // 模板
      '<div class="sliderBox"><div class="sliderInner">{{'+t.replaceKey.imgArrayStr+'}}</div><div class="sliderDotBox">{{'+ t.replaceKey.dotStr +'}}</div></div>',
      '<img {{'+ t.replaceKey.imgStyle +'}} src="{{'+t.replaceKey.imgUrl+'}}">',
      '<span slider-dot-index="{{'+ t.replaceKey.dotIndex +'}}"></span>'
    ];
    

    this.sliderWidth = this.el.clientWidth;
    this.sliderHeight = this.el.clientHeight;

    this.canMove = arr.length > 1 ? true : false;
    
    this.index = 0;   // 当前实际序号，从零开始
    this.vIndex = 0;  // 虚拟序号

    if(t._checkValid() && t._initHtml()) {
      t._moveTo(1)
      t._setInterval()
      t._selectVIndex()
    }
  } 
  Slider.prototype._setIndex = function(index_vIndex, key){
    var t = this;
    var vIndex;
    if(!t.sliderDotBox) t.sliderDotBox = t.el.children[0].children[1];
    if(!t.sliderDots) t.sliderDots = t.sliderDotBox.children;
    if(key){
      t.index = index_vIndex;
      vIndex = t._indexToVIndex(index_vIndex);
    }else{
      t.index = t._vIndexToIndex(index_vIndex);
      vIndex = index_vIndex;
    }
    t.removeClass(t.sliderDots,'active');
    t.addClass(t.sliderDots[vIndex],'active');
  }
  Slider.prototype._checkValid = function(){   // 检查合法性
    if(!this.el){
      console.log('容器不存在！');
      return false;
    } if(!this.sliderWidth || this.sliderWidth <= 0 || !this.sliderHeight || this.sliderHeight <= 0){
      console.log('容器没有设置宽高')
      return false;
    }
    if(!(this.iamgeParams instanceof Array) || this.iamgeParams.length === 0) {
      console.log('没有图片');
      return false;
    }
    return true;
  }
  Slider.prototype._initHtml = function(){   // 初始化图片是否成功
    var t = this;
    var str1 = '', str2 = '', str3 = '', str4 = '';  // str1: 最终字符串、 str2: 图片字符串、str3：图片模板字符串 、 str4：圆点字符串
    var regExp1 = new RegExp('{{'+ this.replaceKey.imgArrayStr +'}}');
    var regExp2 = new RegExp('{{'+ this.replaceKey.imgUrl +'}}');
    var regExp3 = new RegExp('{{'+ this.replaceKey.imgStyle +'}}');
    var regExp4 = new RegExp('{{'+ this.replaceKey.dotStr +'}}');
    var regExp5 = new RegExp('{{'+ this.replaceKey.dotIndex +'}}');
    
    str3 = 'style="width:'+ this.sliderWidth +'px;"';  // 初始化图片模板
    this.tpl[1] = this.tpl[1].replace(regExp3,str3);
    if(this.iamgeParams.length === 1){    // 一张图片
      str2 = this.tpl[1].replace(regExp2,this.iamgeParams[0]);
      str1 = this.tpl[0].replace(regExp1,str2).replace(regExp4,str4);
      this.el.innerHTML = str1;
      console.log('只有一张图片');
      return false;
    }
    
    if(this.iamgeParams.length > 1) {  // 多张图片
      var last = this.iamgeParams[this.iamgeParams.length-1];
      var first = this.iamgeParams[0];
      this.iamges.push(last);
      this.iamges = this.iamges.concat(this.iamgeParams);
      this.iamges.push(first);
      
      this.iamges.forEach(function(e,i){
        str2 += t.tpl[1].replace(regExp2,e);
      });
      this.iamgeParams.forEach(function(e,i){
        str4 += t.tpl[2].replace(regExp5,i);
      });
      str1 = t.tpl[0].replace(regExp1,str2).replace(regExp4,str4);
      this.el.innerHTML = str1;
      return true;
    }
    return true;
  }
  Slider.prototype._moveTo = function(index, rate){  // 移动到图片（实际序号）
    var t = this;
    index = index%t.iamges.length;
    t._setIndex(index, true);
    if(!t.sliderInner){
      t.sliderInner = t.el.children[0].children[0];
    }
    t.sliderInner.style = 'transform: translateX(-'+ index*t.sliderWidth +'px); transition: '+ rate +'s';
  }
  Slider.prototype._setInterval = function(){    // 轮播
    var t = this;
    clearTimeout(t._intervalTimer)
    t._intervalTimer = setTimeout(function(){
      var index = t.index + t.direction;
      t._moveTo(index, t.rate);
      setTimeout(function(){
        if(index === 0) {
          t._moveTo(t.iamges.length-2, 0);
        }else if(index === t.iamges.length-1) {
          t._moveTo(1, 0);
        }
      }, t.rate*1000)
      t._setInterval();
    },t.delay*1000)
  }
  Slider.prototype._selectVIndex = function(){  // 点击选择图片
    var t = this;
    setTimeout(function(){
      if(!t.sliderDotBox) t.sliderDotBox = t.el.children[0].children[1];
      if(!t.sliderDots) t.sliderDots = t.sliderDotBox.children;
      t.sliderDotBox.addEventListener('mouseover',function(e){
        console.log([e.target])
        var target = e.target;
        var indexStr = target.attributes[0]?(target.attributes[0].localName === 'slider-dot-index'?target.attributes[0].value:''):'';
        var index = null;
        if(indexStr){
          index = t._vIndexToIndex(indexStr - '');
          t._moveTo(index, 0);
          t._setInterval();
        }
      })
    }, 1000)
  }
  Slider.prototype._vIndexToIndex = function(vIndex){   // 虚拟序号 => 实际序号
    if(typeof vIndex !== 'number') {
      console.log('_vIndexToIndex: 非数字')
      return null;
    }
    return vIndex%this.iamgeParams.length + 1;
  }
  Slider.prototype._indexToVIndex = function(index){  // 实际序号 => 虚拟序号
    if(typeof index !== 'number') {
      console.log('_indexToVIndex: 非数字')
      return null;
    }
    if(!this.canMove) return index;
    index = index%this.iamges.length;
    if(index === 0) return this.iamgeParams.length - 1;
    if(index === this.iamges.length - 1) return 0;
    return index - 1;
  }
  Slider.prototype.removeClass = function(element,className){
    var collection = null;
    var deal = function(element, className){
      var classArray = element.className.split(' ');
      var index = classArray.indexOf(className);
      if(index<0) return; 
      classArray.splice(index, 1);
      element.className = classArray.join(' ');
    }
    if(element instanceof HTMLCollection){
      collection = element
    }else {
      collection = [element];
    }
    for(var i = 0; i < collection.length; i++){
      deal(collection[i], className);
    }
  }
  Slider.prototype.addClass = function(element, className){
    var collection = null;
    var deal = function(element,className){
      var classArray = element.className.split(' ');
      var index = classArray.indexOf(className);
      if(index<0) {
        classArray.push(className);
        element.className = classArray.join(' ')
      }
    }
    if(element instanceof HTMLCollection){
      collection = element;
    }else {
      collection = [element];
    }
    for(var i = 0; i < collection.length; i++){
      deal(collection[i], className);
    }
  }
  Slider.prototype.hasClass = function(element, className){
    var clasArray = element.className.split(' ');
    var index = clasArray.indexOf(className);
    if(index<0) return false;
    else return true;
  }


  var sliderBox = new Slider(document.getElementById('box'),[
    "./img/1.jpg",
    "./img/2.jpg",
    "./img/3.jpg",
    "./img/4.jpg",
  ],{
    rate: 1,
    delay: 5,
    direction: 1
  });


  window.myLib = {
    Slider: Slider
  }

  document.getElementById('as').addEventListener

  // console.log([document.getElementById('box')])
}