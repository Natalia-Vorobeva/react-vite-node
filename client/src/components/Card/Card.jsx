import { useRef, useState, useEffect, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiSelectors } from '../../store/api/apiSelectors'
import { setChoice, setIsModal } from '../../store/api/apiSlice'
import Button from '../Button/Button'
import avatar from '../../assets/images/avatar.png'
import hide from '../../assets/images/hide.png'
import settings from '../../assets/images/settings.png'
import comment from '../../assets/images/comment.png'
import like from '../../assets/images/favourites.png'
import './Card.scss'

function Card({
	data,
	time,
	column,
	className,
	handleDelCard,
	handleFavourites,
	onMoveCard
}) {

	const dispatch = useDispatch()
	const isModal = useSelector(apiSelectors.getIsModal)
	const choice = useSelector(apiSelectors.getChoice) // Получаем выбранную карточку
	const [isPending, startTransition] = useTransition()
	const outsideClickRef = useRef(null)
	const [dimensions, setDimensions] = useState(true)
	const [menu, setMenu] = useState(false)
	const [outsideMenu, setOutsideMenu] = useState(false)
	const [visibleContent, setVisibleContent] = useState(true)
	const [confirmation, setConfirmation] = useState(true)
	const [symbolCopy, setSymbolCopy] = useState('⧉')

	// Определяем, является ли эта карточка выбранной для модального окна
	const isCardSelected = choice?.object?.id === data.id && isModal

	useEffect(() => {
		function handleClickOutside(e) {
			if (outsideMenu == true) {
				if (outsideClickRef.current && !outsideClickRef.current.contains(e.target)) {
					setMenu(false)
					setOutsideMenu(false)
				}
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [outsideMenu, outsideClickRef])

	const toggleMenu = () => {
		setMenu(!menu)
	}

	useEffect(() => {
		setOutsideMenu(menu)
	}, [menu])

	const handleClipboard = (text) => {
		setSymbolCopy('✔')
		startTransition(async function () {
			const copy = navigator.clipboard.writeText(text)
			return copy
		})

		setTimeout(() => {
			setSymbolCopy('⧉')
		}, 2000);
	}

	const handleDeleteCard = (data) => {
		handleDelCard(data)
	}

	const handleDimensionsIcon = () => {
		setDimensions(!dimensions)
		setVisibleContent(!visibleContent)
	}

	const copyTextToClipboard = (text) => {
		startTransition(async function () {
			const copy = navigator.clipboard.writeText(text)
			return copy
		})
		setMenu(false)
	}

	const handleCommentOn = (data) => {
		// Открываем модальное окно в Redux
		dispatch(setIsModal(true))
		dispatch(setChoice(
			{
				object: data,
				column,
				time
			}))
		
		// Разворачиваем карточку
		setVisibleContent(false)
		setDimensions(false)
	}

	const handleVisibleContent = () => {
		setVisibleContent(false)
		setDimensions(false)
	}

	// Сброс состояния при закрытии модального окна, если эта карточка была выбрана
	useEffect(() => {
		if (!isModal && isCardSelected) {
			// Можно восстановить исходное состояние или оставить как есть
			// setVisibleContent(true)
			// setDimensions(true)
		}
	}, [isModal, isCardSelected])

	console.log('%cDATA', 'color: purple', {isModal, isCardSelected, cardId: data.id, choiceId: choice?.object?.id})

	return (
		<section className={`card ${dimensions ? 'card_mini' : ''}`}>
			<div className="card__columns">
				<div className="card__column-avatar">
					<img src={avatar} alt="аватар" className="card__avatar" />
					{
						!dimensions && <p className="card__date">{time}</p>
					}
				</div>
				<div className="card__column-content">
					<div className="card__column-content-header">
						<div className="card__column-content-author">
							<h2 className="card__title">{data.author}</h2>
							{visibleContent == true && (
								<h2 className="card__subtitle card__subtitle_mini">{data.content}</h2>
							)}
						</div>
						<div className="card__column-content-buttons">
							{
								// Показываем кнопку копирования ТОЛЬКО для выбранной карточки
								isCardSelected ?
									<div onClick={() => handleClipboard(data.content)} className="card__copy">{symbolCopy}</div>
									:
									<div className="card__icons">
										<img
											onClick={() => handleCommentOn(data)}
											src={comment} alt="Комментировать"
											className={`card__icon card__icon_type_comment${isCardSelected ? '_active' : ''}`} />
										<img
											onClick={handleDimensionsIcon}
											src={hide} alt="Изменить размеры"
											className={`card__icon card__icon_type_dimensions${!dimensions ? '_active' : ''} ${isCardSelected ? "opacity" : ""}`} />
										<div className="card__wrapper-button-settings" ref={outsideClickRef}>
											<img
												onClick={toggleMenu}
												src={settings} alt="Скопировать текст или удалить пост"
												className={`card__icon card__icon_type_settings${menu ? "_active" : ""} `} />
											{
												menu && <div className="card__wrapper-button-settings_overlay card__wrapper-button-settings_overlay_visible"></div>
											}
											<div className={`card__menu-wrapper ${menu ? 'card__menu-wrapper_visible' : ''}`}>
												<div className="card__menu">
													<p onClick={() => copyTextToClipboard(data.content)} className="card__menu-copy">Скопировать текст</p>
													{
														confirmation
															?
															<p onClick={() => setConfirmation(!confirmation)} className="card__menu-delete">Удалить</p>
															:
															<p onClick={() => handleDeleteCard(data)} className="card__menu-delete card__menu-delete_confirmation">
																Удалить навсегда?</p>
													}
												</div>
											</div>
										</div>
										<img src={like} alt="В избранное" onClick={() => handleFavourites(data)} className={` card__icon card__icon_type_favourites${data.liked == true ? "_active" : "_no-active"}  ${isCardSelected ? "opacity" : ""}`} />
									</div>
							}

							<div className={`card__control-card card__control-card${className}`}>
								{
									// Показываем кнопки перемещения ТОЛЬКО если карточка не выбрана
									!isCardSelected && <div className="card__buttons">
										<Button id="left" buttonName="left" data={data} column={column}
											onMoveCard={onMoveCard} className={`${column == "left" ? "button_inactive " : ""} ${isCardSelected ? "" : "button_mini"}`} btnText="Левый" />
										<Button id="central" buttonName="central" data={data} column={column}
											onMoveCard={onMoveCard} className={`${column == "central" ? "button_inactive" : ""} ${isCardSelected ? "" : "button_mini"}`} btnText="Центр" />
										<Button id="right" buttonName="right" data={data} column={column}
											onMoveCard={onMoveCard} className={`${column == "right" ? "button_inactive" : ""} ${isCardSelected ? "" : "button_mini"}`} btnText="Правый" />
									</div>
								}
							</div>
						</div>
					</div>
					<div className="card__column-content-data">
						{
							visibleContent == true && !isCardSelected
								?
								(
									<div onClick={handleVisibleContent} className="card__more">Далее</div>
								)
								:
								(
									<p className="card__subtitle card__subtitle_full">{data.content}</p>
								)
						}
					</div>
				</div>
			</div>
			{!dimensions &&
				data.attachments?.map((item, index) => {
					return <video
						type="video/mp4"
						key={item.url + index}
						src={item.url}
						muted loop
						autoPlay
						className='card__video'>
						Ваш браузер не поддерживает встроенные видео
					</video>
				})
			}
		</section>
	)
}

export default Card