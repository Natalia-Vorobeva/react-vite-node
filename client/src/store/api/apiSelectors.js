const getIdLast = state => state.api.idLast
const getDataMessages = state => state.api.dataMessages
const getIsModal = state => state.api.isModal
const getBtnFilterFavourites = state => state.api.btnFilterFavourites
const getChoice = state => state.api.choice
const getIsReverse = state => state.api.isReverse

export const apiSelectors = {
	getIdLast,
	getDataMessages,
	getIsModal,
	getBtnFilterFavourites,
	getChoice,
	getIsReverse	
}