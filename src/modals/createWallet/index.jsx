import React, { useState } from 'react'
import Button from 'Components/atoms/button'
import Input from 'Components/atoms/input'
import { FormValidator, validator } from 'Util/validator'
import Modal from 'Components/molecules/genericModal'
import Modals from 'Util/modals'
import Api from 'Util/api'
import PropTypes from 'prop-types'
import StoreRedux from 'Redux/'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import Select from 'Components/atoms/select'
import Loading from 'Components/atoms/loading'

const CreateWalletModal = (props) => {
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [gender, setGender] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState('')
  const { t } = useTranslation('Wallets')
  const { auth } = StoreRedux.getState()

  const formValidator = new FormValidator([
    {
      field: 'name',
      method: validator.isEmpty,
      validWhen: false,
      message: t('empty-name')
    },
    {
      field: 'surname',
      method: validator.isEmpty,
      validWhen: false,
      message: t('empty-surname')
    },
    {
      field: 'date',
      method: validator.isEmpty,
      validWhen: false,
      message: t('empty-date')
    },
    {
      field: 'gender',
      method: validator.isEmpty,
      validWhen: false,
      message: 'empty-gender'
    }
  ])

  const submit = async () => {
    const validation = formValidator.validate({
      name,
      surname,
      gender,
      date
    })
    setErrors(validation)

    if (validation.isValid) {
      const payload = {}
      payload.strNome = name
      payload.fkUser = auth.id
      payload.strSobrenome = surname
      payload.charGenero = gender.value
      payload.dtNascimento = date
      payload.boolAtivo = 1
      moment(date).format('YYYY-MM-DD')

      setLoading(true)
      try {
        await Api.Persona.post(payload)
        props.onChange()

        Modals.Generic.sucess({
          title: t('create-wallet'),
          text: t('create-wallet-text'),
          continue: 'OK',
          handleAction: () => Modals.Generic.hide()
        })
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }
  }

  const options = [
    { value: 'f', label: 'F' },
    { value: 'm', label: 'M' }
  ]

  return (
    <Modal id='create-wallet' height={400} width={532}>
      <Loading show={loading} />
      <div className='modal-container'>
        <h2 className='title'>{t('create-wallet')}</h2>

        <Input
          label={t('name')}
          onChange={setName}
          value={name}
          placeholder={t('type-name')}
          validator={errors.name}
        />
        <Input
          label={t('surname')}
          onChange={setSurname}
          value={surname}
          placeholder={t('type-surname')}
          validator={errors.surname}
        />
        <Select
          label={t('gender')}
          onChange={setGender}
          value={gender}
          options={options}
          placeholder={t('type-gender')}
          validator={errors.gender}
        />
        <Input
          label={t('date')}
          onChange={setDate}
          value={date}
          mask='99/99/9999'
          placeholder={t('type-date')}
          validator={errors.date}
        />
        <Button onClick={() => submit()}>{t('send')}</Button>
      </div>
    </Modal>
  )
}

CreateWalletModal.propTypes = {
  onChange: PropTypes.func
}

export default CreateWalletModal
