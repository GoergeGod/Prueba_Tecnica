import { useRouter } from 'next/router';
import { useMutation, gql, useQuery } from '@apollo/client';
import { cache, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/ui/Navbar';

const CREAR_INGRESO = gql`
  mutation CrearIngreso(
    $concepto: String!
    $monto: Int!
    $fecha: String!
    $idUsuario: Int!
  ) {
    crearIngreso(
      concepto: $concepto
      monto: $monto
      fecha: $fecha
      usuarioId: $idUsuario
    ) {
      concepto
      fecha
      monto
    }
  }
`;

const OBTENER_USUARIOS = gql`
  query Usuarios {
    usuarios {
      id
      nombre
    }
  }
`;

const Crear_Ingreso = () => {
  const router = useRouter();
  const { data } = useQuery(OBTENER_USUARIOS, {});

  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [idUsuario, setIdUsuario] = useState('');

  const [crearIngreso, { loading, error }] = useMutation(CREAR_INGRESO, {
    onCompleted: () => {
      toast({
        title: 'Creación Ingreso/Egreso Correctamente!',
        description: 'El Ingreso/Egreso se a Creado Correctamente!',
      });
      router.push('/ingresos');
    },
    onError: (error) => {
      console.error('Error al crear ingreso:', error);
    },
  });

  const handleNavegation = () => {
    router.back();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    crearIngreso({
      variables: {
        concepto,
        monto: parseFloat(monto),
        fecha,
        idUsuario: parseInt(idUsuario),
      },
    });
  };

  return (
    <>
      <Navbar />
      <Button className='p-2 mt-12 ml-96' onClick={handleNavegation}>
        Volver
      </Button>

      <form className='space-y-12 px-96' onSubmit={handleSubmit}>
        <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
          <div className='sm:col-span-3'>
            <label
              htmlFor='Concepto'
              className='block text-sm font-medium text-gray-900'
            >
              Concepto
            </label>
            <input
              id='Concepto'
              name='Concepto'
              type='text'
              autoComplete='given-name'
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              className='mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400 focus:outline-[#0f172a]'
              required
            />
          </div>

          <div className='sm:col-span-3'>
            <label
              htmlFor='Monto'
              className='block text-sm font-medium text-gray-900'
            >
              Monto
            </label>
            <input
              id='Monto'
              name='Monto'
              type='number'
              min='0'
              autoComplete='family-name'
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className='mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400 focus:outline-[#0f172a]'
              required
            />
          </div>

          <div className='sm:col-span-4'>
            <label
              htmlFor='fecha'
              className='block text-sm font-medium text-gray-900'
            >
              Fecha
            </label>
            <input
              id='fecha'
              name='fecha'
              type='date'
              autoComplete='fecha'
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className='mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400 focus:outline-[#0f172a]'
              required
            />
          </div>

          <div className='mt-2 grid grid-cols-1'>
            <label
              htmlFor='usuario'
              className='block text-sm font-medium text-gray-900 '
            >
              Usuario
            </label>
            <select
              id='usuario'
              name='usuario'
              value={idUsuario}
              onChange={(e) => setIdUsuario(e.target.value)}
              className='block !w-[22.5rem] rounded-md bg-white px-3 py-2 text-base text-gray-900 border placeholder:text-gray-400 focus:outline-[#0f172a]'
              required
            >
              <option value='' disabled>
                Seleccione un Usuario
              </option>
              {data?.usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button type='submit' disabled={loading} className='w-full'>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>

        {error && <p className='text-red-500'>{error.message}</p>}
      </form>
    </>
  );
};

export default Crear_Ingreso;
