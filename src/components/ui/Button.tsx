import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'relative px-6 py-3 font-medium text-sm uppercase tracking-wider transition-all duration-200 rounded-full shadow-md',
                    // Primary variant
                    variant === 'primary' && 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:bg-[var(--md-sys-color-primary-container)] hover:text-[var(--md-sys-color-on-primary-container)] hover:shadow-lg',
                    // Secondary variant
                    variant === 'secondary' && 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] hover:bg-[var(--md-sys-color-secondary)] hover:text-[var(--md-sys-color-on-secondary)] hover:shadow-lg',
                    // Danger variant
                    variant === 'danger' && 'bg-[var(--md-sys-color-error)] text-[#690005] hover:bg-[#F9DEDC] hover:shadow-lg',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--md-sys-color-background)]',
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };
