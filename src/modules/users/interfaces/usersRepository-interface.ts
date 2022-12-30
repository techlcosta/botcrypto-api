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
  streamURL: string
  accessKey: string
  secretKey: string
  createdAt: Date
  updatedAt: Date
}

export interface InputFindUserByIdInterface {
  id: string
}

export interface InputFindUserByUserNameInterface {
  username: string
}

export interface InputUpdateUserInterface {
  id: string
  password?: string
  apiURL?: string
  streamURL?: string
  accessKey?: string
  secretKey?: string
}

export interface UsersRepositoryInterface {
  findById: (data: InputFindUserByIdInterface) => Promise<UserInterface | null>
  findByUser: (data: InputFindUserByUserNameInterface) => Promise<UserInterface | null>
  update: (data: InputUpdateUserInterface) => Promise<UserInterface>
}
