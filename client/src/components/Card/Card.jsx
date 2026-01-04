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
	handleFavourites
}) {

	const dispatch = useDispatch()
	const isModal = useSelector(apiSelectors.getIsModal)
	const [isPending, startTransition] = useTransition()
	const outsideClickRef = useRef(null)
	const [commentOn, setCommentOn] = useState(false)
	const [dimensions, setDimensions] = useState(true)
	const [menu, setMenu] = useState(false)
	const [outsideMenu, setOutsideMenu] = useState(false)
	const [visibleContent, setVisibleContent] = useState(true)
	const [confirmation, setConfirmation] = useState(true)
	const [symbolCopy, setSymbolCopy] = useState('⧉')
	console.log('%cDATA', 'color: purple', dimensions, 'dimensions', visibleContent, 'visibleContent')

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

	// изменение размера карточки по иконке
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

	// открытие popup 
	const handleCommentOn = (data) => {
		setCommentOn(true)
		dispatch(setIsModal(true))
		dispatch(setChoice(
			{
				object: data,
				column,
				time
			}))
	}

	const handleVisibleContent = () => {
		setVisibleContent(false)
		setDimensions(false) 
	}

	useEffect(() => {
		console.log('%cDATA', 'color: purple', visibleContent, isModal, 'visibleContent, isModal');
	}, [visibleContent, isModal]);

	// В модальном окне всегда показываем полный текст
	useEffect(() => {
		if (isModal) {
			setVisibleContent(false)
			setDimensions(false)
		}
	}, [isModal])


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
							{visibleContent == false || !isModal && (
								<h2 className="card__subtitle card__subtitle_mini">{data.content}</h2>
							)}
						</div>
						<div className="card__column-content-buttons">
							{
								isModal ?
									<div onClick={() => handleClipboard(data.content)} className="card__copy">{symbolCopy}</div>
									:
									<div className="card__icons">
										<img
											onClick={() => handleCommentOn(data)}
											src={comment} alt="Комментировать"
											className={`card__icon card__icon_type_comment${isModal ? "_visible" : ""} card__icon_type_comment${commentOn ? '_active' : ''} `} />
										<img
											onClick={handleDimensionsIcon}
											src={hide} alt="Изменить размеры"
											className={`card__icon card__icon_type_dimensions${!dimensions ? '_active' : ''} ${isModal ? "opacity" : ""}`} />
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
										<img src={like} alt="В избранное" onClick={() => handleFavourites(data)} className={` card__icon card__icon_type_favourites${data.liked == true ? "_active" : "_no-active"}  ${isModal ? "opacity" : ""}`} />
									</div>
							}

							<div className={`card__control-card card__control-card${className}`}>
								{
									!isModal && <div className="card__buttons">
										<Button id="left" buttonName="left" data={data} column={column}
											className={`${column == "left" ? "button_inactive " : ""} ${isModal ? "" : "button_mini"}`} btnText="Левый" />
										<Button id="central" buttonName="central" data={data} column={column}
											className={`${column == "central" ? "button_inactive" : ""} ${isModal ? "" : "button_mini"}`} btnText="Центр" />
										<Button id="right" buttonName="right" data={data} column={column}
											className={`${column == "right" ? "button_inactive" : ""} ${isModal ? "" : "button_mini"}`} btnText="Правый" />
									</div>
								}
							</div>
						</div>
					</div>





					{/* !!!! Далее  */}
					<div className="card__column-content-data">
						{
							// dimensions && data.content && data.content.trim() && 
							visibleContent == true && dimensions == true ?
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