import pino from 'pino'
import ecsFormat from '@elastic/ecs-pino-format'
// import pinoHttp from 'pino-http'
// import pretty from 'pino-pretty'

export const transport = pino.transport({
    targets: [

      {
        target: 'pino/file',
        options: {
          destination: process.env.destpinolog,
          mkdir: true,
          colorize: false
        },
        Level:'info'
      },

      {
        target: 'pino-pretty',
        options: { 
          colorize: true,
          destination: 1 
        }
      }
  ]
});
export const logger = pino({
    level: 'info',
    formatters: {
        level: (label, number) => {
            return { 
              level: number,
              label: label.toUpperCase() 
           };
        }
    },

    timestamp: () => `,"time":"${new Date().toLocaleTimeString()}"` 
}, transport, ecsFormat());