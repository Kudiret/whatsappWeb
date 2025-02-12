const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

// Создание клиента WhatsApp
const client = new Client({
    authStrategy: new LocalAuth() // Авто-вход без повторного сканирования QR
});

// База данных SQLite
const db = new sqlite3.Database('./whatsapp_bot.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

// Создаём таблицу пользователей
db.run("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, last_message TEXT)");

// Генерация QR-кода для входа в WhatsApp Web
client.on('qr', qr => {
    console.log('Отсканируйте этот QR-код для входа в WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Подключение к WhatsApp
client.on('ready', () => {
    console.log('✅ Бот запущен и готов к работе!');
});

// Обработчик сообщений
client.on('message', async message => {
    const chat = await message.getChat();
    const sender = message.from;
    const text = message.body.toLowerCase();

    console.log(`📩 Получено сообщение от ${sender}: ${text}`);

    // Автоответ на "hi"
    if (text === 'hi' || text === 'hello') {
        message.reply('Hello! 👋 Как я могу помочь?');
    }

    // Команда /start
    else if (text === '/start') {
        message.reply('Привет! Я WhatsApp-бот 🤖. Доступные команды:\n/help - список команд\n/info - информация о вас');
    }

    // Команда /help
    else if (text === '/help') {
        message.reply('Доступные команды:\n/start - начало работы\n/help - список команд\n/info - информация о вас');
    }

    // Команда /info
    else if (text === '/info') {
        db.get("SELECT name FROM users WHERE id = ?", [sender], (err, row) => {
            if (row) {
                message.reply(`Вы зарегистрированы как: ${row.name}`);
            } else {
                message.reply("Вы ещё не зарегистрированы! Введите: /register Имя");
            }
        });
    }

    // Регистрация пользователя
    else if (text.startsWith('/register ')) {
        const name = text.replace('/register ', '');
        db.run("INSERT INTO users (id, name) VALUES (?, ?)", [sender, name], err => {
            if (!err) {
                message.reply(`Вы зарегистрированы как: ${name} 🎉`);
            } else {
                message.reply("Ошибка регистрации 😕");
            }
        });
    }

    // Отправка картинки
    else if (text === '/image') {
        message.reply("Вот ваша картинка 🖼");
        client.sendMessage(sender, new MessageMedia('image/jpeg', 'data:image/jpeg;base64,...'));
    }

    // Неизвестная команда
    else {
        message.reply("Неизвестная команда. Введите /help для списка команд.");
    }
});

// Запуск бота
client.initialize();
