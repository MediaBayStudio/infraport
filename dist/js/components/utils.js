var browser = {
    // Opera 8.0+
    isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
    // Firefox 1.0+
    isFirefox: typeof InstallTrigger !== 'undefined',
    // Safari 3.0+ "[object HTMLElementConstructor]"
    isSafari: /constructor/i.test(window.HTMLElement) || (function(p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)),
    // Internet Explorer 6-11
    isIE: /*@cc_on!@*/ false || !!document.documentMode,
    // Edge 20+
    isEdge: !( /*@cc_on!@*/ false || !!document.documentMode) && !!window.StyleMedia,
    // Chrome 1+
    isChrome: !!window.chrome && !!window.chrome.webstore,
    isYandex: !!window.yandex,
    isMac: window.navigator.platform.toUpperCase().indexOf('MAC') >= 0
  },
  // Размреы экранов для медиазапросов
  // mediaQueries = {
  //   's': '(min-width:575.98px)',
  //   'm': '(min-width:767.98px)',
  //   'lg': '(min-width:1023.98px)',
  //   'xl': '(min-width:1439.98px)'
  // },
  SLIDER = {
    // nextArrow: '<button type="button" class="arrow"></button>',
    // prevArrow: '<button type="button" class="arrow"></button>',
    // dot: '<button type="button" class="dot"></button>',
    hasSlickClass: function($el) {
      return $el.hasClass('slick-slider');
    },
    unslick: function($el) {
      $el.slick('unslick');
    },
    createArrow: function(className, inside) {
      className = (className.indexOf('prev') === -1 ? 'next ' : 'prev ') + className;
      return '<button type="button" class="arrow arrow-' + className + '">' + inside + '</button>';
    },
    arrowSvg: '<svg width="27" height="26" class="arrow__svg" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.0213 12.9998L1 13" stroke="#4774C8" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"/><path d="M15.0044 2.98291L25.0217 13.0003L15.0044 23.0176" stroke="#4774C8" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"/></svg>',
    // setImages: function(slides) {
    //   for (let i = 0, len = slides.length; i < len; i++) {
    //     let img = q('img', slides[i]);
    //     // Если элемент найден и он без display:none
    //     if (img && img.offsetParent) {
    //       img.src = img.getAttribute('data-lazy') || img.getAttribute('data-src');
    //     }
    //   }
    // }
  },
  /*
Объединение слушателей для window на события 'load', 'resize', 'scroll'
Все слушатели на окно следует задавать через него, например:
  window.resize.push(functionName)
Все ф-ии, добавленные в [] window.resize, будут заданы одним слушателем
*/
  windowFuncs = {
    load: [],
    resize: [],
    scroll: [],
    call: function(event) {
      let funcs = windowFuncs[event.type] || event;
      for (let i = funcs.length - 1; i >= 0; i--) {
        console.log(funcs[i].name);
        funcs[i]();
      }
    }
  },

  mask, // ф-я маски телефонов в поля ввода (в файле telMask.js)
  lazy,
  menu,
  burger,
  hdr,
  overlay,
  body,
  fakeScrollbar,
  // Сокращение записи querySelector
  q = function(selector, element) {
    element = element || document.body;
    return element.querySelector(selector);
  },
  // Сокращение записи querySelectorAll + перевод в массив
  qa = function(selectors, element, toArray) {
    element = element || document.body;
    return toArray ? Array.prototype.slice.call(element.querySelectorAll(selectors)) : element.querySelectorAll(selectors);
  },
  // Сокращение записи getElementById
  id = function(selector) {
    return document.getElementById(selector);
  },
  // Фикс 100% высоты экрана для моб. браузеров
  setVh = function() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  },
  // Сокращение записи window.matchMedia('query').matches
  media = function(media) {
    return window.matchMedia(media).matches;
  },
  // Функция создания мобильного меню
  mobileMenu,
  // Прокрутка до элемента при помощи requestAnimationFrame
  /**
* @function scrollToTarget
* @desc Scrolling to element with using requestAnimationFrame.
* @arg {Event|null} e standart Event.
* @arg {HTMLElement|0|string} target If 0 target = document.body, if string target = q(string). */
  scrollToTarget = function(e, target) {
    e && e.preventDefault();

    if (this === window) {
      _ = e.target;
    } else {
      _ = this;
    }

    if (target == 0) {
      target = document.body;
    } else {
      target = target || _.getAttribute('data-scroll-target');
    }

    if (!target && _.tagName === 'A') {
      target = q(_.getAttribute('href'));
    }

    if (target.constructor === String) {
      target = q(target);
    }


      menu && menu.close();

      let wndwY = window.pageYOffset,
        targetStyles = getComputedStyle(target),
        // targetTop = target.getBoundingClientRect().top - +(targetStyles.paddingTop).slice(0, -2) - +(targetStyles.marginTop).slice(0, -2),
        targetTop = target.getBoundingClientRect().top,
        start = null,
        V = targetTop > 3000 ? 0.15 : 0.35,
        step = function(time) {
          if (start === null) {
            start = time;
          }
          let progress = time - start,
            r = (targetTop < 0 ? Math.max(wndwY - progress / V, wndwY + targetTop) : Math.min(wndwY + progress / V, wndwY + targetTop));

          window.scrollTo(0, r);

          if (r != wndwY + targetTop) {
            requestAnimationFrame(step);
          } else {
            // menu.transitionEndEvents();
            // pageScroll(false);
            // console.log(menu);
          }
        };

      console.log(targetTop);

      requestAnimationFrame(step);
  },
  // Функция запрета/разрешения прокрутки страницы
  pageScroll = function(disallow) {
    fakeScrollbar.classList.toggle('active', disallow);
    body.classList.toggle('no-scroll', disallow);
    body.style.paddingRight = disallow ? fakeScrollbar.offsetWidth - fakeScrollbar.clientWidth + 'px' : '';
  },
  // Функция липкого элемента средствами js
  sticky = function($el, fixThresholdDir, className) {
    $el = typeof $el === 'string' ? q($el) : $el;
    className = className || 'fixed';
    fixThresholdDir = fixThresholdDir || 'bottom';

    let fixThreshold = $el.getBoundingClientRect()[fixThresholdDir] + pageYOffset,
      $elClone = $el.cloneNode(true),
      $elParent = $el.parentElement,
      fixElement = function() {
        if (!$el.classList.contains(className) && pageYOffset >= fixThreshold) {
          $elParent.appendChild($elParent.replaceChild($elClone, $el));
          $el.classList.add(className);

          window.removeEventListener('scroll', fixElement);
          window.addEventListener('scroll', unfixElement);
        }
      },
      unfixElement = function() {
        if ($el.classList.contains(className) && pageYOffset <= fixThreshold) {
          $elParent.replaceChild($el, $elClone);
          $el.classList.remove(className);

          window.removeEventListener('scroll', unfixElement);
          window.addEventListener('scroll', fixElement);
        }
      };

    $elClone.classList.add('clone');
    fixElement();
    window.addEventListener('scroll', fixElement);
  };