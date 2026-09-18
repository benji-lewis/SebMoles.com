/**
 * Language switching for sebmoles.com.
 *
 * Every translatable string lives in TRANSLATIONS below and is pulled into the
 * page through a data-i18n="<key>" attribute on the element that holds it.
 * The choice is remembered in localStorage, so it survives navigation between
 * pages and later visits.
 *
 * Adding a language means adding one more table here plus a button in the
 * switcher markup; nothing else needs to change.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "sm_lang";
  var DEFAULT_LANG = "en";

  /* What to put in <html lang>. "pirate" is not a real language, so it uses a
     BCP 47 private-use subtag of English. */
  var HTML_LANG = {
    "en": "en",
    "zh-CN": "zh-CN",
    "pirate": "en-x-pirate"
  };

  var TRANSLATIONS = {
    "en": {
      "lang.label": "Language:",

      "nav.home": "Home",
      "nav.page2": "Page 2",
      "nav.page3": "Page 3",

      "footer.thanks": "thanks for visiting seb moles website",

      "counter.before": "You are visitor number",
      "counter.after": "",

      "title.home": "Seb Moles",
      "home.heading": "hello i am seb moles this is my website",
      "home.readMore": "READ MORE...",
      "home.davidWhite": "david white affiliated website",
      "home.confirmLeave": "are you ready to leave sebmoles.com",
      "home.alertOkay": "okay",
      "home.alertGoodBoy": "good boy",
      "home.tableHeading": "Table",
      "home.tableP1": "A wood table is a sturdy and versatile piece of furniture made from natural wood. It features a flat surface supported by legs, offering a functional space for dining, working, or displaying items. Wood tables come in various styles, finishes, and sizes, adding warmth and elegance to any setting.",
      "home.tableP2": "A table is used for dining, working, studying, displaying items, and gathering with others. It serves as a versatile surface for various activities in homes, offices, and public spaces.",

      "title.page2": "Seb Moles Page 2",
      "page2.heading": "page 2",
      "page2.engine": "The X16SZ is a 1.6L SOHC (Single Overhead Cam) engine produced by Opel (a subsidiary of General Motors) as part of the Family 1 engine series. It was used in a variety of vehicles, particularly within the Vauxhall and Opel range, which were sold across Europe. The X16SZ engine was part of the GM Family 1 engine family, which was used extensively in the 1980s and 1990s. The Family 1 engines were designed to be affordable, efficient, and easy to maintain, making them ideal for entry-level and mid-range vehicles.",
      "page2.radiator": "The 1999 Honda Civic radiator is a compact, aluminum-core cooling component designed to regulate engine temperature by dissipating heat from the coolant. It’s essential for preventing engine overheating and ensuring efficient performance.",

      "title.page3": "Seb Moles Page 2",
      "page3.heading": "Page 3",

      "title.jumpscare": "Seb Moles"
    },

    "zh-CN": {
      "lang.label": "语言：",

      "nav.home": "首页",
      "nav.page2": "第二页",
      "nav.page3": "第三页",

      "footer.thanks": "感谢您访问 seb moles 的网站",

      "counter.before": "您是第",
      "counter.after": "位访客",

      "title.home": "Seb Moles 的网站",
      "home.heading": "你好 我是 seb moles 这是我的网站",
      "home.readMore": "阅读更多……",
      "home.davidWhite": "david white 关联网站",
      "home.confirmLeave": "你准备好离开 sebmoles.com 了吗",
      "home.alertOkay": "好的",
      "home.alertGoodBoy": "乖孩子",
      "home.tableHeading": "桌子",
      "home.tableP1": "木桌是一种由天然木材制成的结实而多用途的家具。它有一个由桌腿支撑的平整台面，为用餐、工作或陈列物品提供了实用的空间。木桌有各种款式、饰面和尺寸，为任何环境增添温馨与优雅。",
      "home.tableP2": "桌子可用于用餐、工作、学习、陈列物品以及与他人聚会。它在家庭、办公室和公共场所为各种活动提供了多用途的台面。",

      "title.page2": "Seb Moles 第二页",
      "page2.heading": "第二页",
      "page2.engine": "X16SZ 是欧宝（通用汽车旗下子公司）生产的 1.6 升单顶置凸轮轴（SOHC）发动机，属于 Family 1 发动机系列。它被用于多种车型，尤其是在欧洲销售的沃克斯豪尔和欧宝车系中。X16SZ 属于通用汽车 Family 1 发动机家族，该家族在上世纪八九十年代被广泛使用。Family 1 发动机的设计宗旨是经济实惠、高效且易于维护，非常适合入门级和中端车型。",
      "page2.radiator": "1999 款本田思域的散热器是一个紧凑的铝芯冷却部件，通过散去冷却液中的热量来调节发动机温度。它对于防止发动机过热和确保高效运行至关重要。",

      "title.page3": "Seb Moles 第二页",
      "page3.heading": "第三页",

      "title.jumpscare": "Seb Moles"
    },

    "pirate": {
      "lang.label": "Ship's tongue:",

      "nav.home": "Home Port",
      "nav.page2": "Chart 2",
      "nav.page3": "Chart 3",

      "footer.thanks": "thankee fer boardin' seb moles website, ye salty dog",

      "counter.before": "Ye be visitor number",
      "counter.after": "welcome aboard, matey!",

      "title.home": "Seb Moles, Scourge o' the Seven Seas",
      "home.heading": "ahoy i be seb moles an' this here be me website",
      "home.readMore": "READ ON, MATEY...",
      "home.davidWhite": "david white's affiliated port o' call",
      "home.confirmLeave": "be ye ready to abandon sebmoles.com",
      "home.alertOkay": "aye",
      "home.alertGoodBoy": "good lad",
      "home.tableHeading": "Mess Table",
      "home.tableP1": "A wooden table be a sturdy an' versatile bit o' furniture hewn from honest timber. She boasts a flat deck held aloft by stout legs, offerin' a fine space fer feastin', scrawlin' in the log, or displayin' yer plunder. Wooden tables come in all manner o' rigs, finishes an' burdens, addin' warmth an' grandeur to any cabin.",
      "home.tableP2": "A table be used fer feastin', laborin', studyin' the charts, displayin' yer plunder, an' gatherin' wi' yer crew. She serves as a versatile deck fer all manner o' doin's in homes, countin' houses an' public taverns.",

      "title.page2": "Seb Moles, Chart the Second",
      "page2.heading": "chart the second",
      "page2.engine": "The X16SZ be a 1.6L SOHC (Single Overhead Cam) engine forged by Opel (a vassal o' General Motors) as part o' the Family 1 fleet. She were fitted to a great many vessels, particular in the Vauxhall an' Opel ranges what were sold across Europe. The X16SZ belonged to the GM Family 1 line, pressed into service far an' wide through the 1980s an' 1990s. Them Family 1 engines were drawn up to be cheap, thrifty an' easy to mend, makin' 'em grand fer entry-level an' middlin' vessels.",
      "page2.radiator": "The 1999 Honda Civic radiator be a compact, aluminium-cored coolin' contraption rigged to keep the engine's temper in check by castin' the heat from the coolant overboard. She be essential fer keepin' yer engine from boilin' over an' runnin' true.",

      "title.page3": "Seb Moles, Chart the Second",
      "page3.heading": "Chart 3",

      "title.jumpscare": "Seb Moles"
    }
  };

  function isKnown(lang) {
    return typeof lang === "string" &&
      Object.prototype.hasOwnProperty.call(TRANSLATIONS, lang);
  }

  function readStored() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      return isKnown(saved) ? saved : null;
    } catch (err) {
      // Private mode or blocked storage: fall back to the default.
      return null;
    }
  }

  function writeStored(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* nothing to do; the choice just will not persist */
    }
  }

  /* On a first visit, honour a Chinese browser. Pirate is always opt-in. */
  function detect() {
    var stored = readStored();
    if (stored) return stored;

    var offered = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < offered.length; i++) {
      if (/^zh\b/i.test(String(offered[i]))) return "zh-CN";
    }
    return DEFAULT_LANG;
  }

  var current = detect();

  function t(key) {
    var table = TRANSLATIONS[current] || TRANSLATIONS[DEFAULT_LANG];
    if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];

    var fallback = TRANSLATIONS[DEFAULT_LANG];
    return Object.prototype.hasOwnProperty.call(fallback, key) ? fallback[key] : key;
  }

  function apply() {
    document.documentElement.setAttribute("lang", HTML_LANG[current] || current);

    var slots = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < slots.length; i++) {
      slots[i].textContent = t(slots[i].getAttribute("data-i18n"));
    }

    var buttons = document.querySelectorAll("[data-lang]");
    for (var j = 0; j < buttons.length; j++) {
      var active = buttons[j].getAttribute("data-lang") === current;
      buttons[j].setAttribute("aria-pressed", active ? "true" : "false");
      if (active) buttons[j].classList.add("lang-button-active");
      else buttons[j].classList.remove("lang-button-active");
    }
  }

  function setLanguage(lang) {
    if (!isKnown(lang) || lang === current) return;
    current = lang;
    writeStored(lang);
    apply();
  }

  window.SebMolesI18n = {
    t: t,
    apply: apply,
    setLanguage: setLanguage,
    languages: function () { return Object.keys(TRANSLATIONS); },
    language: function () { return current; }
  };

  function init() {
    apply();
    document.addEventListener("click", function (event) {
      var target = event.target;
      var button = target && target.closest ? target.closest("[data-lang]") : null;
      if (!button) return;
      event.preventDefault();
      setLanguage(button.getAttribute("data-lang"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
