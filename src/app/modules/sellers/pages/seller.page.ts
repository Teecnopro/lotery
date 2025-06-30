import { CommonModule } from "@angular/common";
import { SellerFormComponent } from "../components/seller-form/form.component";
import { SELLER_REPOSITORY } from "../../../domain/sellers/ports";
import { FirebaseSellerAdapter } from "../../../infrastructure/sellers/firebase-seller.adapter";
import { NOTIFICATION_PORT } from "../../../shared/ports";
import { MaterialNotificationAdapter } from "../../../shared/infrastructure/matsnackbar-notification.adapter";
import { SellerUseCase } from "../../../domain/sellers/use-cases";
import { ISeller } from "../../../domain/sellers/models/seller.model";
import { Subject } from "rxjs";
import { Component } from "@angular/core";
import { SellerTableComponent } from "../components/seller-table/table.component";

@Component({
  selector: 'app-seller-page',
  standalone: true,
  imports: [SellerFormComponent, SellerTableComponent, CommonModule],
  providers: [
    {
      provide: SELLER_REPOSITORY,
      useClass: FirebaseSellerAdapter,
    },
    {
      provide: NOTIFICATION_PORT,
      useClass: MaterialNotificationAdapter,
    },
    SellerUseCase,
  ],
  templateUrl: './seller.page.html',
  styleUrls: ['./seller.page.scss'],
})
export class SellerPageComponent {
  sellerObservable: Subject<ISeller> = new Subject<ISeller>();
  updateTable: Subject<boolean> = new Subject<boolean>();
}