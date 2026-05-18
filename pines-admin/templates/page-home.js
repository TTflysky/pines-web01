// page-home.js
// 首页模板
// 导出函数：generateHomePage(data)

var shared = require('./shared');

function generateHomePage(data) {
  var site = data.site;
  var categories = data.categories;

  // 品类卡片列表
  var categoryCardsHTML = '';
  categories.forEach(function(cat, i) {
    var countText = cat.id === 'custom' ? '按需' : cat.products.length + '款';
    if (cat.featured) {
      // 大卡片（featured = true 的品类，跨2列）
      categoryCardsHTML +=
        '<div class="category-item cat-big" onclick="location.href=\'category-' + cat.id + '.html\'" style="cursor:pointer;">' +
        '<div style="width:48px;height:48px;background:rgba(255,255,255,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
        '<svg width="28" height="28" viewBox="0 0 28 28" fill="none">' +
        '<circle cx="14" cy="4" r="3" fill="white"/>' +
        '<rect x="12" y="7" width="4" height="18" rx="2" fill="white"/>' +
        '</svg>' +
        '</div>' +
        '<div>' +
        '<div class="cat-name">' + cat.name + '</div>' +
        '<div class="cat-sub">' + cat.nameEn + '</div>' +
        '<span class="cat-card-label">' + countText + '</span>' +
        '</div>' +
        '</div>';
    } else {
      // 普通3列卡片
      var iconColors = {
        bolts: { bg: '#fff8e6', stroke: '#f59e0b' },
        washers: { bg: '#fefce8', stroke: '#ca8a04' },
        clips: { bg: '#fdf4ff', stroke: '#9333ea' },
        custom: { bg: '#f9fafb', stroke: '#374151' }
      };
      var ic = iconColors[cat.id] || { bg: '#f0f9ff', stroke: '#0284c7' };
      var iconSVG;
      if (cat.id === 'bolts') {
        iconSVG = '<svg width="30" height="30" viewBox="0 0 30 30" fill="none">' +
          '<polygon points="15,3 27,10 27,20 15,27 3,20 3,10" fill="' + ic.bg + '" opacity="0.2"/>' +
          '<polygon points="15,3 27,10 27,20 15,27 3,20 3,10" fill="none" stroke="' + ic.stroke + '" stroke-width="2"/>' +
          '<circle cx="15" cy="15" r="5" fill="' + ic.stroke + '"/>' +
          '</svg>';
      } else if (cat.id === 'washers') {
        iconSVG = '<svg width="30" height="30" viewBox="0 0 30 30" fill="none">' +
          '<circle cx="15" cy="15" r="11" fill="none" stroke="' + ic.stroke + '" stroke-width="2"/>' +
          '<circle cx="15" cy="15" r="6" fill="none" stroke="' + ic.stroke + '" stroke-width="2"/>' +
          '<circle cx="15" cy="15" r="2" fill="' + ic.stroke + '"/>' +
          '</svg>';
      } else if (cat.id === 'clips') {
        iconSVG = '<svg width="30" height="30" viewBox="0 0 30 30" fill="none">' +
          '<path d="M15 3 C8 3 3 8 3 15 C3 22 8 27 15 27 C22 27 27 22 27 15" stroke="' + ic.stroke + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
          '<path d="M22 3 L27 8 L27 3 Z" fill="' + ic.stroke + '"/>' +
          '</svg>';
      } else if (cat.id === 'custom') {
        iconSVG = '<svg width="30" height="30" viewBox="0 0 30 30" fill="none">' +
          '<circle cx="15" cy="15" r="11" fill="none" stroke="' + ic.stroke + '" stroke-width="2" stroke-dasharray="3 2"/>' +
          '<text x="15" y="19" font-size="10" font-weight="700" fill="' + ic.stroke + '" text-anchor="middle" font-family="Arial">+</text>' +
          '</svg>';
      } else {
        iconSVG = '<svg width="30" height="30" viewBox="0 0 30 30" fill="none">' +
          '<circle cx="15" cy="15" r="10" fill="none" stroke="' + ic.stroke + '" stroke-width="2"/>' +
          '</svg>';
      }
      categoryCardsHTML +=
        '<div class="category-item" onclick="location.href=\'category-' + cat.id + '.html\'" style="cursor:pointer;">' +
        '<div class="icon-circle" style="background:' + ic.bg + ';">' + iconSVG + '</div>' +
        '<span class="cat-name">' + cat.name + '</span>' +
        '<span class="cat-sub">' + cat.nameEn + '</span>' +
        '<span class="cat-card-count">' + countText + '</span>' +
        '</div>';
    }
  });

  var html = '<!DOCTYPE html>\n' +
    '<html lang="zh-CN">\n' +
    '<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n' +
    '<title>派恩斯工业紧固件</title>\n' +
    shared.generateSharedCSS() +
    '<link rel="stylesheet" href="css/cart.css">\n' +
    '<style>' +
    // 首页额外样式
    '.notice-bar { background: #fff8e6; padding: 8px 16px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #fde68a; }' +
    '.notice-icon { font-size: 14px; }' +
    '.notice-text { font-size: 12px; color: #92400e; flex: 1; }' +
    '.section-header { padding: 14px 16px 10px; display: flex; align-items: baseline; gap: 4px; }' +
    '.section-header h2 { font-size: 16px; font-weight: 700; color: #222; }' +
    '.section-header span { font-size: 11px; color: #999; }' +
    '.category-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: #e0e0e0; margin: 0 0 2px 0; }' +
    '.category-item { background: #fff; position: relative; overflow: hidden; cursor: pointer; aspect-ratio: 1/1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 6px; transition: background 0.15s; }' +
    '.category-item:active { background: #eef2ff; }' +
    '.category-item .cat-icon { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; margin-bottom: 6px; }' +
    '.category-item .cat-icon-svg { width: 52px; height: 52px; margin-bottom: 6px; display: flex; align-items: center; justify-content: center; }' +
    '.category-item .cat-name { font-size: 12px; color: #222; font-weight: 600; text-align: center; line-height: 1.3; }' +
    '.category-item .cat-sub { font-size: 10px; color: #999; text-align: center; margin-top: 2px; }' +
    '.category-item.cat-big { grid-column: span 2; aspect-ratio: 2/1; background: #1e5bb5; flex-direction: row; justify-content: flex-start; padding: 14px 16px; gap: 14px; }' +
    '.category-item.cat-big .cat-name { color: #fff; font-size: 15px; text-align: left; }' +
    '.category-item.cat-big .cat-sub { color: rgba(255,255,255,0.7); text-align: left; font-size: 11px; }' +
    '.cat-card-label { display:inline-block;background:rgba(255,255,255,0.2);color:#fff;font-size:10px;padding:2px 8px;border-radius:10px;margin-top:6px;letter-spacing:.5px; }' +
    '.cat-card-count { font-size:13px;font-weight:700;color:#1e5bb5; }' +
    '.icon-circle { width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:6px; }' +
    '.features-section { background: #fff; margin-top: 8px; }' +
    '.features-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 0 16px 16px; }' +
    '.feature-card { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 8px; padding: 14px 12px; display: flex; flex-direction: column; gap: 6px; }' +
    '.feature-card .feat-icon { font-size: 24px; line-height: 1; }' +
    '.feature-card .feat-title { font-size: 13px; font-weight: 700; color: #222; }' +
    '.feature-card .feat-desc { font-size: 11px; color: #777; line-height: 1.5; }' +
    '.cta-section { background: linear-gradient(135deg, #1e5bb5 0%, #0d2f6b 100%); padding: 24px 16px; margin-top: 8px; }' +
    '.cta-title { color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 6px; }' +
    '.cta-sub { color: rgba(255,255,255,0.8); font-size: 12px; margin-bottom: 18px; line-height: 1.6; }' +
    '.cta-buttons { display: flex; gap: 10px; }' +
    '.btn-primary { flex: 1; height: 44px; background: #fff; color: #1e5bb5; border: none; border-radius: 22px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }' +
    '.btn-secondary { flex: 1; height: 44px; background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.7); border-radius: 22px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }' +
    '.company-section { background: #fff; margin-top: 8px; padding: 16px; }' +
    '.company-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 12px; }' +
    '.company-stat { text-align: center; }' +
    '.company-stat .stat-num { font-size: 22px; font-weight: 900; color: #1e5bb5; line-height: 1; margin-bottom: 4px; }' +
    '.company-stat .stat-unit { font-size: 12px; color: #1e5bb5; }' +
    '.company-stat .stat-label { font-size: 11px; color: #888; margin-top: 3px; }' +
    '.cert-section { background: #f9f9f9; padding: 12px 16px; margin-top: 8px; }' +
    '.cert-title { font-size: 11px; color: #999; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }' +
    '.cert-list { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; }' +
    '.cert-badge { flex-shrink: 0; background: #fff; border: 1px solid #e8e8e8; border-radius: 6px; padding: 8px 12px; font-size: 11px; color: #444; font-weight: 600; white-space: nowrap; }' +
    '.bottom-bar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 450px; height: 56px; background: #fff; border-top: 1px solid #eee; display: flex; align-items: center; padding: 0 12px; gap: 10px; z-index: 999; box-shadow: 0 -4px 16px rgba(0,0,0,0.08); }' +
    '.bottom-bar-tel { flex: 1; height: 40px; border: 1.5px solid #1e5bb5; border-radius: 20px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; color: #1e5bb5; font-weight: 600; cursor: pointer; }' +
    '.bottom-bar-contact { flex: 2; height: 40px; background: #1e5bb5; border-radius: 20px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; color: #fff; font-weight: 700; cursor: pointer; }' +
    '.banner-main { width: 100%; position: relative; overflow: hidden; background: #1a1a1a; }' +
    '.banner-main-img { width: 100%; display: block; }' +
    '.promo-banner { width: 100%; position: relative; overflow: hidden; }' +
    '.promo-banner-img { width: 100%; display: block; }' +
    '.footer { background: #1a1a1a; padding: 20px 16px 80px; margin-top: 8px; }' +
    '.footer-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }' +
    '.footer-logo-icon { width: 36px; height: 36px; background: #1e5bb5; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; color: #fff; }' +
    '.footer-logo-text { color: #fff; font-size: 16px; font-weight: 700; }' +
    '.footer-logo-sub { color: #888; font-size: 11px; }' +
    '.footer-contact { margin-bottom: 14px; }' +
    '.footer-contact-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #2a2a2a; }' +
    '.footer-contact-item:last-child { border-bottom: none; }' +
    '.footer-contact-item .fc-icon { font-size: 14px; flex-shrink: 0; }' +
    '.footer-contact-item .fc-text { font-size: 12px; color: #bbb; flex: 1; }' +
    '.footer-contact-item .fc-value { font-size: 12px; color: #fff; font-weight: 600; }' +
    '.footer-copyright { font-size: 10px; color: #555; text-align: center; margin-top: 14px; line-height: 1.8; }' +
    '.bottom-placeholder { height: 76px; }' +
    '</style>\n' +
    '</head>\n' +
    '<body>\n' +
    '<div id="app">\n' +

    // 导航栏
    '<nav class="nav-bar">' +
    '<div class="nav-logo">' +
    '<div class="nav-logo-icon">P</div>' +
    '<span class="nav-logo-text">派恩斯 · PINES</span>' +
    '</div>' +
    '<div class="nav-menu-btn">☰</div>' +
    '</nav>\n' +

    // Banner
    '<div class="banner-main">' +
    '<svg class="banner-main-img" viewBox="0 0 390 160" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
    '<linearGradient id="bannerGrad" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0%" stop-color="#0d2f6b"/><stop offset="100%" stop-color="#1e5bb5"/>' +
    '</linearGradient>' +
    '<pattern id="hexPattern" width="20" height="23" patternUnits="userSpaceOnUse">' +
    '<polygon points="10,2 18,7 18,16 10,21 2,16 2,7" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>' +
    '</pattern>' +
    '</defs>' +
    '<rect width="390" height="160" fill="url(#bannerGrad)"/>' +
    '<rect width="390" height="160" fill="url(#hexPattern)"/>' +
    '<circle cx="310" cy="80" r="90" fill="rgba(255,255,255,0.04)"/>' +
    '<circle cx="310" cy="80" r="60" fill="rgba(255,255,255,0.05)"/>' +
    '<g transform="translate(270,45)" opacity="0.18">' +
    '<rect x="0" y="0" width="60" height="12" rx="6" fill="#fff"/>' +
    '<rect x="20" y="12" width="20" height="50" fill="#fff"/>' +
    '<line x1="0" y1="6" x2="60" y2="6" stroke="#0d2f6b" stroke-width="1.5"/>' +
    '</g>' +
    '<text x="20" y="42" font-family="Microsoft YaHei,Arial" font-size="11" fill="rgba(255,255,255,0.7)" letter-spacing="2">' + site.nameEn + '</text>' +
    '<text x="20" y="72" font-family="Microsoft YaHei,Arial" font-size="26" font-weight="900" fill="#fff">' + site.name + '</text>' +
    '<text x="20" y="92" font-family="Microsoft YaHei,Arial" font-size="13" fill="rgba(255,255,255,0.85)">弹性销 · 直槽销 · 实心销 · 卡扣 · 垫片</text>' +
    '<text x="20" y="112" font-family="Microsoft YaHei,Arial" font-size="11" fill="rgba(255,255,255,0.6)">专业制造 · 品质保障 · 快速交付</text>' +
    '<rect x="20" y="126" width="90" height="26" rx="13" fill="#fff"/>' +
    '<text x="65" y="143" font-family="Microsoft YaHei,Arial" font-size="12" font-weight="700" fill="#1e5bb5" text-anchor="middle">立即咨询 →</text>' +
    '</svg>' +
    '</div>\n' +

    // 通知栏
    '<div class="notice-bar">' +
    '<span class="notice-icon">📢</span>' +
    '<span class="notice-text"><strong>新品上线：</strong>DIN 1481弹性圆柱销，批量现货，欢迎询价采购</span>' +
    '</div>\n' +

    // 推广横幅
    '<div class="promo-banner">' +
    '<svg class="promo-banner-img" viewBox="0 0 390 140" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
    '<linearGradient id="promoGrad" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0%" stop-color="#2d2d2d"/><stop offset="100%" stop-color="#111"/>' +
    '</linearGradient>' +
    '</defs>' +
    '<rect width="390" height="140" fill="url(#promoGrad)"/>' +
    '<pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">' +
    '<path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>' +
    '</pattern>' +
    '<rect width="390" height="140" fill="url(#grid)"/>' +
    '<circle cx="320" cy="70" r="80" fill="rgba(30,91,181,0.08)"/>' +
    '<g transform="translate(270,35)" opacity="0.9">' +
    '<polygon points="40,0 70,17 70,53 40,70 10,53 10,17" fill="none" stroke="#1e5bb5" stroke-width="2"/>' +
    '<polygon points="40,8 63,21 63,49 40,62 17,49 17,21" fill="rgba(30,91,181,0.15)" stroke="rgba(30,91,181,0.5)" stroke-width="1"/>' +
    '<circle cx="40" cy="35" r="12" fill="none" stroke="#1e5bb5" stroke-width="2"/>' +
    '<circle cx="40" cy="35" r="6" fill="rgba(30,91,181,0.4)"/>' +
    '</g>' +
    '<text x="20" y="38" font-family="Microsoft YaHei,Arial" font-size="18" font-weight="900" fill="#fff">自有工厂 · 精密制造</text>' +
    '<text x="20" y="62" font-family="Microsoft YaHei,Arial" font-size="12" fill="rgba(255,255,255,0.6)">通过 ISO 9001 质量体系认证</text>' +
    '<rect x="20" y="80" width="70" height="40" rx="4" fill="rgba(30,91,181,0.2)" stroke="rgba(30,91,181,0.3)" stroke-width="1"/>' +
    '<text x="55" y="97" font-family="Arial" font-size="16" font-weight="900" fill="#1e5bb5" text-anchor="middle">' + site.products + '</text>' +
    '<text x="55" y="113" font-family="Microsoft YaHei,Arial" font-size="10" fill="rgba(255,255,255,0.5)" text-anchor="middle">产品规格</text>' +
    '<rect x="100" y="80" width="70" height="40" rx="4" fill="rgba(30,91,181,0.2)" stroke="rgba(30,91,181,0.3)" stroke-width="1"/>' +
    '<text x="135" y="97" font-family="Arial" font-size="16" font-weight="900" fill="#1e5bb5" text-anchor="middle">' + site.founded + '</text>' +
    '<text x="135" y="113" font-family="Microsoft YaHei,Arial" font-size="10" fill="rgba(255,255,255,0.5)" text-anchor="middle">年制造经验</text>' +
    '<rect x="180" y="80" width="70" height="40" rx="4" fill="rgba(30,91,181,0.2)" stroke="rgba(30,91,181,0.3)" stroke-width="1"/>' +
    '<text x="215" y="97" font-family="Arial" font-size="16" font-weight="900" fill="#1e5bb5" text-anchor="middle">' + site.countries + '</text>' +
    '<text x="215" y="113" font-family="Microsoft YaHei,Arial" font-size="10" fill="rgba(255,255,255,0.5)" text-anchor="middle">出口国家</text>' +
    '</svg>' +
    '</div>\n' +

    // 产品中心
    '<div class="section-header"><h2>产品中心</h2><span>Product Center</span></div>\n' +
    '<div class="category-grid">' + categoryCardsHTML + '</div>\n' +

    // 核心优势
    '<div class="features-section">' +
    '<div class="section-header"><h2>核心优势</h2><span>Why Choose Us</span></div>' +
    '<div class="features-list">' +
    '<div class="feature-card"><div class="feat-icon">🏭</div><div class="feat-title">自有工厂</div><div class="feat-desc">从原料到成品，全程自产自销，品质可追溯</div></div>' +
    '<div class="feature-card"><div class="feat-icon">🔬</div><div class="feat-title">专业检测</div><div class="feat-desc">配备专业实验室与检验室，严格把控每批次质量</div></div>' +
    '<div class="feature-card"><div class="feat-icon">📦</div><div class="feat-title">快速交付</div><div class="feat-desc">现货库存充足，标准件24小时内发货</div></div>' +
    '<div class="feature-card"><div class="feat-icon">⚙️</div><div class="feat-title">非标定制</div><div class="feat-desc">支持按图纸定制开发，满足特殊工况需求</div></div>' +
    '</div></div>\n' +

    // CTA
    '<div class="cta-section">' +
    '<div class="cta-title">获取产品手册 &amp; 报价</div>' +
    '<div class="cta-sub">专业团队一对一服务，提供技术选型建议<br>最快当天反馈报价，支持样品试用</div>' +
    '<div class="cta-buttons">' +
    '<button class="btn-primary" id="btnPhone">📞 电话咨询</button>' +
    '<button class="btn-secondary" id="btnInquiry">💬 在线询价</button>' +
    '</div></div>\n' +

    // 关于
    '<div class="company-section">' +
    '<div class="section-header" style="padding:0 0 10px 0;"><h2>关于派恩斯</h2><span>About Pines</span></div>' +
    '<p style="font-size:12px;color:#666;line-height:1.8;margin-bottom:12px;">' +
    '派恩斯是一家专业从事金属紧固件研发与制造的企业，主要产品涵盖弹性销、直槽销、实心销、卡扣、垫片等标准件及非标定制件，广泛应用于汽车、机械、电子、航空等领域。' +
    '</p>' +
    '<div class="company-info-grid">' +
    '<div class="company-stat"><div><span class="stat-num">' + site.founded + '</span><span class="stat-unit">+</span></div><div class="stat-label">年制造经验</div></div>' +
    '<div class="company-stat"><div><span class="stat-num">' + site.products + '</span><span class="stat-unit">+</span></div><div class="stat-label">产品规格</div></div>' +
    '<div class="company-stat"><div><span class="stat-num">' + site.countries + '</span><span class="stat-unit">+</span></div><div class="stat-label">出口国家</div></div>' +
    '</div></div>\n' +

    // 认证
    '<div class="cert-section">' +
    '<div class="cert-title">认证与标准</div>' +
    '<div class="cert-list">' +
    '<div class="cert-badge">✓ ISO 9001</div>' +
    '<div class="cert-badge">✓ DIN 标准</div>' +
    '<div class="cert-badge">✓ ISO 8752</div>' +
    '<div class="cert-badge">✓ ANSI/ASME</div>' +
    '<div class="cert-badge">✓ JIS 标准</div>' +
    '<div class="cert-badge">✓ GB 国标</div>' +
    '</div></div>\n' +

    // Footer
    shared.generateFooter(site) +

    '<div class="bottom-placeholder"></div>\n' +
    '</div><!-- #app -->\n' +

    // 底部固定栏
    '<div class="bottom-bar">' +
    '<div class="bottom-bar-tel" id="bottomPhone">📞 电话</div>' +
    '<div class="bottom-bar-contact" id="bottomInquiry">💬 在线询价 · 获取报价单</div>' +
    '</div>\n' +

    // 弹窗
    shared.generateModalHTML() +

    // JS
    shared.generateModalJS() +
    '<script>\n' +
    'var phoneNumber = \'' + site.phone + '\';\n' +
    'document.getElementById(\'btnPhone\').addEventListener(\'click\', function() { window.location.href = \'tel:\' + phoneNumber; });\n' +
    'document.getElementById(\'bottomPhone\').addEventListener(\'click\', function() { window.location.href = \'tel:\' + phoneNumber; });\n' +
    'document.getElementById(\'btnInquiry\').addEventListener(\'click\', openInquiryForm);\n' +
    'document.getElementById(\'bottomInquiry\').addEventListener(\'click\', openInquiryForm);\n' +
    '<\/script>\n' +
    '<script src="js/cart.js"></script>\n' +

    '</body>\n</html>';

  return html;
}

module.exports = { generateHomePage };
