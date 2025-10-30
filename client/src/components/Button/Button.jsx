import { useDispatch } from 'react-redux';
import { handleButton } from '../../store/api/apiSlice';
import './Button.scss';

function Button({ btnText, data, column,
	className, hover, buttonName, id
}) {
	const dispatch = useDispatch()

	let obj = {
		object: data,
		column,
		buttonName
	}

	return (
		<div id={id} onClick={() => dispatch(handleButton(obj))} data-hover={hover} className={`button ${className}`}>
			<div className={`button__${id}`}>{btnText}</div>
		</div>
	)
}

export default Button