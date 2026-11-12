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

  // 资讯分类筛选 + 每页 6 篇（两列三行）的分页，两者联动
  var filters = document.querySelectorAll('.filter-bar button[data-filter]');
  var cards = Array.prototype.slice.call(
    document.querySelectorAll('.article-list .article-card[data-cat]'));
  var pageNav = document.getElementById('page-nav');
  var pageInfo = document.getElementById('page-info');
  var PAGE_SIZE = 6;
  var currentCat = 'all';
  var currentPage = 1;

  function matched() {
    return cards.filter(function (c) {
      return currentCat === 'all' || c.getAttribute('data-cat') === currentCat;
    });
  }

  function render() {
    var list = matched();
    var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (currentPage > pages) currentPage = pages;
    cards.forEach(function (c) { c.style.display = 'none'; });
    list.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
      .forEach(function (c) { c.style.display = ''; });
    if (pageInfo) pageInfo.textContent = '共 ' + list.length + ' 篇公开资讯';
    if (!pageNav) return;
    var h = '<button type="button" data-page="prev"' + (currentPage === 1 ? ' disabled' : '') + '>上一页</button>';
    for (var i = 1; i <= pages; i++) {
      h += '<button type="button" data-page="' + i + '" class="' + (i === currentPage ? 'on' : '') + '">' + i + '</button>';
    }
    h += '<button type="button" data-page="next"' + (currentPage === pages ? ' disabled' : '') + '>下一页</button>';
    pageNav.innerHTML = h;
    pageNav.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-page');
        if (v === 'prev') currentPage = Math.max(1, currentPage - 1);
        else if (v === 'next') currentPage = Math.min(pages, currentPage + 1);
        else currentPage = parseInt(v, 10);
        render();
        var listEl = document.querySelector('.article-list');
        if (listEl) listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  if (filters.length && cards.length && pageNav) {
    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        currentCat = b.getAttribute('data-filter');
        currentPage = 1;
        filters.forEach(function (x) { x.classList.toggle('on', x === b); });
        render();
      });
    });
    render();
  }

  // canonical / og:url / 结构化数据已写为正式域名的绝对地址，避免多域名产生重复内容
  // 内容默认全部可见，不使用依赖滚动的入场动画，便于搜索引擎与各类渲染环境完整读取正文
})();
