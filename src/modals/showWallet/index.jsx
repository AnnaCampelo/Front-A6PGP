import React, { useState, useEffect } from 'react'
import Modal from 'Components/molecules/genericModal'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { path } from 'ramda'
import moment from 'moment'
import Api from 'Util/api'

import './index.scss'

const ShowWalletModal = () => {
  const modal = useSelector(({ modals }) => modals.generic)
  const [data, setData] = useState([])
  const [vaccines, setVaccines] = useState([])
  const [vaccinesScheduled, setVaccinesScheduled] = useState([])
  const { t } = useTranslation('Wallets')

  useEffect(() => {
    setData(path(['body', 'data'], modal))
  }, [modal])

  const fetchWalletVaccine = () => {
    Api.Wallet.getOne(path(['id'], data))
      .then((res) => {
        setVaccines(res.vacinas.filter(elm => elm.dtAplicacao))
        setVaccinesScheduled((res.vacinas.filter((elm) => elm.fkAgendamento)))
      })
  }

  console.log(vaccinesScheduled)

  useEffect(() => {
    fetchWalletVaccine()
  }, [data])

  return (
    <Modal id='show-wallet' height={400} width={432}>
      <div className='modal-container'>
        <h1 className='title-component'>{t('infos')}</h1>
        <div className='header'>
          <div className='content'>
            <div className='flex-content'>
              <p className='bold-text'>{t('name')}:</p>
              <p>{path(['strNome'], data)} {path(['strSobrenome'], data)}</p>
            </div>
            <div className='flex-content'>
              <p className='bold-text'>{t('birthday')}:</p>
              <p>{moment(path(['dtNascimento'], data)).format('DD/MM/YYYY')}</p>
            </div>
            <div className='flex-content'>
              <p className='bold-text'>{t('gender')}:</p>
              <p>{path(['charGenero'], data) === 'f' ? t('female') : t('male')}</p>
            </div>
          </div>
        </div>
        <div className='footer'>
          <div className='flex-content'>
            <p className='bold-text'>{t('cpf')}:</p>
            <p>{path(['strCpf'], data)}</p>
          </div>
          <div className='flex-content'>
            <p className='bold-text'>{t('address')}:</p>
            <p>{path(['strEndereco'], data)}</p>
          </div>
          <div className='flex-content'>
            <p className='bold-text'>{t('cep')}:</p>
            <p>{path(['strCep'], data)}</p>
          </div>
        </div>

        <div className='footer'>
          <h1 className='title-component'>{t('vaccines')}</h1>
          {(vaccines || []).map((elm) => {
            return (
              <div key={elm.id}>
                <div className='flex-content'>
                  <p className='bold-text'>{t('name')}:</p>
                  <p>{elm.vaccines.map(elm => elm.strNome)}</p>
                </div>
                <div className='flex-content-date'>
                  <p className='bold-text'>{t('application')}:</p>
                  <p>{moment(elm.dtAplicacao).format('DD/MM/YYYY')}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className='footer'>
          <h1 className='title-component'>{t('scheduling')}</h1>
          {(vaccinesScheduled || []).map((elm) => {
            return (
              <div key={elm.id}>
                <div className='flex-content'>
                  <p className='bold-text'>{t('name')}:</p>
                  <p>{elm.vaccines.map(elm => elm.strNome)}</p>
                </div>
                <div className='flex-content-date'>
                  <p className='bold-text'>{t('scheduling')}:</p>
                  <p>{moment(elm.agendamento.dtAgendamento).format('DD/MM/YYYY')}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}

export default ShowWalletModal