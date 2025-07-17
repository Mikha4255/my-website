const _ = {
  sitePass: atob('NDIxOTIy'),
  
  // Данные главной новости
  news: {
    isVideo: true,
    mediaSrc: document.getElementById('main-news-image').querySelector('source').src,
    title: document.getElementById('main-news-title').textContent,
    desc: document.getElementById('main-news-description').innerHTML
  }
};

const $ = {
  el: id => document.getElementById(id),
  show: id => $.el(id).style.display = 'block',
  hide: id => $.el(id).style.display = 'none',
  text: (id, txt) => $.el(id).textContent = txt,
  html: (id, content) => $.el(id).innerHTML = content,
  val: id => $.el(id).value.trim(),
  attr: (id, name, value) => $.el(id).setAttribute(name, value),
  
  setMedia: (id, src, isVideo) => {
    const element = $.el(id);
    const container = element.parentNode;
    
    if (isVideo) {
      // Настройки для видео
      element.style.display = 'block';
      element.style.margin = '0 auto';
      element.style.maxWidth = '100%';
      element.style.height = 'auto';
      
      const source = element.querySelector('source');
      source.src = src;
      element.load();
      
      // Скрываем fallback
      const fallback = container.querySelector('#news-image-fallback');
      if (fallback) fallback.style.display = 'none';
    } else {
      // Настройки для изображения
      element.style.display = 'none';
      
      const fallback = container.querySelector('#news-image-fallback');
      if (!fallback) {
        // Создаем fallback если его нет
        const img = document.createElement('img');
        img.id = 'news-image-fallback';
        img.className = 'mob centered-media';
        img.src = src;
        container.insertBefore(img, element.nextSibling);
      } else {
        // Используем существующий fallback
        fallback.src = src;
        fallback.style.display = 'block';
      }
    }
  }
};

// Остальные функции остаются без изменений
function resetMainNews() {
  $.setMedia('main-news-image', _.news.mediaSrc, _.news.isVideo);
  $.text('main-news-title', _.news.title);
  $.html('main-news-description', _.news.desc);
}

function checkSitePass() {
  if ($.val('password-input') === _.sitePass) {
    $.hide('password-protection');
    $.show('content');
  } else {
    $.show('password-error');
  }
}

document.querySelectorAll('.news-item').forEach(item => {
  item.addEventListener('click', () => {
    $.setMedia('main-news-image', item.dataset.image, false);
    $.text('main-news-title', item.dataset.title);
    $.text('main-news-description', item.dataset.description);
  });
});

$.el('reset-main-news').addEventListener('click', e => {
  e.preventDefault();
  resetMainNews();
});

document.addEventListener('DOMContentLoaded', () => {
  $.show('password-protection');
  $.hide('content');
});

$.el('password-submit').addEventListener('click', checkSitePass);
$.el('password-input').addEventListener('keypress', e => {
  if (e.key === 'Enter') checkSitePass();
});