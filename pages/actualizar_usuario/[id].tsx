import { useRouter } from 'next/router';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/ui/Navbar';

const EDITAR_USUARIO = gql`
  mutation EditarUsuario($editarUsuarioId: Int!, $nombre: String, $rolId: Int) {
    editarUsuario(id: $editarUsuarioId, nombre: $nombre, rolId: $rolId) {
      nombre
    }
  }
`;

const OBTENER_USUARIO = gql`
  query Usuario($usuarioId: Int!) {
    usuario(id: $usuarioId) {
      id
      nombre
      rol {
        id
        nombre
      }
    }
  }
`;

const OBTENER_ROLES = gql`
  query Roles {
    roles {
      id
      nombre
    }
  }
`;

const Actualizar_Usuario = () => {
  const router = useRouter();
  const { id } = router.query;
  const usuarioId = parseInt(id as string);

  const { data: usuarioData, loading: loadingUsuario } = useQuery(
    OBTENER_USUARIO,
    {
      variables: { usuarioId },
    }
  );

  const { data: rolesData } = useQuery(OBTENER_ROLES);

  const [nombre, setNombre] = useState('');
  const [rolId, setRolId] = useState('');

  const [editarUsuario, { loading, error }] = useMutation(EDITAR_USUARIO, {
    onCompleted: () => {
      toast({
        title: 'Usuario Actualizado con Éxito!',
        description: 'Los datos del usuario fueron actualizados correctamente.',
      });
      router.push('/');
    },
    onError: () => {
      toast({
        title: 'Error al actualizar el usuario!',
        description: 'No se pudo actualizar el usuario.',
      });
    },
  });

  useEffect(() => {
    if (usuarioData) {
      setNombre(usuarioData.usuario.nombre);
      setRolId(usuarioData.usuario.rol?.id ?? '');
    }
  }, [usuarioData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    editarUsuario({
      variables: {
        editarUsuarioId: usuarioId,
        nombre,
        rolId: rolId ? parseInt(rolId) : null,
      },
    });
  };

  const handleNavegation = () => {
    router.back();
  };

  return (
    <>
      <Navbar />
      <Button className='p-2 mt-12 ml-96' onClick={handleNavegation}>
        Volver
      </Button>

      <form className='space-y-12 px-96' onSubmit={handleSubmit}>
        <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
          <div className='sm:col-span-4'>
            <label
              htmlFor='nombre'
              className='block text-sm font-medium text-gray-900'
            >
              Nombre del Usuario
            </label>
            <input
              id='nombre'
              name='nombre'
              type='text'
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className='mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400 focus:outline-[#0f172a]'
              required
            />
          </div>

          <div className='sm:col-span-4'>
            <label
              htmlFor='rol'
              className='block text-sm font-medium text-gray-900'
            >
              Rol
            </label>
            <select
              id='rol'
              name='rol'
              value={rolId}
              onChange={(e) => setRolId(e.target.value)}
              className='block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border placeholder:text-gray-400 focus:outline-[#0f172a]'
              required
            >
              <option value='' disabled>
                --Seleccione un Rol--
              </option>
              {rolesData?.roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={loading || loadingUsuario}
            className='w-full'
          >
            {loading ? 'Actualizando...' : 'Actualizar Usuario'}
          </Button>
        </div>

        {error && <p className='text-red-500'>{error.message}</p>}
      </form>
    </>
  );
};

export default Actualizar_Usuario;
