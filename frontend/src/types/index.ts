/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

export interface IConfig {
  backendURL: string;
}

export type BookingDetails = {
  service: string;
  clinic: string;
  optician: string;
  date: string;
  time: string;
  notes: string;
  emailConfirmation: string;
};

export type BookingSelection = {
  row: CatalogueRow;
  date: string;
  time: string;
};

export interface CatalogueRow {
  service: {
    id: string;
    name: string;
  };
  clinic: {
    id: string;
    name: string;
    opticians: {
      id: string;
      name: string;
    }[];
  };
}
