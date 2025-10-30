import { createSlice } from '@reduxjs/toolkit'

export const apiSlice = createSlice({
	name: 'api',
	initialState: {
		idLast: null,
		isModal: false,
		dataMessages: {
			leftCol: [],
			centralCol: [],
			rightCol: [],
		},
		btnFilterFavourites: true,
		isReverse: false,
		isSearched: false,
		choice: {}
	},

	reducers: {
		setLastId: (state, action) => {
			state.id = action.payload
		},
		setChoice: (state, action) => {
			state.choice = action.payload
		},
		setStateBtnFilterFavourites: (state, action) => {
			state.btnFilterFavourites = action.payload
		},

		setIsModal: (state, action) => {
			state.isModal = action.payload
		},

		setDataMessages: (state, action) => {
			// модификация даты и сортировка массива по дате
			let arrModified = action.payload.map(object => {
				const dateModified = object.date.replace(/ /g, 'T').concat("Z")
				return { ...object, date: dateModified }
			})
			arrModified.sort((a, b) => {
				return new Date(b.date) - new Date(a.date)
			})
			const ids = arrModified.map(object => object.id)
			let id = Math.max(...ids)
			// получаем самое большое id 
			state.idLast = id
			state.dataMessages.centralCol = arrModified

		},

		setNewMessages: (state, action) => {			
			state.dataMessages = action.payload
		},

		setOldMessages: (state, action) => {
			const initialArr = state.dataMessages.centralCol
			let arr = initialArr.concat(action.payload)
			let arrModified = arr.map(object => {
				const dateModified = object.date.replace(/ /g, 'T').concat("Z")
				return { ...object, date: dateModified }
			})
			arrModified.sort((a, b) => {
				return new Date(b.date) - new Date(a.date)
			})
			state.dataMessages.centralCol = arrModified
		},
		
		handleButton: (state, action) => {
			const payload = action.payload
			const filterData = (data) => data.filter((element) => JSON.stringify(element) !== JSON.stringify(action.payload.object))

			if (payload.column == "central") {
				if (payload.buttonName == "left") {
					const newArr = [payload.object, ...state.dataMessages.leftCol]
					let arr = newArr.sort((a, b) => {
						return new Date(b.date) - new Date(a.date)
					})
					state.dataMessages.leftCol = arr
				}
				if (payload.buttonName == "right") {
					const newArr = [payload.object, ...state.dataMessages.rightCol]
					let arr = newArr.sort((a, b) => {
						return new Date(b.date) - new Date(a.date)
					})
					state.dataMessages.rightCol = arr
				}
				state.dataMessages = { ...state.dataMessages, centralCol: filterData(state.dataMessages.centralCol) }
			} else if (payload.column == "right") {
				if (payload.buttonName == "left") {
					const newArr = [payload.object, ...state.dataMessages.leftCol]
					let arr = newArr.sort((a, b) => {
						return new Date(b.date) - new Date(a.date)
					})
					state.dataMessages.leftCol = arr
				}
				if (payload.buttonName == "central") {
					const newArr = [payload.object, ...state.dataMessages.centralCol]
					let arr = newArr.sort((a, b) => {
						return new Date(b.date) - new Date(a.date)
					})
					state.dataMessages.centralCol = arr
				}
				state.dataMessages = { ...state.dataMessages, rightCol: filterData(state.dataMessages.rightCol) }
			} else if (payload.column == "left") {
				if (payload.buttonName == "right") {
					const newArr = [payload.object, ...state.dataMessages.rightCol]
					let arr = newArr.sort((a, b) => {
						return new Date(b.date) - new Date(a.date)
					})
					state.dataMessages.rightCol = arr
				}
				if (payload.buttonName == "central") {
					const newArr = [payload.object, ...state.dataMessages.centralCol]
					let arr = newArr.sort((a, b) => {
						return new Date(b.date) - new Date(a.date)
					})
					state.dataMessages.centralCol = arr
				}
				state.dataMessages = { ...state.dataMessages, leftCol: filterData(state.dataMessages.leftCol) }
			}
		},

		handleDeleteCard: (state, action) => {
			const payload = action.payload
			const filterData = (data) => data.filter(
				(element) => JSON.stringify(element) !== JSON.stringify(action.payload.object))
			if (payload.column == "central") {
				state.dataMessages = { ...state.dataMessages, centralCol: filterData(state.dataMessages.centralCol) }
			} else if (payload.column == "right") {
				state.dataMessages = { ...state.dataMessages, rightCol: filterData(state.dataMessages.rightCol) }
			} else if (payload.column == "left") {
				state.dataMessages = { ...state.dataMessages, leftCol: filterData(state.dataMessages.leftCol) }
			}
		},

		handleAddingFavourires: (state, action) => {
			let payload = action.payload
			state.dataMessages = payload
		},

		onToggleReverse: (state, action) => {
			state.isReverse = action.payload
			const reverseLeft = state.dataMessages.leftCol.reverse()
			const reverseCentral = state.dataMessages.centralCol.reverse()
			const reverseRight = state.dataMessages.rightCol.reverse()
			state.dataMessages = {
				leftCol: reverseLeft,
				centralCol: reverseCentral,
				rightCol: reverseRight,
			}
		}
	}
})

export const {
	setLastId,
	setIsModal,
	setDataMessages,
	setNewMessages,
	setOldMessages,
	handleButton,
	handleDeleteCard,
	handleAddingFavourires,
	setStateBtnFilterFavourites,
	setChoice,
	onToggleReverse } = apiSlice.actions

export default apiSlice.reducer