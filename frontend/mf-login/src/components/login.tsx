'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import PasswordStrengthBar from './password-strength-bar'
import TermsAndConditions from './terms-and-conditions'
import './login.css'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  const handleTermsAccept = (checked: boolean) => {
    setTermsAccepted(checked)
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <CardHeader>
          <CardTitle className="login-title">DeptMeeting</CardTitle>
          <CardDescription className="login-description">Inicia sesión o regístrate para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form className="login-form">
                <div className="login-input-group">
                  <Label htmlFor="email">Correo universitario</Label>
                  <Input id="email" placeholder="tu.correo@usach.cl" required type="email" />
                </div>
                <div className="login-input-group">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="password-input-wrapper">
                    <Input
                      id="password"
                      required
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="password-toggle-button"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <Button className="login-button" type="submit">
                  Iniciar sesión
                </Button>
              </form>
              <Button variant="outline" className="login-google-button">
                Iniciar sesión con Google
              </Button>
            </TabsContent>
            <TabsContent value="register">
              <form className="login-form">
                <div className="login-input-group">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input id="fullName" placeholder="Juan Pérez" required />
                </div>
                <div className="login-input-group">
                  <Label htmlFor="rut">RUT</Label>
                  <Input id="rut" placeholder="20058348-5" required />
                </div>
                <div className="login-input-group">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" placeholder="juan.perez@usach.cl" required type="email" />
                </div>
                <div className="login-input-group">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="password-input-wrapper">
                    <Input
                      id="password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="password-toggle-button"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <PasswordStrengthBar password={password} />
                </div>
                <div className="login-input-group">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
                <div className="terms-checkbox">
                  <Checkbox id="terms" checked={termsAccepted} onCheckedChange={handleTermsAccept} />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Acepto los{" "}
                    <button type="button" className="terms-link" onClick={() => setShowTerms(true)}>
                      términos y condiciones
                    </button>
                  </label>
                </div>
                <Button className="login-button" type="submit" disabled={!termsAccepted || password !== confirmPassword}>
                  Registrarse
                </Button>
              </form>
              <Button variant="outline" className="login-google-button">
                Registrarse con Google
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {showTerms && <TermsAndConditions onClose={() => setShowTerms(false)} onAccept={() => { setTermsAccepted(true); setShowTerms(false); }} />}
    </div>
  )
}

export default Login

