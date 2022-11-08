export interface InputCreateNewUserInterface {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInterface {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersRepositoryInterface {
  findById: (id: string) => Promise<UserInterface | null>;
  findByUser: (username: string) => Promise<UserInterface | null>;
}
