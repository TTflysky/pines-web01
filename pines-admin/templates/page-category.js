// page-category.js
// 品类页模板
// 导出函数：generateCategoryPage(category, allCategories, site)

var shared = require('./shared');

function generateCategoryPage(category, allCategories, site) {
  // 导航栏标题：根据品类决定
  var navTitle = category.name + ' · ' + category.nameEn.split(' · ')[0];

  // 返回链接：支持自定义（子分类页返回 landing 页）
  var backLink = category.backLink || 'index-1.html';
  var backText = category.backText || '返回首页';

  // 产品卡片列表
  var productsHTML = '';
  category.products.forEach(function(product) {
    productsHTML += shared.generateProductCard(product);
  });

  var html = '<!DOCTYPE html>\n' +
    '<html lang="zh-CN">\n' +
    '<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n' +
    '<title>' + category.name + ' - 派恩斯工业紧固件</title>\n' +
    shared.generateSharedCSS() +
    '<link rel="stylesheet" href="css/cart.css">\n' +
    '</head>\n' +
    '<body>\n' +
    '<div id="app">\n' +

    // 导航栏（支持自定义返回链接）
    '<nav class="nav-bar">' +
    '<a class="nav-back" href="' + backLink + '">← ' + backText + '</a>' +
    '<span class="nav-title">' + navTitle + '</span>' +
    '</nav>\n' +

    // 品类Hero
    '<div class="cat-hero">' +
    '<div class="cat-hero-name">' + category.name + '</div>' +
    '<div class="cat-hero-en">' + category.nameEn + '</div>' +
    '<div class="cat-hero-desc">' + category.description + '</div>' +
    '<span class="cat-hero-count">共 ' + category.products.length + ' 款产品</span>' +
    '</div>\n' +

    // 搜索框
    '<div class="search-bar">' +
    '<div class="search-input-wrap">' +
    '<span class="search-icon">🔍</span>' +
    '<input type="text" class="search-input" id="searchInput" placeholder="搜索产品名称...">' +
    '<span class="search-clear" id="searchClear">✕</span>' +
    '</div>' +
    '<div class="search-count" id="searchCount"></div>' +
    '<div class="no-result" id="noResult">未找到匹配的产品</div>' +
    '</div>\n' +

    // 产品列表
    productsHTML +

    // Footer
    shared.generateFooter(site) +

    '<div class="bottom-placeholder"></div>\n' +
    '</div><!-- #app -->\n' +

    // 弹窗
    shared.generateModalHTML() +

    // JS
    shared.generateModalJS() +
    '<script src="js/cart.js"></script>\n' +

    '</body>\n</html>';

  return html;
}

module.exports = { generateCategoryPage };
