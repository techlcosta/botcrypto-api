export interface InputCreateNewUserInterface {
  username: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface UserInterface {
  id: string
  username: string
  password: string
  apiURL: string
  accessKey: string
  secretKey: string
  createdAt: Date
  updatedAt: Date
}

export interface InputUpdateUserInterface {
  id: string
  password?: string
  apiURL?: string
  accessKey?: string
  secretKey?: string
}

export interface UsersRepositoryInterface {
  findById: (id: string) => Promise<UserInterface | null>
  findByUser: (username: string) => Promise<UserInterface | null>
  update: (data: InputUpdateUserInterface) => Promise<UserInterface>
}
