$('body').ready(() => {

	if (!location.href.includes('/pe?resultId=')) return

	const url = {
		api: 'https://dz-helper.ru/yaklass/api.php',
		key: 'https://dz-helper.ru/api/yak/getKey.php'
	}

	const text = {
		auth: 'Для работы с расширением необходимо авторизоваться на DZ-Helper. Открыть страницу авторизации?',
		afterAuth: 'После авторизации обновите страницу',
		serverError: 'Не удалось подключиться к серверу. Попробуйте обновить страницу',
		incorrectKey: 'Произошла ошибка авторизации. Попробуйте заново авторизоваться на <a href="https://dz-helper.ru/" target="_blank">dz-helper.ru</a>',
		noBalance: 'У вас недостаточно средств. Пополните баланс на <a href="https://dz-helper.ru/buy.html" target="_blank">dz-helper.ru</a>',
		fake: 'Используйте ваш предыдущий аккаунт ВКонтакте для авторизации на <a href="https://dz-helper.ru/" target="_blank">dz-helper.ru</a>'
	}

	let key = null

	$.ajaxSetup({ xhrFields: { withCredentials: true } });

	(async () => {
		key = await get(url.key)
		createButton()
	})()

	function load(elem, url) {
		return new Promise(resolve => {
			elem.load(url, () => resolve())
		})
	}

	async function clickButton() {
		const wrapper = $('<div>')
			.append('<div class="header"><h3>Шаги решения ПАСТА ХЕЛПЕРА АХАХАХХАХАХАХ:</h3></div>')
			.append('<div class="blockbody"><div class="custom-action text-center">Получение ответа...</div></div>')
			.addClass('block no-bmarg')
			.insertAfter('.block.no-bmarg')

		const setAnswer = html => {
			wrapper.find('div.blockbody').find('div').remove()
			wrapper.find('div.blockbody').html(html)
		}

		const container = $('<div>')
		await load(container, 'https://www.yaklass.ru/Account/Profile section.school')
		const schoolName = container.find('.scoolname a').eq(0).text().trim().replace(/ /g, '')
		const className = container.find('.classname').eq(0).text().trim().replace(/ /g, '')
		const name = $('.user_links a.name').text().trim().replace(/ /g, '')
		const fullName = name + className + schoolName
		const urlEx = location.href.replace(/pe\?resultId=.+/, '')
		let answer = await get(`${url.api}?key=${key}&url=${urlEx}&name=${fullName}`)
		if (!answer) {
			setAnswer('Не удалось получить ответ. Попробуйте обновить страницу.')
		} else if (answer === 'incorrect key') {
			setAnswer(text.incorrectKey)
		} else if (answer === 'fake') {
			setAnswer(text.fake)
		} else {
			answer = '<small><i>Приведёно решение к похожему заданию. Ответы могут не совпадать.</i></small><br><br>' + answer
			setAnswer(answer)

			const s = document.createElement('script')
			s.innerHTML = 'MathJax.Hub.Typeset()'
			document.body.appendChild(s)
		}
	}

	function createButton() {
		$('<button>')
			.text('Показать ответ')
			.addClass('btn')
			.css('background', '#00cc00')
			.appendTo('.task-buttons')
			.click(async function (e) {
				$(this).attr('disabled', '')
				clickButton()
				e.preventDefault()
			})
	}

	async function get(url) {
		try {
			return await $.ajax({ type: "GET", url, async: true })
		} catch (error) {
			console.error(error)
			return false
		}
	}

})