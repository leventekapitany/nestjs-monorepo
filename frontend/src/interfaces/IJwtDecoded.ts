import { type JwtPayload } from 'jwt-decode'

export interface IDecoded extends JwtPayload {
  userId: number
}
