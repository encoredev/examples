import { SignIn } from '@clerk/nextjs';

import CookieConsent from '../../../components/CookieConsent';

export default function Signin() {
    return (
        <div className='flex h-screen w-full items-center justify-center'>
            <div className='grid h-full w-full grid-cols-2'>
                <div className='col-span-1 flex items-center justify-center'>
                    <SignIn />
                </div>
                <div className='h-full w-full overflow-hidden'>
                    <img
                        src='https://intellioptima.eu-central-1.linodeobjects.com/f7584093-db34-4886-9908-f375e3137354.jpg'
                        alt='Image'
                        className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
                    />
                </div>
            </div>
            <CookieConsent />
        </div>
    );
}
