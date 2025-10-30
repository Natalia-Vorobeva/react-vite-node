import { useState, useRef, useEffect, useCallback } from 'react';
import Card from '../Card/Card';
import Comment from '../Comment/Comment';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddingFavourires, handleDeleteCard, setIsModal } from '../../store/api/apiSlice';
import { apiSelectors } from '../../store/api/apiSelectors';
import './Popup.scss';
import Comments from '../Comments/Comments';


function Popup() {
	const ref = useRef(null)
	const dispatch = useDispatch()
	const isModal = useSelector(apiSelectors.getIsModal)
	const choice = useSelector(apiSelectors.getChoice)
	const [comments, setComments] = useState([])

	const handleFilterComments = (currIndex) => {
		setComments(prevState => {
			const newArray = [...prevState]
			newArray.splice(currIndex, 1)
			return newArray
		})
	}

	const memoizedFilter = useCallback(handleFilterComments, [comments])

	useEffect(() => {
		if (isModal) {
			document.addEventListener('keydown', handleEscClose)
		}
		return () => {
			document.removeEventListener('keydown', handleEscClose)
		}
	}, [isModal])

	function handleEscClose(evt) {
		if (evt.key === 'Escape') {
			dispatch(setIsModal(false))
		}
	}

	useEffect(() => {
		const onClick = e => {
			if (!ref.current.contains(e.target) == false) {
				dispatch(setIsModal(false))
			}
		}
		document.addEventListener('click', onClick);
		return () => document.removeEventListener('click', onClick)
	}, [])

	const handleDelCard = () => {
		dispatch(handleDeleteCard(choice))
		if (isModal) { dispatch(setIsModal(false)) }
	}

	const handleFavourites = () => {
		dispatch(handleAddingFavourires(choice))
	}
	function onSubmit(e, value) {
		e.preventDefault()
		setComments((prevState) => [...prevState, value])
	}

	return (
		<section className={`popup ${isModal ? 'popup_showed' : ''}`}>
			<div ref={ref} className="popup__overlay"></div>
			<div className="popup__container">

				<p onClick={() => dispatch(setIsModal(false))} className="popup__close">×</p>
				<div className="popup__wrapper">
					<Card time={choice.time} handleFavourites={handleFavourites} handleDelCard={handleDelCard} column={choice.column} data={choice.object} />
					{/* <div className="popup__wrapper-comments"> */}
				</div>
				<div className="popup__list">
					<Comments comments={comments} handleFilterComments={memoizedFilter} />
				</div>
				<div className="popup__input">
					<Comment onSubmit={onSubmit} />
				</div>
				{/* </div> */}

			</div>
		</section>
	);
}

export default Popup;