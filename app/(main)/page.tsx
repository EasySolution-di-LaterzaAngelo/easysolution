import Producs from './(prodotti)/Producs';

export default function Home() {
  return (
    <>
      <div className='bg-white flex justify-center flex-grow z-0'>
        <main className='w-full'>
          <Producs />
        </main>
      </div>
    </>
  );
}
