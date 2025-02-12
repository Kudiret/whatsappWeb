const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Создание клиента WhatsApp
const client = new Client({
    authStrategy: new LocalAuth() // Авто-вход без повторного сканирования QR
});

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
    const text = message.body.toLowerCase();

    console.log(`📩 Получено сообщение: ${text}`);

    // Автоответ на "hi"
    if (text === 'hi' || text === 'hello') {
        message.reply('Hello! 👋 Как я могу помочь?');
    }
    // Команда /start
    else if (text === '/start') {
        message.reply('Привет! Я WhatsApp-бот 🤖. Доступные команды:\n/help - список команд');
    }
    // Команда /help
    else if (text === '/help') {
        message.reply('Доступные команды:\n/start - начало работы\n/help - список команд');
    }
    // Отправка картинки
    else if (text === '/image') {
        message.reply("Вот ваша картинка 🖼 (пока не реализовано)");
    }
    // Неизвестная команда
    else {
        message.reply("Неизвестная команда. Введите /help для списка команд.");
    }
});

// Запуск бота
client.initialize();
