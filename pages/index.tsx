import { Navbar } from '@/components/ui/Navbar';
import { useQuery, gql } from '@apollo/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

const OBTENER_USUARIOS = gql`
  query Usuarios {
    usuarios {
      id
      nombre
      correo
      telefono
      rol {
        nombre
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(OBTENER_USUARIOS, {
    fetchPolicy: 'cache-and-network',
  });
  const router = useRouter();

  if (loading) return <p>Cargando....</p>;
  if (error) return <p>Error: {error.message} </p>;

  const handleNavegation = (id) => {
    router.push(`/actualizar_usuario/${id}`);
  };

  return (
    <main>
      <Navbar />
      <div className='w-[80%] mx-auto'>
        <Table className='mt-12'>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>Usuario</TableHead>
              <TableHead className='text-center'>Correo</TableHead>
              <TableHead className='text-center'>Telefono</TableHead>
              <TableHead className='text-center'>Rol</TableHead>
              <TableHead className='text-center'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.usuarios.map((data) => (
              <TableRow key={data.id}>
                <TableCell className='text-center'>{data.nombre}</TableCell>
                <TableCell className='text-center'>{data.correo}</TableCell>
                <TableCell className='text-center'>{data.telefono}</TableCell>
                <TableCell className='text-center'>{data.rol.nombre}</TableCell>
                <TableCell className='text-center'>
                  <Button onClick={() => handleNavegation(data.id)}>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
