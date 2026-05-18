// page-landing.js
// 子分类 landing 页模板（样式 + 结构独立，不混在 generate-site.js 里）
// 修改样式只改这里，生成脚本只负责读数据和调用

exports.LANDING_CSS =
  '<style>\n' +
  '* { margin:0; padding:0; box-sizing:border-box; }\n' +
  'html,body { width:100%; background:#f5f5f5; font-family:"Microsoft YaHei",Helvetica,Arial,sans-serif; }\n' +
  '#app { width:100%; max-width:450px; margin:0 auto; background:#fff; min-height:100vh; }\n' +
  '.nav-bar { position:sticky; top:0; z-index:1000; width:100%; height:50px; background:#1e5bb5; display:flex; align-items:center; padding:0 16px; gap:12px; }\n' +
  '.nav-back { color:#fff; font-size:14px; text-decoration:none; }\n' +
  '.nav-title { color:#fff; font-size:15px; font-weight:700; }\n' +
  '.cat-hero { background:linear-gradient(135deg,#1e5bb5 0%,#0d2f6b 100%); padding:20px 16px; position:relative; overflow:hidden; }\n' +
  '.cat-hero::after { content:""; position:absolute; top:-30px; right:-30px; width:120px; height:120px; background:rgba(255,255,255,0.05); border-radius:50%; }\n' +
  '.cat-hero-name { font-size:24px; font-weight:900; color:#fff; margin-bottom:4px; position:relative; z-index:1; }\n' +
  '.cat-hero-en { font-size:13px; color:rgba(255,255,255,0.7); margin-bottom:8px; position:relative; z-index:1; }\n' +
  '.cat-hero-desc { font-size:12px; color:rgba(255,255,255,0.6); line-height:1.8; position:relative; z-index:1; }\n' +
  '.search-bar { padding:10px 16px; background:#f8f9fb; border-bottom:1px solid #eee; position:sticky; top:50px; z-index:999; }\n' +
  '.search-input-wrap { display:flex; align-items:center; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:0 12px; height:40px; }\n' +
  '.search-input-wrap:focus-within { border-color:#1e5bb5; }\n' +
  '.search-icon { font-size:15px; color:#999; margin-right:8px; }\n' +
  '.search-input { flex:1; border:none; outline:none; font-size:14px; color:#333; background:transparent; font-family:inherit; }\n' +
  '.search-input::placeholder { color:#bbb; }\n' +
  '.search-clear { font-size:13px; color:#ccc; cursor:pointer; padding:4px; display:none; }\n' +
  '.search-clear.show { display:block; }\n' +
  '.search-count { font-size:12px; color:#888; text-align:center; padding:4px 0 0; }\n' +
  '.no-result { text-align:center; padding:30px 16px; color:#999; font-size:14px; display:none; }\n' +
  '.no-result.show { display:block; }\n' +
  '.sub-cat-grid { padding:8px; display:grid; grid-template-columns:1fr 1fr; gap:6px; }\n' +
  '.sub-cat-card { background:#fff; border-radius:8px; box-shadow:0 1px 6px rgba(0,0,0,0.05); padding:8px 10px; cursor:pointer; transition:box-shadow 0.2s; border:1px solid #eee; position:relative; }\n' +
  '.sub-cat-card:active { box-shadow:0 3px 12px rgba(0,0,0,0.08); }\n' +
  '.sub-cat-icon-wrap { width:36px; height:36px; background:#f0f5ff; border-radius:8px; display:flex; align-items:center; justify-content:center; margin-bottom:4px; }\n' +
  '.sub-cat-icon-wrap svg { transform:scale(0.85); transform-origin:center; }\n' +
  '.sub-cat-name { font-size:14px; font-weight:700; color:#222; margin-bottom:1px; }\n' +
  '.sub-cat-en { font-size:10px; color:#999; margin-bottom:3px; }\n' +
  '.sub-cat-count { font-size:11px; color:#1e5bb5; font-weight:600; }\n' +
  '.sub-cat-arrow { position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:14px; color:#ccc; }\n' +
  '.footer { background:#1a1a1a; padding:20px 16px 30px; margin-top:20px; }\n' +
  '.footer-logo { display:flex; align-items:center; gap:8px; margin-bottom:14px; }\n' +
  '.footer-logo-icon { width:36px; height:36px; background:#1e5bb5; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:900; color:#fff; }\n' +
  '.footer-logo-text { color:#fff; font-size:16px; font-weight:700; }\n' +
  '.footer-logo-sub { color:#888; font-size:11px; }\n' +
  '.footer-contact { margin-bottom:14px; }\n' +
  '.footer-contact-item { display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid #2a2a2a; }\n' +
  '.footer-contact-item:last-child { border-bottom:none; }\n' +
  '.footer-contact-item .fc-icon { font-size:14px; flex-shrink:0; }\n' +
  '.footer-contact-item .fc-text { font-size:12px; color:#bbb; flex:1; }\n' +
  '.footer-contact-item .fc-value { font-size:12px; color:#fff; font-weight:600; }\n' +
  '.footer-copyright { font-size:10px; color:#555; text-align:center; margin-top:14px; line-height:1.8; }\n' +
  '</style>\n';

// 固定图标 SVG（可按子分类 id 扩展）
var ICONS = {
  default:
    '<svg width="32" height="32" viewBox="0 0 32 32" fill="none">' +
    '<rect x="4" y="2" width="24" height="28" rx="4" fill="#1e5bb5" opacity="0.10"/>' +
    '<circle cx="16" cy="8" r="3" fill="#1e5bb5"/>' +
    '<rect x="13" y="11" width="6" height="18" rx="3" fill="#1e5bb5"/>' +
    '</svg>'
};

/**
 * 生成单个子分类卡片 HTML
 * @param {object} sc - 子分类对象 { id, name, nameEn }
 * @param {string} catId - 父分类 id
 * @param {number} count - 该子分类的产品数量
 */
exports.generateSubCatCard = function(sc, catId, count) {
  var icon = ICONS[sc.id] || ICONS.default;
  var dataName = (sc.name + ' ' + (sc.nameEn || '')).toLowerCase().replace(/"/g, '&quot;');
  return (
    '<div class="sub-cat-card" data-name="' + dataName + '" onclick="location.href=\'category-' + catId + '-' + sc.id + '.html\'">' +
      '<div class="sub-cat-icon-wrap">' + icon + '</div>' +
      '<div class="sub-cat-name">' + sc.name + '</div>' +
      '<div class="sub-cat-en">' + sc.nameEn + '</div>' +
      '<div class="sub-cat-count">' + count + ' 款产品</div>' +
      '<div class="sub-cat-arrow">→</div>' +
    '</div>'
  );
};

/**
 * 生成完整 landing 页 HTML
 * @param {object} cat - 分类对象（包含 subcategories 数组）
 * @param {object} subCatCounts - { subCatId: count } 映射
 * @param {object} site - 站点配置 { phone, email, address }
 */
exports.generateLandingPage = function(cat, subCatCounts, site) {
  var cardsHTML = '';
  cat.subcategories.forEach(function(sc) {
    var count = subCatCounts[sc.id] || 0;
    cardsHTML += exports.generateSubCatCard(sc, cat.id, count);
  });

  var html =
    '<!DOCTYPE html>\n' +
    '<html lang="zh-CN">\n' +
    '<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n' +
    '<title>' + cat.name + ' - 派恩斯工业紧固件</title>\n' +
    exports.LANDING_CSS +
    '<link rel="stylesheet" href="css/cart.css">\n' +
    '</head>\n' +
    '<body>\n' +
    '<div id="app">\n' +

    '<nav class="nav-bar">' +
      '<a class="nav-back" href="index-1.html">← 首页</a>' +
      '<span class="nav-title">' + cat.name + '</span>' +
    '</nav>\n' +

    '<div class="cat-hero">' +
      '<div class="cat-hero-name">' + cat.name + '</div>' +
      '<div class="cat-hero-en">' + cat.nameEn + '</div>' +
      '<div class="cat-hero-desc">' + cat.description + '</div>' +
    '</div>\n' +

    '<div class="search-bar">' +
      '<div class="search-input-wrap">' +
        '<span class="search-icon">🔍</span>' +
        '<input type="text" class="search-input" id="searchInput" placeholder="搜索子分类名称...">' +
        '<span class="search-clear" id="searchClear">✕</span>' +
      '</div>' +
      '<div class="search-count" id="searchCount"></div>' +
      '<div class="no-result" id="noResult">未找到匹配的分类</div>' +
    '</div>\n' +

    '<div class="sub-cat-grid" id="subCatGrid">\n' + cardsHTML + '\n</div>\n' +

    '<div class="footer">' +
      '<div class="footer-logo">' +
        '<div class="footer-logo-icon">P</div>' +
        '<div>' +
          '<div class="footer-logo-text">派恩斯工业 · PINES</div>' +
          '<div class="footer-logo-sub">Professional Industrial Fasteners</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-contact">' +
        '<div class="footer-contact-item">' +
          '<span class="fc-icon">📞</span>' +
          '<span class="fc-text">全国服务热线</span>' +
          '<span class="fc-value">' + site.phone + '</span>' +
        '</div>' +
        '<div class="footer-contact-item">' +
          '<span class="fc-icon">✉️</span>' +
          '<span class="fc-text">商务邮箱</span>' +
          '<span class="fc-value">' + site.email + '</span>' +
        '</div>' +
        '<div class="footer-contact-item">' +
          '<span class="fc-icon">📍</span>' +
          '<span class="fc-text">工厂地址</span>' +
          '<span class="fc-value">' + site.address + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="footer-copyright">' +
        'Copyright © 2026 派恩斯工业紧固件<br>' +
        '专业制造 品质保障 服务至上' +
      '</div>' +
    '</div>\n' +

    '</div><!-- #app -->\n' +
    '<script>\n' +
    '(function() {\n' +
    '  var searchInput = document.getElementById(\'searchInput\');\n' +
    '  var searchClear = document.getElementById(\'searchClear\');\n' +
    '  var searchCount = document.getElementById(\'searchCount\');\n' +
    '  var noResult = document.getElementById(\'noResult\');\n' +
    '  if (!searchInput) return;\n' +
    '  searchInput.addEventListener(\'input\', function() {\n' +
    '    var q = this.value.trim().toLowerCase();\n' +
    '    if (searchClear) searchClear.classList.toggle(\'show\', q.length > 0);\n' +
    '    var cards = document.querySelectorAll(\'.sub-cat-card\');\n' +
    '    var visible = 0;\n' +
    '    cards.forEach(function(card) {\n' +
    '      var name = (card.getAttribute(\'data-name\') || \'\').toLowerCase();\n' +
    '      var match = !q || name.indexOf(q) !== -1;\n' +
    '      card.style.display = match ? \'\' : \'none\';\n' +
    '      if (match) visible++;\n' +
    '    });\n' +
    '    if (searchCount) searchCount.textContent = q ? \'找到 \' + visible + \' 个分类\' : \'\';\n' +
    '    if (noResult) noResult.classList.toggle(\'show\', q && visible === 0);\n' +
    '  });\n' +
    '  if (searchClear) {\n' +
    '    searchClear.addEventListener(\'click\', function() {\n' +
    '      searchInput.value = \'\';\n' +
    '      searchInput.dispatchEvent(new Event(\'input\'));\n' +
    '      searchInput.focus();\n' +
    '    });\n' +
    '  }\n' +
    '})();\n' +
    '<\/script>\n' +
    '<script src="js/cart.js"></script>\n' +
    '</body>\n' +
    '</html>';

  return html;
};
