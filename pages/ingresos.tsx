import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Consultas GraphQL
const OBTENER_INGRESOS = gql`
  query Ingresos {
    ingresos {
      id
      concepto
      fecha
      monto
      usuario {
        nombre
      }
    }
  }
`;

const ELIMINAR_INGRESO = gql`
  mutation EliminarIngreso($id: Int!) {
    eliminarIngreso(id: $id) {
      id
    }
  }
`;

const Ingresos = () => {
  const { loading, error, data } = useQuery(OBTENER_INGRESOS, {
    fetchPolicy: 'network-only',
  });
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIngresoId, setSelectedIngresoId] = useState(null);

  const { toast } = useToast();

  const [eliminarIngreso] = useMutation(ELIMINAR_INGRESO, {
    refetchQueries: [{ query: OBTENER_INGRESOS }],
  });

  const handleNavegation = (option, id) => {
    if (option === 1) {
      setSelectedIngresoId(id);
      setDialogOpen(true);
    } else if (option === 2) {
      router.push(`/crear_ingreso`);
    } else if (option === 3) {
      router.push(`/actualizar_ingreso/${id}`);
    }
  };

  const handleDelete = () => {
    eliminarIngreso({ variables: { id: parseInt(selectedIngresoId) } })
      .then(() => {
        toast({
          title: 'Eliminación Correctamente!',
          description: 'El Ingreso/Egreso se a Eliminado Correctamente!',
        });
        setDialogOpen(false);
      })
      .catch((err) => {
        console.error('Error al eliminar ingreso:', err);
        toast({
          title: 'Error en la Eliminación!',
          description: 'Error al Eliminar el  Ingreso/Egreso!',
        });
      });
  };

  if (loading) return <p>Cargando....</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Navbar />
      <div className='w-[80%] mx-auto'>
        <div className='flex justify-end'>
          <Button className='mt-12' onClick={() => handleNavegation(2)}>
            Crear
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>Concepto</TableHead>
              <TableHead className='text-center'>Monto</TableHead>
              <TableHead className='text-center'>Fecha</TableHead>
              <TableHead className='text-center'>Usuario</TableHead>
              <TableHead className='text-center'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.ingresos.map((ingreso) => (
              <TableRow key={ingreso.id}>
                <TableCell className='font-medium text-center'>
                  {ingreso.concepto}
                </TableCell>
                <TableCell className='text-center'>{ingreso.monto}</TableCell>
                <TableCell className='text-center'>{ingreso.fecha}</TableCell>
                <TableCell className='text-center'>
                  {ingreso.usuario.nombre}
                </TableCell>
                <TableCell className='text-center space-x-2'>
                  <Button onClick={() => handleNavegation(1, ingreso.id)}>
                    Eliminar
                  </Button>
                  <Button onClick={() => handleNavegation(3, ingreso.id)}>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className='pl-[7%] font-semibold' colSpan={4}>
                Total
              </TableCell>
              <TableCell className='text-center'>
                $
                {data.ingresos.reduce(
                  (acumulador, ingreso) => acumulador + ingreso.monto,
                  0
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Estás seguro?</DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. ¿Deseas eliminar este ingreso?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleDelete}>Eliminar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Ingresos;
