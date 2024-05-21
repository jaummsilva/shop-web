export interface User {
  id: string
  name: string
  birthdate: string
  email: string
  phone: string
  photoPath: string
  role: 'ADMIN' | 'MEMBER'
}
