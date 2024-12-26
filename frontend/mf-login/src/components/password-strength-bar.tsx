import React from 'react'
import './password-strength-bar.css'

interface PasswordStrengthBarProps {
  password: string
}

const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password }) => {
  const getPasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]+/)) strength++
    if (password.match(/[A-Z]+/)) strength++
    if (password.match(/[0-9]+/)) strength++
    if (password.match(/[$@#&!]+/)) strength++
    return strength
  }

  const strength = getPasswordStrength(password)

  const getColor = () => {
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="password-strength-bar">
      <div className="password-strength-bar-bg">
        <div
          className={`password-strength-bar-fill ${getColor()}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <p className="password-strength-text">
        {strength <= 2 && 'Débil'}
        {strength > 2 && strength <= 4 && 'Media'}
        {strength > 4 && 'Fuerte'}
      </p>
    </div>
  )
}

export default PasswordStrengthBar

