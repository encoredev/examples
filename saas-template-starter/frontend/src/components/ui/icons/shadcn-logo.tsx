export function ShadcnLogo({ className = 'h-16' }: { className?: string }) {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' version='1.1' viewBox='0 0 256 256' className={className}>
            <defs>
                <style>{`
                    .st0, .st1 { fill: none; }
                    .st1 { stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px; }
                `}</style>
            </defs>
            <rect className='st0' width='256' height='256' />
            <line className='st1' x1='208' y1='128' x2='128' y2='208' />
            <line className='st1' x1='192' y1='40' x2='40' y2='192' />
        </svg>
    );
}
