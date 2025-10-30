import avatar from '../../assets/images/avatar.png'
import './Comments.scss';

function Comments({ comments, handleFilterComments, name = 'Воробьева Наталья' }) {

	return (
		<div className="comments">
			{
				comments.map((item, index) => {
					return <div key={`${item}${index}/comment-content`} className='comments__element'>
						<p className="comments__user">{name}</p>
						<div className="comments__wrapper">
							<img src={avatar} alt="аватар" className="comments__avatar" />
							<p className="comments__item">{item}</p>
							<button onClick={() => handleFilterComments({ index })} className="comments__delete">Удалить</button>
						</div>
					</div>
				})
			}
		</div>
	)
}

export default Comments