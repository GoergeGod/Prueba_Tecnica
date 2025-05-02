import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/ui/Navbar';
import { useQuery, gql } from '@apollo/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const OBTENER_INGRESOS = gql`
  query Ingresos {
    ingresos {
      concepto
      fecha
      monto
      usuario {
        nombre
      }
    }
  }
`;

const reportes = () => {
  const { loading, error, data } = useQuery(OBTENER_INGRESOS, {});

  if (loading) return <p>Cargando....</p>;
  if (error) return <p>Error: {error.message} </p>;

  const ingresosData = data.ingresos.map((ingreso) => ({
    concepto: ingreso.concepto,
    monto: ingreso.monto,
    usuario: ingreso.usuario.nombre,
  }));

  const conceptoCounts = ingresosData.reduce((acc, ingreso) => {
    acc[ingreso.concepto] = (acc[ingreso.concepto] || 0) + ingreso.monto;
    return acc;
  }, {});

  const chartData = Object.keys(conceptoCounts).map((concepto) => ({
    concepto: concepto,
    totalMonto: conceptoCounts[concepto],
  }));

  const downloadCSV = () => {
    const csvRows = [];
    const headers = ['Concepto', 'Monto Total'];
    csvRows.push(headers.join(':'));

    for (const concepto in conceptoCounts) {
      const row = [concepto, conceptoCounts[concepto]];
      csvRows.push(row.join(':'));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'ingresos.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <div className='flex items-center flex-col '>
        <h2 className='text-center text-xl font-bold mt-4'>
          Ingresos por Concepto
        </h2>
        <div className='flex justify-between items-center w-[80%] mx-4'>
          <Card className='w-[340px] ml-[160px]'>
            <CardHeader>
              <CardTitle>Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <span className='font-semibold'>Ingreso: </span>$
                {conceptoCounts.Ingreso.toLocaleString()}
              </p>
              <p>
                <span className='font-semibold '>Egresos: </span>$
                {conceptoCounts.Egreso.toLocaleString()}
              </p>
              <p>
                <span className='font-semibold mr-6'>Total: </span>$
                {(
                  conceptoCounts.Ingreso - conceptoCounts.Egreso
                ).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Button className='' onClick={downloadCSV}>
            Descargar CSV
          </Button>
        </div>
        <ResponsiveContainer width='80%' height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='concepto' />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '12px',
              }}
            />
            <Legend />
            <Bar dataKey='totalMonto' fill='#0f172a' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default reportes;
