import React, { useCallback, useMemo, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiSelectors } from '../../../store/api/apiSelectors';
import { handleDeleteCard, setIsModal, handleAddingFavourires } from '../../../store/api/apiSlice';
import '../Column.scss'

const Card = lazy(() => import('../../Card/Card'));

function CentralColumn({ searchQuery = '', searchResults = [] }) {
	let column = 'central'

	const dispatch = useDispatch()
	const messages = useSelector(apiSelectors.getDataMessages)
	const btnFilterFavourites = useSelector(apiSelectors.getBtnFilterFavourites)
	const isModal = useSelector(apiSelectors.getIsModal)
	const isReverse = useSelector(apiSelectors.getIsReverse) // Добавляем isReverse

	const { centralCol } = messages

	// Мемоизированные фильтрованные сообщения
	const filteredMessages = useMemo(() => {
    let messagesToShow;

    if (searchQuery && searchResults.length > 0) {
      // Используем searchResults, но фильтруем только те, что еще есть в centralCol
      // Это обеспечит актуальность данных при перемещении карточек
      const currentCentralIds = new Set(centralCol.map(item => item.id));
      messagesToShow = searchResults.filter(item => currentCentralIds.has(item.id));
    } else {
      messagesToShow = centralCol;
    }

    // Сортируем по дате
    const sortedMessages = [...messagesToShow].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })

    // Если isReverse = true, показываем старые сверху
    if (isReverse) {
      return sortedMessages.reverse();
    }

    return sortedMessages;
  }, [searchQuery, searchResults, centralCol, isReverse])

	// Мемоизированные избранные сообщения
	const filteredFavorites = useMemo(() => {
		let favs = filteredMessages.filter(el => el.liked === true)

		// Сохраняем порядок отфильтрованных сообщений
		if (isReverse) {
			return [...favs].reverse()
		}

		return favs
	}, [filteredMessages, isReverse])

	// Проверка наличия результатов поиска
	const hasSearchResults = useMemo(() => {
		return filteredMessages.length > 0
	}, [filteredMessages])

	const handleDelCard = useCallback((data) => {
		dispatch(handleDeleteCard({
			object: data,
			column
		}))
		if (isModal) { dispatch(setIsModal(false)) }
	}, [dispatch, column, isModal])

	const handleFavourites = useCallback((data) => {
		let el
		if ('liked' in data == false) {
			el = { ...data, liked: true }
		} else if ('liked' in data && data.liked == true) {
			el = { ...data, liked: false }
		} else {
			el = { ...data, liked: true }
		}
		const newArr = centralCol.map((item) => {
			if (JSON.stringify(data) === JSON.stringify(item)) {
				return el
			} else {
				return item
			}
		})
		const newObj = { ...messages, centralCol: newArr }
		dispatch(handleAddingFavourires(newObj))
	}, [centralCol, dispatch, messages])

	const renderCards = (items) => {
	if (items.length === 0) {
		return (
			<div className="column-base__empty">
				{searchQuery ? 'Сообщения не найдены' : 'Сообщений нет'}
			</div>
		)
	}

	return items.map((item) => {
		function time(data) { return data.substring(11, 16) }
		// Стабильный ключ на основе id
		let key = `card-${item.id}`
		return (
			<div
				key={key}
				className="card-wrapper"
			>
				<Suspense fallback={<div className="column-base__fallback">Загрузка...</div>}>
					<Card
						key={key} // Добавляем key также в Card
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
	})
}

	return (
		<div className="central-column">
			<div className="central-column__wrapper">
				{searchQuery && (
					<div className="column-base__search-info">
						• Найдено: {filteredMessages.length}
					</div>
				)}

				{searchQuery && !hasSearchResults ? (
					<div className="column-base__empty">
						Сообщения не найдены
					</div>
				) : (
					btnFilterFavourites
						? renderCards(filteredMessages)
						: renderCards(filteredFavorites)
				)}
			</div>
		</div>
	)
}

const arePropsEqual = (prevProps, nextProps) => {
	return (
		prevProps.searchQuery === nextProps.searchQuery &&
		JSON.stringify(prevProps.searchResults) === JSON.stringify(nextProps.searchResults)
	)
}

export default React.memo(CentralColumn, arePropsEqual)