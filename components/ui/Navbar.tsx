import Link from 'next/link';

export const Navbar = () => (
  <>
    <nav className='bg-[#0f172a]'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-16 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
            <div className='flex shrink-0 items-center'></div>
            <div className='hidden sm:ml-6 sm:block'>
              <div className='flex space-x-4'>
                <Link
                  href='/'
                  className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#272E3F] hover:text-white'
                >
                  Usuarios
                </Link>
                <Link
                  href='/ingresos'
                  className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#272E3F] hover:text-white'
                >
                  Ingresos y Egresos
                </Link>
                <Link
                  href='/reportes'
                  className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#272E3F] hover:text-white'
                >
                  Reportes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='sm:hidden' id='mobile-menu'>
        <div className='space-y-1 px-2 pb-3'>
          <Link
            href='/'
            className='block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white'
            aria-current='page'
          >
            Usuarios
          </Link>
          <Link
            href='/ingresos'
            className='block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-[#272E3F] hover:text-white'
          >
            Ingresos y Egresos
          </Link>
          <Link
            href='/reportes'
            className='block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-[#272E3F] hover:text-white'
          >
            Reportes
          </Link>
        </div>
      </div>
    </nav>
  </>
);
