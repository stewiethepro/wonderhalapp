import React, { Fragment, useEffect, useState } from 'react';
import { useField } from "formik";
import Input, { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';
import { Combobox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'


const regionNames = new Intl.DisplayNames(
  ['en'], {type: 'region'}
);

const countries = []

getCountries().map((country) => (
  countries.push({
    country: country, 
    name: regionNames.of(country),
    countryCode: getCountryCallingCode(country),
    imageURL: "https://purecatamphetamine.github.io/country-flag-icons/3x2/" + country + ".svg",
  })
))

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function PhoneInput(props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(countries[167])

  const filteredCountries =
    query === ''
      ? countries
      : countries.filter((country) => {
          return country.name.toLowerCase().includes(query.toLowerCase())
        })

  const [field, meta, helpers] = useField(props.name)
  const [number, setNumber] = useState(props.number)
  const setFieldValue = props.setFieldValue

  return (
    <>
      <div className='flex justify-center'>
        <div className="mb-4 group shadow-xl rounded-lg overflow-hidden w-24">
          <img
            src={selected.imageURL}
            className="object-cover"
          />
          <div aria-hidden="true" className="bg-gradient-to-b from-transparent to-indigo-500 opacity-30"/>
        </div>
      </div>

      <div className='mb-4'>
        <Combobox as="div" value={selected} onChange={setSelected} name="countrySelect">
          <Combobox.Label className="block text-sm font-medium text-gray-700">Country</Combobox.Label>
          <div className="relative mt-1">
            <Combobox.Input
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(country) => country?.name}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>

            {filteredCountries.length > 0 && (
              <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredCountries.map((country) => (
                  <Combobox.Option
                    key={country.country}
                    value={country}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <>
                        <div className="flex items-center">
                          <img src={country.imageURL} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                          <span className={classNames('ml-3 truncate', selected && 'font-semibold')}>{country.name} +{country.countryCode}</span>
                        </div>

                        {selected && (
                          <span
                            className={classNames(
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                              active ? 'text-white' : 'text-indigo-600'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </div>
        </Combobox>
      </div>
      <label htmlFor={props.name} className="block text-sm font-medium text-gray-700">
          {props.label}
      </label>
      <div className='flex mt-1'>
        <div className='flex none'>
          <input disabled value={"+" + selected.countryCode} className="block w-16 pl-4 py-2 sm:text-sm border-r-0 rounded-md rounded-tr-none rounded-br-none border border-slate-300">
          </input>
        </div>
      <div className='flex-1'>
        <Input 
        {...field}
        country={selected.country} 
        value={number} 
        onChange={(e) => {
          console.log(e);
          setFieldValue(props.name, e)
        }} 
        placeholder="Enter phone number"
        name={props.name} 
        className={`block w-full pl-4 sm:text-sm rounded-md rounded-bl-none rounded-tl-none 
        ${meta.error && meta.touched ? 
        'border-pink-500 text-pink-600 focus:border-pink-500 focus:ring-pink-500' 
        : 
        'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
        }`
        }/>
      </div>
    </div>
    {meta.error && meta.touched && <p className="mt-2 text-sm text-red-600">
        {meta.error}
      </p>}

  </>

  )
}