const Sidebar = () => {
  return (
    <Sidebar className='w-64 h-full bg-gray-800 text-white'>
      <div className='p-4'>
        <h2 className='text-lg font-bold'>Menú</h2>
        <ul className='mt-4'>
          <li className='py-2 hover:bg-gray-700'>
            <a href='/'>Inicio</a>
          </li>
          <li className='py-2 hover:bg-gray-700'>
            <a href='/about'>Acerca de</a>
          </li>
          <li className='py-2 hover:bg-gray-700'>
            <a href='/services'>Servicios</a>
          </li>
          <li className='py-2 hover:bg-gray-700'>
            <a href='/contact'>Contacto</a>
          </li>
        </ul>
      </div>
    </Sidebar>
  );
};

export default Sidebar;
