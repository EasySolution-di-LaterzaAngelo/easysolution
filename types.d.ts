export interface Prodotto {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  descrizione: string;
  immagini: string[];
  video: string;
  usato: boolean;
  ricondizionato: boolean;
  dual_sim: boolean;
  five_g: boolean;
  nfc: boolean;
  colore: string;
  prezzo: string;
  sconto?: string;
  percentuale?: string;
  score?: number;
}

type Menu = {
  page: string | null;
  text: string;
};
