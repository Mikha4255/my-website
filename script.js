// Элементы кнопок
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const showUsersBtn = document.getElementById('show-users-btn');
const motivationRegisterBtn = document.getElementById('motivation-register-btn');
const adminAccessBtn = document.getElementById('admin-access-btn');

// Элементы для отображения имени пользователя
const userGreeting = document.getElementById('user-greeting');
const usernameSpan = document.getElementById('username');

// Элементы модальных окон
const registerModal = document.getElementById('register-modal');
const loginModal = document.getElementById('login-modal');
const closeButtons = document.querySelectorAll('.close');

// Элементы формы регистрации
const regNumberInput = document.getElementById('reg-number');
const regNameInput = document.getElementById('reg-name');
const submitRegisterBtn = document.getElementById('submit-register');

// Элементы формы входа
const loginNumberInput = document.getElementById('login-number');
const submitLoginBtn = document.getElementById('submit-login');

// Элементы главной новости
const mainNewsImage = document.getElementById('main-news-image');
const mainNewsTitle = document.getElementById('main-news-title');
const mainNewsDescription = document.getElementById('main-news-description');
const resetMainNewsLink = document.getElementById('reset-main-news');

// Исходные данные главной новости
const defaultImage = mainNewsImage.src;
const defaultTitle = mainNewsTitle.textContent;
const defaultDescription = mainNewsDescription.textContent;

// Хранилище для пользователей (в localStorage)
const usersKey = 'registeredUsers';
let registeredUsers = JSON.parse(localStorage.getItem(usersKey)) || [];

// Ключ для хранения текущего пользователя
const currentUserKey = 'currentUser';

// Список номеров и имён (номер: имя)
const allowedNumbersAndNames = {
  '12': 'Иван',
  '42': 'Михаил',
  '56': 'Сергей',
  '78': 'Алексей',
  '90': 'Дмитрий'
};

// Функция для сохранения пользователей в localStorage
function saveUsers() {
  localStorage.setItem(usersKey, JSON.stringify(registeredUsers));
}

// Функция для обновления файла
function updateUsersFile() {
  const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  if (users.length === 0) return;

  // Формируем содержимое файла
  const usersList = users.map(user => `Номер: ${user.number}, Имя: ${user.name}`).join('\n');
  
  // Создаём файл
  const blob = new Blob([usersList], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  // Создаём ссылку для скачивания
  const a = document.createElement('a');
  a.href = url;
  a.download = 'registered_users.txt'; // Имя файла
  document.body.appendChild(a);
  a.click(); // Автоматически скачиваем файл

  // Очищаем ссылку
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Регистрация
submitRegisterBtn.addEventListener('click', () => {
  const number = regNumberInput.value.trim();
  const name = regNameInput.value.trim();

  // Проверка номера (2 цифры)
  if (!/^\d{2}$/.test(number)) {
    Swal.fire({
      icon: 'error',
      title: 'Ошибка',
      text: 'Номер должен состоять из 2 цифр!'
    });
    return;
  }

  // Проверка, есть ли номер в списке allowedNumbersAndNames
  if (!allowedNumbersAndNames.hasOwnProperty(number)) {
    Swal.fire({
      icon: 'error',
      title: 'Ошибка',
      text: 'Номер не найден в списке разрешённых!'
    });
    return;
  }

  // Проверка, совпадает ли имя с закреплённым за номером
  if (allowedNumbersAndNames[number] !== name) {
    Swal.fire({
      icon: 'error',
      title: 'Ошибка',
      text: 'Имя не соответствует закреплённому за этим номером!'
    });
    return;
  }

  // Проверяем, не зарегистрирован ли уже такой номер
  const existingUser = registeredUsers.find(user => user.number === number);
  if (existingUser) {
    Swal.fire({
      icon: 'error',
      title: 'Ошибка',
      text: 'Этот номер уже зарегистрирован!'
    });
    return;
  }

  // Сохраняем нового пользователя
  registeredUsers.push({ number, name });
  saveUsers();

  // Обновляем файл
  updateUsersFile();

  Swal.fire({
    icon: 'success',
    title: 'Успех!',
    text: 'Регистрация успешна!'
  });
  registerModal.style.display = 'none';
});

// Вход
submitLoginBtn.addEventListener('click', () => {
  const number = loginNumberInput.value.trim();

  // Проверяем, зарегистрирован ли пользователь
  const user = registeredUsers.find(user => user.number === number);
  if (user) {
    // Сохраняем текущего пользователя в localStorage
    localStorage.setItem(currentUserKey, JSON.stringify(user));

    // Показываем приветствие и скрываем кнопки
    usernameSpan.textContent = user.name; // Устанавливаем имя пользователя
    userGreeting.style.display = 'block'; // Показываем приветствие
    registerBtn.style.display = 'none'; // Скрываем кнопку "Зарегистрироваться"
    loginBtn.style.display = 'none'; // Скрываем кнопку "Войти"
    showUsersBtn.style.display = 'none'; // Скрываем кнопку "Показать зарегистрированных"
    motivationRegisterBtn.style.display = 'none'; // Скрываем кнопку "Зарегистрироваться" в мотивационной фразе

    Swal.fire({
      icon: 'success',
      title: 'Добро пожаловать!',
      text: `Рады видеть вас, ${user.name}!`
    });
    loginModal.style.display = 'none';
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Ошибка',
      text: 'Номер не найден. Зарегистрируйтесь!'
    });
  }
});

// Показать зарегистрированных пользователей
showUsersBtn.addEventListener('click', () => {
  if (registeredUsers.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Информация',
      text: 'Зарегистрированных пользователей пока нет.'
    });
  } else {
    const usersList = registeredUsers.map(user => `Номер: ${user.number}, Имя: ${user.name}`).join('\n');
    Swal.fire({
      icon: 'info',
      title: 'Зарегистрированные пользователи',
      text: usersList
    });
  }
});

// Обработчик клика на новость
document.querySelectorAll('.news-item').forEach(item => {
  item.addEventListener('click', () => {
    const image = item.getAttribute('data-image');
    const title = item.getAttribute('data-title');
    const description = item.getAttribute('data-description');

    // Обновляем главную новость
    mainNewsImage.src = image;
    mainNewsTitle.textContent = title;
    mainNewsDescription.textContent = description;
  });
});

// Обработчик клика на ссылку "Вернуть главную новость"
resetMainNewsLink.addEventListener('click', (e) => {
  e.preventDefault(); // Отменяем переход по ссылке

  // Возвращаем главную новость к исходному состоянию
  mainNewsImage.src = defaultImage;
  mainNewsTitle.textContent = defaultTitle;
  mainNewsDescription.textContent = defaultDescription;
});

// Закрытие модальных окон
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    registerModal.style.display = 'none';
    loginModal.style.display = 'none';
  });
});

// Закрытие модальных окон при клике вне их
window.addEventListener('click', (e) => {
  if (e.target === registerModal) {
    registerModal.style.display = 'none';
  }
  if (e.target === loginModal) {
    loginModal.style.display = 'none';
  }
});

// Элементы панели администратора
const adminPanel = document.getElementById('admin-panel');
const adminPasswordInput = document.getElementById('admin-password');
const adminLoginBtn = document.getElementById('admin-login-btn');
const usersList = document.getElementById('users-list');

// Пароль администратора
const ADMIN_PASSWORD = '42551922';

// Вход в режим администратора
adminLoginBtn.addEventListener('click', () => {
  const password = adminPasswordInput.value.trim();

  if (password === ADMIN_PASSWORD) {
    adminPanel.style.display = 'block'; // Показываем панель администратора
    showUsersList(); // Показываем список пользователей
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Ошибка',
      text: 'Неверный пароль администратора!'
    });
  }
});

// Показать список зарегистрированных пользователей
function showUsersList() {
  usersList.innerHTML = ''; // Очищаем список

  registeredUsers.forEach((user, index) => {
    const userItem = document.createElement('div');
    userItem.innerHTML = `
      <p>Номер: ${user.number}, Имя: ${user.name}</p>
      <button onclick="deactivateUser(${index})">Деактивировать</button>
    `;
    usersList.appendChild(userItem);
  });
}

// Деактивация пользователя
function deactivateUser(index) {
  registeredUsers.splice(index, 1); // Удаляем пользователя из списка
  saveUsers(); // Сохраняем изменения в localStorage
  showUsersList(); // Обновляем список
  Swal.fire({
    icon: 'success',
    title: 'Успех!',
    text: 'Пользователь деактивирован.'
  });
}

// Открытие модального окна регистрации
registerBtn.addEventListener('click', () => {
  registerModal.style.display = 'block';
});

// Открытие модального окна входа
loginBtn.addEventListener('click', () => {
  loginModal.style.display = 'block';
});

// Открытие модального окна регистрации при клике на кнопку в секции motivation
motivationRegisterBtn.addEventListener('click', () => {
  registerModal.style.display = 'block';
});

// Обработчик для кнопки "Панель администратора"
adminAccessBtn.addEventListener('click', () => {
  adminPanel.style.display = 'block'; // Показываем панель администратора
});

// Очистка текущего пользователя при загрузке страницы
localStorage.removeItem(currentUserKey);

// Проверка состояния входа при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem(currentUserKey));

  if (currentUser) {
    // Показываем приветствие и скрываем кнопки
    usernameSpan.textContent = currentUser.name;
    userGreeting.style.display = 'block';
    registerBtn.style.display = 'none';
    loginBtn.style.display = 'none';
    showUsersBtn.style.display = 'none';
    motivationRegisterBtn.style.display = 'none'; // Скрываем кнопку "Зарегистрироваться" в мотивационной фразе
  }
});
document.addEventListener('DOMContentLoaded', () => {
  console.log('Скрипт загружен!');

// Ожидаемый пароль (замените на ваш пароль)
const EXPECTED_PASSWORD = '4255';

// Элементы для защиты паролем
const passwordProtection = document.getElementById('password-protection');
const passwordInput = document.getElementById('password-input');
const passwordSubmit = document.getElementById('password-submit');
const passwordError = document.getElementById('password-error');
const content = document.getElementById('content');

// Показываем защиту паролем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  console.log('Страница загружена');
  passwordProtection.style.display = 'block'; // Показываем поле для ввода пароля
  content.style.display = 'none'; // Скрываем основное содержимое сайта
});

// Функция для проверки пароля
function checkPassword() {
  console.log('Функция checkPassword вызвана');
  const password = passwordInput.value.trim();
  console.log('Введённый пароль:', password);

  if (password === EXPECTED_PASSWORD) {
    console.log('Пароль верный');
    passwordProtection.style.display = 'none';
    content.style.display = 'block';
  } else {
    console.log('Пароль неверный');
    passwordError.style.display = 'block';
  }
}

// Обработчик для кнопки "Войти"
passwordSubmit.addEventListener('click', checkPassword);

// Обработчик для нажатия Enter в поле ввода пароля
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    console.log('Нажата клавиша Enter');
    checkPassword(); // Проверяем пароль
  }
});
});