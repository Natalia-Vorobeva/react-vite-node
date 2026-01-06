import { useState, useEffect, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { onToggleReverse, setDataMessages, setNewMessages, setOldMessages, setStateBtnFilterFavourites, setLastId } from './store/api/apiSlice'
import { apiSelectors } from './store/api/apiSelectors'
import FormSearch from './components/FormSearch/FormSearch'
import Preloader from './components/Preloader/Preloader'
import RightColumn from './components/Columns/RigthColumn/RigthColumn'
import LeftColumn from './components/Columns/LeftColumn/LeftColumn'
import CentralColumn from './components/Columns/CentralColumn/CentralColumn'
import Popup from './components/Popup/Popup'
import './index.css'
import './App.scss'

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://a0830433.xsph.ru');

  const ref = useRef(null)
  const dispatch = useDispatch()
  const dataMessages = useSelector(apiSelectors.getDataMessages)
  const idLast = useSelector(apiSelectors.getIdLast)
  const isModal = useSelector(apiSelectors.getIsModal)
  const btnFilterFavourites = useSelector(apiSelectors.getBtnFilterFavourites)
  const isReverse = useSelector(apiSelectors.getIsReverse)
  const [isLoading, setIsLoading] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)
  const [oldMessagesLoaded, setOldMessagesLoaded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [activeTab, setActiveTab] = useState('central')

  useEffect(() => {
    const handleResize = (event) => {
      setWidth(event.target.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [width])

  // ВЫЧИСЛЯЕМ searchData при каждом изменении dataMessages
  const searchData = useMemo(() => {
    if (!searchValue.trim()) {
      return { leftCol: [], centralCol: [], rightCol: [] };
    }
    
    const left = dataMessages.leftCol.filter(el => 
      el.content.toLowerCase().includes(searchValue.toLowerCase())
    );
    const central = dataMessages.centralCol.filter(el => 
      el.content.toLowerCase().includes(searchValue.toLowerCase())
    );
    const right = dataMessages.rightCol.filter(el => 
      el.content.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    return { leftCol: left, centralCol: central, rightCol: right };
  }, [searchValue, dataMessages]);

  // ВЫЧИСЛЯЕМ searchLength при каждом изменении searchData
  const searchLength = useMemo(() => {
    if (!searchValue.trim()) return null;
    return Object.values(searchData).reduce((sum, val) => 
      sum + (Array.isArray(val) ? val.length : 0), 0
    );
  }, [searchValue, searchData]);

  const formData = new FormData()
  formData.append('actionName', 'MessagesLoad')
  formData.append('messageId', 0)
  const requestOptions = {
    method: 'POST',
    body: formData,
  }

  const formDataOldMessages = new FormData()
  formDataOldMessages.append('actionName', 'MessagesLoad')
  formDataOldMessages.append('oldMessages', true)
  const requestOptionsOldMessages = {
    method: 'POST',
    body: formDataOldMessages,
  }
  const formDataNewMessages = new FormData()
  formDataNewMessages.append('actionName', 'MessagesLoad')
  formDataNewMessages.append('messageId', idLast)
  const requestOptionsNewMessages = {
    method: 'POST',
    body: formDataNewMessages
  }

  useEffect(() => {
    fetch(`${API_BASE_URL}`, requestOptions)
      .then(response => response.json())
      .then(
        (result) => {
          setIsLoading(false)
          dispatch(setDataMessages(result.Messages))
        },
        (error) => {
          setIsLoading(true)
          console.error('%cDATA', 'color: purple', 'Ошибка при запросе:', error)
        }
      )
  }, [])
  
  // async function fetchAPIData() {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}`, requestOptionsNewMessages)
  //     if (!response.ok) throw new Error('Ошибка сети')
  //     const data = await response.json()
  //     if (typeof data !== 'string') {
  //       let arrModified = data.Messages.map(object => {
  //         let dateModified = object.date.replace(/ /g, 'T').concat("Z")
  //         return { ...object, date: dateModified }
  //       })
  //       let arr = [...dataMessages.centralCol, ...arrModified]
  //       arr.sort((a, b) => {
  //         return new Date(b.date) - new Date(a.date)
  //       })
  //       const ids = arr.map(object => object.id)
  //       let id = Math.max(...ids)
  //       dispatch(setLastId(id))
  //       dispatch(setNewMessages({ ...dataMessages, centralCol: arr }))
  //     } else {
  //       return
  //     }
  //   }
  //   catch (err) {
  //     console.log('Ошибка:', err)
  //   }
  // }

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetchAPIData(requestOptionsNewMessages)
  //   }, 5000)
  //   return () => clearInterval(intervalId)
  // }, [requestOptionsNewMessages])

  function handleLoadOldMessages() {
    fetch(`${API_BASE_URL}`, requestOptionsOldMessages)
      .then(response => response.json())
      .then(
        (result) => {
          setIsLoading(false)
          dispatch(setOldMessages(result.Messages))
          setOldMessagesLoaded(true) 
        },
        (error) => {
          setIsLoading(true)
          console.error('%cDATA', 'color: purple', 'Ошибка при запросе:', error)
        }
      )
  }

  const getColumnCounts = (column) => {
    const columnKey = `${column}Col`;
    const allMessages = dataMessages[columnKey] || [];

    if (searchValue) {
      const searchResults = allMessages.filter(el =>
        el.content.toLowerCase().includes(searchValue.toLowerCase())
      );
      const total = searchResults.length;
      const favorites = searchResults.filter(el => el.liked).length;
      return { total, favorites };
    }

    const total = allMessages.length;
    const favorites = allMessages.filter(el => el.liked).length;
    return { total, favorites };
  }

  function handleSearch(value) {
    setSearchValue(value);
    // searchData и searchLength теперь пересчитываются автоматически через useMemo
  }

  function handleClearSearch() {
    setSearchValue('');
    // searchData и searchLength теперь пересчитываются автоматически через useMemo
  }

  const getColumnMessageCount = (column, isFiltered = false) => {
    if (searchValue) {
      return searchData[`${column}Col`]?.length || 0
    }
    if (isFiltered && btnFilterFavourites) {
      return dataMessages[`${column}Col`]?.filter(el => el.liked)?.length || 0
    }
    return dataMessages[`${column}Col`]?.length || 0
  }

  return (
    <div className="app">
      {
        isModal && <Popup />
      }
      {isLoading ?
        <Preloader />
        :
        <div ref={ref} className="app__content">
          <div className="app__control-header">
            <div className="app__header-top">
              <h1 className="app__title">My <span className="app__title-span">♡</span> messenger</h1>
              <div className="app__search-container">
                <div className="app__search">
                  <FormSearch
                    onSubmit={handleSearch}
                    initialValue={searchValue}
                    onClear={handleClearSearch}
                  />
                </div>
                {searchLength !== null && (
                  <div className="app__search-info">• Найдено: {searchLength}
                  </div>
                )}
              </div>
            </div>
            <div className="app__header-bottom">
              <div className="app__header-content">
                <button
                  onClick={handleLoadOldMessages}
                  disabled={oldMessagesLoaded}
                  className={`app__button-load ${oldMessagesLoaded ? 'app__button-load_disabled' : ''}`}
                >
                  <span className="app__button-load-icon">↻</span>
                  <span className="app__button-load-text">
                    {oldMessagesLoaded ? 'Загружено' : 'Загрузить предыдущие'}
                  </span>
                </button>
                <div className="app__sort-buttons">
                  <button
                    onClick={() => dispatch(onToggleReverse(!isReverse))}
                    className="app__button-sort-toggle"
                    aria-label={isReverse ? "Показать новые сверху" : "Показать старые сверху"}
                    title={isReverse ? "Показать новые сверху" : "Показать старые сверху"}
                  >
                    <span className={`app__button-sort-icon ${isReverse ? 'app__button-sort-icon_reverse' : ''}`}>
                      ↕
                    </span>
                    <span className="app__button-sort-text">
                      {isReverse ? "Старые сверху" : "Новые сверху"}
                    </span>
                  </button>
                  <button
                    onClick={() => dispatch(setStateBtnFilterFavourites(!btnFilterFavourites))}
                    className="app__button-filter-toggle"
                    aria-label={btnFilterFavourites ? "Показать все сообщения" : "Показать избранное"}
                    title={btnFilterFavourites ? "Показать все сообщения" : "Показать избранное"}
                  >
                    <span className={`app__button-filter-icon ${!btnFilterFavourites ? 'app__button-filter-icon_active' : ''}`}>
                      {!btnFilterFavourites ? '★' : '☆'}
                    </span>
                    <span className="app__button-filter-text">
                      {!btnFilterFavourites ? "Избранное" : "Все"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {width <= 900 && (
            <div className="app__column-tabs">
              <button
                className={`app__column-tab ${activeTab === 'left' ? 'app__column-tab_active' : ''}`}
                onClick={() => setActiveTab('left')}
              >
                <span className="app__column-tab-name">Левая</span>
                <span className="app__column-tab-count">
                  ({getColumnCounts('left').favorites}/{getColumnCounts('left').total})
                </span>
              </button>
              <button
                className={`app__column-tab ${activeTab === 'central' ? 'app__column-tab_active' : ''}`}
                onClick={() => setActiveTab('central')}
              >
                <span className="app__column-tab-name">Центральная</span>
                <span className="app__column-tab-count">
                  ({getColumnCounts('central').favorites}/{getColumnCounts('central').total})
                </span>
              </button>
              <button
                className={`app__column-tab ${activeTab === 'right' ? 'app__column-tab_active' : ''}`}
                onClick={() => setActiveTab('right')}
              >
                <span className="app__column-tab-name">Правая</span>
                <span className="app__column-tab-count">
                  ({getColumnCounts('right').favorites}/{getColumnCounts('right').total})
                </span>
              </button>
            </div>
          )}

          <div className="app__columns">
            {width > 900 ? (
              <>
                <LeftColumn searchQuery={searchValue} searchResults={searchData.leftCol} />
                <CentralColumn searchQuery={searchValue} searchResults={searchData.centralCol} />
                <RightColumn searchQuery={searchValue} searchResults={searchData.rightCol} />
              </>
            ) : (
              <>
                {activeTab === 'left' && (
                  <LeftColumn searchQuery={searchValue} searchResults={searchData.leftCol} />
                )}
                {activeTab === 'central' && (
                  <CentralColumn searchQuery={searchValue} searchResults={searchData.centralCol} />
                )}
                {activeTab === 'right' && (
                  <RightColumn searchQuery={searchValue} searchResults={searchData.rightCol} />
                )}
              </>
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default App