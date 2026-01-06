import React, { useEffect, useState, lazy, Suspense } from 'react';
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
	const isReverse = useSelector(apiSelectors.getIsReverse)

	const { centralCol } = messages

	const [filteredMessages, setFilteredMessages] = useState([]);
	const [filteredFavorites, setFilteredFavorites] = useState([]);

	useEffect(() => {
		let messagesToShow;

		if (searchQuery && searchResults.length > 0) {
			messagesToShow = searchResults;
		} else {
			messagesToShow = centralCol;
		}

		let sortedMessages = [...messagesToShow].sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		})

		if (isReverse) {
			sortedMessages = sortedMessages.reverse();
		}

		setFilteredMessages(sortedMessages);

		const favs = sortedMessages.filter(el => el.liked === true);
		setFilteredFavorites(favs);
	}, [searchQuery, searchResults, centralCol, isReverse]);

	function handleDelCard(data) {
		dispatch(handleDeleteCard({
			object: data,
			column
		}))
		if (isModal) { dispatch(setIsModal(false)) }
	}

	const handleFavourites = (data) => {
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
					id={`${key}/central`}
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
		<div className="central-column">
			<div className="central-column__wrapper">
				{(searchQuery || !btnFilterFavourites) && (
					<div className="column-base__search-info">
						{searchQuery
							? `• Найдено: ${filteredMessages.length}`
							: `• Избранных: ${filteredFavorites.length}`
						}
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

const arePropsEqual = (prevProps, nextProps) => {
	return (
		prevProps.searchQuery === nextProps.searchQuery &&
		JSON.stringify(prevProps.searchResults) === JSON.stringify(nextProps.searchResults)
	)
}

export default React.memo(CentralColumn, arePropsEqual)