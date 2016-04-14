# zepto.easyh5

快速构建html5移动应用

## 功能介绍
实现移动端的单页全屏滚动，参数自定义，预定义移动开发常用的CSS3动画。

## 依赖包
	
	[Zepto.js](https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.6/zepto.min.js)

## 快速上手
### 全屏滚动
##### HTML

	<div id="easyh5" class="easyh5">
		<section class="easyh5-page">Page 1</section>
		<section class="easyh5-page">Page 2</section>
		<section class="easyh5-page">Page 3</section>
		<section class="easyh5-page">Page 4</section>
	</div>

#### JS
	
	$('#easyh5').easyh5();


