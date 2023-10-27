import LoginButton from './LoginButton';

function page() {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='flex flex-col gap-8 rounded-md p-4 border w-64 bg-slate-50'>
        <h1 className='text-lg font-semibold break-words text-center'>
          Accedi al tuo account Easy Solution
        </h1>
        <LoginButton />
      </div>
    </div>
  );
}

export default page;
