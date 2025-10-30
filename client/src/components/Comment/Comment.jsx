import FormPopup from '../FormPopup/FormPopup';
import './Comment.scss';

function Comment({ onSubmit }) {
	return (
		<div className="comment">
			<FormPopup onSubmit={onSubmit} />
		</div >
	)
}

export default Comment;