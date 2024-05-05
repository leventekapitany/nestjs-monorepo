import auth from './auth';
import database from './database';

export interface Config {
  port: number;
  auth: ReturnType<typeof auth>;
  database: ReturnType<typeof database>;
}

export default () => ({
  port: parseInt(process.env.PORT!, 10) || 3000,
  auth: auth(),
  database: database(),
});
