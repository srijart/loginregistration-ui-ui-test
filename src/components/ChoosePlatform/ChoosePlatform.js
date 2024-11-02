import React from 'react'
import './ChoosePlatform.css'
import { useTranslation } from 'react-i18next'

const ChoosePlatform = () => {

  const {t}= useTranslation();
  return (
    <div className='CP-Container'>
    <h1 className='CP-Heading'>{t("ChoosePlatform")} </h1>
 </div>
  )
}

export default ChoosePlatform