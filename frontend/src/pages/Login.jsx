import * as React from 'react';

export default function Login(){
    return (
        <div className='bg-white px-10 py-20 '>
            <h1 className='text-7xl'>Hola!</h1>
            <h3 className='text-3xl font-semibold mt-9'>Welcome!</h3>
            <p className='font-medium text-lg text-gray-500 mt-4'>Please enter your details.</p>
            <div className='mt-8'>
                <div >
                    <label className='text-lg'>Email</label>
                    <input
                    className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                    placeholder='Enter your email'
                    />
                </div>
                <div >
                    <label className='text-lg'>Password</label>
                    <input
                    className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                    placeholder='Enter password'
                    />
                </div>
                <div className='mt-8 justify-between items-center'>
                    <div>
                        <input
                        type='checkbox'
                        id='remember'/>
                        <label className='ml-2 font-medium text-base' for="remember">Remember for 30 days</label>
                    </div>
                    <button className='font-medium text-base text-violet-500'>Forgot password?</button>
                </div>
                <div className='mt-8 flex flex-col gap-y-4'>
                    <button className='active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-violet-500 text-white text-lg font-bold'>Sign In</button>
                    <button className='flex rounded-xl py-3 border-2 border-gray-100 items-center justify-center gap-2 active:scale-[.98] active:duration-75 transition-all'>
                        <svg width="24" height="24" viewBox='0 0 24 24' fill='none' xmlns=''>
                            
                        </svg>
                        Sign in with Google
                        </button>
                </div>
                <div className='mt-8 flex justify-center items-center'>
                    <p className='font-medium text-base'>Don't have an account?</p>
                    <button className='text-violet-500 text-base font-medium ml-2'>Sign Up</button>
                </div>
            </div>
        </div>
    )
}