import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { onToggleReverse, setDataMessages, setNewMessages, setOldMessages, setStateBtnFilterFavourites, setLastId } from './store/api/apiSlice'
import { apiSelectors } from './store/api/apiSelectors'
import FormSearch from './components/FormSearch/FormSearch'
import Preloader from './components/Preloader/Preloader'
import LeftColumn from './components/Columns/LeftColumn/LeftColumn'
import CentralColumn from './components/Columns/CentralColumn/CentralColumn'
import RigthColumn from './components/Columns/RigthColumn/RigthColumn'
import Popup from './components/Popup/Popup'
import './index.css'
import './App.scss'

function App() {

	const ref = useRef(null)
	const dispatch = useDispatch()
	const dataMessages = useSelector(apiSelectors.getDataMessages)
	const idLast = useSelector(apiSelectors.getIdLast)
	const isModal = useSelector(apiSelectors.getIsModal)
	const btnFilterFavourites = useSelector(apiSelectors.getBtnFilterFavourites)
	const isReverse = useSelector(apiSelectors.getIsReverse)
	const [isLoading, setIsLoading] = useState(false)
	const [searchLenght, setSearchLenght] = useState(null)
	const [width, setWidth] = useState(window.innerWidth)

	useEffect(() => {
		const handleResize = (event) => {
			setWidth(event.target.innerWidth)
		}

		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [width])

	// найденные в поиске объекты (ПОКА НЕ ИСПОЛЬЗУЕТСЯ)
	const [searchData, setSearchData] = useState({
		leftCol: [],
		centralCol: [],
		rigthCol: []
	})

	// ЗАПРОСЫ	
	const formData = new FormData()
	formData.append('actionName', 'MessagesLoad')
	formData.append('messageId', 0)
	const requestOptions = {
		method: 'POST',
		body: formData,
	}

	const formDataOldMessages = new FormData()
	formDataOldMessages.append('actionName', 'MessagesLoad')
	formDataOldMessages.append('oldMessages', true)
	const requestOptionsOldMessages = {
		method: 'POST',
		body: formDataOldMessages,
	}
	const formDataNewMessages = new FormData()
	formDataNewMessages.append('actionName', 'MessagesLoad')
	formDataNewMessages.append('messageId', idLast)
	const requestOptionsNewMessages = {
		method: 'POST',
		body: formDataNewMessages
	}

	// получение данных при загрузке страницы
	useEffect(() => {
		fetch('https://localhost:44305', requestOptions)
			.then(response => response.json())
			.then(
				(result) => {
					setIsLoading(false)
					dispatch(setDataMessages(result.Messages))
				},
				(error) => {
					setIsLoading(true)
					console.error('%cDATA', 'color: purple', 'Ошибка при запросе:', error)
				}
			)
	}, [])

	// получение новых сообщений
	async function fetchAPIData() {
		try {
			const response = await fetch('https://localhost:44305', requestOptionsNewMessages)
			if (!response.ok) throw new Error('Ошибка сети')
			const data = await response.json()
			if (typeof data !== 'string') {
				let arrModified = data.Messages.map(object => {
					let dateModified = object.date.replace(/ /g, 'T').concat("Z")
					return { ...object, date: dateModified }
				})
				let arr = [...dataMessages.centralCol, ...arrModified]
				arr.sort((a, b) => {
					return new Date(b.date) - new Date(a.date)
				})
				const ids = arr.map(object => object.id)
				let id = Math.max(...ids)
				dispatch(setLastId(id))
				dispatch(setNewMessages({ ...dataMessages, centralCol: arr }))
			} else {
				return
			}
		}
		catch (err) {
			console.log('Ошибка:', err)
		}
	}

	useEffect(() => {
		const intervalId = setInterval(() => {
			fetchAPIData(requestOptionsNewMessages)
		}, 5000)
		return () => clearInterval(intervalId)
	}, [requestOptionsNewMessages])

	// загрузка "предыдущих" сообщений
	function handleLoadOldMessages() {
		fetch('https://localhost:44305', requestOptionsOldMessages)
		// fetch('https://localhost:44305/', requestOptionsOldMessages)
			.then(response => response.json())
			.then(
				(result) => {
					setIsLoading(false)
					dispatch(setOldMessages(result.Messages))
				},
				(error) => {
					setIsLoading(true)
					console.error('%cDATA', 'color: purple', 'Ошибка при запросе:', error)
				}
			)
	}

	function handleSearch(value) {
		const left = dataMessages.leftCol.filter(el => el.content.includes(value))
		const central = dataMessages.centralCol.filter(el => el.content.includes(value))
		const right = dataMessages.rightCol.filter(el => el.content.includes(value))
		const arr = {
			leftCol: left,
			centralCol: central,
			rigthCol: right
		}
		setSearchData(arr)
		const count = Object.values(arr).reduce((sum, val) =>
			sum + (Array.isArray(val) ? val.length : 0), 0)
		setSearchLenght(count)
	}

	return (
		<div className="app">
			{
				isModal && <Popup />
			}
			{isLoading ?
				<Preloader />
				:
				width >= 750 ?
					<div ref={ref} className="app__content">
						<div className="app__control-header">
							<h1 className="app__title">My <div className="app__title-span">♡</div> messenger</h1>
							<div className="app__header-content">
								<button onClick={handleLoadOldMessages} className="app__button-load">Загрузить предыдущие</button>
								<button onClick={() => dispatch(onToggleReverse(!isReverse))} className="app__buttons-sort">
									<span className={`app__button-sort app__button-sort_active ${!isReverse && "move"}`}>
										{!isReverse ? "Новые" : "Cтарые"} сверху
									</span>
									<span className={`app__button-sort ${isReverse && "flip"}`}>
										{!isReverse ? "Cтарые" : "Новые"}
									</span>
								</button>
								<button onClick={() => dispatch(setStateBtnFilterFavourites(!btnFilterFavourites))} className="app__buttons-sort">
									<span className={`app__button-sort app__button-sort_active ${!btnFilterFavourites && "move"}`}>
										{!btnFilterFavourites ? "Избранное" : "Все сообщения"}
									</span>
									<span className={`app__button-sort ${btnFilterFavourites && "flip"}`}>
										{!btnFilterFavourites ? "Все сообщения" : "Избранное"}
									</span>
								</button>
							</div>
							<div className="app__search" >
								<FormSearch onSubmit={handleSearch} />
								<p className="app__lenght">Найдено совпадений: {searchLenght}</p>
							</div>
						</div>
						<div className="app__columns">
							<LeftColumn />
							<CentralColumn />
							<RigthColumn />
						</div>
					</div>
					:
					<div className="app__info">
						<div className="app__info-text">К сожалению, для этого расширения экрана пока нет контента</div>
					</div>
			}
		</div>
	)
}

export default App
