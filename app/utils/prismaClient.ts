import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });
  
  prisma.$on("query", async (e) => {
    console.log('DATABASE QUERY', {...e})
  });
  
  prisma.$on("error", async (e) => {
    console.log('DATABASE ERROR', {...e})
  });
  
  prisma.$on("warn", async (e) => {
    console.log('DATABASE WARNING', {...e})
  });
  
  prisma.$on("info", async (e) => {
    console.log('DATABASE INFO', {...e})
  });
  
  
  export default prisma