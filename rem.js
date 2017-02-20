    /**
     * 此js负责初始化或重置根节点的字体大小，默认为屏幕css宽度大小的10分之一，并通过检测rem比，来解决部分手机换算bug。
     * rem对应值得计算方式为: designPx/dpr/rootFontSize
     * 即如过设计师给的iphone6的设计图:
     * 屏幕像素宽度为750px, dpr为2
     * 屏幕css宽度为375px，那么rootFontSize = 37.5px;  即 1rem = 37.5px;
     * 如 设计图上宽度为400的盒子，那么他的css rem大小即为，400/2/37.5
     * 提供计算函数：px2rem() 你也可以自己通过scss变量的方式进行计算
     * 使用方法：放在头部即可
     */
    (function () {
      var dpr = window.dpr = window.devicePixelRatio || 1;
      var scale = 1;
      var rootFontSize;
      var docEl = document.documentElement;
      var metaEl = document.querySelector('meta[name="viewport"]');
      // 无需缩放，避免模糊
      metaEl.setAttribute('content', 'initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');
      // 设置根字体大小
      function setRootSize() {
        var rootWidth = docEl.offsetWidth;
        // 将设计图分成10等份
        rootFontSize = rootWidth / 10;
        window.rootFontSize = rootFontSize;
        docEl.style.fontSize = rootFontSize + 'px';
        // 防止部分手机rem换算bug，需要打个补丁，检测修复一下
        remPatch();
      }

      var delay;
      function onResize() {
        clearTimeout(delay);
        delay = setTimeout(setRootSize, 300);
      }

      window.addEventListener('resize', onResize, false);
      setRootSize();

      // 计算
      window.px2rem = function (designPx) {
        return designPx / dpr / rootFontSize;
      }

      // 检测rem比，并调整
      var remTestNode;
      function remPatch() {
        var remTestFragment = document.createElement("div");
        remTestFragment.id = 'rem-test';
        remTestFragment.style.width = '10rem';
        remTestFragment.style.boxSizing = 'border-box';
        remTestFragment.style.opacity = 0;
        remTestFragment.style.position = 'absolute';
        remTestFragment.style.bottom = '-1000px';
        setTimeout(function () {
          document.body.appendChild(remTestFragment);
          remTestNode = document.getElementById('rem-test');
          var currentTestWidth = remTestNode.offsetWidth;
          var rootFontSize = docEl.style.fontSize.replace(/px/, '') * 100;
          var scale = currentTestWidth*10 / rootFontSize;
          rootFontSize = rootFontSize / 100 / scale;
          window.rootFontSize = rootFontSize;
          docEl.style.fontSize = rootFontSize + 'px';
          remTestNode.parentNode.removeChild(remTestNode);
        })
      };

    })();