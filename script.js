const _ = {
 
  sitePass: atob('NDI1NQ=='), 
  
  // Разрешенные номера и имена {номер: имя}
  allowed: {   
    [atob('NDI=')]: 'Михаил',  
    [atob('NTY=')]: 'Сергей', 
    [atob('OTA=')]: 'Дмитрий'  
  },
  
  // Ключи для localStorage
  keys: {
    users: atob('cmVnaXN0ZXJlZFVzZXJz') // registeredUsers
  },
  
  // Данные пользователей
  users: JSON.parse(localStorage.getItem(atob('cmVnaXN0ZXJlZFVzZXJz'))) || [],
  
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

// Функция сохранения пользователей
function saveUsers() {
  localStorage.setItem(_.keys.users, JSON.stringify(_.users));
}

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

// Регистрация пользователя
$.el('submit-register').addEventListener('click', () => {
  const num = $.val('reg-number');
  const name = $.val('reg-name');

  if (!/^\d{2}$/.test(num)) {
    Swal.fire('Ошибка', 'Номер должен быть 2 цифры', 'error');
    return;
  }

  if (!_.allowed[num] || _.allowed[num] !== name) {
    Swal.fire('Ошибка', 'Неверные данные', 'error');
    return;
  }

  if (_.users.some(u => u.number === num)) {
    Swal.fire('Ошибка', 'Номер уже зарегистрирован', 'error');
    return;
  }

  _.users.push({number: num, name: name});
  saveUsers();
  Swal.fire('Успех', 'Регистрация завершена', 'success');
  $.hide('register-modal');
});

// Вход пользователя
$.el('submit-login').addEventListener('click', () => {
  const num = $.val('login-number');
  const user = _.users.find(u => u.number === num);

  if (user) {
    // Вход только на текущую сессию (не сохраняем в localStorage)
    $.text('username', user.name);
    $.show('user-greeting');
    $.hide('register-btn');
    $.hide('login-btn');
    Swal.fire('Добро пожаловать', `Рады видеть вас, ${user.name}!`, 'success');
    $.hide('login-modal');
  } else {
    Swal.fire('Ошибка', 'Номер не найден', 'error');
  }
});

// Выход пользователя
$.el('logout-btn')?.addEventListener('click', () => {
  $.hide('user-greeting');
  $.show('register-btn');
  $.show('login-btn');
});

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
  // Всегда показываем кнопки входа/регистрации при загрузке
  $.show('register-btn');
  $.show('login-btn');
  $.hide('user-greeting');
  
  // Защита паролем
  $.show('password-protection');
  $.hide('content');
});

// Обработчики
$.el('password-submit').addEventListener('click', checkSitePass);
$.el('password-input').addEventListener('keypress', e => {
  if (e.key === 'Enter') checkSitePass();
});

// Модальные окна
$.el('register-btn').addEventListener('click', () => $.show('register-modal'));
$.el('login-btn').addEventListener('click', () => $.show('login-modal'));
document.querySelectorAll('.close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none';
  });
});