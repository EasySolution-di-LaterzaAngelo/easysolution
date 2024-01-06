'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Prodotto } from '@/types';
import { getProduct, getProducts } from '@/pages/api/auth/getProducts';
import styles from './Prodotto.module.css';
import Link from 'next/link';
import db, { auth, storage } from '@/firebase';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Switch } from '@headlessui/react';
import { optionalInputs } from '../../../../../global_data';
import { deleteObject, ref, uploadBytes } from 'firebase/storage';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import imageCompression from 'browser-image-compression';
import { User, onAuthStateChanged } from 'firebase/auth';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Field = ({
  productKey,
  value,
  handleChange,
}: {
  productKey: string;
  value: any;
  handleChange: any;
}) => {
  productKey = productKey.charAt(0).toUpperCase() + productKey.slice(1);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.setCustomValidity(
        value === '' && productKey !== 'Sconto' && productKey !== 'Percentuale'
          ? 'Campo necessario!'
          : ''
      );
    }
    if (productKey === 'Prezzo' || productKey === 'Sconto') {
      if (inputRef.current !== null && value !== '') {
        const pattern = /^[0-9]+([,.][0-9]{1,2})?$/;
        const inputValue = inputRef.current.value;

        inputRef.current.setCustomValidity(
          !pattern.test(inputValue)
            ? 'Deve seguire il formato 123 o 123,45 o 123.45'
            : ''
        );
      }
    }
  }, [value, productKey]);

  return (
    <>
      {productKey !== 'Prezzo' &&
      productKey !== 'Sconto' &&
      productKey !== 'Percentuale' ? (
        productKey === 'Nome' || productKey === 'Descrizione' ? (
          // Required field
          <div className='flex flex-row w-full items-center justify-center'>
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
                value={value}
                onChange={handleChange}
                id={productKey}
                className='block w-[70%] rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder=''
              />
            </div>
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
              name={productKey}
              onChange={handleChange}
              id={productKey}
              value={value}
              className='block w-[70%] rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder=''
            />
          </div>
        )
      ) : (
        <div className='flex flex-row w-full items-center justify-center'>
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
                id={
                  productKey === 'Prezzo'
                    ? 'Prezzo di listino'
                    : productKey === 'Sconto'
                    ? 'Prezzo scontato'
                    : 'Percentuale sconto'
                }
                className='block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder={`${
                  productKey === 'Prezzo' || productKey === 'Sconto'
                    ? '0.00'
                    : '0'
                }`}
                value={value}
                aria-describedby='price-currency'
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function Product({ params }: any) {
  interface Product {
    [key: string]: string | boolean;
  }
  const [initialProdotto, setInitialProdotto] = useState<Product>();
  const [prodotto, setProdotto] = useState<Prodotto>();
  const [loggedUser, setLoggedUser] = useState<User | false>();

  const [originalImages, setOriginalImages] = useState<any>([]);
  const [images, setImages] = useState<any>([]);
  const [imagesUrls, setImagesUrls] = useState<string[]>([]);
  const [originalVideo, setOriginalVideo] = useState<any>();
  const [video, setVideo] = useState<any>();
  const [videoUrl, setVideoUrl] = useState<string>();
  const [categories, setCategories] = useState<any>();

  const [isDualSim, setIsDualSim] = useState(
    prodotto?.dual_sim ? prodotto?.dual_sim : false
  );
  const [isSecondHand, setIsSecondHand] = useState(
    prodotto?.usato ? prodotto?.usato : false
  );
  const [isRefurbished, setIsRefurbished] = useState(
    prodotto?.ricondizionato ? prodotto?.ricondizionato : false
  );
  const [is5G, setIs5G] = useState(prodotto?.five_g ? prodotto?.five_g : false);
  const [isNFC, setIsNFC] = useState(prodotto?.nfc ? prodotto?.nfc : false);

  // Snackbar
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState('');
  const [message, setMessage] = useState('');

  const excludeKeys = [
    'nome',
    'categoria',
    'descrizione',
    'immagini',
    'video',
    'prezzo',
    'sconto',
    'percentuale',
  ];

  const router = useRouter();
  useEffect(() => {
    async function fetchData(params: any) {
      const prodottiData = await getProduct(params.id);
      prodottiData ? setImagesUrls(prodottiData.immaginiUrl) : null;
      delete prodottiData.immaginiUrl;
      prodottiData ? setVideoUrl(prodottiData.videoUrl) : null;
      delete prodottiData.videoUrl;
      prodottiData ? setProdotto(prodottiData) : null;
      prodottiData ? setOriginalImages(prodottiData.immagini) : null;
      prodottiData ? setOriginalVideo(prodottiData.video) : null;
      prodottiData ? setInitialProdotto(prodottiData) : null;
      prodottiData ? setIsSecondHand(prodottiData.secondHand) : null;
      prodottiData ? setIsRefurbished(prodottiData.ricondizionato) : null;
      prodottiData ? setIs5G(prodottiData.five_g) : null;
      prodottiData ? setIsNFC(prodottiData.nfc) : null;
      prodottiData ? setIsDualSim(prodottiData.dual_sim) : null;
    }

    async function fetchDataForCategories() {
      const prodottiData = await getProducts();

      const categoriesArray: any[] = [];

      for (const product of prodottiData) {
        if (!categoriesArray.includes(product.categoria)) {
          categoriesArray.push(product.categoria);
        }
      }

      setCategories(categoriesArray);
    }

    onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setLoggedUser(user);
      } else {
        setLoggedUser(false);
      }
    });

    if (loggedUser !== false && loggedUser !== undefined) {
      if (loggedUser?.uid !== process.env.NEXT_PUBLIC_UID) {
        if (typeof window !== 'undefined') {
          window.location.replace('/');
        }
      } else {
        fetchData(params);
        fetchDataForCategories();
      }
    } else if (loggedUser !== undefined) {
      if (typeof window !== 'undefined') {
        window.location.replace('/');
      }
    }
  }, [loggedUser, params]);

  useEffect(() => {
    setProdotto((prevState: any) => ({
      ...prevState,
      dual_sim: isDualSim,
    }));
  }, [isDualSim]);

  useEffect(() => {
    setProdotto((prevState: any) => ({
      ...prevState,
      five_g: is5G,
    }));
  }, [is5G]);

  useEffect(() => {
    setProdotto((prevState: any) => ({
      ...prevState,
      nfc: isNFC,
    }));
  }, [isNFC]);

  useEffect(() => {
    setProdotto((prevState: any) => ({
      ...prevState,
      usato: isSecondHand,
    }));
  }, [isSecondHand]);

  useEffect(() => {
    setProdotto((prevState: any) => ({
      ...prevState,
      ricondizionato: isRefurbished,
    }));
  }, [isRefurbished]);

  const handleChange = (e: any) => {
    if (
      e.target.name === 'Prezzo' &&
      prodotto?.percentuale !== null &&
      prodotto?.percentuale !== undefined
    ) {
      setProdotto((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
        ['sconto']: Math.round(
          Number(e.target.value.replace(',', '.')) -
            (Number(e.target.value.replace(',', '.')) *
              Number(prodotto?.percentuale?.replace(',', '.'))) /
              100
        ).toString(),
      }));
    } else if (
      e.target.name === 'Prezzo' &&
      prodotto?.sconto !== null &&
      prodotto?.sconto !== undefined
    ) {
      setProdotto((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
        ['percentuale']: Math.round(
          ((Number(e.target.value.replace(',', '.')) -
            Number(prodotto?.sconto?.replace(',', '.'))) /
            Number(e.target.value.replace(',', '.'))) *
            100
        ).toString(),
      }));
    } else if (
      e.target.name === 'Sconto' &&
      prodotto?.prezzo !== null &&
      e.target.value !== ''
    ) {
      setProdotto((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
        ['percentuale']: Math.round(
          ((Number(prodotto?.prezzo?.replace(',', '.')) -
            Number(e.target.value.replace(',', '.'))) /
            Number(prodotto?.prezzo?.replace(',', '.'))) *
            100
        ).toString(),
      }));
    } else if (
      e.target.name === 'Sconto' &&
      prodotto?.prezzo !== null &&
      e.target.value === ''
    ) {
      setProdotto((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
        ['percentuale']: '',
      }));
    } else if (
      e.target.name === 'Percentuale' &&
      prodotto?.prezzo !== null &&
      e.target.value !== ''
    ) {
      setProdotto((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
        ['sconto']: Math.round(
          Number(prodotto?.prezzo?.replace(',', '.')) -
            (Number(prodotto?.prezzo?.replace(',', '.')) *
              Number(e.target.value.replace(',', '.'))) /
              100
        ).toString(),
      }));
    } else if (
      e.target.name === 'Percentuale' &&
      prodotto?.prezzo !== null &&
      e.target.value === ''
    ) {
      setProdotto((prevState: any) => ({
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

      setProdotto((prevState: any) => ({
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
      setProdotto((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
      }));
    } else if (e.target.type !== 'file') {
      setProdotto((prevState: any) => ({
        ...prevState,
        [e.target.name.charAt(0).toLowerCase() + e.target.name.slice(1)]:
          e.target.value.replace(/\n/g, ''),
      }));
    }
    if (e.target.files && e.target.files[0] && prodotto) {
      if (
        e.target.name === 'Immagine_0' ||
        e.target.name === 'Immagine_1' ||
        e.target.name === 'Immagine_2'
      ) {
        const parts = e.target.name.split('_');
        const index = parts[parts.length - 1];
        // Update the image name in the 'immagini' array
        const updatedImages = [...prodotto.immagini];
        updatedImages[parseInt(index)] = e.target.files[0].name;

        // Update the 'images' state by creating a new array with the updated image
        setImages((prevImages: any) => {
          const updatedImages = [...prevImages];
          updatedImages[parseInt(index)] = e.target.files[0];
          return updatedImages;
        });

        // Update the 'imagesUrls' state by creating a new array with the updated image URL
        setImagesUrls((prevImageUrls: any) => {
          const updatedUrls = [...prevImageUrls];
          updatedUrls[parseInt(index)] = URL.createObjectURL(e.target.files[0]);
          return updatedUrls;
        });

        // Update the 'immagini' state with the updated image names
        setProdotto((prevInputs: any) => ({
          ...prevInputs,
          immagini: updatedImages,
        }));
      }
      if (e.target.name === 'Video') {
        const selectedFile = e.target.files[0];
        const maxSizeInBytes = 3 * 1024 * 1024; // 3MB in bytes

        if (selectedFile.size > maxSizeInBytes) {
          setSeverity('error');
          setOpen(true);
        } else {
          prodotto.video = selectedFile.name;
          setVideo(selectedFile);
          setVideoUrl(URL.createObjectURL(selectedFile));
        }
      }
    }
  };

  const handleDeleteProduct = async (e: any) => {
    setMessage('Prodotto eliminato.');
    setSeverity('delete');
    setOpen(true);
    e.preventDefault();
    prodotto?.immagini?.map(async (imageData: any, index: number) => {
      const immagine = prodotto?.immagini[index]; // Get the corresponding immagine at the same index
      const imgref = ref(storage, `immagini/${immagine}`);
      await deleteObject(imgref);
    });
    await deleteDoc(doc(db, 'prodotti', `${params.id}`));
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.replace('/auth/admin/gestisci');
      }
    }, 1000);
  };

  const handleEditProduct = async (e: any) => {
    e.preventDefault();
    const hasChanged =
      JSON.stringify(prodotto) !== JSON.stringify(initialProdotto);

    if (hasChanged) {
      setMessage('Prodotto modificato');
      setSeverity('success');
      setOpen(true);
      if (prodotto) {
        const uploadPromises = images.map(
          async (imageData: any, index: number) => {
            const compressedImage = await handleImageUpload(imageData);
            const immagine = prodotto.immagini[index]; // Get the corresponding immagine at the same index
            const imgref = ref(storage, `immagini/${params.id}_${immagine}`);
            await uploadBytes(imgref, compressedImage);
          }
        );

        const uploadVideoPromise = async () => {
          if (!(params.id + '_' + prodotto.video).includes(originalVideo)) {
            const videoInput = prodotto.video; // Get the corresponding immagine at the same index
            const vidref = ref(storage, `video/${params.id}_${videoInput}`);
            await uploadBytes(vidref, video);
          }
        };

        const deleteImagesPromises = originalImages.map(
          async (image: any, index: number) => {
            if (!prodotto.immagini.includes(image)) {
              const imgref = ref(storage, `immagini/${image}`);
              await deleteObject(imgref);
            }
          }
        );

        const deleteVideoPromises = async () => {
          if (!(params.id + '_' + prodotto.video).includes(originalVideo)) {
            const vidref = ref(storage, `video/${originalVideo}`);
            await deleteObject(vidref);
          }
        };

        await Promise.all(uploadPromises);
        await Promise.all(deleteImagesPromises);
        const videoUploadPromise = uploadVideoPromise();
        await videoUploadPromise;
        const videoDeletePromise = deleteVideoPromises();
        await videoDeletePromise;

        let adjustedInputs: any = Object.fromEntries(
          Object.entries(prodotto)
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
              key === 'immagini' && Array.isArray(value)
                ? value.map((image) => {
                    // Check if the image name starts with params.id
                    if (!image.startsWith(params.id + '_')) {
                      // If it doesn't, prepend params.id to the image name
                      return params.id + '_' + image;
                    }
                    return image; // Otherwise, keep the image name unchanged
                  }) // Adjust 'immagini' value here
                : key === 'video' &&
                  !(params.id + '_' + prodotto.video).includes(originalVideo)
                ? params.id + '_' + value
                : key === 'prezzo' && !isNaN(parseFloat(value))
                ? parseFloat(value.replace(',', '.'))
                    .toFixed(2)
                    .replace('.', ',') // Convert 'prezzo' to fixed format with comma as decimal separator
                : key === 'sconto' && !isNaN(parseFloat(value))
                ? parseFloat(value.replace(',', '.'))
                    .toFixed(2)
                    .replace('.', ',') // Convert 'sconto' to fixed format with comma as decimal separator
                : typeof value === 'string'
                ? (value as string).trim()
                : value,
            ])
        );
        await setDoc(doc(db, 'prodotti', `${params.id}`), adjustedInputs);

        if (typeof window !== 'undefined') {
          window.location.replace('/auth/admin/gestisci');
        }
      }
    } else {
      setMessage('Nessuna modifica');
      setSeverity('warning');
      setOpen(true);
    }
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
  return (
    <div className='relative px-5 pt-5 pb-10 max-w-7xl flex flex-col h-[calc(100dvh-74px)] md:h-[calc(100dvh-56px)]'>
      <form
        onSubmit={handleEditProduct}
        className='relative flex flex-col h-full gap-4'
      >
        <a
          key={'Back'}
          href='/auth/admin/gestisci'
          className='z-50 flex absolute left-5 top-5 p-1 items-center drop-shadow-lg rounded-full text-black hover:bg-gray-300 hover:shadow-lg '
        >
          <ArrowLeftIcon height={18} className='stroke-black' />
        </a>
        <div
          className={`relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-auto p-4 items-center justify-center bg-white w-full content-start md:w-full max-h-min rounded-3xl shadow-lg bg-clip-padding bg-opacity-60 border border-gray-200 overflow-y-scroll ${styles.card}`}
        >
          {prodotto?.video && (
            <div className='flex flex-col w-full items-center justify-center'>
              <video
                key={videoUrl}
                controls
                className={`rounded-xl shadow-xl md:shadow-none aspect-auto object-contain h-64 w-auto p-2 mx-auto`}
              >
                <source
                  src={videoUrl}
                  type='video/mp4'
                  width={'160px'}
                  className='w-40 max-h-40'
                />
                Your browser does not support the video tag.
              </video>

              <label
                className={`flex flex-row items-center gap-1 p-2 px-4 my-4 rounded-xl ring-2 ring-gray-400 bg-gray-200 shadow-lg hover:ring-2 hover:ring-black hover:bg-yellow-400 cursor-pointer text-sm ${styles.drop_container}`}
              >
                <span className={styles.drop_title}>Cambia Video</span>
                <input
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
              </label>
            </div>
          )}
          {prodotto?.immagini?.map((imageName, index) => (
            <>
              <div
                key={index}
                className='flex flex-col w-full items-center justify-center'
              >
                <Image
                  key={'Image'}
                  src={imagesUrls ? imagesUrls[index] : ''}
                  alt={imageName}
                  className='w-40 max-h-40 p-2 aspect-auto object-contain bg-white rounded-xl'
                  width={64}
                  height={64}
                  unoptimized={true}
                />
                {index === 0 ? (
                  <p>Prima Immagine</p>
                ) : index === 1 ? (
                  <p>Seconda Immagine</p>
                ) : index === 2 ? (
                  <p>Terza Immagine</p>
                ) : null}
                <label
                  className={`flex flex-row items-center gap-1 p-2 px-4 my-4 rounded-xl ring-2 ring-gray-400 bg-gray-200 shadow-lg hover:ring-2 hover:ring-black hover:bg-yellow-400 cursor-pointer text-sm ${styles.drop_container}`}
                >
                  <span className={styles.drop_title}>Cambia Immagine</span>
                  <input
                    accept='image/*'
                    type='file'
                    name={`Immagine_${index}`}
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
                </label>
              </div>
            </>
          ))}

          <div className='hidden md:flex lg:col-span-2'>
            <Field
              key={'Descrizione'}
              productKey='Descrizione'
              value={
                typeof prodotto?.descrizione === 'string'
                  ? prodotto.descrizione
                  : ''
              }
              handleChange={handleChange}
            />
          </div>

          <Field
            key={'Nome'}
            productKey='Nome'
            value={typeof prodotto?.nome === 'string' ? prodotto.nome : ''}
            handleChange={handleChange}
          />

          <div
            aria-required
            className='relative flex flex-col w-full items-center justify-center py-4'
          >
            <label
              htmlFor='Categoria'
              className='absolute z-50 top-2 inline-block bg-white px-1 text-xs font-medium text-gray-900'
            >
              Categoria
            </label>
            <select
              value={prodotto?.categoria}
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

          <div className='md:hidden'>
            <Field
              key={'Descrizione'}
              productKey='Descrizione'
              value={
                typeof prodotto?.descrizione === 'string'
                  ? prodotto.descrizione
                  : ''
              }
              handleChange={handleChange}
            />
          </div>

          {/* Switches */}
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

          {initialProdotto && (
            <>
              {Object.entries(initialProdotto).map(([key, value]) => (
                <>
                  <React.Fragment key={key}>
                    {!excludeKeys.includes(key) && typeof value === 'string' ? (
                      <>
                        <Field
                          productKey={key}
                          handleChange={handleChange}
                          value={
                            prodotto && prodotto[key as keyof typeof prodotto]
                          }
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                </>
              ))}
              {optionalInputs.map((key) => (
                <>
                  <React.Fragment key={key.toLowerCase()}>
                    {!initialProdotto.hasOwnProperty(key.toLowerCase()) && (
                      <Field
                        productKey={key.toLowerCase()}
                        handleChange={handleChange}
                        value={undefined}
                      />
                    )}
                  </React.Fragment>
                </>
              ))}
            </>
          )}

          <Field
            key={'Prezzo'}
            productKey='Prezzo'
            value={typeof prodotto?.prezzo === 'string' ? prodotto.prezzo : ''}
            handleChange={handleChange}
          />

          <Field
            key={'Sconto'}
            productKey='Sconto'
            value={typeof prodotto?.sconto === 'string' ? prodotto.sconto : ''}
            handleChange={handleChange}
          />

          <Field
            key={'Percentuale'}
            productKey='Percentuale'
            value={
              typeof prodotto?.percentuale === 'string'
                ? prodotto.percentuale
                : ''
            }
            handleChange={handleChange}
          />
        </div>

        <div
          key={'Buttons'}
          className='flex flex-row h-fit items-center justify-center gap-2'
        >
          <div>
            <button
              role='button'
              type='button'
              onClick={handleDeleteProduct}
              className='flex mx-auto p-4 items-center drop-shadow-lg text-white bg-red-400 rounded-full ring-2 ring-red-500 shadow-lg hover:ring-2 hover:ring-red-700 hover:bg-red-500'
            >
              <XMarkIcon height={18} className='stroke-white' />
            </button>
            <p className='font-light w-20 text-center mt-2'>
              Cancella prodotto
            </p>
          </div>
          <div key={'Update'}>
            <button
              role='button'
              type='submit'
              className='flex mx-auto p-4 items-center drop-shadow-lg text-white bg-yellow-400 rounded-full ring-2 ring-yellow-500 shadow-lg hover:ring-2 hover:ring-yellow-700 hover:bg-yellow-500'
            >
              <PaperAirplaneIcon height={18} className='stroke-white' />
            </button>
            <p className='font-light w-20 text-center mt-2'>
              Aggiorna prodotto
            </p>
          </div>
        </div>
      </form>

      {/* Snackbar for delete */}
      {open && (
        <div className='z-50 fixed w-full left-0 bottom-20'>
          <div
            className={` flex w-min mx-auto items-center shadow-2xl ring-2 rounded-md p-4 ${
              severity === 'success'
                ? ' bg-green-50 ring-green-300'
                : severity === 'warning'
                ? 'bg-yellow-50 ring-yellow-300'
                : 'bg-red-50 ring-red-300'
            }`}
          >
            <div className='flex w-max'>
              <div className='flex-shrink-0'>
                {severity === 'success' ? (
                  <CheckCircleIcon
                    className='h-5 w-5 text-green-400'
                    aria-hidden='true'
                  />
                ) : severity === 'warning' ? (
                  <ExclamationCircleIcon
                    className='h-5 w-5 text-yellow-400'
                    aria-hidden='true'
                  />
                ) : (
                  <ExclamationCircleIcon
                    className='h-5 w-5 text-red-400'
                    aria-hidden='true'
                  />
                )}
              </div>
              <div className='ml-3 shrink-0'>
                {severity === 'success' ? (
                  <p className='text-sm font-medium text-green-800'>
                    Prodotto modificato! Attendi ...
                  </p>
                ) : severity === 'warning' ? (
                  <p className='text-sm font-medium text-yellow-800'>
                    Nessuna modifica
                  </p>
                ) : severity === 'error' ? (
                  <p className='text-sm font-medium text-red-800'>
                    Video troppo grande. Massimo 3 Mb.
                  </p>
                ) : (
                  <p className='text-sm font-medium text-red-800'>
                    Prodotto eliminato! Attendi ...
                  </p>
                )}
              </div>
              <div className='ml-auto pl-3'>
                <div className='-mx-1.5 -my-1.5'>
                  <button
                    type='button'
                    className={`inline-flex rounded-md ${
                      severity === 'success'
                        ? 'bg-green-50 p-1.5 text-green-500 hover:bg-green-100  focus:ring-green-600 focus:ring-offset-green-50'
                        : severity === 'warning'
                        ? 'bg-yellow-50 p-1.5 text-yellow-500 hover:bg-yellow-100  focus:ring-yellow-600 focus:ring-offset-yellow-50'
                        : 'bg-red-50 p-1.5 text-red-500 hover:bg-red-100  focus:ring-red-600 focus:ring-offset-red-50'
                    }  focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    <span className='sr-only'>Dismiss</span>
                    <XMarkIcon
                      className='h-5 w-5'
                      aria-hidden='true'
                      onClick={() => setOpen(false)}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
