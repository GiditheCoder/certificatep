import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import SignUp from './components/SignUp'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import Dashboard from './components/Dashboard'
import Application from './components/Application'
import Successful from './components/Successful.jsx'
import ResetPassword from './components/ResetPassword'
import Role from './components/Role'
import OfficialLogin from './components/OfficialLogin'
import OfficialSignUp from './components/OfficialSignUp'
import VerifyEmail from './components/VerifyEmail'
import RequestEmailVerification from './components/RequestEmailVerification'
import OfficialScreen from './components/OfficialScreen.jsx'
import OfficialChangePassword from './components/OfficialChangePassword.jsx'
import OfficialForgotPassword from './components/OfficialForgotPassword.jsx'
import OfficialResetPassword from './components/OfficialResetPassword.jsx'
import OfficialResendOtp from './components/OfficialResendOtp.jsx'
import { UserProvider } from './context/UserContext.jsx'
import ApproveApplications from './components/ApproveApplications.jsx'
import ApprovedCertificate from "./components/ApprovedCertificate";
import VerifyCertificate from './components/VerifyCertificate.jsx'
import RequestVerificationCode from './components/RequestVerificationCode.jsx'
import CertificateConfirmation from './components/CertificateConfirmation.jsx'
import CertificateRequest from './components/CertificateRequest.jsx'
import PublicCertificate from './components/PublicCertificate.jsx'
import './index.css'

const App = () => {
  return (
     <UserProvider>
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />
        {/* Signup page */}
        <Route path="/signup" element={<SignUp />} />
        {/* Login page */}
        <Route path="/login" element={<Login />} />
        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Application page */}
        <Route path="/application" element={<Application />} />
        {/* Successful payment page */}
        <Route path="/successful" element={<Successful />} />
         {/* Reset Password */}
        <Route path="/resetpassword" element={<ResetPassword />} />
        {/* Role Selection */}
        <Route path="/role" element={<Role />} />
        {/* Official Register */}
        <Route path='/official' element={<OfficialLogin/>} />
        {/* Official SignUp */}
        <Route path='/officialsignup' element={<OfficialSignUp />} />
           {/* Verify email route */}
       <Route path='/verify-email' element={<VerifyEmail />} />
       {/* Verify email after login */}
         <Route path='/request-email-verify' element={<RequestEmailVerification/>} />
          <Route path="/certificate-request" element={<CertificateRequest />} />
         {/* Route to the admin screen */}
           <Route path='/officialscreen' element={<OfficialScreen/>} />
           {/* Route for Official Admin */}
            <Route path='/officialchangepassword' element={<OfficialChangePassword/>} />
           <Route path='/officialforgotpassword' element={<OfficialForgotPassword />} />
             <Route path='/officialresendotp' element={<OfficialResendOtp/>} />
             <Route path='/officialresetpassword' element={<OfficialResetPassword/>} />
            <Route path='/approveapplications' element={<ApproveApplications/>} />
            <Route path="/certificate/:id" element={<ApprovedCertificate />} />
            <Route path="/certificate-verify" element={<VerifyCertificate />} />
            <Route path="/certificate-confirmation/:ref" element={<CertificateConfirmation />} />
            <Route path="/public-certificate/:id" element={<PublicCertificate />} />

      </Routes>
       
    </Router>
    </UserProvider>
  )
}

export default App
