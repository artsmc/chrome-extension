export interface IUserState {
    email: string;
    token?: string;
    jwt?: string;
    reference?: string;
    user_id: string;
    created: string;
    is_active?: boolean;
    is_system?: boolean;
  }