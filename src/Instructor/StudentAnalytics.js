import React from 'react'
import { useTranslation } from 'react-i18next';

const StudentAnalytics = () => {
  const { t } = useTranslation();
  return (
    <div>{t("StudentAnalytics")}</div>
  )
}

export default StudentAnalytics