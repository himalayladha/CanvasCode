/**
 * Bridge script injected into the preview iframe to facilitate
 * live console logging, error reporting, link navigation, visual element inspection,
 * and on-canvas WYSIWYG double-click text editing.
 */

export function getIframeBridgeScript(initialInspectMode: boolean = true): string {
  return `
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

  // 2. Visual Element Inspector Overlay & State
  var isInspectMode = ${initialInspectMode ? 'true' : 'false'};
  var hoverOverlay = null;

  function setMode(mode) {
    isInspectMode = !!mode;
    if (!isInspectMode && hoverOverlay) {
      hoverOverlay.style.display = 'none';
    }
  }

  // 3. Link Navigation Interception (Interact Mode)
  document.addEventListener('click', function(e) {
    if (isInspectMode) return;
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

  function createHoverOverlay() {
    if (hoverOverlay) return hoverOverlay;
    hoverOverlay = document.createElement('div');
    hoverOverlay.id = '__webstudio_inspect_overlay__';
    hoverOverlay.style.cssText = 'position: fixed; pointer-events: none; z-index: 2147483647; border: 2px dashed #007acc; background-color: rgba(0, 122, 204, 0.12); transition: all 0.05s ease-out; display: none;';
    
    var badge = document.createElement('div');
    badge.id = '__webstudio_inspect_badge__';
    badge.style.cssText = 'position: absolute; top: -24px; left: 0; background: #007acc; color: #ffffff; font-family: monospace; font-size: 11px; padding: 2px 6px; border-radius: 3px; white-space: nowrap; pointer-events: none; font-weight: bold; box-shadow: 0 2px 6px rgba(0,0,0,0.3);';
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
      if (!attr.name.startsWith('data-webstudio') && attr.name !== 'contenteditable') {
        attributes[attr.name] = attr.value;
      }
    }

    var ancestorPath = [];
    var curr = el;
    while (curr && curr !== document.documentElement && curr.nodeType === Node.ELEMENT_NODE) {
      var currClasses = [];
      if (curr.className && typeof curr.className === 'string') {
        currClasses = curr.className.trim().split(/\\s+/).filter(function(c) {
          return c && !c.startsWith('__webstudio');
        });
      }
      ancestorPath.unshift({
        tagName: curr.tagName.toLowerCase(),
        id: curr.id || '',
        classList: currClasses,
        selector: getUniqueSelector(curr),
        dataWebstudioId: curr.getAttribute('data-webstudio-id') || undefined
      });
      curr = curr.parentElement;
    }

    return {
      dataWebstudioId: el.getAttribute('data-webstudio-id') || undefined,
      tagName: el.tagName.toLowerCase(),
      id: el.id || '',
      classList: classList,
      selector: getUniqueSelector(el),
      ancestorPath: ancestorPath,
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
        display: style.display || '',
        flexDirection: style.flexDirection || 'row',
        alignItems: style.alignItems || 'stretch',
        justifyContent: style.justifyContent || 'flex-start',
        gap: style.gap || '0px',
        opacity: style.opacity || '1'
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
    if (!isInspectMode) {
      if (hoverOverlay) hoverOverlay.style.display = 'none';
      return;
    }
    var target = e.target;
    if (!target || target === document.body || target === document.documentElement || target.id?.startsWith('__webstudio') || (target.closest && target.closest('#__webstudio_inspect_overlay__'))) {
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
    if (!target || target === document.body || target === document.documentElement || target.id?.startsWith('__webstudio') || (target.closest && target.closest('#__webstudio_inspect_overlay__'))) {
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

  // On-canvas Double-Click WYSIWYG text editing (Design Mode only)
  document.addEventListener('dblclick', function(e) {
    if (!isInspectMode) return;
    var target = e.target;
    if (!target || target === document.body || target === document.documentElement || target.id?.startsWith('__webstudio') || (target.closest && target.closest('#__webstudio_inspect_overlay__'))) {
      return;
    }

    if (target.children.length === 0 || ['H1','H2','H3','H4','H5','H6','P','SPAN','BUTTON','A','LI','BLOCKQUOTE'].indexOf(target.tagName) !== -1) {
      target.contentEditable = 'true';
      target.focus();
      if (hoverOverlay) hoverOverlay.style.display = 'none';

      var handleBlur = function() {
        target.contentEditable = 'false';
        target.removeEventListener('blur', handleBlur);
        window.parent.postMessage({
          type: 'WEBSTUDIO_CANVAS_TEXT_EDITED',
          payload: {
            selector: getUniqueSelector(target),
            dataWebstudioId: target.getAttribute('data-webstudio-id') || undefined,
            text: target.textContent || '',
            id: target.id || '',
            tagName: target.tagName.toLowerCase()
          }
        }, '*');
      };

      target.addEventListener('blur', handleBlur);
    }
  }, true);

  document.addEventListener('mouseleave', function() {
    if (hoverOverlay) hoverOverlay.style.display = 'none';
  });

  window.addEventListener('message', function(event) {
    var data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'SET_INSPECT_MODE') {
      setMode(data.payload);
    }

    if (data.type === 'WEBSTUDIO_FORMAT_TEXT') {
      var payload = data.payload || {};
      var command = payload.command;
      var value = payload.value || null;
      if (command) {
        document.execCommand(command, false, value);
        var activeEl = document.activeElement || document.body;
        window.parent.postMessage({
          type: 'WEBSTUDIO_CANVAS_TEXT_EDITED',
          payload: {
            selector: getUniqueSelector(activeEl),
            dataWebstudioId: activeEl.getAttribute('data-webstudio-id') || undefined,
            text: activeEl.textContent || '',
            id: activeEl.id || '',
            tagName: activeEl.tagName.toLowerCase()
          }
        }, '*');
      }
    }

    if (data.type === 'SELECT_ELEMENT') {
      var targetSelector = data.payload && data.payload.selector;
      var targetWebstudioId = data.payload && data.payload.dataWebstudioId;
      var targetNode = null;
      if (targetWebstudioId !== undefined) {
        targetNode = document.querySelector('[data-webstudio-id="' + targetWebstudioId + '"]');
      }
      if (!targetNode && targetSelector) {
        try {
          targetNode = document.querySelector(targetSelector);
        } catch(e) {}
      }
      if (targetNode) {
        var elementData = extractElementData(targetNode);
        window.parent.postMessage({
          type: 'WEBSTUDIO_ELEMENT_SELECTED',
          payload: elementData
        }, '*');
      }
    }
  });

  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('click', handleClick, true);

  // Notify parent that iframe bridge is ready
  window.parent.postMessage({ type: 'WEBSTUDIO_IFRAME_READY' }, '*');
})();
</script>
`;
}

export const IFRAME_BRIDGE_SCRIPT = getIframeBridgeScript(true);

