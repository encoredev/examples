'use client';

import { usePathname } from 'next/navigation';

import { SignedOut, UserButton } from '@clerk/nextjs';

import NavigationLinks from './navigation-links';
import ThemeSwitch from './theme-switch';

const NavigationBar = () => {
    const pathname = usePathname();
    return (
        <div
            className={`${pathname.includes('signin') ? 'hidden' : ''} mx-auto mt-3 flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-6 px-3 sm:flex-row sm:px-0 lg:mt-6`}>
            <NavigationLinks />
            <div className='flex w-full justify-between gap-6 sm:w-auto sm:items-center'>
                <ThemeSwitch />
                <UserButton />
                <SignedOut>
                    <a href='/signin' className='btn btn-primary'>
                        Sign in
                    </a>
                </SignedOut>
            </div>
        </div>
    );
};

export default NavigationBar;
