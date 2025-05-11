// components/ui/Spinner.tsx
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'currentColor', className }) => {
    const sizeClasses = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8';

    return (
        <div
            className={`inline-block border-2 border-t-transparent rounded-full animate-spin ${sizeClasses} ${className}`}
            style={{ borderColor: color }}
        />
    );
};