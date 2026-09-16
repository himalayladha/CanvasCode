/**
 * Bridge script injected into the preview iframe to facilitate
 * live console logging, error reporting, link navigation, and visual element inspection.
 */

export const IFRAME_BRIDGE_SCRIPT = `
<script id="__WEBSTUDIO_BRIDGE__">
(function() {
  if (window.__WEBSTUDIO_BRIDGE_INITIALIZED__) return;
  window.__WEBSTUDIO_BRIDGE_INITIALIZED__ = true;

  // 1. Console & Error interception
  var originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  };

  function sendLog(level, args) {
    try {
      var message = Array.prototype.slice.call(args).map(function(arg) {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch(e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');

      window.parent.postMessage({
        type: 'WEBSTUDIO_CONSOLE_LOG',
        payload: {
          level: level,
          message: message,
          timestamp: Date.now()
        }
      }, '*');
    } catch(e) {}
  }

  console.log = function() {
    originalConsole.log.apply(console, arguments);
    sendLog('log', arguments);
  };
  console.info = function() {
    originalConsole.info.apply(console, arguments);
    sendLog('info', arguments);
  };
  console.warn = function() {
    originalConsole.warn.apply(console, arguments);
    sendLog('warn', arguments);
  };
  console.error = function() {
    originalConsole.error.apply(console, arguments);
    sendLog('error', arguments);
  };

  window.addEventListener('error', function(event) {
    window.parent.postMessage({
      type: 'WEBSTUDIO_CONSOLE_LOG',
      payload: {
        level: 'error',
        message: event.message + (event.filename ? ' (' + event.filename + ':' + event.lineno + ')' : ''),
        stack: event.error ? event.error.stack : undefined,
        timestamp: Date.now()
      }
    }, '*');
  });

  window.addEventListener('unhandledrejection', function(event) {
    window.parent.postMessage({
      type: 'WEBSTUDIO_CONSOLE_LOG',
      payload: {
        level: 'error',
        message: 'Unhandled Promise Rejection: ' + (event.reason ? (event.reason.message || String(event.reason)) : 'Unknown'),
        stack: event.reason && event.reason.stack ? event.reason.stack : undefined,
        timestamp: Date.now()
      }
    }, '*');
  });

  // 2. Link Navigation Interception
  document.addEventListener('click', function(e) {
    var target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }
    if (target && target.tagName === 'A') {
      var href = target.getAttribute('href');
      if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('javascript:')) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({
          type: 'WEBSTUDIO_NAVIGATE_TO',
          payload: {
            path: href
          }
        }, '*');
      }
    }
  }, true);

  // 3. Visual Element Inspector Overlay
  var isInspectMode = false;
  var hoverOverlay = null;

  function createHoverOverlay() {
    if (hoverOverlay) return hoverOverlay;
    hoverOverlay = document.createElement('div');
    hoverOverlay.id = '__webstudio_inspect_overlay__';
    hoverOverlay.style.cssText = 'position: fixed; pointer-events: none; z-index: 2147483647; border: 2px dashed #3b82f6; background-color: rgba(59, 130, 246, 0.15); transition: all 0.05s ease-out; display: none;';
    
    var badge = document.createElement('div');
    badge.id = '__webstudio_inspect_badge__';
    badge.style.cssText = 'position: absolute; top: -24px; left: 0; background: #3b82f6; color: #ffffff; font-family: monospace; font-size: 11px; padding: 2px 6px; border-radius: 3px; white-space: nowrap; pointer-events: none; font-weight: bold;';
    hoverOverlay.appendChild(badge);

    document.body.appendChild(hoverOverlay);
    return hoverOverlay;
  }

  function getUniqueSelector(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return '';
    if (el.id) return '#' + el.id;
    if (el === document.body) return 'body';

    var path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE && el !== document.body) {
      var selector = el.nodeName.toLowerCase();
      if (el.className && typeof el.className === 'string') {
        var validClasses = el.className.trim().split(/\\s+/).filter(function(c) {
          return c && !c.startsWith('__webstudio');
        });
        if (validClasses.length > 0) {
          selector += '.' + validClasses.join('.');
        }
      }
      var siblingIndex = 1;
      var sibling = el.previousElementSibling;
      while (sibling) {
        if (sibling.nodeName === el.nodeName) siblingIndex++;
        sibling = sibling.previousElementSibling;
      }
      if (siblingIndex > 1) {
        selector += ':nth-of-type(' + siblingIndex + ')';
      }
      path.unshift(selector);
      el = el.parentElement;
    }
    return path.join(' > ');
  }

  function extractElementData(el) {
    var rect = el.getBoundingClientRect();
    var style = window.getComputedStyle(el);
    var classList = [];
    if (el.className && typeof el.className === 'string') {
      classList = el.className.trim().split(/\\s+/).filter(Boolean);
    }

    var attributes = {};
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (!attr.name.startsWith('data-webstudio')) {
        attributes[attr.name] = attr.value;
      }
    }

    return {
      tagName: el.tagName.toLowerCase(),
      id: el.id || '',
      classList: classList,
      selector: getUniqueSelector(el),
      innerText: el.children.length === 0 ? el.textContent || '' : '',
      attributes: attributes,
      computedStyles: {
        color: style.color || '',
        backgroundColor: style.backgroundColor || '',
        fontSize: style.fontSize || '',
        fontWeight: style.fontWeight || '',
        textAlign: style.textAlign || '',
        margin: style.margin || '',
        padding: style.padding || '',
        border: style.border || '',
        borderRadius: style.borderRadius || '',
        width: Math.round(rect.width) + 'px',
        height: Math.round(rect.height) + 'px',
        display: style.display || ''
      },
      boxModel: {
        marginTop: style.marginTop || '0px',
        marginRight: style.marginRight || '0px',
        marginBottom: style.marginBottom || '0px',
        marginLeft: style.marginLeft || '0px',
        paddingTop: style.paddingTop || '0px',
        paddingRight: style.paddingRight || '0px',
        paddingBottom: style.paddingBottom || '0px',
        paddingLeft: style.paddingLeft || '0px'
      },
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    };
  }

  function handleMouseMove(e) {
    if (!isInspectMode) return;
    var target = e.target;
    if (!target || target === document.body || target === document.documentElement || target.id?.startsWith('__webstudio')) {
      if (hoverOverlay) hoverOverlay.style.display = 'none';
      return;
    }

    var overlay = createHoverOverlay();
    var rect = target.getBoundingClientRect();
    overlay.style.display = 'block';
    overlay.style.top = rect.top + 'px';
    overlay.style.left = rect.left + 'px';
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';

    var badge = overlay.querySelector('#__webstudio_inspect_badge__');
    if (badge) {
      var classNameStr = target.className && typeof target.className === 'string' ? '.' + target.className.trim().split(/\\s+/).slice(0, 2).join('.') : '';
      badge.textContent = target.tagName.toLowerCase() + (target.id ? '#' + target.id : '') + classNameStr + ' [' + Math.round(rect.width) + ' × ' + Math.round(rect.height) + ']';
    }
  }

  function handleClick(e) {
    if (!isInspectMode) return;
    var target = e.target;
    if (!target || target === document.body || target === document.documentElement || target.id?.startsWith('__webstudio')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    var data = extractElementData(target);
    window.parent.postMessage({
      type: 'WEBSTUDIO_ELEMENT_SELECTED',
      payload: data
    }, '*');
  }

  window.addEventListener('message', function(event) {
    var data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'SET_INSPECT_MODE') {
      isInspectMode = !!data.payload;
      if (!isInspectMode && hoverOverlay) {
        hoverOverlay.style.display = 'none';
      }
    }
  });

  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('click', handleClick, true);
})();
</script>
`;
