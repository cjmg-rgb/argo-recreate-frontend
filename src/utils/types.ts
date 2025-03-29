import { z } from "zod";

import { AxiosError } from "axios";

export interface IRequestError extends AxiosError<{ message: string }> {}

export type TActiveModal = "details" | "deleteConfirmation" | "edit" | "successEdit";

export interface IAddBookingForm {
  title: string;
  location: string;
  date: Date | null;
  pickUpTimeHour: number | null;
  dropOffTimeHour: number | null;
  carId: string | null;
  instruction: string;
}

export interface IEditBookingForm extends IAddBookingForm {
  id: string;
}

export interface EditUserDetails {
  name: string;
  department: string;
  remainingCredits: string;
  accessType: string;
}

export interface IResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}

export interface IDepartment {
  id: string;
  name: string;
}

export interface IDepartments {
  departments: IDepartment[];
  count: number;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  credits: number;
  department: IDepartment;
  role: "admin" | "user";
}

export interface IDriver {
  id: string;
  email: string;
  name: string;
  number: string;
  car: ICar | null;
}

export interface IDrivers {
  drivers: IDriver[];
  count: number;
}

export interface IAuth {
  auth: IUser | null;
  token: string | null;
  updateCredits: (newCredits: number) => void;
  setCredentials: (credentials: IUser, token: string) => Promise<void>;
  removeCredentials: () => Promise<void>;
}

export interface IUsers {
  users: IUser[];
  count: number;
}

export interface IColor {
  id: string;
  label: string;
  isUsed: boolean;
}

export interface IColors {
  colors: IColor[];
  count: number;
}

export interface ICar {
  id: string;
  model: string;
  plateNumber: string;
  driver: IDriver;
  codingDay: number;
  colorTag: {
    label: string;
  };
}

export interface ICars {
  cars: ICar[];
  count: number;
}

export interface IBooking {
  id: string;
  title: string;
  location: string;
  date: string;
  pickUpTime: string;
  dropOffTime: string;
  instruction: string;
  creditDeduction: number;
  editAttempts: number;
  car: ICar;
  bookedBy: IUser;
}

export interface IBookings {
  bookings: IBooking[];
  count: number;
}

export interface IPaginatedUsers {
  users: IUser[];
  count: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number | null;
}

export interface IUsersQueryFilter {
  keyword: string | undefined;
  departmentId: string | undefined;
}

export interface IDepartmentWithRenderedHrs extends IDepartment {
  hoursRendered: number;
}

export interface ICarReport extends ICar {
  hoursRenderedPerDept: IDepartmentWithRenderedHrs[];
}

export interface IDepartmentReport extends IDepartment {
  totalRenderedHours: number;
}

export interface IReports {
  carReports: ICarReport[];
  departmentReports: IDepartmentReport[];
}

export interface IDepartmentTotalHours {
  deptName: string;
  hours: number;
}