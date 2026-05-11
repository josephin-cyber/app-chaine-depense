import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { Transfert } from './models/transfert.model';
import { Beneficiaire } from './models/transfert.model';
import { Banque } from './models/transfert.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app-chaine-depense');
  transferts = signal<Transfert[]>([]);
  beneficiaires = signal<Beneficiaire[]>([]);
  banques = signal<Banque[]>([]);
  newTransfert: Omit<Transfert, 'id'> = {
    num_opi: '',
    num_depense: null,
    num_dossier: null,
    imputation: null,
    num_od: null,
    objet_opi: null,
    montant: 0,
    date_emission: null,
    signataire_nom: 'SULIA KITAMBALA Mireille',
    fk_beneficiaire_id: null,
    fk_banque_id: null
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadTransferts();
    this.loadBeneficiaires();
    this.loadBanques();
  }

  loadTransferts() {
    this.dataService.getTransferts().subscribe({
      next: (data) => this.transferts.set(data),
      error: (err) => console.error('Erreur lors de la récupération des transferts:', err)
    });
  }

   loadBeneficiaires() {
     this.dataService.getBeneficiaires().subscribe({
       next: (data) => {
         console.log('Bénéficiaires reçus:', data);
         this.beneficiaires.set(data);
       },
       error: (err) => console.error('Erreur lors de la récupération des bénéficiaires:', err)
     });
   }

   loadBanques() {
     this.dataService.getBanques().subscribe({
       next: (data) => {
         console.log('Banques reçues:', data);
         this.banques.set(data);
       },
       error: (err) => console.error('Erreur lors de la récupération des banques:', err)
     });
   }

   addTransfert() {
     this.dataService.addTransfert(this.newTransfert).subscribe({
       next: (transfert) => {
         this.transferts.update(list => [...list, transfert]);
         this.resetForm();
       },
       error: (err) => console.error('Erreur lors de l\'ajout du transfert:', err)
     });
   }

   resetForm() {
     this.newTransfert = {
       num_opi: '',
       num_depense: null,
       num_dossier: null,
       imputation: null,
       num_od: null,
       objet_opi: null,
       montant: 0,
       date_emission: null,
       signataire_nom: 'SULIA KITAMBALA Mireille',
       fk_beneficiaire_id: null,
       fk_banque_id: null
     };
   }
 }
