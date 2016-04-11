;(function($, window) {
    if (typeof $ === 'undefined') {
        throw new Error('easyh5 requires Zepto');
    }
    var fullpage = null;
    var easyh5 = null;
    var defaults = {
        page: '.section',
        start: 0,
        currentIndex: 0,
        duration: 500,
        loop: false,
        persent: 0.15 //滚动屏幕的百分比时触发换页
    };

    function touchmove(e) {
        e.preventDefault();
    }

    function init(options,$node) {
        this.options = $.extend({}, defaults, options);
        this.pages = $node.find(this.options.page);
        this.pages[0].style['z-index'] = 2;
        this.initEvent($node);
        this.height = $node.height();
    }

    function Fullpage($node, options) {
        init.call(this, options, $node);
    }

    Fullpage.prototype = {
        initEvent: function($node) {
            var _this = this;
            
            $node.on('touchstart', function(e) {
                _this.startX = e.targetTouches[0].clientX;
                _this.startY = e.targetTouches[0].clientY;
            });
            $node.on('touchend', function(e) {
                var persent = (e.changedTouches[0].clientY - _this.startY) / _this.height;
                var move = Math.abs(persent) >= _this.options.persent ? true : false;
                var i = 0;
                if(move && persent < 0){
                    i = -1;
                } else if (move && persent > 0){
                    i = 1;
                }
                _this.moveTo(_this.options.currentIndex - i);
            });
            $node.on('touchmove', function(e) {
                var y = e.changedTouches[0].clientY - _this.startY;
                //页面向上滚
                var index = y > 0 ? -1 : 1;
                console.log(y)
                $(_this.pages[_this.options.currentIndex + index]).css({
                    'z-index':3,
                    '-webkit-transform':'translateY('+(y + _this.height)+'px)',
                    'transform':'translateY('+(y + _this.height)+'px)',
                });
            });
        },
        moveTo: function(target) {
            console.log(target)
            var _this = this;
            _this.options.currentIndex = target;
            $(_this.pages[target]).css({
                '-webkit-transform':'translateY(0)',
                'transform':'translateY(0)',
            });
        },
    };

    $.fn.fullpage = function(option) {
        if (!fullpage) {
            fullpage = new Fullpage($(this), option);
        }
        return this;
    };
    $.fn.fullpage.version = '0.1.0';
    //暴露方法
    $.each(['update', 'moveTo', 'moveNext', 'movePrev', 'start', 'stop', 'getCurrentIndex', 'holdTouch', 'unholdTouch'], function(key, val) {
        $.fn.fullpage[val] = function() {
            if (!fullpage) {
                return 0;
            }
            return fullpage[val].apply(fullpage, [].slice.call(arguments, 0));
        };
    });
}(Zepto, window));