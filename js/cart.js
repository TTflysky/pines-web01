/**
 * 派恩斯购物车系统
 * 纯前端实现，数据存 localStorage
 * 支持：产品页直接注入、购物车浮窗、数量调整、提交订单
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'pines_cart';
  var CART_PANEL_ID = 'cartPanelOverlay';

  // ===== 购物车数据层 =====
  var _items = [];
  // 产品页特有：记录每个产品按钮状态 { '产品名': true }
  var _inCartMap = {};

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      _items = raw ? JSON.parse(raw) : [];
    } catch (e) {
      _items = [];
    }
    _rebuildInCartMap();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_items));
    _rebuildInCartMap();
    renderBadge();
    updateAddButtons();
  }

  function _rebuildInCartMap() {
    _inCartMap = {};
    _items.forEach(function(item) {
      _inCartMap[item.name] = true;
    });
  }

  function getItems() { return _items; }

  function getCount() {
    return _items.reduce(function(sum, item) { return sum + (item.qty || 1); }, 0);
  }

  function getItemCount() {
    return _items.length;
  }

  function addItem(product) {
    if (!product || !product.name) return;
    // 同名产品合并
    var existing = null;
    for (var i = 0; i < _items.length; i++) {
      if (_items[i].name === product.name) {
        existing = i;
        break;
      }
    }
    if (existing !== null) {
      _items[existing].qty = (_items[existing].qty || 1) + (product.qty || 1);
    } else {
      _items.push({
        name: product.name,
        nameEn: product.nameEn || '',
        image: product.image || '',
        specs: product.specs || [],
        qty: product.qty || 1
      });
    }
    save();
    showToast('已加入购物车');
  }

  function removeItem(index) {
    if (index >= 0 && index < _items.length) {
      _items.splice(index, 1);
      save();
      renderPanel();
    }
  }

  function updateQty(index, delta) {
    if (index >= 0 && index < _items.length) {
      var newQty = (_items[index].qty || 1) + delta;
      if (newQty <= 0) {
        _items.splice(index, 1);
      } else {
        _items[index].qty = newQty;
      }
      save();
      renderPanel();
    }
  }

  function clearCart() {
    _items = [];
    save();
    renderPanel();
  }

  // ===== 从产品卡片提取信息 =====
  function addFromCard(btnEl) {
    var card = btnEl.closest('.product-card');
    if (!card) return;

    var nameEl = card.querySelector('.product-name');
    var nameEnEl = card.querySelector('.product-name-en');
    var imgEl = card.querySelector('.product-img');
    var name = nameEl ? nameEl.textContent.trim() : '';

    if (!name) return;

    var product = {
      name: name,
      nameEn: nameEnEl ? nameEnEl.textContent.trim() : '',
      image: imgEl ? imgEl.getAttribute('src') : '',
      specs: [],
      qty: 1
    };

    // 提取规格信息
    var specRows = card.querySelectorAll('.spec-table tr');
    specRows.forEach(function(row) {
      var cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        product.specs.push({
          label: cells[0].textContent.trim(),
          value: cells[1].textContent.trim()
        });
      }
    });

    // 如果没有 spec 表，尝试从 info-cards 提取
    if (product.specs.length === 0) {
      var infoCards = card.querySelectorAll('.info-card');
      infoCards.forEach(function(ic) {
        var label = ic.querySelector('.ic-label');
        var value = ic.querySelector('.ic-value');
        if (label && value) {
          product.specs.push({
            label: label.textContent.trim(),
            value: value.textContent.trim()
          });
        }
      });
    }

    addItem(product);
  }

  function isInCart(name) {
    return !!_inCartMap[name];
  }

  // ===== 按钮状态更新 =====
  function updateAddButtons() {
    var btns = document.querySelectorAll('.cart-add-btn');
    btns.forEach(function(btn) {
      var card = btn.closest('.product-card');
      if (!card) return;
      var nameEl = card.querySelector('.product-name');
      var name = nameEl ? nameEl.textContent.trim() : '';
      if (name && _inCartMap[name]) {
        btn.classList.add('in-cart');
        btn.textContent = '✓ 已加入购物车';
      } else {
        btn.classList.remove('in-cart');
        btn.textContent = '🛒 加入购物车';
      }
    });
  }

  // ===== 导航角标 =====
  function renderBadge() {
    var badge = document.getElementById('cartBadge');
    if (badge) {
      var count = getItemCount();
      badge.textContent = count;
      if (count > 0) {
        badge.classList.add('show');
      } else {
        badge.classList.remove('show');
      }
    }
  }

  function injectNavCart() {
    var navBar = document.querySelector('.nav-bar');
    if (!navBar) return;

    // 避免重复注入
    if (document.getElementById('cartNavIcon')) return;

    var cartIcon = document.createElement('span');
    cartIcon.id = 'cartNavIcon';
    cartIcon.className = 'nav-cart';
    cartIcon.title = '购物车';
    cartIcon.innerHTML = '🛒<span class="nav-cart-badge" id="cartBadge"></span>';
    cartIcon.addEventListener('click', openPanel);
    cartIcon.addEventListener('touchend', function(e) {
      e.preventDefault();
      openPanel();
    });
    navBar.appendChild(cartIcon);

    renderBadge();
  }

  // ===== 购物车面板 =====
  function getOrCreatePanel() {
    var panel = document.getElementById(CART_PANEL_ID);
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = CART_PANEL_ID;
    panel.className = 'cart-overlay';
    panel.innerHTML =
      '<div class="cart-panel" id="cartPanel">' +
        '<div class="cart-panel-handle"></div>' +
        '<div class="cart-panel-header">' +
          '<h3>🛒 购物车</h3>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<button class="cart-panel-clear" id="cartClearAll">清空</button>' +
            '<button class="cart-panel-close" id="cartPanelClose">✕</button>' +
          '</div>' +
        '</div>' +
        '<div class="cart-panel-body" id="cartPanelBody"></div>' +
        '<div class="cart-panel-footer">' +
          '<div class="cart-summary" id="cartSummary"></div>' +
          '<button class="cart-order-btn" id="cartOrderBtn" disabled>提交订单</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(panel);

    // 事件绑定
    panel.addEventListener('click', function(e) {
      if (e.target === panel) closePanel();
    });
    document.getElementById('cartPanelClose').addEventListener('click', closePanel);
    document.getElementById('cartClearAll').addEventListener('click', function() {
      if (_items.length > 0) {
        clearCart();
        showToast('购物车已清空');
      }
    });
    document.getElementById('cartOrderBtn').addEventListener('click', function() {
      if (_items.length === 0) return;
      window.location.href = 'order.html';
    });

    return panel;
  }

  function openPanel() {
    var panel = getOrCreatePanel();
    renderPanel();
    panel.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    var panel = document.getElementById(CART_PANEL_ID);
    if (panel) {
      panel.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function renderPanel() {
    var body = document.getElementById('cartPanelBody');
    var summary = document.getElementById('cartSummary');
    var orderBtn = document.getElementById('cartOrderBtn');
    if (!body) return;

    if (_items.length === 0) {
      body.innerHTML =
        '<div class="cart-empty">' +
          '<div class="cart-empty-icon">🛒</div>' +
          '<div class="cart-empty-text">购物车是空的</div>' +
          '<div style="font-size:12px;color:#bbb;margin-top:4px;">去产品页添加商品吧</div>' +
        '</div>';
      if (summary) summary.innerHTML = '';
      if (orderBtn) orderBtn.disabled = true;
      return;
    }

    var html = '';
    _items.forEach(function(item, index) {
      var specsStr = item.specs.map(function(s) {
        return s.label + ': ' + s.value;
      }).join(' · ') || '标准规格';

      var imgTag = item.image
        ? '<img class="cart-item-img" src="' + item.image + '" alt="' + item.name + '" onerror="this.style.display=\'none\'">'
        : '';

      html +=
        '<div class="cart-item">' +
          imgTag +
          '<div class="cart-item-info">' +
            '<div class="cart-item-name">' + item.name + '</div>' +
            (item.nameEn ? '<div style="font-size:11px;color:#bbb;">' + item.nameEn + '</div>' : '') +
            '<div class="cart-item-specs">' + specsStr + '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;align-items:flex-end;">' +
            '<div class="cart-item-actions">' +
              '<button class="cart-qty-btn" onclick="Cart.updateQty(' + index + ',-1)">−</button>' +
              '<span class="cart-qty-val">' + item.qty + '</span>' +
              '<button class="cart-qty-btn" onclick="Cart.updateQty(' + index + ',1)">+</button>' +
            '</div>' +
            '<div class="cart-item-remove" onclick="Cart.removeItem(' + index + ')">删除</div>' +
          '</div>' +
        '</div>';
    });

    body.innerHTML = html;

    var totalItems = getCount();
    if (summary) {
      summary.innerHTML = '共 <strong>' + totalItems + '</strong> 件商品';
    }
    if (orderBtn) {
      orderBtn.disabled = _items.length === 0;
    }
  }

  // ===== Toast 提示 =====
  function showToast(msg) {
    // 移除已有 toast
    var existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    // 触发动画
    requestAnimationFrame(function() {
      toast.classList.add('show');
    });

    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() { toast.remove(); }, 300);
    }, 1500);
  }

  // ===== 注入产品页购物车按钮 =====
  function injectCartButtons() {
    var cardBodies = document.querySelectorAll('.product-card-body');
    cardBodies.forEach(function(body) {
      // 避免重复注入
      if (body.querySelector('.cart-add-btn')) return;

      var inquiryBtn = body.querySelector('.inquiry-btn');
      var cartBtn = document.createElement('button');
      cartBtn.className = 'cart-add-btn';
      cartBtn.textContent = '🛒 加入购物车';
      cartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        Cart.addFromCard(this);
      });

      if (inquiryBtn) {
        // 插入在询价按钮前面
        inquiryBtn.parentNode.insertBefore(cartBtn, inquiryBtn);
      } else {
        // 没有询价按钮，放在 body 末尾
        body.appendChild(cartBtn);
      }
    });
  }

  // ===== 初始化 =====
  function init() {
    load();
    injectNavCart();
    injectCartButtons();
    updateAddButtons();
    // 预创建面板（不显示）
    getOrCreatePanel();
  }

  // ===== 暴露全局 API =====
  window.Cart = {
    addItem: addItem,
    removeItem: removeItem,
    updateQty: updateQty,
    getItems: getItems,
    getCount: getCount,
    getItemCount: getItemCount,
    clear: clearCart,
    addFromCard: addFromCard,
    isInCart: isInCart,
    openPanel: openPanel,
    closePanel: closePanel,
    init: init
  };

  // 页面加载完成后自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
