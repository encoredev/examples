import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { EncoreLogo } from '@/components/ui/icons/encore-logo';
import { cn } from '@/lib/utils';

import { DrizzleLogo } from '../components/ui/icons/drizzle-logo';
import { NextjsLogo } from '../components/ui/icons/nextjs-logo';
import { ShadcnLogo } from '../components/ui/icons/shadcn-logo';
import { StripeLogo } from '../components/ui/icons/stripe-logo';
import { ExternalLink, Rocket } from 'lucide-react';

export default function Home() {
    return (
        <section className='mt-16 flex flex-col items-center justify-center py-32'>
            <div
                className='absolute inset-x-0 top-[65px] flex h-[calc(100%-65px)] w-full items-center justify-center opacity-100'
                style={{ zIndex: -1 }}>
                <img
                    src='https://shadcnblocks.com/images/block/hero12/background.svg'
                    className='h-full min-h-full w-full min-w-full object-cover [mask-image:radial-gradient(ellipse_at_center,white,transparent)]'
                />
            </div>
            <div className='relative z-10 container'>
                <div className='mx-auto flex max-w-5xl flex-col items-center'>
                    <div className='flex flex-col items-center gap-6 text-center'>
                        <div className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6'>
                            <EncoreLogo className='h-10 sm:h-16 md:mr-2 md:h-16 lg:h-20' />
                            <div className='relative flex items-center justify-center'>
                                <img
                                    src='./x.svg'
                                    alt='logo'
                                    className='h-8 scale-150 transform sm:h-10 md:h-12 md:scale-175 lg:h-16 lg:scale-200'
                                />
                            </div>
                            <NextjsLogo className='h-8 sm:h-10 md:h-12 lg:h-16' />
                        </div>
                        <Badge className='mt-4' variant='outline'>
                            Ship Faster. Scale Confidently.
                        </Badge>
                        <div>
                            <h1 className='mb-10 text-2xl font-bold text-pretty lg:text-5xl'>
                                Build <span className='text-primary'>Type-Safe</span> Full-Stack Apps Faster
                            </h1>
                            <p className='text-muted-foreground lg:text-xl'>
                                Combine Encore's powerful backend framework with Next.js to create secure, scalable
                                applications with 70% less code.
                            </p>
                        </div>
                        <div className='mt-4 flex flex-col justify-center gap-2 lg:flex-row'>
                            <Link href='https://encore.dev/docs/ts' target='_blank' rel='noopener noreferrer'>
                                <Button className='hover:cursor-pointer'>
                                    <Rocket className='mr-2 h-4 w-4' />
                                    Start Building with Encore
                                </Button>
                            </Link>
                        </div>
                        <div className='mt-20 flex flex-col items-center gap-4'>
                            <p className='text-muted-foreground text-center'>
                                Powered by industry-leading technologies
                            </p>
                            <div className='flex flex-wrap items-center justify-center gap-4'>
                                <Link
                                    href='https://tailwindcss.com'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className={cn(buttonVariants({ variant: 'outline' }), 'group px-3')}>
                                    <img
                                        src='https://shadcnblocks.com/images/block/logos/tailwind-icon.svg'
                                        alt='Tailwind CSS'
                                        className='h-6 saturate-0 transition-all group-hover:saturate-100'
                                    />
                                </Link>
                                <Link
                                    href='https://ui.shadcn.com'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className={cn(buttonVariants({ variant: 'outline' }), 'group px-3')}>
                                    <ShadcnLogo className='h-6 saturate-0 transition-all group-hover:saturate-100' />
                                </Link>
                                <Link
                                    href='https://orm.drizzle.team/docs/overview'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className={cn(buttonVariants({ variant: 'outline' }), 'group px-3')}>
                                    <DrizzleLogo className='h-6 scale-125 saturate-0 transition-all group-hover:saturate-100' />
                                </Link>
                                <Link
                                    href='https://react.dev'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className={cn(buttonVariants({ variant: 'outline' }), 'group px-3')}>
                                    <img
                                        src='https://shadcnblocks.com/images/block/logos/react-icon.svg'
                                        alt='React'
                                        className='h-6 saturate-0 transition-all group-hover:saturate-100'
                                    />
                                </Link>

                                <Link
                                    href='https://www.typescriptlang.org'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className={cn(buttonVariants({ variant: 'outline' }), 'group px-3')}>
                                    <img
                                        src='https://shadcnblocks.com/images/block/logos/typescript-icon.svg'
                                        alt='TypeScript'
                                        className='h-6 saturate-0 transition-all group-hover:saturate-100'
                                    />
                                </Link>
                                <Link
                                    href='https://docs.stripe.com'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className={cn(buttonVariants({ variant: 'outline' }), 'group px-3')}>
                                    <StripeLogo className='h-6 scale-125 saturate-0 transition-all group-hover:saturate-100' />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
