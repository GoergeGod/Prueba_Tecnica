import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import { gql } from 'graphql-tag';

const prisma = new PrismaClient();


const typeDefs = gql`

  type Usuario {
    id: Int!
    nombre: String!
    correo: String!
    telefono: Int!
    rol: Rol!
    ingresos: [Ingreso!]!
  }

  type Rol {
    id: Int!
    nombre: String!
  }

  type Ingreso {
    id: Int
    concepto: String!
    monto: Int!
    fecha: String!
    usuario: Usuario!
  }

  type Query {
    usuario(id: Int!): Usuario!
    usuarios: [Usuario!]!
    ingresos: [Ingreso!]!
    roles: [Rol!]!
    ingreso(id: Int!): Ingreso!
  }

  type Mutation {
    crearUsuario(id: Int!, nombre: String!, correo: String!, telefono: Int!, rolId: Int!): Usuario!
    crearRol(id: Int!, nombre: String!) : Rol!
    crearIngreso( concepto: String!, monto: Int!, fecha: String!, usuarioId: Int!): Ingreso!
    editarIngreso( id: Int!, concepto: String!, monto: Int!, fecha: String!, usuarioId: Int!): Ingreso!
    editarUsuario(id: Int!, nombre: String, rolId: Int): Usuario!
    eliminarIngreso(id: Int!): Ingreso!
  }
`;

const resolvers = {
  Query: {
    usuario: async (_, { id }) => await prisma.usuario.findUnique({ where: { id }, include: { rol: true }}),
    usuarios: async () => await prisma.usuario.findMany({ include: { rol: true }}),
    ingresos: async () => await prisma.ingreso.findMany({ include: { usuario: true }}),
    ingreso: async (_ , { id }) => await prisma.ingreso.findUnique({ where: { id } , include: { usuario: true }}),
    roles: async () => await prisma.rol.findMany({ include: { usuarios: true }}),
  },

  Mutation: {


    crearIngreso: async (_, { concepto, monto, fecha, usuarioId }) => {
      return await prisma.ingreso.create({
        data: {
          concepto,
          monto,
          fecha,
          usuarioId
        }
      })
    },

    crearRol: async (_, { id , nombre }) => {
      return await prisma.rol.create({
        data: {
          id,
          nombre
        }
      }
      ) 
    },

    crearUsuario: async (_, { id, nombre, correo, telefono, rolId }) => {
      return await prisma.usuario.create({
        data: {
          id,
          nombre,
          correo,
          telefono, 
          rolId
        }
      })
    },

    editarIngreso: async ( _, { id, concepto, monto, fecha, usuarioId } ) => {
      try {
          const ingresoActualizado = await prisma.ingreso.update({
            where: { id },
            data: { 
              concepto, 
              monto,   
              fecha,   
              usuarioId
            }
          });
          return ingresoActualizado;
        } catch (error) {
          throw new Error(`Error al actualizar el ingreso: ${error.message}`);
        }},


      editarUsuario: async (_ , { id, nombre , rolId }) => {
        try {
          const usuarioActualizado = await prisma.usuario.update({
            where: { id },
            data: {
              nombre,
              rolId
            }
          })
          return usuarioActualizado
        } catch (error) {
          throw new Error(`Error al actualizar el usuario: ${error.message}`)
        }
      },


      eliminarIngreso: async (_ , { id }) => {
        return await prisma.ingreso.delete({ where: { id }})
      }
  }
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema
});

export default startServerAndCreateNextHandler(server);
