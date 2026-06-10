'use client';

import React, { useEffect, useState } from 'react';
import Button from '../admin/components/Button';
import { useLogin } from '../admin/services/auth';import Storage from '../admin/utils/storageUtil';
import { Input } from '../admin/components/ui/input';
import { toast } from 'react-toastify';

 const LaginPage = ({handleClick}) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false)

  const {loginAsync, loginIsLoading, loginError} = useLogin(() => {
    Storage.setObject("email", credentials?.email);
    handleClick()
  })

  const login = async () => {
    await loginAsync(
      {
    "emailid" : credentials?.email,
    "password" : credentials?.password,
    "device" : "",
    "location" : {
        "ip":"49.43.155.130",
        "success":true,
        "type":"IPv4",
        "continent":"Asia",
        "continent_code":"AS",
        "country":"India",
        "country_code":"IN",
        "country_flag":"https://cdn.ipwhois.io/flags/in.svg",
        "country_capital":"New Delhi",
        "country_phone":"+91",
        "country_neighbours":"BD,BT,CN,MM,NP,PK",
        "region":"Uttarakhand",
        "city":"Haridwar",
        "latitude":29.9456906,
        "longitude":78.1642478,
        "asn":"AS55836",
        "org":"Reliance Jio Infocomm Limited",
        "isp":"Reliance Jio Infocomm Limited",
        "timezone":"Asia/Calcutta",
        "timezone_name":"IST",
        "timezone_dstOffset":0,
        "timezone_gmtOffset":19800,
        "timezone_gmt":"+05:30",
        "currency":"Indian Rupee",
        "currency_code":"INR",
        "currency_symbol":"₹",
        "currency_rates":88.758,
        "currency_plural":"Indian rupees"
    }
}
    )
    
    // AFTER SUCCESSFUL LOGIN - SHOW FULL DECRYPTED PROFILE
    setTimeout(async () => {
      console.log("\n\n=== 🚀 CALLING getFullUserProfile AFTER LOGIN ===\n");
      const { getFullUserProfile } = await import('../admin/services/auth');
      const fullProfile = await getFullUserProfile();
      console.log("\n\n=== 🎯 FINAL RETURNED PROFILE ===");
      console.log(JSON.stringify(fullProfile, null, 2));
      console.log("\n\n=== ✅ CHECK CONSOLE FOR COMPLETE DATA ===\n\n");
    }, 1000);
  }

   useEffect(() => {
      toast.error(loginError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    }, [loginError])
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 text-customBlack">
      <div className="w-full h-full max-w-lg space-y-6 lg:px-8">
        <div>
          <h2 className="text-3xl font-semibold">Sign In</h2>
          <p className="mt-1 text-sm text-grey">
            Kindly fill in your details to login to your dashboard
          </p>
        </div>

        <form className="space-y-5 text-customBlack">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              required
              value={credentials?.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              placeholder="Email Address"
              className={"h-12 mt-1 focus:border-2"}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <div className="relative mt-1">
               <Input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder='Password'
                value={credentials?.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className={"h-12 mt-1 focus:border-2"}
              />
              
              <div 
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-1 text-right">
              <a href="#" className="text-sm font-bold cursor-pointer">
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
         <Button 
            text="Sign In"
            handleClick={() => login()}
            disabled={!credentials?.email || !credentials?.password}
            loading={loginIsLoading}
        />
        </form>

        <p className="text-center text-sm text-grey">
          Do not have an account?{' '}
          <a onClick={() => handleClick && handleClick('/onboarding')} className="font-bold text-blue cursor-pointer">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}

export default LaginPage;
