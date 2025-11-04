export type LoginResponse = {
  token: string;
  firstname: string;
  lastname: string;
  image: string;
};

export type LoginFormItems = {
  ApplicantId: string;
  AuthCode: string;
  ClientAudience: string; // "samfa-client"
};
