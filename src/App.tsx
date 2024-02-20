import { useEffect, useState } from 'react';
import './App.css';
import { FormatOutputWithErrorBoundary } from './components/FormatOutput.tsx';
import { NumberInput } from './components/NumberInput.tsx';
import { Radio } from './components/Radio.tsx';
import { Select } from './components/Select.tsx';
import { TextInput } from './components/TextInput.tsx';
import roundingIncrements from './config/roundingIncrements.json';
import roundingModes from './config/roundingModes.json';
import units from './config/units.json';
import { SET_LOCALE, useFormatOptions } from './hooks/useFormatOptions.ts';

const LOCAL_STORAGE_VALUE_KEY = 'inputValue';

function parseFormatOptions(
  rawValue: string | number | undefined,
  defaultValue?: string,
): string {
  return rawValue === undefined
    ? defaultValue
      ? defaultValue
      : ''
    : `${rawValue}`;
}

function App() {
  const {
    state: { locale, ...formatOptions },
    dispatch,
  } = useFormatOptions();

  const [input, setInput] = useState('10000000');

  useEffect(() => {
    const savedInput = localStorage.getItem(LOCAL_STORAGE_VALUE_KEY);
    if (savedInput) {
      setInput(savedInput);
    }
  }, []);

  return (
    <main>
      <h1>
        <pre>Intl.NumberFormat</pre>
      </h1>
      <div className="formatter-container">
        <TextInput
          value={input}
          setValue={(newValue) => {
            setInput(newValue);
            localStorage.setItem(LOCAL_STORAGE_VALUE_KEY, newValue);
          }}
          name="number-to-be-formatted"
          label="To be formatted:"
        />
        <FormatOutputWithErrorBoundary
          input={input}
          locale={locale}
          options={formatOptions}
        />
      </div>
      <div className="inputs-container">
        <Select
          value={locale}
          setValue={(newValue) => {
            dispatch({ type: SET_LOCALE, payload: newValue });
          }}
          name="locale"
          label="Select locale:"
          options={['en-GB', 'en-US', 'vi']}
          info={`Determines the locale used. Your browser's locale is "${navigator.language}".`}
        />
        <Radio
          name="format-style"
          label="Style:"
          value={parseFormatOptions(formatOptions.style, 'decimal')}
          setValue={(newValue) =>
            dispatch({
              type: 'SET_OPTIONS',
              payload: { key: 'style', value: newValue },
            })
          }
          options={['decimal', 'currency', 'percent', 'unit']}
        />
        {formatOptions.style === 'currency' && (
          <>
            <Select
              value={parseFormatOptions(formatOptions.currency)}
              setValue={(newValue) => {
                dispatch({
                  type: 'SET_OPTIONS',
                  payload: { key: 'currency', value: newValue },
                });
              }}
              name="currency"
              label="Select currency:"
              options={['GBP', 'USD', 'EUR']}
              noEmptyValue
              info="Currency must be provided when using 'currency' format style."
            />
            <Radio
              name="currency-display"
              label="Currency display:"
              value={parseFormatOptions(
                formatOptions.currencyDisplay,
                'symbol',
              )}
              setValue={(newValue) =>
                dispatch({
                  type: 'SET_OPTIONS',
                  payload: { key: 'currencyDisplay', value: newValue },
                })
              }
              options={['code', 'symbol', 'narrowSymbol', 'name']}
            />
            <Radio
              name="currency-sign"
              label="Currency sign:"
              value={parseFormatOptions(formatOptions.currencySign, 'standard')}
              setValue={(newValue) =>
                dispatch({
                  type: 'SET_OPTIONS',
                  payload: { key: 'currencySign', value: newValue },
                })
              }
              options={['standard', 'accounting']}
              info="'Accounting' will use parentheses for negative values."
            />
          </>
        )}
        {formatOptions.style === 'unit' && (
          <>
            <Select
              value={parseFormatOptions(formatOptions.unit)}
              setValue={(newValue) => {
                dispatch({
                  type: 'SET_OPTIONS',
                  payload: { key: 'unit', value: newValue },
                });
              }}
              name="unit"
              label="Select unit:"
              options={units}
              info="Unit must be provided when using 'unit' format style."
            />
            <Radio
              name="unit-display"
              label="Unit display:"
              value={parseFormatOptions(formatOptions.unitDisplay, 'short')}
              setValue={(newValue) =>
                dispatch({
                  type: 'SET_OPTIONS',
                  payload: { key: 'unitDisplay', value: newValue },
                })
              }
              options={['short', 'narrow', 'long']}
            />
          </>
        )}
        <NumberInput
          value={parseFormatOptions(formatOptions.minimumIntegerDigits)}
          setValue={(newValue) => {
            dispatch({
              type: 'SET_OPTIONS',
              payload: {
                key: 'minimumIntegerDigits',
                value: newValue === '' ? undefined : newValue,
              },
            });
          }}
          name="min-int-digits"
          label="Minimum integer digits:"
          min={1}
          max={21}
          info="A value with a smaller number of integer digits than this number will be left-padded with zeros when formatted."
        />
        <NumberInput
          value={parseFormatOptions(formatOptions.minimumFractionDigits)}
          setValue={(newValue) => {
            dispatch({
              type: 'SET_OPTIONS',
              payload: {
                key: 'minimumFractionDigits',
                value: newValue === '' ? undefined : newValue,
              },
            });
          }}
          name="min-fraction-digits"
          label="Minimum fraction digits:"
          min={0}
          max={20}
        />
        <NumberInput
          value={parseFormatOptions(formatOptions.maximumFractionDigits)}
          setValue={(newValue) => {
            dispatch({
              type: 'SET_OPTIONS',
              payload: {
                key: 'maximumFractionDigits',
                value: newValue === '' ? undefined : newValue,
              },
            });
          }}
          name="max-fraction-digits"
          label="Maximum fraction digits:"
          min={0}
          max={20}
          disabled={formatOptions.minimumFractionDigits === undefined}
          info="Leave empty for default behaviour."
        />
        <NumberInput
          value={parseFormatOptions(formatOptions.minimumSignificantDigits)}
          setValue={(newValue) => {
            dispatch({
              type: 'SET_OPTIONS',
              payload: {
                key: 'minimumSignificantDigits',
                value: newValue === '' ? undefined : newValue,
              },
            });
          }}
          name="min-significant-digits"
          label="Minimum significant digits:"
          min={1}
          max={21}
        />
        <NumberInput
          value={parseFormatOptions(formatOptions.maximumSignificantDigits)}
          setValue={(newValue) => {
            dispatch({
              type: 'SET_OPTIONS',
              payload: {
                key: 'maximumSignificantDigits',
                value: newValue === '' ? undefined : newValue,
              },
            });
          }}
          name="max-significant-digits"
          label="Maximum significant digits:"
          min={1}
          max={21}
        />
        <Radio
          name="rounding-priority"
          label="Rounding priority:"
          value={parseFormatOptions(formatOptions.roundingPriority, 'auto')}
          setValue={(newValue) =>
            dispatch({
              type: 'SET_OPTIONS',
              payload: { key: 'roundingPriority', value: newValue },
            })
          }
          options={['auto', 'morePrecision', 'lessPrecision']}
          info="Determines how rounding conflicts will be resolved when both fraction digits and significant digits are specified. 'Auto' means prioritising significant digits."
        />
        {formatOptions.roundingPriority === 'auto' && (
          <Select
            value={parseFormatOptions(formatOptions.roundingIncrement)}
            setValue={(newValue) => {
              dispatch({
                type: 'SET_OPTIONS',
                payload: {
                  key: 'roundingIncrement',
                  value: newValue === '' ? undefined : newValue,
                },
              });
            }}
            name="rounding-increment"
            label="Select rounding increment:"
            options={roundingIncrements}
            info="This is only available when rounding priority = 'auto'."
          />
        )}
        <Select
          value={parseFormatOptions(formatOptions.roundingMode)}
          setValue={(newValue) => {
            dispatch({
              type: 'SET_OPTIONS',
              payload: {
                key: 'roundingMode',
                value: newValue === '' ? undefined : newValue,
              },
            });
          }}
          name="rounding-mode"
          label="Select rounding mode:"
          options={roundingModes}
        />
      </div>
    </main>
  );
}

export default App;
