import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription, timer } from 'rxjs';
import { IStockResponce } from '../models/StockResponce';
import { StockDataService } from './stock-data.service';

@Injectable({
  providedIn: 'root'
})
export class SocketSimulatorService {

  private stockDataSubject = new BehaviorSubject<IStockResponce[]>([]);
  private simulationSub?: any;
  private currentData: IStockResponce[] = [];
  private unSubscribedSymbols = new Set<string>('');

  constructor() { }

  public start(initialData: IStockResponce[]): void {
    if (this.simulationSub) return;

    this.currentData = initialData;

    this.setSimulatedStockData = this.currentData;

    this.simulationSub = setInterval(() => {
      this.currentData = this.currentData.map(stock => ({
        ...stock,
        price: this.getUpdatedPrice(stock.price, stock.symbol)
      }));

      this.setSimulatedStockData = this.currentData;
    }, 16000)

  }

  public unsubscribeFromSymbol(symbol: string): void {
    this.unSubscribedSymbols.add(symbol);
  }

  public subscribeToSymbol(symbol: string) {
    if (this.unSubscribedSymbols.has(symbol)) {
      this.unSubscribedSymbols.delete(symbol);
    }
  }

  set setSimulatedStockData(data: IStockResponce[]) {
    this.stockDataSubject.next(data);
  }

  get getSimulatedStockData() {
    return this.stockDataSubject.asObservable();
  }

  private getUpdatedPrice(current: number, symbol: string): number {
    if (this.unSubscribedSymbols.has(symbol)) return current;
    const variation = current * (Math.random() * 0.03 - 0.015);
    return +(current + variation).toFixed(2);
  }

  public disconnect(): void {
    clearInterval(this.simulationSub);
  }
}
