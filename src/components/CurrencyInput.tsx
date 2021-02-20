import React from 'react';
import NumberInput from './NumberInput';
import { getLocaleOptions } from '../utils/locale';

type CurrencyInputProps = React.PropsWithChildren<{
  label: string;
  currency: string;
  setCurrency: (currency: string) => void;
  setValue?: (value: number) => void; // only if CurrencyInput is 'base' (one could improve it with discriminated union type, based on label or 'kind')
  defaultValue?: number; // only if CurrencyInput is 'target' (one could improve it with discriminated union type, based on label)
  disabled?: boolean; // only if CurrencyInput is target
}>;

// If this component's implementation gets too 'conditional', consider splitting it to 2 separate ones, or get NumberInput passed as second child.
export function CurrencyInput({
  label,
  currency,
  setCurrency,
  setValue,
  defaultValue,
  disabled = false,
  children,
}: CurrencyInputProps) {
  const onChange = ({ value }: { value: number }) => {
    if (!disabled) {
      // TODO: we're sure that this exists, just dont have time right now to type it with discriminated union
      setValue!(value);
    }
  };

  return (
    <>
      <p className="text-gray-400">{label}</p>
      <div className="shadow appearance-none border rounded py-3 px-3 text-grey-darker bg-white">
        <select
          className="w-4/12 md:w-2/12"
          onChange={(e) => setCurrency(e.target.value)}
          value={currency}
        >
          {children}
        </select>
        <div className="w-8/12 md:w-10/12 inline-flex justify-end">
          {/* the width of the input is a bit ugly (no regular spacing) if its on the right side of container */}
          <NumberInput
            min={0}
            disabled={disabled}
            defaultValue={defaultValue}
            onChange={onChange}
            localeOptions={getLocaleOptions(currency)}
          />
        </div>
      </div>
    </>
  );
}
