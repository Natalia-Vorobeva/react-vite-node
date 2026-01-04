import { useEffect, useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiSelectors } from '../../../store/api/apiSelectors';
import { handleDeleteCard, setIsModal, handleAddingFavourires } from '../../../store/api/apiSlice';
import '../Column.scss'

const Card = lazy(() => import('../../Card/Card'));

function RightColumn({ searchQuery = '', searchResults = [] }) {
	let column = 'right'

	const dispatch = useDispatch()
	const messages = useSelector(apiSelectors.getDataMessages)
	const btnFilterFavourites = useSelector(apiSelectors.getBtnFilterFavourites)
	const isModal = useSelector(apiSelectors.getIsModal)
	const [sortedArr, setSortedArr] = useState(messages.rightCol)

	const { rightCol } = messages

	useEffect(() => {
		const filter = rightCol.filter(el => el.liked == true)
		setSortedArr(filter)
	}, [btnFilterFavourites, rightCol])

	// Фильтрация по поиску
	const [filteredMessages, setFilteredMessages] = useState([]);
	const [filteredFavorites, setFilteredFavorites] = useState([]);

	useEffect(() => {
		if (searchQuery && searchResults.length > 0) {
			// Используем результаты поиска
			setFilteredMessages(searchResults);
			const filteredFavs = searchResults.filter(el => el.liked === true);
			setFilteredFavorites(filteredFavs);
		} else {
			// Используем все сообщения
			setFilteredMessages(rightCol);
			const filteredFavs = rightCol.filter(el => el.liked === true);
			setFilteredFavorites(filteredFavs);
		}
	}, [searchQuery, searchResults, rightCol]);

	// удаление карточки
	function handleDelCard(data) {
		dispatch(handleDeleteCard({
			object: data,
			column
		}))
		if (isModal) { dispatch(setIsModal(false)) }
	}

	// добавление в избранное
	const handleFavourites = (data) => {
		let el
		if ('liked' in data == false) {
			el = { ...data, liked: true }
		} else if ('liked' in data && data.liked == true) {
			el = { ...data, liked: false }
		} else {
			el = { ...data, liked: true }
		}
		const newArr = rightCol.map((item) => {
			if (JSON.stringify(data) === JSON.stringify(item)) {
				return el
			} else {
				return item
			}
		})
		const newObj = { ...messages, rightCol: newArr }
		dispatch(handleAddingFavourires(newObj))
	}

	const renderCards = (items) => {
		if (items.length === 0) {
			return (
				<div className="column-base__empty">
					{searchQuery ? 'Сообщения не найдены' : 'Сообщений нет'}
				</div>
			);
		}

		return items.map((item, index) => {
			function time(data) { return data.substring(11, 16) }
			let key = `${item.id}${index}`
			return (
				<div
					id={`${key}/right`}
					key={key}
					className="card-wrapper"
				>
					<Suspense fallback={<div className="column-base__fallback">Загрузка...</div>}>
						<Card
							className={isModal ? "" : "_mini"}
							column={column}
							time={time(item.date)}
							data={item}
							handleDelCard={handleDelCard}
							handleFavourites={handleFavourites}
						/>
					</Suspense>
				</div>
			)
		});
	}

	return (
		<div className="right-column">
			<div className="right-column__wrapper">
				{searchQuery && (
					<div className="column-base__search-info">
						{/* Поиск: "{searchQuery}"  */}
						• Найдено: {filteredMessages.length}
					</div>
				)}
				
				{btnFilterFavourites
					? renderCards(filteredMessages)
					: renderCards(filteredFavorites)
				}
			</div>
		</div>
	)
}

export default RightColumn