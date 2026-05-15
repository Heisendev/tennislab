import { cva } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from "react";
import { useTranslation } from 'react-i18next';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'controlPlayerA' | 'controlPlayerB';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
    variant?: Variant;
};

const buttonStyles = cva(
  'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-[8px] border border-[var(--gray-400)] shadow-lg transition-[background-color,box-shadow,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-(--color-primary) hover:bg-(--color-primary-hover) text-(--color-primary-fg)',
        secondary:
          'bg-(--color-secondary) hover:bg-(--color-secondary-hover) text-(--color-secondary-fg) border border-(--color-border-strong)',
        tertiary:
          'bg-white hover:bg-(--color-accent) hover:text-white text-(--color-accent) border border-(--color-border-strong)',
        danger:
          'bg-(--color-error) hover:bg-(--color-error-hover) text-white',
        controlPlayerA:
          'bg-white hover:bg-(--color-primary-hover) hover:text-white border border-(--color-primary) text-(--color-primary-hover)',
        controlPlayerB:
          'bg-white hover:bg-(--color-info) hover:text-white border border-(--color-info) text-(--color-info)',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export const Button = ({ isLoading = false, variant = 'primary', children, className, ...props }: ButtonProps) => {
    const { t } = useTranslation();
    return (
        <button
            className={buttonStyles({ variant }) + (className ? ` ${className}` : '')}
            disabled={isLoading || props.disabled}
            aria-busy={isLoading}
            {...props}
        >
            {isLoading ? t('common.loading') : children}
        </button>
    );
};