import avatar from '../../assets/images/avatar.png';
import './Comments.scss';

function Comments({ comments, handleFilterComments, name = 'Воробьева Наталья' }) {
		// Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum in reprehenderit, doloremque assumenda deserunt laboriosam nostrum officia tempora fugiat. Labore ad dolor perferendis recusandae architecto eligendi sunt quas reprehenderit repellat earum magnam minus, deleniti quo officia sapiente placeat, laboriosam dignissimos. Quasi alias doloribus quo incidunt debitis eaque, facere harum porro.
  return (
		
    <div className="comments">
		
      {comments.length === 0 ? (
        <div className="comments__empty">
          <p className="comments__empty-text">Пока нет комментариев</p>
          <p className="comments__empty-subtext">Будьте первым, кто оставит комментарий!</p>
        </div>
      ) : (
        comments.map((item, index) => {
          return (
            <div key={`${item}${index}/comment-content`} className='comments__element'>
              <p className="comments__user">{name}</p>
              <div className="comments__wrapper">
                <img src={avatar} alt="аватар" className="comments__avatar" />
                <p className="comments__item">{item}</p>
                <button 
                  onClick={() => handleFilterComments(index)} 
                  className="comments__delete"
                >
                  Удалить
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Comments;