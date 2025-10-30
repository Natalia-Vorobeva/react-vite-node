import './Form.scss'

function Form({ onSubmit, children, name }) {

	return (
		<form
			action="#"
			className="form"
			name={name}
			onSubmit={onSubmit}
		>
			{
				children
			}
		</form>
	)
}

export default Form
