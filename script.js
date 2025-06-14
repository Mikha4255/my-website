const _ = {
  sitePass: atob('NDIxOTIy'),
  
  // Данные главной новости
  news: {
    image: document.getElementById('main-news-image').src,
    title: document.getElementById('main-news-title').textContent,
    desc: document.getElementById('main-news-description').textContent
  }
};

// Основные функции
const $ = {
  // Получить элемент по ID
  el: id => document.getElementById(id),
  
  // Показать/скрыть элемент
  show: id => $.el(id).style.display = 'block',
  hide: id => $.el(id).style.display = 'none',
  
  // Установить текст
  text: (id, txt) => $.el(id).textContent = txt,
  
  // Получить значение
  val: id => $.el(id).value.trim(),
  
  // Установить атрибут
  attr: (id, name, value) => $.el(id).setAttribute(name, value)
};

// Сброс главной новости
function resetMainNews() {
  $.attr('main-news-image', 'src', _.news.image);
  $.text('main-news-title', _.news.title);
  $.text('main-news-description', _.news.desc);
}

// Проверка пароля сайта
function checkSitePass() {
  if ($.val('password-input') === _.sitePass) {
    $.hide('password-protection');
    $.show('content');
  } else {
    $.show('password-error');
  }
}

// Работа с новостями
document.querySelectorAll('.news-item').forEach(item => {
  item.addEventListener('click', () => {
    $.attr('main-news-image', 'src', item.dataset.image);
    $.text('main-news-title', item.dataset.title);
    $.text('main-news-description', item.dataset.description);
  });
});

// Сброс новостей
$.el('reset-main-news').addEventListener('click', e => {
  e.preventDefault();
  resetMainNews();
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Защита паролем
  $.show('password-protection');
  $.hide('content');
});

// Обработчики
$.el('password-submit').addEventListener('click', checkSitePass);
$.el('password-input').addEventListener('keypress', e => {
  if (e.key === 'Enter') checkSitePass();
});