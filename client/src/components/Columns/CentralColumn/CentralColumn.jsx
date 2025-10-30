import { useEffect, useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiSelectors } from '../../../store/api/apiSelectors';
import { handleDeleteCard, setIsModal, handleAddingFavourires } from '../../../store/api/apiSlice';
import './CentralColumn.scss'
const Card = lazy(() => import('../../Card/Card'));

function CentralColumn() {

	let column = 'central'

	const dispatch = useDispatch()
	const messages = useSelector(apiSelectors.getDataMessages)
	const btnFilterFavourites = useSelector(apiSelectors.getBtnFilterFavourites)
	const isModal = useSelector(apiSelectors.getIsModal)
	const [sortedArr, setSortedArr] = useState(messages.centralCol)

	const { centralCol } = messages

	useEffect(() => {
		const filter = centralCol.filter(el => el.liked == true)
		setSortedArr(filter)
	}, [btnFilterFavourites, centralCol])

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

	return (
		<div className="central-column">
			<div className="central-column__wrapper">
				{
					btnFilterFavourites
						?
						centralCol.map((item, index) => {
							function time(data) { return data.substring(11, 16) }
							let key = `${item.id}${index}`
							return <div
								id={`${key}/central`}
								key={key}>
								<Suspense fallback={<div className="central-column__fallback">Loading...</div>}>
									<Card className={isModal ? "" : "_mini"}
										column={column}
										time={time(item.date)}
										data={item}
										handleDelCard={handleDelCard}
										handleFavourites={handleFavourites}
									/>
								</Suspense>
							</div>
						})
						:
						sortedArr.map((item, index) => {
							function time(data) { return data.substring(11, 16) }
							let key = `${item.id}${index}`
							return <div
								id={`${key}/central`}
								key={key}>
								<Card
									className={isModal ? "" : "_mini"}
									column={column}
									time={time(item.date)}
									data={item}
									handleDelCard={handleDelCard}
									handleFavourites={handleFavourites}
								/>
							</div>
						})
				}
			</div>
		</div>
	)
}

export default CentralColumn