import React, { useState, useEffect } from 'react'
import Button from 'Components/atoms/button'
import Search from 'Components/atoms/search'
import ListItem from 'Components/atoms/listItem'
import CreateVaccineModal from 'Modals/createVaccine'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { truncate } from 'Util/helpers'
import { search } from 'fast-fuzzy'
import Loading from 'Components/atoms/loading'
import Modals from 'Util/modals'
import pagination from 'Util/hooks/pagination'
import StoreRedux from 'Redux/'
import PaginationComponent from 'Components/atoms/paginationComponent'
import Api from 'Util/api'

import './index.scss'

export default function Vaccines () {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation('Vaccines')
  const [originalData, setOriginalData] = useState([])
  const [adminVaccine, setAdminVaccine] = useState([])
  const { auth } = StoreRedux.getState()
  const admin = auth.intNivel === 2
  const history = useHistory()
  const [
    page,
    pages,
    list,
    setPage,
    setContent
  ] = pagination(5)

  const handleOnSearch = (query) => {
    if (!query) return setContent(originalData)
    if (query === null) return ''

    const res = search(query || '', originalData, { keySelector: (obj) => obj.strNome || '' })
    setContent(res)
  }

  const reorder = (data = []) => {
    const safeLow = (str = '') => {
      if (str === null) return ''
      return str.toLowerCase()
    }

    return data.sort((a, b) => {
      if (safeLow(a.strNome) < safeLow(b.strNome)) return -1
      if (safeLow(a.strNome) > safeLow(b.strNome)) return 1
      return 0
    })
  }

  useEffect((query) => {
    handleOnSearch(query)
  }, [])

  const fetchVaccine = async () => {
    setLoading(true)
    const res = await Api.Vaccine.list(1)
    setContent(reorder(res.vacinas))
    setOriginalData(res.vacinas)
    setLoading(false)
  }

  const fetchAdminVaccine = async () => {
    setLoading(true)
    const res = await Api.Vaccine.list(2)
    setAdminVaccine(res.vacinas)
    setLoading(false)
  }

  useEffect(() => {
    fetchVaccine()
    fetchAdminVaccine()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [pages])

  const redirect = (elm) => {
    history.push(`/user/vaccines/${elm.id}`)
  }

  const approveVaccine = (elm) => {
    const payload = {
      intStatus: 1
    }

    Modals.Generic.sucess({
      title: t('approve'),
      text: t('approve-text'),
      cancel: t('cancel'),
      continue: t('continue'),
      handleAction: async () => {
        setLoading(true)
        try {
          await Api.Vaccine.update(payload, elm)
        } catch (err) {
          console.log(err)
        }
        fetchVaccine()
        fetchAdminVaccine()
        setLoading(false)
      }
    })
  }

  const createVaccine = () => {
    Modals.Generic.show('create-vaccine')
  }

  const deleteVaccine = (elm) => {
    Modals.Generic.sucess({
      title: t('delete'),
      text: t('text'),
      cancel: t('cancel'),
      continue: t('continue'),
      handleAction: async () => {
        setLoading(true)
        try {
          await Api.Vaccine.delete(elm)
        } catch (err) {
          console.log(err)
        }
        fetchVaccine()
        fetchAdminVaccine()
        setLoading(false)
      }
    })
  }

  return (
    <div className='vaccines-content'>
      <h1 className='title'>{t('title')}</h1>

      <div className='vaccines-header'>
        <div className='search-container'>
          <Search
            placeholder={t('search')}
            onChange={handleOnSearch}
          />
        </div>

        <Button onClick={() => createVaccine()} type='primary'>{t('add')}</Button>
      </div>

      <Loading show={loading} />

      {admin && <h2 className='subtitle'>{t('analize')}</h2>}
      {admin && adminVaccine.map(elm =>
        <ListItem
          key={elm.id}
          onClick={() => redirect(elm)}
          name={elm.strNome}
          description={truncate(elm.strSobre, 70)}
          active={() => approveVaccine(elm.id)}
          delete={() => deleteVaccine(elm.id)}
        />
      )}

      {admin && <h2 className='subtitle'>{t('approved')}</h2>}
      {list.map(elm =>
        <ListItem
          key={elm.id}
          onClick={() => redirect(elm)}
          name={elm.strNome}
          description={truncate(elm.strSobre, 70)}
          delete={() => deleteVaccine(elm.id)}
        />
      )}
      <PaginationComponent
        total={pages}
        current={page}
        onChange={setPage}
      />
      <CreateVaccineModal onChange={fetchAdminVaccine} />
    </div>
  )
}
