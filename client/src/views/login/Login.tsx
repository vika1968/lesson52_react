import React from "react";
import { useState } from "react";
import axios from "axios";//npm i axios 

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  async function handleSubmit(ev: any) {
    try {
      ev.preventDefault(); 
      //.post("http://localhost:8000/api/users/login"  //polniy put;  8000 - eto to, chto v env napisano  ,  /api/users - eto vzyali iz index.ts. React - port 3000, server - port 8000
    //  <Route path="/login" element={<Login />} />  --is App.tsx vzyali /login

      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  //---------proxy----------------
//   v packet json v client : 

// Esli ya ispol'zuyu tol'ko svoy API  i na svoem servere i ne ispol'zuyu API hizonim : 

// posle strochki private : 


// {
//   "name": "client",
//   "version": "0.1.0",
//   "private": true,

//   "proxy": "http://localhost:8000",  // togda react znaet , chto kagdiy put' nachnimaetsya imenno tak


//   "dependencies": {
//   "@testing-library/jest-dom": "^5.16.5",
//   "@testing-library/react": "^13.4.0",

// poetomu poluchilas' eta stroka . Mi otrezali : http://localhost:8000   ===> const { data } = await axios.post("/api/users/login", 


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={email}//eto dopisivaem, chtobi ne bilo delay
          type="email"
          placeholder="email"
          required
          onInput={(ev: any) => {setEmail(ev.target.value)}}
        />
        <input
          value={password}//eto dopisivaem, chtobi ne bilo delay
          type="password"
          placeholder="password"
          required
          onInput={(ev: any) => {setPassword(ev.target.value)}}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
