'use client';

import { JSX, useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

// Define the type for each switch option
interface SwitchOption {
    name: string;
    value: string;
    iconSvg: JSX.Element;
}

// Define the data with type annotations
// prettier-ignore
const SWITCH_DATA: SwitchOption[] = [
    {
        name: 'System',
        value: 'system',
        iconSvg: (<svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M1 2h22v8.25h-2V4H3v12h8.5v2H1zm2 18h8.5v2H3z"></path><path fill="currentColor" d="M19.5 12v1.376c.715.184 1.352.56 1.854 1.072l1.193-.689l1 1.732l-1.192.688a4 4 0 0 1 0 2.142l1.192.688l-1 1.732l-1.193-.689a4 4 0 0 1-1.854 1.072V22.5h-2v-1.376a4 4 0 0 1-1.854-1.072l-1.193.689l-1-1.732l1.192-.688a4 4 0 0 1 0-2.142l-1.192-.688l1-1.732l1.193.688a4 4 0 0 1 1.854-1.071V12zm-2.751 4.283a2 2 0 0 0-.25.967c0 .35.091.68.25.967l.036.063a2 2 0 0 0 3.43 0l.036-.063c.159-.287.249-.616.249-.967c0-.35-.09-.68-.249-.967l-.036-.063a2 2 0 0 0-3.43 0z"></path></svg>),
    },
    {
        name: 'Light',
        value: 'light',
        iconSvg: (<svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"></path></svg>),
    },
    {
        name: 'Dark',
        value: 'dark',
        iconSvg: (<svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"></path></svg>),
    },
];

const ThemeSwitch: React.FC = () => {
    const { theme, setTheme } = useTheme();

    // State to manage the component mount status
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <div className='w-fit'>
            <div className='flex w-auto flex-row justify-center overflow-hidden rounded-3xl border border-neutral-200 sm:flex-row dark:border-neutral-700'>
                {SWITCH_DATA.map((data) => (
                    <button
                        key={data.value}
                        className={`flex items-center gap-2 px-4 py-2 text-black hover:cursor-pointer dark:text-white ${
                            theme === data.value && mounted
                                ? 'bg-neutral-200 dark:bg-neutral-700'
                                : 'bg-transparent hover:bg-neutral-200/30'
                        } dark:hover:bg-neutral-800`}
                        onClick={() => {
                            console.log('Theme:', data.value);
                            setTheme(data.value);
                        }}>
                        {data.iconSvg}
                        <h3 className='hidden sm:block'>{data.name}</h3>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThemeSwitch;
