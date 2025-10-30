import { useState } from 'react';
import Form from '../Form/Form';
import './FormSearch.scss';

function FormSearch({ onSubmit, handleFocus }) {

	const [value, setValue] = useState('')

	const handleChangeTextSearch = (e) => setValue(e.target.value)

	function handleSubmit(e) {
		e.preventDefault()
		onSubmit(value)
		setValue('')
	}

	return (
		<Form name="search" onSubmit={(e) => handleSubmit(e)}>
			<input
				id="search-input" type="search"
				className="form-search__input"
				placeholder="Поиск по сайту..."
				value={value}
				onFocus={handleFocus}
				onInput={(e) => handleChangeTextSearch(e)} />
			<button className="form-search__submit">
				<span className="form-search__send">
					<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="send_comment" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="send_24__send_24"><path id="send_24__Rectangle-76" d="M0 0h24v24H0z"></path><path d="M5.74 15.75a39.14 39.14 0 0 0-1.3 3.91c-.55 2.37-.95 2.9 1.11 1.78 2.07-1.13 12.05-6.69 14.28-7.92 2.9-1.61 2.94-1.49-.16-3.2C17.31 9.02 7.44 3.6 5.55 2.54c-1.89-1.07-1.66-.6-1.1 1.77.17.76.61 2.08 1.3 3.94a4 4 0 0 0 3 2.54l5.76 1.11a.1.1 0 0 1 0 .2L8.73 13.2a4 4 0 0 0-3 2.54Z" id="send_24__Mask" fill="white"></path></g></g></svg>
				</span>
			</button>
		</Form>
	)
}

export default FormSearch