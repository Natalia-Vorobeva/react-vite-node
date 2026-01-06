import { useDispatch } from 'react-redux';
import { handleButton } from '../../store/api/apiSlice';
import './Button.scss';

function Button({ btnText, data, column,
	className, hover, buttonName, id,
	onMoveCard
}) {
	const dispatch = useDispatch()

	let obj = {
		object: data,
		column,
		buttonName
	}

	const handleClick = () => {
		if (onMoveCard) {
			onMoveCard(buttonName, data);
		} else {
			dispatch(handleButton({
				object: data,
				column,
				buttonName
			}));
		}
	};

	return (
		<div id={id} onClick={handleClick} data-hover={hover} className={`button ${className}`}>
			<div className={`button__${id}`}>{btnText}</div>
		</div>
	)
}

export default Button