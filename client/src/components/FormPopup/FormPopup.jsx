import { useState } from 'react';
import Form from '../Form/Form';
import avatar from '../../assets/images/avatar.png'
import './FormPopup.scss';

function FormPopup({ onSubmit }) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    onSubmit(e, comment.trim());
    setComment('');
    
    // Сбросить состояние отправки после небольшой задержки
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };
  
  const characterCount = comment.length;
  const characterLimit = 500;
  const isNearLimit = characterCount > characterLimit * 0.8;
  const isOverLimit = characterCount > characterLimit;


	return (
		<Form name="comment" onSubmit={handleSubmit} >
			<div style={{ flex: 1, width: '100%' }}>
        <textarea
          className="comment__textarea"
          value={comment}
          onChange={(e) => {
            if (e.target.value.length <= characterLimit) {
              setComment(e.target.value);
            }
          }}
          placeholder="Напишите ваш комментарий..."
          rows="3"
          disabled={isSubmitting}
        />
        <span className={`comment__counter ${
          isOverLimit ? 'comment__counter_error' : 
          isNearLimit ? 'comment__counter_warning' : ''
        }`}>
          {characterCount}/{characterLimit}
        </span>
      </div>
      <button
        type="submit"
        className="comment__submit"
        disabled={!comment.trim() || isSubmitting || isOverLimit}
      >
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </button>
		</Form>
	)
}

export default FormPopup