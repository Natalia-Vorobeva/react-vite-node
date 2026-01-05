import { useState, useEffect } from 'react';
import Form from '../Form/Form';
import './FormPopup.scss';

function FormPopup({ onSubmit }) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Автофокус на textarea при монтировании
  useEffect(() => {
    const textarea = document.querySelector('.comment__textarea');
    if (textarea) {
      textarea.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    onSubmit(e, comment.trim());
    setComment('');
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSubmitting) {
      e.preventDefault();
      
      if (characterCount <= characterLimit && comment.trim()) {
        handleSubmit(e);
      }
    }
  };
  
  const characterCount = comment.length;
  const characterLimit = 500;
  const isNearLimit = characterCount > characterLimit * 0.8;
  const isOverLimit = characterCount > characterLimit;

	return (
		<Form name="comment" onSubmit={handleSubmit}>
			
			<div className="comment__flex" >
        <textarea
				name="textarea"
          className="comment__textarea"
          value={comment}
          onChange={(e) => {
            if (e.target.value.length <= characterLimit) {
              setComment(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
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
      <button
        type="submit"
        className="comment__submit"
        disabled={!comment.trim() || isSubmitting || isOverLimit}
      >
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </button>
      </div>
		</Form>
	)
}

export default FormPopup;