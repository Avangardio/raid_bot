"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const guilded_js_1 = require("guilded.js");
const client = new guilded_js_1.Client({ token: 'gapi_xjBICqdHaeSx7f3VuGM9vnpv2O1i8vgjoW9IA9gKhoJb/MmM3OsdZcnW5ko82p7498kVBZ9l1lNgD24Esy45JQ==' });
// Вставьте URL вебхука, который вы создали на сервере Guilded
// Хранение данных о рейдах
const raids = new Map();
raids.set("tanks", []);
raids.set("healers", []);
raids.set("melee", []);
raids.set("ranged", []);
client.on("ready", () => console.log(`Bot is successfully logged in`));
client.on("messageCreated", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.content.startsWith('/createRaid')) {
        const [command, raidName, raidDate] = message.content.split(' ');
        if (!raidName || !raidDate) {
            return message.reply('Пожалуйста, укажите имя рейда и дату в формате: /createRaid <name> <date>');
        }
        // Создаем новый рейд и сохраняем его
        const raidId = Date.now();
        raids.set(raidId, { name: raidName, date: raidDate, participants: {} });
        // Формируем embed с информацией о рейде и кнопками
        const embed = {
            title: `Рейд: ${raidName}`,
            description: `Дата: **${raidDate}**\nЗапишитесь на роли, нажав на кнопки ниже:\n\n` +
                `**Танки** | **Хилы** | **Ближний бой** | **Дальний бой**\n` +
                `------------------------------------------------------------\n` +
                `\n(Список пуст, ждём участников)\n`,
            color: 0x0099ff, // Синий цвет,
            fields: [{
                    inline: true,
                    name: "ZZZ",
                    value: "VVVV",
                }]
        };
        // Отправляем сообщение с inline кнопками для ролей
        const raidMessage = yield message.send({
            content: `Рейд **${raidName}** назначен на ${raidDate}. Участники:`,
            embeds: [embed],
        });
        // Добавляем реакции к сообщению
        // Мили
        yield raidMessage.addReaction(90002024);
        // Танк
        yield raidMessage.addReaction(90002027);
        // Хил
        yield raidMessage.addReaction(90001291);
        // Ренж
        yield raidMessage.addReaction(90002026);
        // Сохраняем ID сообщения, чтобы обновлять его
        raids.get(raidId).messageId = raidMessage.id;
    }
}));
// Обработка реакции на сообщение
client.on('messageReactionCreated', (reaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (reaction.createdBy === client.user.id) {
        return;
    }
    console.log(reaction);
    let role = '';
    let roleList;
    const raidId = Array.from(raids.keys()).pop(); // Берем последний активный рейд
    const raid = raids.get(raidId);
    if (!raid)
        return;
    switch (reaction.emote.id) {
        case 90002027:
            role = 'Танк';
            raid.tanks.push(reaction.createdBy);
            break;
        case 90002024:
            role = 'Ближний бой';
            raid.melee.push(reaction.createdBy);
            break;
        case 90002026:
            role = 'Дальний бой';
            raid.ranged.push(reaction.createdBy);
            break;
        case 90001291:
            role = 'Хил';
            raid.healers.push(reaction.createdBy);
            break;
    }
    if (!role)
        return;
    /*// Добавляем пользователя в соответствующую роль
    raid.participants[reaction.createdBy] = role;

    // Генерируем обновленное сообщение с участниками
    let participantsList = '';
    for (const [userId, userRole] of Object.entries(raid.participants)) {
        const participant = await client.members.fetch(reaction.serverId, userId);
        participantsList += `${participant.username} — ${userRole}\n`;
    }
    console.log(participantsList);

    // Обновляем embed с информацией о рейде и участниками
    const embed = {
        title: `Рейд: ${raid.name}`,
        description: `Дата: **${raid.date}**\nЗаписавшиеся:\n${participantsList}`,
        color: 0x0099ff
    };
     */
    // Генерируем обновленный список участников
    const getParticipantsList = (roleArray) => {
        if (roleArray.length === 0)
            return '—';
        return roleArray.map(userId => `<@${userId}>`).join(', ');
    };
    const participantsTable = `**Танки** | **Хилы** | **Ближний бой** | **Дальний бой**\n` +
        `------------------------------------------------------------\n` +
        `${getParticipantsList(raid.tanks)} | ${getParticipantsList(raid.healers)} | ${getParticipantsList(raid.melee)} | ${getParticipantsList(raid.ranged)}`;
    // Обновляем embed с новым списком участников
    const embed = {
        title: `Рейд: ${raid.name}`,
        description: `Дата: **${raid.date}**\nЗаписавшиеся:\n\n` + participantsTable,
        color: 0x0099ff
    };
    // Обновляем сообщение с новым embed
    const message = yield client.messages.fetch(reaction.channelId, reaction.messageId); // Получаем оригинальное сообщение
    yield message.edit({ embeds: [embed] });
    yield client.reactions.delete(reaction.channelId, reaction.messageId, reaction.emote.id, reaction.createdBy);
}));
client.login();
