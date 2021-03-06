import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import './index.scss'

const Wallet = (props) => {
  const { t } = useTranslation('Wallets')

  const text = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  }

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={text}
      className='wallet-component-container'
    >
      <i className='icon-trash' onClick={props.delete} />
      <i className='icon-edit' onClick={props.edit} />
      <div className='header'>
        <div className='content'>
          <div className='flex-content'>
            <p className='bold-text'>{t('name')}:</p>
            <p>{props.name}</p>
          </div>
          <div className='flex-content'>
            <p className='bold-text'>{t('birthday')}:</p>
            <p>{props.date}</p>
          </div>
          <div className='flex-content'>
            <p className='bold-text'>{t('gender')}:</p>
            <p>{props.gender}</p>
          </div>
        </div>
      </div>
      <div className='footer'>
        <div className='flex-content-buttons'>
          <p onClick={props.watch}>{t('view')}</p>
          <p onClick={props.add}>{t('add')}</p>
        </div>
      </div>
    </motion.div>
  )
}

Wallet.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  date: PropTypes.string,
  gender: PropTypes.string,
  field: PropTypes.string,
  edit: PropTypes.func,
  add: PropTypes.func,
  watch: PropTypes.func,
  delete: PropTypes.func
}

export default Wallet
