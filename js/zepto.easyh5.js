;(function($, window) {
    if (typeof $ === 'undefined') {
        throw new Error('easyh5 requires Zepto');
    }

    var easyh5 = null;

    //默认参数
    var defaults = {
        start: 1,       // 初始化时显示第几屏 从0开始
        duration: 500,  // 动画的时间；单位：毫秒
        loop: true,     // 是否循环
        width: 320,     // 设置内容区域宽度
        height: 480,    // 设置内容区域高度
        persent: 0.15   //滚动屏幕的百分比时触发换页
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
            '-webkit-transform' : 'translate3d( 0px, ' + ds + 'px,0px);',
            'transform' : 'translate3d( 0px, ' + ds + 'px, 0px);'
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
            var _this = this,
                $node = _this.$node;

            $node.on('touchstart', function(e) {
                _this.startX = e.targetTouches[0].clientX;
                _this.startY = e.targetTouches[0].clientY;
                _this.resetStyle();
                _this.resetClass();
            });
            // 判断是否要向上或向下滚动一屏
            $node.on('touchend', function(e) {
                var s = e.changedTouches[0].clientY - _this.startY,
                    persent = s / $node.height(),
                    i = 0;  

                if(Math.abs(persent) >= _this.options.persent){
                    if (persent < 0) i = 1;
                     if (persent > 0) i = -1;
                }
                _this.checkLoop(s) && _this.moveTo(_this.settings.currentIndex + i);
            });
            $node.on('touchmove', function(e) {
                //移动的距离
                var s = e.changedTouches[0].clientY - _this.startY;
                _this.checkLoop(s) && move($node, s, _this);
            });
        },
        ininSetting: function(options){
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
            _this.resetView();
            _this.resetPlacement();
            // 第一屏添加current样式
            $(_this.$node.find(this.settings.page)[_this.settings.currentIndex]).addClass('easyh5-current');
        },
        initArrow: function(){
            var _this = this,
                $node = _this.$node,
                arrow = '<div class="easyh5-arrow"> \
                        <div class="easyh5-arrow-in"> \
                            <span class="easyh5-arrow-l"><i></i></span> \
                            <span class="easyh5-arrow-r"><i></i></span> \
                        </div> \
                    </div>';
            $node.append(arrow);
        },
        // 根据屏幕比例设置内容区域的scale及left
        resetView: function(){
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
        },
        resetStyle: function(){
            var _this = this,
                $node = _this.$node;
            $($node.find(this.settings.page)).css({
                '-webkit-transition':'',
                'transition':''
            });
        },
        resetClass: function(){
            var _this = this,
                $node = _this.$node;
            $($node.find('.easyh5-active')).removeClass('easyh5-active');
            $($node.find('.easyh5-anim')).removeClass('easyh5-anim');
        },
        checkLoop: function(s){
            var _this = this,
                flag = true;
            if(!_this.options.loop){
                if(_this.settings.currentIndex == 0 && s > 0) flag = false;
                if(_this.settings.currentIndex == _this.settings.size - 1 && s < 0) flag = false;
            }
            return flag;
        },
        moveTo: function(target) {

            var _this = this,
                $node = _this.$node;
           
            //当未达到临界值时
            if (target == _this.settings.currentIndex) {
                
                $($node.find('.easyh5-active'))
                    .addClass('easyh5-anim')
                    .css({
                        '-webkit-transform' : '',
                        'transform' : ''
                    });
            } else {  

                //判断target是否越界
                if (target < 0) target = _this.settings.size - 1;
                if (target >= _this.settings.size) target = 0;
                
                _this.settings.currentIndex = target;
                
                
                //添加动画时长
                var $targetNode = $($node.find(this.settings.page)[target]);
                $targetNode.css({
                    '-webkit-transition':'transform '+_this.options.duration/1000+'s ease-in',
                    'transition':'transform '+_this.options.duration/1000+'s ease-in'
                })
                $targetNode.addClass('easyh5-active');
                
                //动画结束之后的操作
                $targetNode.css({
                    '-webkit-transform' : 'translate3d( 0px, 0px,0px);',
                    'transform' : 'translate3d( 0px, 0px, 0px);'
                });

                setTimeout(function(){
                    $($node.find('.easyh5-current')).removeClass('easyh5-current');
                    $targetNode.addClass('easyh5-current');
                    $targetNode.removeClass('easyh5-active');
                    _this.resetPlacement();
                },_this.options.duration);
            }
        },
    };

    $.fn.easyh5 = function(option) {
        if (!easyh5) {
            easyh5 = new Easyh5($(this), option);
        }
        return this;
    };
    //$.fn.easyh5.version = '0.1.0';
    //暴露方法
    // $.each(['update', 'moveTo', 'moveNext', 'movePrev', 'start', 'stop', 'getCurrentIndex', 'holdTouch', 'unholdTouch'], function(key, val) {
    //     $.fn.easyh5[val] = function() {
    //         if (!easyh5) {
    //             return 0;
    //         }
    //         return easyh5[val].apply(easyh5, [].slice.call(arguments, 0));
    //     };
    // });
}(Zepto, window));