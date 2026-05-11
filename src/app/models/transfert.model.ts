export interface Transfert {
  id: number;
  num_opi: string;
  num_depense?: string | null;
  num_dossier?: string | null;
  imputation?: string | null;
  num_od?: string | null;
  objet_opi?: string | null;
  montant: number;
  date_emission?: string | null; // ISO date string
  signataire_nom?: string;
  fk_beneficiaire_id?: number | null;
  fk_banque_id?: number | null;
  // Optionally include related objects if needed
  beneficiaire?: Beneficiaire;
  banque?: Banque;
}

export interface Beneficiaire {
  id: number;
  nom: string;
  type_beneficiaire?: string | null;
  service_prestataire?: string | null;
}

export interface Banque {
  id: number;
  nom_banque: string;
  num_compte: string;
  mode_paiement?: string;
}