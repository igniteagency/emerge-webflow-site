const LANGUAGE_MAP = new Map([
  ['af', 'Afrikaans'],
  ['sq', 'Albanian'],
  ['ar', 'Arabic'],
  ['hy', 'Armenian'],
  ['az', 'Azerbaijani'],
  ['eu', 'Basque'],
  ['be', 'Belarusian'],
  ['bg', 'Bulgarian'],
  ['ca', 'Catalan'],
  ['zh-CN', 'ChineseSimplified'],
  ['zh-TW', 'ChineseTraditional'],
  ['hr', 'Croatian'],
  ['cs', 'Czech'],
  ['da', 'Danish'],
  ['nl', 'Dutch'],
  ['de', 'German'],
  ['en', 'English'],
  ['et', 'Estonian'],
  ['tl', 'Filipino'],
  ['fi', 'Finnish'],
  ['fr', 'French'],
  ['gl', 'Galician'],
  ['ka', 'Georgian'],
  ['el', 'Greek'],
  ['ht', 'Haitian'],
  ['iw', 'Hebrew'],
  ['hi', 'Hindi'],
  ['hu', 'Hungarian'],
  ['is', 'Icelandic'],
  ['id', 'Indonesian'],
  ['ga', 'Irish'],
  ['it', 'Italian'],
  ['ja', 'Japanese'],
  ['ko', 'Korean'],
  ['lv', 'Latvian'],
  ['lt', 'Lithuanian'],
  ['mk', 'Macedonian'],
  ['ms', 'Malay'],
  ['mt', 'Maltese'],
  ['no', 'Norwegian'],
  ['fa', 'Persian'],
  ['pl', 'Polish'],
  ['pt', 'Portuguese'],
  ['ro', 'Romanian'],
  ['ru', 'Russian'],
  ['sr', 'Serbian'],
  ['sk', 'Slovak'],
  ['sl', 'Slovenian'],
  ['es', 'Spanish'],
  ['sw', 'Swahili'],
  ['sv', 'Swedish'],
  ['th', 'Thai'],
  ['tr', 'Turkish'],
  ['uk', 'Ukrainian'],
  ['ur', 'Urdu'],
  ['vi', 'Vietnamese'],
  ['cy', 'Welsh'],
  ['yi', 'Yiddish'],
]);

/**
 * Helper to get cookies
 * @param name - Cookie name
 */
function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

let googleTranslateLoaded = false;

/**
 * Injects CSS to hide Google Translate default UI
 */
function injectStyles() {
  if (document.getElementById('google-translate-styles')) return;
  const style = document.createElement('style');
  style.id = 'google-translate-styles';
  style.innerHTML = `
    body { top: 0px !important; position: static !important; }
    .goog-te-banner-frame, .skiptranslate,
    #goog-gt-tt, .goog-te-balloon-frame,
    .goog-text-highlight {
      display: none !important;
      background: none !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Loads the Google Translate script and initializes it
 */
function loadGoogleTranslate() {
  if (googleTranslateLoaded) return;
  googleTranslateLoaded = true;

  injectStyles();

  window.googleTranslateElementInit = function () {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        layout: window.google.translate.TranslateElement.FloatPosition.TOP_LEFT,
      },
      'google_translate_element'
    );
  };

  window.loadScript('https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit', {
    placement: 'head',
    name: 'google-translate',
  });
}

/**
 * Initialize Google Translate component
 * Handles language-specific content visibility and setup click listeners
 */
export const initGoogleTranslate = (): void => {
  // Detect current language
  const currentLang = getCookie('googtrans')?.split('/').pop() || 'en';
  const readableLang = LANGUAGE_MAP.get(currentLang);
  const langClass = `.languagespecific.${readableLang?.toLowerCase()}specific`;
  const fallbackClass = `.languagespecific.englishspecific`;

  // Show language-specific content
  if (document.querySelector(langClass)) {
    document.querySelectorAll<HTMLElement>(langClass).forEach((el) => (el.style.display = 'block'));
  } else {
    document
      .querySelectorAll<HTMLElement>(fallbackClass)
      .forEach((el) => (el.style.display = 'block'));
  }

  // Global click listener for triggers and language selectors
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    // 1. Check for Translate Trigger (Lazy Load)
    if (target.closest('[data-translate-trigger]')) {
      loadGoogleTranslate();
    }

    // 2. Check for Language Selectors
    const langSelect = target.closest<HTMLElement>('[data-ms-code-lang-select]');
    if (langSelect) {
      e.preventDefault();
      const selectedLang = langSelect.getAttribute('data-ms-code-lang');
      if (!selectedLang) return;

      if (selectedLang === 'en') {
        document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie =
          'googtrans=;domain=.webflow.io;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.hash = '';
        setTimeout(() => location.reload(), 100);
      } else {
        const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
        if (combo) combo.value = selectedLang;
        window.location.hash = `#googtrans(en|${selectedLang})`;
        location.reload();
      }
    }
  });
};
