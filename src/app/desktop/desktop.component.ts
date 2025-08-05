import { Component, OnDestroy } from '@angular/core';
import { ToggleComponent } from '../shared/components/toggle/toggle.component';
import { StockDataService } from '../shared/services/stock-data.service';
import { StockCardComponent } from "../shared/components/stock-card/stock-card.component";
import { IStockResponce } from '../shared/models/StockResponce';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CardStatusEnum } from '../shared/enums/card-status.enum';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [ToggleComponent, StockCardComponent, AsyncPipe],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css'
})
export class DesktopComponent implements OnDestroy {

  stocks = ['AAPL', 'BINANCE:BTCUSDT', 'IC MARKETS:1', 'MSFT', 'AMZN'];
  viewModel!: Observable<{ data: IStockResponce[] | null }>;
  displayKeys = [
    'symbol',
    'price',
    'dailyHigh',
    'dailyLow',
    'week52High',
    'week52Low'
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

  objectEntriesWithoutStatus(card: IStockResponce) {
    return Object.entries(card).filter(([key]) => this.displayKeys.includes(key as keyof IStockResponce));
  }

  onClickToggle(data: boolean, card: IStockResponce) {
    if (data) {
      this.stockDataService.subscribeToSymbol(card);
    } else {
      card.status = CardStatusEnum.OFF;
      this.stockDataService.unsubscribeFromSymbol(card)
    }
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
