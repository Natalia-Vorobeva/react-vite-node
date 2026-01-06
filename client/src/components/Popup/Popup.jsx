import { useState, useRef, useEffect, useCallback } from 'react';
import Card from '../Card/Card';
import Comment from '../Comment/Comment';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddingFavourires, handleDeleteCard, setIsModal } from '../../store/api/apiSlice';
import { apiSelectors } from '../../store/api/apiSelectors';
import Comments from '../Comments/Comments';
import './Popup.scss';

function Popup() {
	const containerRef = useRef(null); 
	const wrapperRef = useRef(null);
	const dispatch = useDispatch();
	const isModal = useSelector(apiSelectors.getIsModal);
	const choice = useSelector(apiSelectors.getChoice);
	const [comments, setComments] = useState([]);
	const [isMounted, setIsMounted] = useState(false);

	const handleFilterComments = (currIndex) => {
		setComments(prevState => {
			const newArray = [...prevState];
			newArray.splice(currIndex, 1);
			return newArray;
		});
	};

	const memoizedFilter = useCallback(handleFilterComments, []);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) {
				dispatch(setIsModal(false));
			}
		};

		if (isModal) {
			const timer = setTimeout(() => {
				document.addEventListener('click', handleClickOutside);
			}, 0);

			return () => {
				clearTimeout(timer);
				document.removeEventListener('click', handleClickOutside);
			};
		}
	}, [isModal, dispatch]);

	useEffect(() => {
		if (isModal) {
			setIsMounted(true);
		} else {
			setIsMounted(false);
		}
	}, [isModal]);

	useEffect(() => {
		const handleEscClose = (evt) => {
			if (evt.key === 'Escape') {
				dispatch(setIsModal(false));
			}
		};

		if (isModal) {
			document.addEventListener('keydown', handleEscClose);
		}

		return () => {
			document.removeEventListener('keydown', handleEscClose);
		};
	}, [isModal, dispatch]);

	const handleDelCard = () => {
		dispatch(handleDeleteCard(choice));
		dispatch(setIsModal(false));
	};

	const handleFavourites = () => {
		dispatch(handleAddingFavourires(choice));
	};

	const onSubmit = (e, value) => {
		e.preventDefault();
		if (value.trim()) {
			setComments((prevState) => [...prevState, value]);
		}
	};

	if (!isMounted || !choice?.object) return null;

	return (
		<section className={`popup ${isModal ? 'popup_showed' : ''}`}>
			<div className="popup__overlay"></div>
			<div ref={containerRef} className="popup__container"> {/* ref теперь на контейнере */}
				<div className="popup__inner">
					<button
						onClick={() => dispatch(setIsModal(false))}
						className="popup__close"
						aria-label="Закрыть попап"
					>
						×
					</button>

					<div ref={wrapperRef} className="popup__wrapper">
						<Card
							time={choice.time}
							handleFavourites={handleFavourites}
							handleDelCard={handleDelCard}
							column={choice.column}
							data={choice.object}
						/>
					</div>

					<div className="popup__list">
						<Comments comments={comments} handleFilterComments={memoizedFilter} />
					</div>

					<div className="popup__input">
						<Comment onSubmit={onSubmit} />
					</div>
				</div>
			</div>
		</section>
	);
}

export default Popup;