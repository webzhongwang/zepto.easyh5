# zepto.easyh5

[![issues](https://img.shields.io/github/issues/webzhongwang/zepto.easyh5.svg)](https://github.com/webzhongwang/zepto.easyh5/issues) [![forks](https://img.shields.io/github/forks/webzhongwang/zepto.easyh5.svg)](https://github.com/webzhongwang/zepto.easyh5/network) [![stars](https://img.shields.io/github/stars/webzhongwang/zepto.easyh5.svg)](https://github.com/webzhongwang/zepto.easyh5/stargazers)

快速构建html5移动应用

## 功能介绍
实现移动端的单页全屏滚动，参数自定义，预定义移动开发常用的CSS3动画。

## 依赖包

[Zepto](https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.6/zepto.min.js)

## 快速上手
#### 全屏滚动
##### HTML

	<div id="easyh5" class="easyh5">
		<section class="easyh5-page">Page 1</section>
		<section class="easyh5-page">Page 2</section>
		<section class="easyh5-page">Page 3</section>
		<section class="easyh5-page">Page 4</section>
	</div>

#### JS
	
	$('#easyh5').easyh5();

#### 参数

	var defaults = {
        start: 0,       // 初始化时显示第几屏 默认从0开始
        duration: 300,  // 滚动到下一屏所需的时间，单位（毫秒），默认300毫秒
        loop: true,     // 是否可循环激动，默认是true
        width: 320,     // 设置内容区域宽度 默认320px
        height: 480,    // 设置内容区域高度 默认480px
        persent: 0.15   // 滑动屏幕的临界值时触发换页 默认是屏幕高度的15%
    };


