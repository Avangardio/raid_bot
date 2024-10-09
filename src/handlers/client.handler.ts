import {Client, Embed} from "guilded.js";
import {DB} from "../main";

const client = new Client({ token: 'gapi_xjBICqdHaeSx7f3VuGM9vnpv2O1i8vgjoW9IA9gKhoJb/MmM3OsdZcnW5ko82p7498kVBZ9l1lNgD24Esy45JQ==' });
// Вставьте URL вебхука, который вы создали на сервере Guilded

const { raids, specs } = DB;


client.on("ready", () => console.log(`Bot is successfully logged in`));
client.on("messageCreated", async (message) => {
    if (message.content.startsWith('/createRaid')) {
        const [command, raidName, raidDate] = message.content.split(' ');

        if (!raidName || !raidDate) {
            return message.reply('Пожалуйста, укажите имя рейда и дату в формате: /createRaid <name> <date>');
        }

        // Создаем новый рейд и сохраняем его
        const raidId = Date.now();

        // Формируем embed с информацией о рейде и кнопками
        const embed: Partial<Embed> = {
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
        const raidMessage = await message.send({
            content: `Рейд **${raidName}** назначен на ${raidDate}. Участники:`,
            embeds: [embed as Embed],
        });

        // Добавляем реакции к сообщению
        // Мили
        await raidMessage.addReaction(90002024);
        // Танк
        await raidMessage.addReaction(90002027);
        // Хил
        await raidMessage.addReaction(90001291);
        // Ренж
        await raidMessage.addReaction(90002026);

        // Сохраняем ID сообщения, чтобы обновлять его
        //raids.get(raidId).messageId = raidMessage.id;
    }
});

// Обработка реакции на сообщение
client.on('messageReactionCreated', async (reaction) => {
    if (reaction.createdBy === client.user.id) {
        return;
    }
    console.log(reaction)

    let role = '';

    switch (reaction.emote.id) {
        case 90002027:
            role = 'Танк';
            break;
        case 90002024:
            role = 'Ближний бой';
            break;
        case 90002026:
            role = 'Дальний бой';
            break;
        case 90001291:
            role = 'Хил';
            break;
    }

    if (!role) return;

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

    // Обновляем сообщение с новым embed
    const message = await client.messages.fetch(reaction.channelId, reaction.messageId); // Получаем оригинальное сообщение
    await message.edit({ embeds: [embed] });
    await client.reactions.delete(reaction.channelId, reaction.messageId, reaction.emote.id, reaction.createdBy);
     */

    const user = await client.messages.send(reaction.channelId, {
        isPrivate: true,
    });

});

client.login();
