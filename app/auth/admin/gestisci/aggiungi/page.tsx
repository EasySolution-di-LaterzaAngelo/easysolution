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
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { getProducts } from '@/pages/api/auth/getProducts';
import imageCompression from 'browser-image-compression';

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
        productKey === 'Nome' || productKey === 'Descrizione' ? (
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
    video: '',
    usato: false,
    ricondizionato: false,
    dual_sim: false,
    five_g: false,
    nfc: false,
    colore: '',
    prezzo: '',
    sconto: '',
    percentuale: '',
  });

  const [images, setImages] = useState<any>([]);
  const [imagesUrls, setImagesUrls] = useState<string[]>([]);
  const [video, setVideo] = useState<any>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const router = useRouter();

  const [isSecondHand, setIsSecondHand] = useState(false);
  const [isRefurbished, setIsRefurbished] = useState(false);
  const [isDualSim, setIsDualSim] = useState(false);
  const [is5G, setIs5G] = useState(false);
  const [isNFC, setIsNFC] = useState(false);
  const [prodotti, setProdotti] = useState<Prodotto[]>();
  const [categories, setCategories] = useState<any>();

  let inputRefImage = useRef<HTMLInputElement | null>(null);

  let categoria = inputs?.categoria;
  let immagini = inputs?.immagini;

  useEffect(() => {
    async function fetchData() {
      const prodottiData = await getProducts();
      setProdotti(prodottiData);

      const categoriesArray: any[] = [];

      for (const product of prodottiData) {
        if (!categoriesArray.includes(product.categoria)) {
          categoriesArray.push(product.categoria);
        }
      }

      setCategories(categoriesArray);
    }

    fetchData();
  }, []);

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
    console.log(e);

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
    } else if (
      e.target.name === 'Sconto' &&
      inputs?.prezzo !== null &&
      e.target.value !== ''
    ) {
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
    } else if (
      e.target.name === 'Sconto' &&
      inputs?.prezzo !== null &&
      e.target.value === ''
    ) {
      setInputs((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
        ['percentuale']: '',
      }));
    } else if (
      e.target.name === 'Percentuale' &&
      inputs?.prezzo !== null &&
      e.target.value !== ''
    ) {
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
    } else if (
      e.target.name === 'Percentuale' &&
      inputs?.prezzo !== null &&
      e.target.value === ''
    ) {
      setInputs((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
        ['sconto']: '',
      }));
    } else if (e.target.id === 'InputCategoria') {
      const selectDropdown = document.getElementById('grouped-native-select');

      if (selectDropdown && selectDropdown instanceof HTMLSelectElement) {
        // Set the first option to 'None' or an empty value
        selectDropdown.selectedIndex = 0; // This assumes the 'None' option is the first one

        // If you want to set a specific value as 'None', you can do:
        // selectDropdown.value = ''; // or any other specific value

        // Optionally, trigger a change event if needed
        const event = new Event('change');
        selectDropdown.dispatchEvent(event);
      }

      setInputs((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
      }));
    } else if (e.target.id === 'grouped-native-select') {
      const inputCategoria = document.getElementById(
        'InputCategoria'
      ) as HTMLInputElement | null;
      if (inputCategoria) {
        inputCategoria.value = ''; // Clears the input field
      }
      setInputs((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
      }));
    } else {
      e.target.type !== 'file' &&
        setInputs((prevState: any) => ({
          ...prevState,
          [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
            e.target.value.replace(/\n/g, ''),
        }));
      if (e.target.files && e.target.files[0]) {
        if (e.target.name === 'Immagine') {
          inputs.immagini.push(e.target.files[0].name);
          setImages((prevImage: any) => [...prevImage, e.target.files[0]]);
          setImagesUrls((prevImageUrls) => [
            ...prevImageUrls,
            URL.createObjectURL(e.target.files[0]),
          ]);
        }
        if (e.target.name === 'Video') {
          inputs.video = e.target.files[0].name;
          setVideo(e.target.files[0]);
          setVideoUrl(URL.createObjectURL(e.target.files[0]));
        }
      }
    }
  };
  // Submit Handler
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setSuccessOpen(true);

    const uuid = uuidv4();

    const uploadImagesPromises = images.map(
      async (imageData: any, index: number) => {
        const compressedImage = await handleImageUpload(imageData);
        const immagine = inputs.immagini[index]; // Get the corresponding immagine at the same index
        const imgref = ref(storage, `immagini/${uuid}_${immagine}`);
        await uploadBytes(imgref, compressedImage);
      }
    );

    const uploadVideoPromise = async () => {
      const videoInput = inputs.video; // Get the corresponding immagine at the same index
      const vidref = ref(storage, `video/${uuid}_${videoInput}`);
      await uploadBytes(vidref, video);
    };

    const videoUploadPromise = uploadVideoPromise();

    await Promise.all(uploadImagesPromises);
    await videoUploadPromise;

    let adjustedInputs =
      inputs &&
      Object.fromEntries(
        Object.entries(inputs)
          .filter(([key, value]) => {
            if (key === 'immagini' && Array.isArray(value)) {
              return true; // Keep the "immagine" key with an array value
            } else if (key === 'video') {
              return true; // Keep the "video" key
            }
            if (
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
            key === 'immagini' && Array.isArray(value)
              ? value.map((image) => uuid + '_' + image) // Adjust 'immagini' value here
              : key === 'video'
              ? uuid + '_' + value
              : typeof value === 'string'
              ? (value as string).trim()
              : value,
          ])
      );
    await setDoc(doc(db, 'prodotti', `${uuid}`), adjustedInputs);

    // if (typeof window !== 'undefined') {
    //   window.location.replace('/auth/admin/gestisci');
    // }
  };

  async function handleImageUpload(image: any) {
    const imageFile = image;
    // console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      // console.log(
      //   'compressedFile instanceof Blob',
      //   compressedFile instanceof Blob
      // ); // true
      // console.log(
      //   `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      // ); // smaller than maxSizeMB
      return compressedFile;
    } catch (error) {
      console.log(error);
      return imageFile;
    }
  }

  const handleRemoveImage = (index: number) => {
    setInputs((prevState) => {
      const updatedImages = [...prevState.immagini];
      updatedImages.splice(index, 1);
      return { ...prevState, immagini: updatedImages };
    });
    imagesUrls.splice(index, 1);
  };

  const handleRemoveVideo = () => {
    setInputs((prevState) => {
      return { ...prevState, video: '' };
    });
    setVideoUrl('');
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
        role='button'
        type='button'
        onClick={() => handleRemoveImage(index)}
        className='flex items-center gap-1 p-2 px-4 my-4 rounded-xl ring-2 ring-gray-400 bg-gray-200 shadow-lg hover:ring-2 hover:ring-black hover:bg-red-400 cursor-pointer text-sm'
      >
        Rimuovi Immagine
      </button>
    </div>
  );

  const renderVideo = (src: string, index: number) => (
    <div
      key={index}
      className='flex flex-col w-full items-center justify-center'
    >
      <video controls width='240px' height='120px' className='flex'>
        <source src={src} type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      <button
        role='button'
        type='button'
        onClick={() => handleRemoveVideo()}
        className='flex items-center gap-1 p-2 px-4 my-4 rounded-xl ring-2 ring-gray-400 bg-gray-200 shadow-lg hover:ring-2 hover:ring-black hover:bg-red-400 cursor-pointer text-sm'
      >
        Rimuovi Video
      </button>
    </div>
  );

  const renderImageUploader = () => (
    <label className={`flex flex-row w-3/5 mx-auto ${styles.drop_container}`}>
      <span className={styles.drop_title}>Carica una Foto</span>

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

  const renderVideoUploader = () => (
    <label className={`flex flex-row w-3/5 mx-auto ${styles.drop_container}`}>
      <span className={styles.drop_title}>Carica un Video</span>

      <input
        required={inputs.immagini.length === 0}
        ref={inputRefImage}
        accept='video/*'
        type='file'
        name='Video'
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
      <VideoCameraIcon height={22} className='stroke-black stroke-2' />
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
          <a
            key={'Back'}
            href='/auth/admin/gestisci'
            className='flex absolute left-4 top-4 p-1 items-center drop-shadow-lg rounded-full text-black hover:bg-gray-300 hover:shadow-lg '
          >
            <ArrowSmallLeftIcon height={18} className='stroke-black' />
          </a>

          {/* Video field */}
          <>
            {inputs.video === '' ? (
              <> {renderVideoUploader()}</>
            ) : (
              <>{renderVideo(videoUrl, 0)}</>
            )}
          </>

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

          {/* Category field */}
          <div
            aria-required
            className='relative flex flex-col  items-center justify-center py-4'
          >
            <label
              htmlFor='Categoria'
              className='absolute z-50 top-2 inline-block bg-white px-1 text-xs font-medium text-gray-900'
            >
              Categoria
            </label>
            <select
              defaultValue=''
              id='grouped-native-select'
              name='Categoria'
              onChange={handleChange}
              autoComplete='country-name'
              className='relative block w-[70%] rounded-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            >
              <option aria-label='None' value='' />
              {categories?.map((category: any) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type='text'
              id='InputCategoria'
              name='Categoria'
              placeholder='Inserisci una nuova categoria'
              onChange={handleChange}
              className='mt-2 p-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-[70%] sm:text-sm'
            />
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
            role='button'
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
                Prodotto aggiunto! Attendi ...
              </p>
            </div>
            <div className='ml-auto pl-3'>
              <div className='-mx-1.5 -my-1.5'>
                <button
                  role='button'
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
