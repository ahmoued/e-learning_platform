import React, { useState, type FormEvent } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
}
from 'mdb-react-ui-kit';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()


    const handleSignup = async (e: FormEvent)=>{
    e.preventDefault()
    const {data, error} = await supabase.auth.signUp({email, password})
    if (error) setError(error.message)
        else {
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

            <p>Please sign up</p>
            {error && <div className="text-danger mb-3">{error}</div>}

            <form onSubmit={handleSignup}>
            <MDBInput value = {email} onChange ={(e)=>setEmail(e.target.value)} wrapperClass='mb-4' label='Email address' id='form1' type='email'/>
            <MDBInput value = {password} onChange ={(e)=>setPassword(e.target.value)} wrapperClass='mb-4' label='Password' id='form2' type='password'/>


            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn type='submit' className="mb-4 w-100 gradient-custom-2">Sign up</MDBBtn>
              <a className="text-muted" href="#!">Forgot password?</a>
            </div>
            </form>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Already have an account ?</p>
              <MDBBtn onClick={()=> navigate('/login')} outline className='mx-2' color='danger'>
                login
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

export default SignupPage;