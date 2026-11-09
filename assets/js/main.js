(function () {
  'use strict';

  // 年份
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // 当前导航高亮
  var page = document.body.getAttribute('data-page') || '';
  document.querySelectorAll('.nav-menu a[data-nav]').forEach(function (a) {
    if (a.getAttribute('data-nav') === page) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  // 移动端菜单
  var btn = document.querySelector('.menu-btn');
  var menu = document.querySelector('.nav-menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 导航滚动阴影
  var nav = document.querySelector('.nav');
  var backTop = document.getElementById('back-top');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('scrolled', y > 12);
    if (backTop) backTop.classList.toggle('show', y > 420);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 资讯分类筛选
  var filters = document.querySelectorAll('.filter-bar button[data-filter]');
  var cards = document.querySelectorAll('.article-list .article-card[data-cat]');
  if (filters.length && cards.length) {
    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-filter');
        filters.forEach(function (x) { x.classList.toggle('on', x === b); });
        cards.forEach(function (c) {
          var show = key === 'all' || c.getAttribute('data-cat') === key;
          c.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // canonical / og:url / 结构化数据已写为正式域名的绝对地址，避免多域名产生重复内容
  // 内容默认全部可见，不使用依赖滚动的入场动画，便于搜索引擎与各类渲染环境完整读取正文
})();
