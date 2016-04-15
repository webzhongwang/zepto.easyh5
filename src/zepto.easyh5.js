/*
 * zepto.easyh5
 * author zhongwang
 * email webzhongwang@gmail.com
 * github https://github.com/webzhongwang/easyh5.git
 *
 */
;(function($, window) {
    if (typeof $ === 'undefined') {
        throw new Error('Easyh5 requires Zepto');
    }

    var easyh5 = null;

    //默认参数
    var defaults = {
        start: 0,           // 初始化时显示第几屏 默认从0开始
        duration: 300,      // 滚动到下一屏所需的时间，单位（毫秒），默认300毫秒
        loop: true,         // 是否可循环激动，默认是true
        auto: false,        // 是否自动滚屏
        dir: 'top',         // 自动滚屏的方向，只有auto值为true时有效，取值:top|bottom
        autoDuration: 5,    // 自动滚屏的时间间隔，只有auto值为true时有效，单位：秒
        showPageNum: true,  // 是否显示当前页是第几页，从第一页开始计数
        pageNumPlace: 'right-bottom',   // 显示页码的位置，只有当showPageNum为true时有效，取值:left-top|left-bottom|right-top|right-bottom
        width: 320,         // 设置内容区域宽度 默认320px
        height: 480,        // 设置内容区域高度 默认480px
        persent: 0.15       // 滑动屏幕的临界值时触发换页 默认是屏幕高度的15%
    };

    /*
     * 控制元素移动
     * @param: $node:绑定easyh5的节点
     * @param: s:位移量
     * @param: _this:easyh5对像
     * 目前仅支持竖直方向上
     */ 
    function move($node, s, _this) {

        var $moveNode = null;
        if(s > 0) $moveNode = $node.find('.easyh5-pre');
        if(s < 0) $moveNode = $node.find('.easyh5-next')
        $moveNode.addClass('easyh5-active');

        var ds = s > 0 ? s - $node.height() : s + $node.height();
        $moveNode.css({
            '-webkit-transform' : 'translateY(' + ds + 'px);',
            'transform' : 'translateY(' + ds + 'px);'
        });
        anim($moveNode);
    }

    /*
     * 初始化每页的动画
     * @param: $page:启动动画的page
     *
     */ 
    function anim($page){
        var $eles = $($page.find('[delay]'));
        $.each($eles, function (key,node){
            var $this = $(node),
                delay = parseFloat($this.attr('delay')) ? parseFloat($this.attr('delay')) : 0;
            $this.addClass($this.attr('data-class'));
            node.style['webkitAnimationDelay'] = delay + 's';
            node.style['animationDelay'] = delay + 's';

        });
    }

    //初始化
    function init(options) {
        this.ininSetting(options);
        this.initEvent();
    }

    // 构造函数
    function Easyh5($node, options) {
        this.$node = $node;
        init.call(this, options);
    }

    Easyh5.prototype = {
        initEvent: function() {
            // 初始化事件
            this.touchstart();
            this.touchmove();
            this.touchend();
            this.orientationchange();
            this.autoPlay();
        },
        ininSetting: function(options){
            // 初始化设置
            var _this = this,
                $node = _this.$node;

            // 参数设置
            _this.options = $.extend({}, defaults, options);

            // 设置
            _this.settings = {
                currentIndex: _this.options.start,
                page: '.easyh5-page'
            };
            _this.settings.size = $node.find(_this.settings.page).length;
            
            _this.initArrow();
            _this.resetContent();
            _this.resetView();
            _this.initLoading();
            _this.resetPlacement();
            _this.resetPageNum();
            // 第一屏添加current样式
            var $currentPage = $(_this.$node.find(this.settings.page)[_this.settings.currentIndex]);
            $currentPage.addClass('easyh5-current');
            anim($currentPage);
        },
        touchstart: function(){
            // touchstart事件
            var _this = this;
            this.$node.on('touchstart', function(e) {
                _this.startX = e.targetTouches[0].clientX;
                _this.startY = e.targetTouches[0].clientY;
                _this.resetStyle();
                _this.resetClass();
            });
        },
        touchmove: function(){
            // touchend事件
            var _this = this;
            this.$node.on('touchmove', function(e) {
                e.stopPropagation();
                e.preventDefault();
                //移动的距离
                var s = e.changedTouches[0].clientY - _this.startY;
                _this.checkLoop(s) && move(_this.$node, s, _this);
            });
        },
        touchend: function(){
            // touchmove事件
            var _this = this;
            this.$node.on('touchend', function(e) {

                var s = e.changedTouches[0].clientY - _this.startY,
                    persent = s / _this.$node.height(),
                    i = 0;  

                if(Math.abs(persent) >= _this.options.persent){
                    if (persent < 0) i = 1;
                     if (persent > 0) i = -1;
                }
                _this.checkLoop(s) && _this.moveTo(_this.settings.currentIndex + i);
            });
        },
        orientationchange: function(){
            var _this = this;
            //屏幕方向变化时重置页面
            $(window).on('orientationchange', function(e){
                 setTimeout(function(){
                    _this.resetView();
                },30)
            });
        },
        initArrow: function(){
            // 创建arrow图标
            var arrow = '<div class="easyh5-arrow"> \
                        <div class="easyh5-arrow-in"> \
                            <span class="easyh5-arrow-l"><i></i></span> \
                            <span class="easyh5-arrow-r"><i></i></span> \
                        </div> \
                    </div>';
            this.$node.append(arrow);
        },
        initLoading: function(){
            // loading
            $(this.$node.find('.easyh5-page')).css({
                opacity: 1
            });
        },
        resetPageNum: function(){
            if(!this.options.showPageNum) return false;

            var mask = null,
                n = (this.settings.currentIndex + 1) + '/' + this.settings.size;
            if(!this.$node.find('.easyh5-mask').size()) {
                mask = '<span class="easyh5-mask ' + this.options.pageNumPlace + '">' + n + '</span>';
                this.$node.append(mask);
            } else {
                $(this.$node.find('.easyh5-mask')).text(n);
            }
        },
        autoPlay: function(){
            // 自动播放
            var _this = this,
                dir = this.options.dir;

            if(!_this.options.auto) return false;

            setInterval(function(){
                if(dir == 'top'){
                    _this.moveTo(_this.settings.currentIndex + 1);
                } else if (dir == 'bottom') {
                    _this.moveTo(_this.settings.currentIndex - 1);
                }
            }, _this.options.autoDuration * 1000);
            
        },
        resetView: function(){ 
            // 根据屏幕比例设置内容区域的scale及left
            var _this = this,
                $node = _this.$node,
                $contents = $($node.find('.easyh5-content')),
                width = _this.options.width,
                height = _this.options.height
                windowWidth = $node.width(),
                windowHeight = $node.height(),
                scale = 1,
                b = width/height,
                windowB = windowWidth/windowHeight,
                dl = (windowWidth - width) / 2;  // left
                dt = (windowHeight - height) / 2; // top

            $contents.css({
                width: width,
                height: height,
            });

            if (b <= windowB) scale = windowHeight/height;
            else scale = windowWidth/width;
                
            $contents.css({
                left: dl + 'px',
                top: dt + 'px',
                '-webkit-transform' : 'scale('+scale+')',
                'transform' : 'scale('+scale+')',
            });
        },
        resetPlacement: function(){
            // 设置上一页、下一页
            var _this = this,
                $node = _this.$node,
                $pages = $($node.find(this.settings.page)),
                index = _this.settings.currentIndex,
                pre = index - 1,
                next = index + 1;

            if(pre < 0 ) pre = _this.settings.size - 1;
            if(next >= _this.settings.size) next = 0;

            $($node.find('.easyh5-pre')).removeClass('easyh5-pre');
            $($node.find('.easyh5-next')).removeClass('easyh5-next');
            $($pages[pre]).addClass('easyh5-pre');
            $($pages[next]).addClass('easyh5-next');
            _this.clearPageAnim($($pages[pre]));
            _this.clearPageAnim($($pages[next]));
        },
        resetStyle: function(){
            // 设置CSS样式
            $(this.$node.find(this.settings.page)).css({
                '-webkit-transition':'',
                'transition':''
            });
        },
        resetClass: function(){
            // 设置类名
            $(this.$node.find('.easyh5-active')).removeClass('easyh5-active');
            $(this.$node.find('.easyh5-anim')).removeClass('easyh5-anim');
        },
        resetContent: function(){
            // 添加内容区域
            var $node = this.$node;
            var contents = $node.find('.easyh5-page');
            $.each(contents, function(key,node){
                var ele = node.innerHTML;
                $(node).html('<div class="easyh5-content"></div>');
                $($(node).find('.easyh5-content')).html(ele);
            });
        },
        checkLoop: function(s){
            // 判断是否循环
            var flag = true;
            if(!this.options.loop){
                if(this.settings.currentIndex == 0 && s > 0) flag = false;
                if(this.settings.currentIndex == this.settings.size - 1 && s < 0) flag = false;
            }
            return flag;
        },
        clearPageAnim: function($page){
            // 清除每页的动画
            $eles = $($page.find('[delay]'));
            $.each($eles, function(key, node){
                var $this = $(node),
                    dataClass = $this.attr('data-class'),
                    className = $this.attr('class');

                className = className.replace(dataClass,'');
                node.className = className;

            })
            $eles.css({
                '-webkit-animation': '',
                'animation-delay': ''
            });
        },
        clearPageStyle: function($page){
            //清除page的style
            $page.css({
                '-webkit-transition':'',
                'transition':'',
                '-webkit-transform' : '',
                'transform' : ''
            });
        },
        moveTo: function(target) {
            // 移动到目标页
            var _this = this,
                $node = _this.$node;
           
            //当未达到临界值 不翻屏时时
            if (target == _this.settings.currentIndex) {
                
                $($node.find('.easyh5-active'))
                    .addClass('easyh5-anim')
                    .css({
                        '-webkit-transform' : '',
                        'transform' : ''
                    });
                setTimeout(function(){
                    _this.resetPlacement();
                },_this.options.duration);
            } else {  

                //判断target是否越界
                if (target < 0) target = _this.settings.size - 1;
                if (target >= _this.settings.size) target = 0;
                
                _this.settings.currentIndex = target;
                anim($($node.find('.easyh5-page')[target]));

                // var ele = $node.find('.easyh5-page')[target];
                // console.log(ele.style.WebkitTransform)

                //添加动画时长
                var $targetNode = $($node.find(this.settings.page)[target]);
                $targetNode.addClass('easyh5-active');
                $targetNode.css({
                    '-webkit-transition':'-webkit-transform '+_this.options.duration/1000+'s ease-in-out',
                    'transition':'transform '+_this.options.duration/1000+'s ease-in-out',
                    '-webkit-transform' : 'translateY(0);',
                    'transform' : 'translateY(0);'
                });
                
                //动画结束之后的操作
                setTimeout(function(){
                    $($node.find('.easyh5-current')).removeClass('easyh5-current');
                    $targetNode.addClass('easyh5-current');
                    $targetNode.removeClass('easyh5-active');
                    _this.clearPageStyle($targetNode);
                    _this.resetPlacement();
                    _this.resetPageNum();
                },_this.options.duration);
            }
        }
    };

    $.fn.easyh5 = function(option) {
        if (!easyh5) {
            easyh5 = new Easyh5($(this), option);
        }
        return this;
    };
    
}(Zepto, window));
