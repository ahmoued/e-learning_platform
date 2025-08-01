import './LoginPage.css' 
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  



    const handleLogin = async (e: React.MouseEvent)=>{
      e.preventDefault()
      const response = await supabase.auth.signInWithPassword({email, password})
      const data = response.data;
      const error = response.error;
      if(error) setError(error.message)
        else{
      navigate('/dashboard')}
    }

  return (
    <MDBContainer className="my-5 gradient-form">

      <MDBRow>

        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">

            <div className="text-center">
              <img src="Login.webp"
                style={{width: '185px'}} alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">Welcome to the e-learning app</h4>
            </div>

            <p>Please login to your account</p>
            {error && <div className="text-danger mb-3">{error}</div>}



            <MDBInput wrapperClass='mb-4' value={email} onChange={(e)=>setEmail(e.target.value)} label='Email address' id='form1' type='email'/>
            <MDBInput wrapperClass='mb-4' value = {password} onChange={(e)=>setPassword(e.target.value)} label='Password' id='form2' type='password'/>


            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={handleLogin}>Sign in</MDBBtn>
              <a className="text-muted" href="#!">Forgot password?</a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <MDBBtn onClick={()=>navigate('/signup')}outline className='mx-2' color='danger'>
                sign up
              </MDBBtn>
            </div>

          </div>

        </MDBCol>

        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">

            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">We are more than just an app</h4>
              <p className="small mb-0">We make it easier for people from different regions and countries to study in the same environment. Our e-learning app is the best option for all institutions.
              </p>
            </div>

          </div>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
}