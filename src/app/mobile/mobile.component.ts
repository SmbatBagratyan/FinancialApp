import { Component, OnDestroy } from '@angular/core';
import { StockDataService } from '../shared/services/stock-data.service';
import { map, Observable } from 'rxjs';
import { IStockResponce } from '../shared/models/StockResponce';
import { StockCardComponent } from "../shared/components/stock-card/stock-card.component";
import { AsyncPipe } from '@angular/common';
import { ToggleComponent } from "../shared/components/toggle/toggle.component";
import { CardStatusEnum } from '../shared/enums/card-status.enum';

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [StockCardComponent, AsyncPipe, ToggleComponent],
  templateUrl: './mobile.component.html',
  styleUrl: './mobile.component.css'
})
export class MobileComponent implements OnDestroy {

  stocks = ['AAPL', 'BINANCE:BTCUSDT', 'MSFT', 'AMZN'];
  viewModel!: Observable<{ data: IStockResponce[] | null }>;
  displayKeys = [
    'symbol',
    'price',
    'dailyHigh',
    'dailyLow'
  ];

  constructor(private stockDataService: StockDataService) {
    this.stockDataService.connectToMultipleSymbols(this.stocks);
    this.initViewModel();
  }

  initViewModel() {
    this.viewModel = this.stockDataService.getSocketData.pipe(
      map((data) => ({ data }))
    )
  }

  onClickToggle(data: boolean, card: IStockResponce) {
    if (data) {
      this.stockDataService.subscribeToSymbol(card);
    } else {
      this.stockDataService.unsubscribeFromSymbol(card)
    }
  }

  objectEntriesWithoutStatus(card: IStockResponce) {
    return Object.entries(card).filter(([key]) => this.displayKeys.includes(key as keyof IStockResponce));
  }

  getCardColor(status: string | undefined): string {
    switch (status) {
      case 'up':
        return 'green';
      case 'down':
        return 'red';
      case 'off':
        return 'gray';
      default:
        return 'brown';
    }
  }

  ngOnDestroy(): void {
    this.stockDataService.disconnect();
  }

}
