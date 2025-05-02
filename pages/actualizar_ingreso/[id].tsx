import { useRouter } from 'next/router';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/ui/Navbar';

const ACTUALIZAR_INGRESO = gql`
  mutation EditarIngreso(
    $editarIngresoId: Int!
    $concepto: String!
    $monto: Int!
    $fecha: String!
    $usuarioId: Int!
  ) {
    editarIngreso(
      id: $editarIngresoId
      concepto: $concepto
      monto: $monto
      fecha: $fecha
      usuarioId: $usuarioId
    ) {
      concepto
      fecha
      id
      monto
    }
  }
`;

const OBTENER_INGRESO = gql`
  query Ingreso($id: Int!) {
    ingreso(id: $id) {
      id
      concepto
      monto
      fecha
      usuario {
        id
        nombre
      }
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

const Actualizar_Ingreso = () => {
  const router = useRouter();
  const { id } = router.query;
  const ingresoId = parseInt(id as string);
  const { data: usuariosData } = useQuery(OBTENER_USUARIOS, {});
  const { data: ingresoData, loading: loadingIngreso } = useQuery(
    OBTENER_INGRESO,
    {
      variables: { id: ingresoId },
    }
  );

  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [idUsuario, setIdUsuario] = useState('');

  const [actualizarIngreso, { loading, error }] = useMutation(
    ACTUALIZAR_INGRESO,
    {
      onCompleted: () => {
        toast({
          title: 'Ingreso Actualizado con Éxito!',
          description: 'El Ingreso/Egreso se a Actualizado Correctamente!',
        });
        router.push('/ingresos');
      },
      onError: (error) => {
        toast({
          title: 'Error al Actualizar el Ingreso/Egreso!',
          description: 'El Ingreso/Egreso no se Actualizado Correctamente!',
        });
      },
    }
  );

  const handleNavegation = () => {
    router.back();
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    actualizarIngreso({
      variables: {
        editarIngresoId: ingresoId,
        concepto,
        monto: parseInt(monto),
        fecha,
        usuarioId: parseInt(idUsuario),
      },
    });
  };

  useEffect(() => {
    if (ingresoData) {
      setConcepto(ingresoData.ingreso.concepto);
      setMonto(ingresoData.ingreso.monto);
      setFecha(ingresoData.ingreso.fecha);
      setIdUsuario(ingresoData.ingreso.usuario.id);
    }
  }, [ingresoData]);

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
              className='block w-[22.5rem] rounded-md bg-white px-3 py-2 text-base text-gray-900 border placeholder:text-gray-400 focus:outline-[#0f172a]'
              required
            >
              <option
                className='rounded-md border-blue-400'
                value=''
                disabled
                selected
              >
                --Seleccione un Usuario--
              </option>
              {usuariosData?.usuarios.map((usuario) => (
                <option className='' key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={loading || loadingIngreso}
            className='w-full'
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>

        {error && <p className='text-red-500'>{error.message}</p>}
      </form>
    </>
  );
};

export default Actualizar_Ingreso;
