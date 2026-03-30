import React from 'react'
import Badge from '../common/Badge'

function calcAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

const BLOOD_TYPE_COLORS = {
  'A+': 'danger', 'A-': 'danger',
  'B+': 'warning', 'B-': 'warning',
  'AB+': 'primary', 'AB-': 'primary',
  'O+': 'success', 'O-': 'success',
}

const GENDER_LABELS = {
  male: 'Masculino', female: 'Femenino', other: 'Otro', M: 'Masculino', F: 'Femenino'
}

export default function PatientHeader({ patient }) {
  if (!patient) return null

  const initials = `${patient.first_name?.[0] || ''}${patient.last_name?.[0] || ''}`.toUpperCase()
  const age = calcAge(patient.date_of_birth)
  const bloodVariant = BLOOD_TYPE_COLORS[patient.blood_type] || 'neutral'
  const genderLabel = GENDER_LABELS[patient.gender] || patient.gender || ''

  return (
    <div className="patient-header">
      <div className="patient-avatar">{initials}</div>
      <div className="patient-header-info">
        <h2 className="patient-header-name">
          {patient.first_name} {patient.last_name}
        </h2>
        <div className="patient-header-meta">
          {age !== null && (
            <span className="patient-header-age">{age} años</span>
          )}
          {genderLabel && (
            <Badge variant="neutral">{genderLabel}</Badge>
          )}
          {patient.blood_type && (
            <Badge variant={bloodVariant}>{patient.blood_type}</Badge>
          )}
        </div>
      </div>
    </div>
  )
}
