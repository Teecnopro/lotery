import { CommonModule } from "@angular/common";
import { SellerFormComponent } from "../components/seller-form/form.component";
import { SELLER_REPOSITORY } from "../../../domain/sellers/ports";
import { FirebaseSellerAdapter } from "../../../infrastructure/sellers/firebase-seller.adapter";
import { NOTIFICATION_PORT } from "../../../shared/ports";
import { MaterialNotificationAdapter } from "../../../shared/infrastructure/matsnackbar-notification.adapter";
import { SellerUseCase } from "../../../domain/sellers/use-cases";
import { ISeller } from "../../../domain/sellers/models/seller.model";
import { Subject } from "rxjs";
import { Component, OnDestroy } from "@angular/core";
import { SellerTableComponent } from "../components/seller-table/table.component";
import { MaterialModule } from "../../../shared/material/material.module";
import { LOG_BOOK_SERVICE } from "../../../domain/logBook/ports";
import { LogBookAdapter } from "../../../infrastructure/logBook/logBook.adapter";
import { LogBookUseCases } from "../../../domain/logBook/use-cases/logBook.usecases";

@Component({
  selector: 'app-seller-page',
  standalone: true,
  imports: [SellerFormComponent, SellerTableComponent, CommonModule, MaterialModule],
  providers: [
    {
      provide: SELLER_REPOSITORY,
      useClass: FirebaseSellerAdapter,
    },
    {
      provide: NOTIFICATION_PORT,
      useClass: MaterialNotificationAdapter,
    },
    {
      provide: LOG_BOOK_SERVICE,
      useClass: LogBookAdapter
    },
    LogBookUseCases,
    SellerUseCase,
  ],
  templateUrl: './seller.page.html',
  styleUrls: ['./seller.page.scss'],
})
export class SellerPageComponent implements OnDestroy {
  sellerObservable: Subject<ISeller> = new Subject<ISeller>();
  updateTable: Subject<boolean> = new Subject<boolean>();
  showFormObservable: Subject<boolean> = new Subject<boolean>();
  showForm: boolean = false;
  isMobile: boolean = false;
  
  ngOnInit() {
    this.showFormObservable.next(false);
    this.showFormObservable.subscribe((editing) => {
      this.showForm = editing;
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.showFormObservable.next(this.showForm);
  }

  ngOnDestroy() {
    // Cerrar los Subjects cuando el componente padre se destruye
    this.sellerObservable.complete();
    this.updateTable.complete();
    this.showFormObservable.complete();
  }
}