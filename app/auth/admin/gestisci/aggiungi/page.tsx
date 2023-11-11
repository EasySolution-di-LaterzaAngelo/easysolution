'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Aggiungi.module.css';
import Link from 'next/link';
import db from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { storage } from '../../../../../firebase';
import { Prodotto } from '@/types';
import Image from 'next/image';
import { Switch } from '@headlessui/react';
import { optionalInputs } from '../../../../../global_data';
import {
  ArrowSmallLeftIcon,
  CameraIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Field = ({
  productKey,
  handleChange,
  inputs,
}: {
  productKey: string;
  handleChange: any;
  inputs: any;
}) => {
  let productKeyLowerCase =
    productKey.charAt(0).toLowerCase() + productKey.slice(1);
  let value = inputs[productKeyLowerCase] ? inputs[productKeyLowerCase] : '';

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let input = document.querySelector(
      `[name="${productKey}"]`
    ) as HTMLInputElement | null;

    input?.setCustomValidity(
      value === '' || value === undefined || value === null
        ? productKey === 'Sconto' ||
          productKey === 'Percentuale' ||
          productKey === 'Percentuale'
          ? ''
          : 'Campo necessario!'
        : ''
    );

    if (productKey === 'Prezzo' || productKey === 'Sconto') {
      if (
        inputRef.current !== null &&
        value !== '' &&
        value !== null &&
        value !== undefined
      ) {
        const pattern = /^[0-9]+,[0-9]+$/;
        const inputValue = inputRef.current.value;

        inputRef.current.setCustomValidity(
          !pattern.test(inputValue) ? 'Deve seguire il formato 123,45' : ''
        );
      }
    }
  }, [value, productKey, productKeyLowerCase]);
  return (
    <>
      {productKey !== 'Prezzo' &&
      productKey !== 'Sconto' &&
      productKey !== 'Percentuale' ? (
        productKey === 'Nome' ||
        productKey === 'Marca' ||
        productKey === 'Descrizione' ? (
          // Required field
          <div className='relative flex flex-row w-full items-center justify-center py-4'>
            <label
              htmlFor={productKey}
              className='absolute top-2 inline-block bg-white px-1 text-xs font-medium text-gray-900'
            >
              {productKey}
            </label>
            <textarea
              required
              name={productKey}
              onChange={handleChange}
              id={productKey}
              className='block w-[70%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder=''
            />
          </div>
        ) : (
          // Optional field
          <div className='relative flex flex-row w-full items-center justify-center py-4'>
            <label
              htmlFor={productKey}
              className='absolute top-2 bg-white px-1 text-xs font-medium text-gray-900'
            >
              <p className='flex items-start gap-1'>
                {productKey}
                <span
                  className='flex text-[8px] h-2 leading-6 text-gray-500 items-start'
                  id='optional'
                >
                  (Opzionale)
                </span>
              </p>
            </label>

            <textarea
              name={`${productKey}(Opzionale)`}
              onChange={handleChange}
              id={productKey}
              className='block w-[70%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder=''
            />
          </div>
        )
      ) : (
        // Price
        <div className='relative flex flex-row w-full items-center justify-center py-4'>
          <label
            htmlFor={
              productKey === 'Prezzo'
                ? 'Prezzo di listino'
                : productKey === 'Sconto'
                ? 'Prezzo scontato'
                : 'Percentuale sconto'
            }
            className='z-20 absolute top-4 inline-block bg-white px-1 text-xs font-medium text-gray-900'
          >
            <p className='flex items-start gap-1 bg-red'>
              {productKey === 'Prezzo'
                ? 'Prezzo di listino'
                : productKey === 'Sconto'
                ? 'Prezzo scontato'
                : 'Percentuale sconto'}
              <span
                className={`${
                  productKey === 'Prezzo' ? 'hidden' : 'flex'
                } h-2 text-[8px] leading-6 text-gray-500 items-start bg-red z-0`}
                id='optional'
              >
                (Opzionale)
              </span>
            </p>
          </label>
          <div className='relative w-[70%] mt-2 rounded-md shadow-sm'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <span
                className={` ${
                  productKey === 'Prezzo' || productKey === 'Sconto'
                    ? 'flex'
                    : 'hidden'
                } text-gray-500 sm:text-sm`}
              >
                €
              </span>
              <span
                className={` ${
                  productKey === 'Percentuale' ? 'flex' : 'hidden'
                } text-gray-500 sm:text-sm`}
              >
                %
              </span>
            </div>
            <input
              ref={inputRef}
              required={productKey === 'Prezzo' ? true : false}
              type='text'
              name={
                productKey === 'Prezzo'
                  ? 'Prezzo'
                  : productKey === 'Sconto'
                  ? 'Sconto'
                  : 'Percentuale'
              }
              id={productKey}
              className='block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder={`${
                productKey === 'Prezzo' || productKey === 'Sconto'
                  ? '0.00'
                  : '0'
              }`}
              value={inputs[productKeyLowerCase]}
              aria-describedby='price-currency'
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

function AddProduct() {
  const [inputs, setInputs] = useState<Prodotto>({
    id: '',
    nome: '',
    marca: '',
    categoria: '',
    descrizione: '',
    immagini: [],
    usato: false,
    ricondizionato: false,
    dual_sim: false,
    five_g: false,
    nfc: false,
    prezzo: '',
    sconto: '',
    percentuale: '',
  });

  const [images, setImages] = useState<any>([]);
  const [imagesUrls, setImagesUrls] = useState<string[]>([]);
  const router = useRouter();

  const [isSecondHand, setIsSecondHand] = useState(false);
  const [isRefurbished, setIsRefurbished] = useState(false);
  const [isDualSim, setIsDualSim] = useState(false);
  const [is5G, setIs5G] = useState(false);
  const [isNFC, setIsNFC] = useState(false);

  let inputRefImage = useRef<HTMLInputElement | null>(null);

  let categoria = inputs?.categoria;
  let immagini = inputs?.immagini;

  useEffect(() => {
    let input = document.querySelector(
      `[name="Categoria"]`
    ) as HTMLInputElement | null;

    input?.setCustomValidity(
      categoria === '' || categoria === undefined || categoria === null
        ? 'Campo necessario!'
        : ''
    );
  }, [categoria]);

  useEffect(() => {
    let input = document.querySelector(
      `[name="Immagine"]`
    ) as HTMLInputElement | null;

    input?.setCustomValidity(immagini.length === 0 ? 'Campo necessario!' : '');
  }, [immagini]);

  useEffect(() => {
    setInputs((prevState: any) => ({
      ...prevState,
      dual_sim: isDualSim,
    }));
  }, [isDualSim]);

  useEffect(() => {
    setInputs((prevState: any) => ({
      ...prevState,
      five_g: is5G,
    }));
  }, [is5G]);

  useEffect(() => {
    setInputs((prevState: any) => ({
      ...prevState,
      nFC: isNFC,
    }));
  }, [isNFC]);

  useEffect(() => {
    setInputs((prevState: any) => ({
      ...prevState,
      usato: isSecondHand,
    }));
  }, [isSecondHand]);

  useEffect(() => {
    setInputs((prevState: any) => ({
      ...prevState,
      ricondizionato: isRefurbished,
    }));
  }, [isRefurbished]);

  // Snackbar
  const [successOpen, setSuccessOpen] = React.useState(false);

  // Inputs handler
  const handleChange = (e: any) => {
    if (e.target.name === 'Prezzo' && inputs?.percentuale !== '') {
      setInputs((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
        ['sconto']: Math.round(
          Number(e.target.value.replace(',', '.')) -
            (Number(e.target.value.replace(',', '.')) *
              Number(inputs?.percentuale?.replace(',', '.'))) /
              100
        ).toString(),
      }));
    } else if (e.target.name === 'Prezzo' && inputs?.sconto !== '') {
      setInputs((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
        ['percentuale']: Math.round(
          ((Number(e.target.value.replace(',', '.')) -
            Number(inputs?.sconto?.replace(',', '.'))) /
            Number(e.target.value.replace(',', '.'))) *
            100
        ).toString(),
      }));
    } else if (e.target.name === 'Sconto' && inputs?.prezzo !== '') {
      setInputs((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
        ['percentuale']: Math.round(
          ((Number(inputs?.prezzo?.replace(',', '.')) -
            Number(e.target.value.replace(',', '.'))) /
            Number(inputs?.prezzo?.replace(',', '.'))) *
            100
        ).toString(),
      }));
    } else if (e.target.name === 'Percentuale' && inputs?.prezzo !== '') {
      setInputs((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
        ['sconto']: Math.round(
          Number(inputs?.prezzo?.replace(',', '.')) -
            (Number(inputs?.prezzo?.replace(',', '.')) *
              Number(e.target.value.replace(',', '.'))) /
              100
        ).toString(),
      }));
    } else {
      e.target.type !== 'file' &&
        setInputs((prevState: any) => ({
          ...prevState,
          [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
            e.target.value.replace(/\n/g, ''),
        }));
      if (e.target.files && e.target.files[0]) {
        inputs.immagini.push(e.target.files[0].name);
        setImages((prevImage: any) => [...prevImage, e.target.files[0]]);
        setImagesUrls((prevImageUrls) => [
          ...prevImageUrls,
          URL.createObjectURL(e.target.files[0]),
        ]);
      }
    }
  };
  // Submit Handler
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setSuccessOpen(true);

    images.map(async (imageData: any, index: number) => {
      const immagine = inputs.immagini[index]; // Get the corresponding immagine at the same index
      const imgref = ref(storage, `immagini/${immagine}`);
      await uploadBytes(imgref, imageData);
    });
    let adjustedInputs =
      inputs &&
      Object.fromEntries(
        Object.entries(inputs)
          .filter(([key, value]) => {
            if (key === 'immagini' && Array.isArray(value)) {
              return true; // Keep the "immagine" key with an array value
            } else if (
              typeof value === 'string'
                ? (value as string).trim() !== ''
                : typeof value === 'boolean' && value === true
            ) {
              return true;
            }
            return false;
          })
          .map(([key, value]) => [
            key.startsWith('_') ? key.slice(1) : key,
            typeof value === 'string' ? (value as string).trim() : value,
          ])
      );
    await setDoc(doc(db, 'prodotti', `${uuidv4()}`), adjustedInputs);
    router.push('/auth/admin/gestisci');
  };

  const handleRemoveImage = (index: number) => {
    setInputs((prevState) => {
      const updatedImages = [...prevState.immagini];
      updatedImages.splice(index, 1);
      return { ...prevState, immagini: updatedImages };
    });
    imagesUrls.splice(index, 1);
  };

  const renderImage = (src: string, label: string, index: number) => (
    <div
      key={index}
      className='flex flex-col w-full items-center justify-center'
    >
      <Image
        src={src}
        alt=''
        className='rounded-xl mb-1 mt-10 shadow-lg shrink-0'
        width={128}
        height={128}
        unoptimized={true}
      />
      <p>{label}</p>
      <button
        type='button'
        onClick={() => handleRemoveImage(index)}
        className='flex items-center gap-1 p-2 px-4 my-4 rounded-xl ring-2 ring-gray-400 bg-gray-200 shadow-lg hover:ring-2 hover:ring-black hover:bg-red-400 cursor-pointer text-sm'
      >
        Rimuovi Immagine
      </button>
    </div>
  );

  const renderImageUploader = () => (
    <label className={`flex flex-row w-3/5 mx-auto ${styles.drop_container}`}>
      <span className={styles.drop_title}>Carica una foto</span>

      <input
        required={inputs.immagini.length === 0}
        ref={inputRefImage}
        accept='image/*'
        type='file'
        name='Immagine'
        onChange={handleChange}
        style={{
          position: 'absolute',
          clip: 'rect(1px, 1px, 1px, 1px)',
          padding: 0,
          border: 0,
          height: '1px',
          width: '1px',
          overflow: 'hidden',
        }}
      />
      <CameraIcon height={22} className='stroke-black stroke-2' />
    </label>
  );
  return (
    <div className='relative w-full flex flex-col px-6'>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          className={`relative max-w-4xl h-[600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 items-center justify-center bg-white content-start md:w-full md:h-2/3 rounded-3xl shadow-lg bg-clip-padding bg-opacity-60 border border-gray-200 overflow-y-scroll  ${styles.card}`}
        >
          {/* Go back */}
          <Link
            key={'Back'}
            href='/auth/admin/gestisci'
            className='flex absolute left-4 top-4 p-1 items-center drop-shadow-lg rounded-full text-black hover:bg-gray-300 hover:shadow-lg '
          >
            <ArrowSmallLeftIcon height={18} className='stroke-black' />
          </Link>
          {/* Image field */}
          <>
            {inputs.immagini.length === 0 && (
              <>
                {renderImageUploader()}
                {renderImageUploader()}
                {renderImageUploader()}
              </>
            )}
            {inputs.immagini.length === 1 && (
              <>
                {renderImage(imagesUrls[0], 'Prima immagine', 0)}
                {renderImageUploader()}
                {renderImageUploader()}
              </>
            )}
            {inputs.immagini.length === 2 && (
              <>
                {renderImage(imagesUrls[0], 'Prima immagine', 0)}
                {renderImage(imagesUrls[1], 'Seconda immagine', 1)}
                {renderImageUploader()}
              </>
            )}
            {inputs.immagini.length >= 3 && (
              <>
                {renderImage(imagesUrls[0], 'Prima immagine', 0)}
                {renderImage(imagesUrls[1], 'Seconda immagine', 1)}
                {renderImage(imagesUrls[2], 'Terza immagine', 2)}
              </>
            )}
          </>

          {/* Description field */}
          <div className='flex lg:col-span-2'>
            <Field
              productKey='Descrizione'
              handleChange={handleChange}
              inputs={inputs}
            />
          </div>

          {/* Name field */}
          <Field
            productKey='Nome'
            handleChange={handleChange}
            inputs={inputs}
          />

          {/* Brand field */}
          <Field
            productKey='Marca'
            handleChange={handleChange}
            inputs={inputs}
          />

          {/* Category field */}
          <div className='relative flex flex-row  items-center justify-center py-4'>
            <label
              htmlFor='Categoria'
              className='absolute z-50 top-2 inline-block bg-white px-1 text-xs font-medium text-gray-900'
            >
              Categoria
            </label>
            <select
              required
              defaultValue=''
              id='grouped-native-select'
              name='Categoria'
              onChange={handleChange}
              autoComplete='country-name'
              className='relative block w-[70%] rounded-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            >
              <option aria-label='None' value='' />
              <option value={'Cartoleria'}>Cartoleria</option>
              <option value={'Idee Regalo'}>Idee Regalo</option>
              <option value={'Articoli per feste'}>Articoli per feste</option>
              <option value={'Incisioni su accaio e legno'}>
                Incisioni su accaio e legno
              </option>
              <option value={'Prodotti di elettronica'}>
                Prodotti di elettronica
              </option>
              <option value={'Bomboniere artigianali'}>
                Bomboniere artigianali
              </option>
              <option value={'Articoli da personalizzare'}>
                Articoli da personalizzare
              </option>
              <option value={'Riparazioni smartphone / PC / Bimby / Folletto'}>
                Riparazioni smartphone / PC / Bimby / Folletto
              </option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className='flex flex-row items-center justify-center py-4'>
            <div className='flex flex-wrap max-w-[200px] items-center justify-center gap-3'>
              <Switch.Group as='div' className='flex flex-col items-center'>
                <Switch
                  checked={isSecondHand}
                  onChange={setIsSecondHand}
                  name='usato'
                  className={classNames(
                    isSecondHand ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                  )}
                >
                  <span className='sr-only'>Use setting</span>
                  <span
                    className={classNames(
                      isSecondHand ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  >
                    <span
                      className={classNames(
                        isSecondHand
                          ? 'opacity-0 duration-100 ease-out'
                          : 'opacity-100 duration-200 ease-in',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                      )}
                      aria-hidden='true'
                    >
                      <svg
                        className='h-3 w-3 text-gray-400'
                        fill='none'
                        viewBox='0 0 12 12'
                      >
                        <path
                          d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                          stroke='currentColor'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </span>
                    <span
                      className={classNames(
                        isSecondHand
                          ? 'opacity-100 duration-200 ease-in'
                          : 'opacity-0 duration-100 ease-out',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                      )}
                      aria-hidden='true'
                    >
                      <svg
                        className='h-3 w-3 text-indigo-600'
                        fill='currentColor'
                        viewBox='0 0 12 12'
                      >
                        <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                      </svg>
                    </span>
                  </span>
                </Switch>
                <Switch.Label as='p' className='text-sm'>
                  <span className='font-medium text-xs text-gray-900'>
                    Usato
                  </span>
                </Switch.Label>
              </Switch.Group>

              <Switch.Group as='div' className='flex flex-col items-center'>
                <Switch
                  checked={isRefurbished}
                  onChange={setIsRefurbished}
                  name='usato'
                  className={classNames(
                    isRefurbished ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                  )}
                >
                  <span className='sr-only'>Use setting</span>
                  <span
                    className={classNames(
                      isRefurbished ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  >
                    <span
                      className={classNames(
                        isRefurbished
                          ? 'opacity-0 duration-100 ease-out'
                          : 'opacity-100 duration-200 ease-in',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                      )}
                      aria-hidden='true'
                    >
                      <svg
                        className='h-3 w-3 text-gray-400'
                        fill='none'
                        viewBox='0 0 12 12'
                      >
                        <path
                          d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                          stroke='currentColor'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </span>
                    <span
                      className={classNames(
                        isRefurbished
                          ? 'opacity-100 duration-200 ease-in'
                          : 'opacity-0 duration-100 ease-out',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                      )}
                      aria-hidden='true'
                    >
                      <svg
                        className='h-3 w-3 text-indigo-600'
                        fill='currentColor'
                        viewBox='0 0 12 12'
                      >
                        <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                      </svg>
                    </span>
                  </span>
                </Switch>
                <Switch.Label as='p' className='text-sm'>
                  <span className='font-medium text-xs text-gray-900'>
                    Ricondizionato
                  </span>
                </Switch.Label>
              </Switch.Group>

              <Switch.Group as='div' className='flex flex-col items-center'>
                <Switch
                  checked={isDualSim}
                  onChange={setIsDualSim}
                  name='dual_sim'
                  className={classNames(
                    isDualSim ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                  )}
                >
                  <span className='sr-only'>Use setting</span>
                  <span
                    className={classNames(
                      isDualSim ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  >
                    <span
                      className={classNames(
                        isDualSim
                          ? 'opacity-0 duration-100 ease-out'
                          : 'opacity-100 duration-200 ease-in',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                      )}
                      aria-hidden='true'
                    >
                      <svg
                        className='h-3 w-3 text-gray-400'
                        fill='none'
                        viewBox='0 0 12 12'
                      >
                        <path
                          d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                          stroke='currentColor'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </span>
                    <span
                      className={classNames(
                        isDualSim
                          ? 'opacity-100 duration-200 ease-in'
                          : 'opacity-0 duration-100 ease-out',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                      )}
                      aria-hidden='true'
                    >
                      <svg
                        className='h-3 w-3 text-indigo-600'
                        fill='currentColor'
                        viewBox='0 0 12 12'
                      >
                        <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                      </svg>
                    </span>
                  </span>
                </Switch>
                <Switch.Label as='p' className='text-sm'>
                  <span className='font-medium text-xs text-gray-900'>
                    Dual Sim
                  </span>
                </Switch.Label>
              </Switch.Group>

              <Switch.Group as='div' className='flex flex-col items-center'>
                <Switch
                  checked={is5G}
                  onChange={setIs5G}
                  name='dual_sim'
                  className={classNames(
                    is5G ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                  )}
                >
                  <span className='sr-only'>Use setting</span>
                  <span
                    className={classNames(
                      is5G ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  >
                    <span
                      className={classNames(
                        is5G
                          ? 'opacity-0 duration-100 ease-out'
                          : 'opacity-100 duration-200 ease-in',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                      )}
                      aria-hidden='true'
                    >
                      <svg
                        className='h-3 w-3 text-gray-400'
                        fill='none'
                        viewBox='0 0 12 12'
                      >
                        <path
                          d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                          stroke='currentColor'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </span>
                    <span
                      className={classNames(
                        is5G
                          ? 'opacity-100 duration-200 ease-in'
                          : 'opacity-0 duration-100 ease-out',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                      )}
                      aria-hidden='true'
                    >
                      <svg
                        className='h-3 w-3 text-indigo-600'
                        fill='currentColor'
                        viewBox='0 0 12 12'
                      >
                        <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                      </svg>
                    </span>
                  </span>
                </Switch>
                <Switch.Label as='p' className='text-sm'>
                  <span className='font-medium text-xs text-gray-900'>5G</span>
                </Switch.Label>
              </Switch.Group>

              <Switch.Group as='div' className='flex flex-col items-center'>
                <Switch
                  checked={isNFC}
                  onChange={setIsNFC}
                  name='dual_sim'
                  className={classNames(
                    isNFC ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                  )}
                >
                  <span className='sr-only'>Use setting</span>
                  <span
                    className={classNames(
                      isNFC ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  >
                    <span
                      className={classNames(
                        isNFC
                          ? 'opacity-0 duration-100 ease-out'
                          : 'opacity-100 duration-200 ease-in',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                      )}
                      aria-hidden='true'
                    >
                      <svg
                        className='h-3 w-3 text-gray-400'
                        fill='none'
                        viewBox='0 0 12 12'
                      >
                        <path
                          d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                          stroke='currentColor'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </span>
                    <span
                      className={classNames(
                        isNFC
                          ? 'opacity-100 duration-200 ease-in'
                          : 'opacity-0 duration-100 ease-out',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                      )}
                      aria-hidden='true'
                    >
                      <svg
                        className='h-3 w-3 text-indigo-600'
                        fill='currentColor'
                        viewBox='0 0 12 12'
                      >
                        <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                      </svg>
                    </span>
                  </span>
                </Switch>
                <Switch.Label as='p' className='text-sm'>
                  <span className='font-medium text-xs text-gray-900'>NFC</span>
                </Switch.Label>
              </Switch.Group>
            </div>
          </div>

          {/* Optional fields */}
          {optionalInputs.map((key) => (
            <Field
              key={key}
              productKey={key}
              handleChange={handleChange}
              inputs={inputs}
            />
          ))}

          <Field
            productKey='Prezzo'
            handleChange={handleChange}
            inputs={inputs}
          />

          <Field
            productKey='Sconto'
            handleChange={handleChange}
            inputs={inputs}
          />

          <Field
            productKey='Percentuale'
            handleChange={handleChange}
            inputs={inputs}
          />
        </div>

        {/* Add product button */}
        <div className='flex flex-col mt-4 items-center justify-center gap-2'>
          <button
            type='submit'
            className='flex mx-auto p-4 items-center drop-shadow-lg text-white bg-green-400 rounded-full ring-2 ring-green-500 shadow-lg hover:ring-2 hover:ring-green-700 hover:bg-green-500'
          >
            <PaperAirplaneIcon height={18} className='stroke-white' />
          </button>
          <p className='font-light'>Aggiungi prodotto</p>
        </div>
      </form>

      {/* Snackbar for success */}
      {successOpen && (
        <div className='rounded-md bg-green-50 p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <CheckCircleIcon
                className='h-5 w-5 text-green-400'
                aria-hidden='true'
              />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-green-800'>
                Successfully uploaded
              </p>
            </div>
            <div className='ml-auto pl-3'>
              <div className='-mx-1.5 -my-1.5'>
                <button
                  type='button'
                  className='inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50'
                >
                  <span className='sr-only'>Dismiss</span>
                  <XMarkIcon className='h-5 w-5' aria-hidden='true' />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProduct;
