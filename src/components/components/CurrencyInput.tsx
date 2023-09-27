import _CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field'
import { twMerge } from 'tailwind-merge'

interface InputProps extends CurrencyInputProps {
  error?: boolean
  errorMessage?: string
}

function CurrencyInput({
  className,
  error,
  errorMessage,
  onValueChange,
  ...props
}: InputProps) {
  const inputClassName = twMerge(
    'rounded-lg border border-gray-300 bg-white p-2 text-sm font-normal text-constrastBlack placeholder-black placeholder-opacity-40 outline-none transition-all focus:ring-1 focus:ring-primaryOrange',
    error ? 'border-red-500' : '',
    className,
  )

  return (
    <div className="flex w-full flex-col">
      <_CurrencyInput
        lang="pt-BR"
        className={inputClassName}
        intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
        onValueChange={onValueChange}
        {...props}
      />
      {error && errorMessage && (
        <div className="text-red-500 mt-1 text-xs">{errorMessage}</div>
      )}
    </div>
  )
}

export default CurrencyInput
