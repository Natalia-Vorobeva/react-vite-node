import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleDeleteCard, setIsModal, handleAddingFavourires } from '../../../store/api/apiSlice';
import { apiSelectors } from '../../../store/api/apiSelectors';
import Card from '../../Card/Card';
import './RigthColumn.scss'

function RigthColumn() {

	let column = 'right'

	const dispatch = useDispatch()
	const messages = useSelector(apiSelectors.getDataMessages)
	const isModal = useSelector(apiSelectors.getIsModal)
	const btnFilterFavourites = useSelector(apiSelectors.getBtnFilterFavourites)
	const [sortedArr, setSortedArr] = useState(messages.rightCol)

	const { rightCol } = messages

	useEffect(() => {
		const filter = rightCol.filter(el => el.liked == true)
		setSortedArr(filter)
	}, [btnFilterFavourites, rightCol])

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

	return (
		<section className="right-column">
			<div className="right-column__wrapper">
				{
					btnFilterFavourites
						?
						rightCol.map((item, index) => {
							function time(data) { return data.substring(11, 16) }
							let key = `${item.id}${index}`
							return <div
								id={`${key}/central`}
								key={key}>
								<Card className={isModal ? "" : "_mini"}
									column={column}
									time={time(item.date)}
									data={item}
									handleDelCard={handleDelCard}
									handleFavourites={handleFavourites}
								/>
							</div>
						})
						:
						sortedArr?.map((item, index) => {
							function time(data) { return data.substring(11, 16) }
							let key = `${item.id}${index}`
							return <div
								id={`${key}/central`}
								key={key}>
								<Card className={isModal ? "" : "_mini"}
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
		</section>
	)
}

export default RigthColumn