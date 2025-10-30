import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiSelectors } from '../../../store/api/apiSelectors';
import { handleDeleteCard, setIsModal, handleAddingFavourires } from '../../../store/api/apiSlice';
import Card from '../../Card/Card';
import './LeftColumn.scss'

function LeftColumn() {

	let column = "left"
	
	const dispatch = useDispatch()
	const messages = useSelector(apiSelectors.getDataMessages)
	const isModal = useSelector(apiSelectors.getIsModal)
	const btnFilterFavourites = useSelector(apiSelectors.getBtnFilterFavourites)
	const [sortedArr, setSortedArr] = useState(messages.leftCol)

	const { leftCol } = messages

	useEffect(() => {
		const filter = leftCol.filter(el => el.liked == true)
		setSortedArr(filter)
	}, [btnFilterFavourites, leftCol])

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
		const newArr = leftCol.map((item) => {
			if (JSON.stringify(data) === JSON.stringify(item)) {
				return el
			} else {
				return item
			}
		})
		const newObj = { ...messages, leftCol: newArr }
		dispatch(handleAddingFavourires(newObj))
	}

	return (
		<section className="left-column">
			<div className="left-column__wrapper">

				{
					btnFilterFavourites
						?
						leftCol.map((item, index) => {
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
									date={item.date}
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

export default LeftColumn