const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "leave",
		version: "1.4",
		author: "NTKhang",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			leaveType1: "tự rời",
			leaveType2: "bị kick",
			defaultLeaveMessage: "{userName} đã {type} khỏi nhóm"
		},
		en: {
			session1: "🤣",
			session2: "😗",
			session3: "🤧",
			session4: "😐",
			leaveType1: "𝗘𝘂𝗵....",
			leaveType2: "𝗟'𝗮𝗱𝗺𝗶𝗻 𝗱𝗲 𝗰𝗲 𝗴𝗿𝗼𝘂𝗽𝗲 𝗮 𝗮𝗶𝗱𝗲́",
			defaultLeaveMessage: "{type} {userName} 𝗮̀ 𝗾𝘂𝗶𝘁𝘁𝗲𝗿 𝗹𝗲 𝗴𝗿𝗼𝘂𝗽𝗲 𝗽𝗼𝘂𝗿 𝗶𝗻𝗳𝗼 {session}{session}{session}"
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType == "log:unsubscribe")
			return async function () {
				const { threadID } = event;
				const threadData = await threadsData.get(threadID);
				if (!threadData.settings.sendLeaveMessage)
					return;
				const { leftParticipantFbId } = event.logMessageData;
				if (leftParticipantFbId == api.getCurrentUserID())
					return;
				const hours = getTime("HH");

				const threadName = threadData.threadName;
				const userName = await usersData.getName(leftParticipantFbId);

				// Définition du message de départ
				let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;
				const form = {
					mentions: leaveMessage.match(/\{userNameTag\}/g) ? [{
						tag: userName,
						id: leftParticipantFbId
					}] : null
				};

				// Personnalisation du message de départ
				leaveMessage = leaveMessage
					.replace(/\{userName\}|\{userNameTag\}/g, userName)
					.replace(/\{type\}/g, leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2"))
					.replace(/\{threadName\}|\{boxName\}/g, threadName)
					.replace(/\{time\}/g, hours)
					.replace(/\{session\}/g, hours <= 10 ?
						getLang("session1") :
						hours <= 12 ?
							getLang("session2") :
							hours <= 18 ?
								getLang("session3") :
								getLang("session4")
					);

				form.body = leaveMessage;

				if (leaveMessage.includes("{userNameTag}")) {
					form.mentions = [{
						id: leftParticipantFbId,
						tag: userName
					}];
				}

				// Messages insultants pour l'utilisateur qui quitte de façon autonome
				const leaveMessages = [
					"Tu as quitté ? Dommage, on commençait à apprécier te supporter ! 😂",
					"C’est pas grave, tu nous manques déjà… enfin presque. 🫣",
					"Ah, t'as disparu aussi vite qu'une illusion. C’était une fuite stratégique, non ? 🤔",
					"Tu t’es barré avant qu’on ait le temps de dire que c’était pas pire que ta présence ! 🫣",
					"Bon, ben voilà, t’as fuit comme un héros… ou un lâche, c’est selon. 🤷‍♂️",
					"Tu es parti sans dire au revoir ? Bah, ça tombe bien, on s’en fout. 👋",
					"Pas de panique, ta place a déjà été occupée par un vrai humain. On se porte mieux sans toi ! 😂",
					"Tu es parti aussi vite qu’un vent mauvais, mais t'inquiète, on s'en remet. 🙄",
					"Tu sais que ça fait une éternité qu’on t’ignore depuis ton départ ? Bonne chance avec ta solitude ! 🙃"
				];

				// Sélection d'un message au hasard pour l'utilisateur qui quitte
				const randomMessage = leaveMessages[Math.floor(Math.random() * leaveMessages.length)];

				// Envoi du premier message (message d'adieu standard)
				await message.send(form);

				// Envoi du message insultant
				form.body = randomMessage;
				await message.send(form);

				// Envoi du sticker (choix d'un sticker au hasard parmi une liste)
				const stickerUrls = [
					"https://scontent.fdkr5-1.fna.fbcdn.net/v/t39.1997-6/56463100_2379566285401442_4000563475590938624_n.webp?_nc_cat=106&ccb=1-7&_nc_sid=1176f5&_nc_eui2=AeHrr6qDowtvpOcjqZAW9aKliqZYaYmg_k6KplhpiaD-TkP3Ol3TdBo3kzBqeYFN6g4We64BeqZcnqnElSjHKolM&_nc_ohc=OsSp3gfphtkQ7kNvgGBayjy&_nc_zt=26&_nc_ht=scontent.fdkr5-1.fna&_nc_gid=A_rQ1pPeQCEwdmkEhedbjlS&oh=00_AYCyuQ2Dr71r2EksolWT7Z_WufS7hnCS4U-YBEa3I82HtA&oe=67759D18",
					"https://scontent.fdkr5-1.fna.fbcdn.net/v/t39.1997-6/68615353_411593842791602_3354885434072104960_n.webp?_nc_cat=103&ccb=1-7&_nc_sid=1176f5&_nc_eui2=AeHOdfuY_LiKbeTUY8lUWXCy-uXkbJ4YL6X65eRsnhgvpUgAn2zYsAeJMlniakcnvKx6z_EISOoWsjEDiS1gynj-&_nc_ohc=tHHxQfeS32YQ7kNvgGKz_6q&_nc_zt=26&_nc_ht=scontent.fdkr5-1.fna&_nc_gid=A_rQ1pPeQCEwdmkEhedbjlS&oh=00_AYC0K7W3d5JIRv4nCDVfeWZmyfy8-_RUiF0b6dS7B5XzrA&oe=6775A866",
					"https://scontent.fdkr5-1.fna.fbcdn.net/v/t39.1997-6/68332629_411592802791706_6218167644428697600_n.webp?_nc_cat=1&amp;ccb=1-7&amp;_nc_sid=1176f5&amp;_nc_eui2=AeHBG4sk8M267oReZe-AlHjQzUgDEsPLWLXNSAMSw8tYtcL7X_UUF9lnT0Bo3s-L04JoGdRATxOENYDMrZ8ykbMK&amp;_nc_ohc=jnOh6OVvc7wQ7kNvgGeL-HL&amp;_nc_zt=26&amp;_nc_ht=scontent.fdkr5-1.fna&amp;_nc_gid=ARVlyWOfuEETH3lm_Oa9Vxy&amp;oh=00_AYBwkOLUDfY-pkdChdJbVBqHC3CIiwaXGJEKmrgNs_XiDA&amp;oe=6775BA8C"
				];

				const randomStickerUrl = stickerUrls[Math.floor(Math.random() * stickerUrls.length)];
				await message.send({
					attachment: await global.utils.getStreamFromURL(randomStickerUrl),
				});
			};
	}
};
