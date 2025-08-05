import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { RealSocketService } from './real-socket.service';
import { IStockResponce } from '../models/StockResponce';
import { SocketSimulatorService } from './socket-simulator.service';
import { CardStatusEnum } from '../enums/card-status.enum';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  private stocksDataSubject = new BehaviorSubject<IStockResponce[] | null>(null);
  private initialStockData = new Map()

  private receivedSymbols: Set<string> = new Set();
  private expectedSymbols: Set<string> = new Set();
  private symbolResponses!: Record<string, IStockResponce>;

  private messageSub?: Subscription;
  private simulationSub?: Subscription;

  constructor(private realSocketService: RealSocketService,
    private socketSimulatorService: SocketSimulatorService
  ) { this.subscribeToMessages(); }

  private subscribeToMessages(): void {
    this.receivedSymbols.clear();

    this.messageSub = this.realSocketService.getMessages.subscribe(data => {
      for (const trade of data) {
        const symbol = trade.symbol;

        this.symbolResponses[symbol] = { ...trade };
        this.receivedSymbols.add(symbol);
      }

      this.emitCollectedResponses();
      if (this.getSocketDataValue)
        this.startSimulation(this.getSocketDataValue);
    });

    this.simulationSub = this.socketSimulatorService.getSimulatedStockData.subscribe(data => {
      this.updateStockData(data)
    });
  }


  public connectToMultipleSymbols(symbols: string[]): void {
    this.receivedSymbols.clear();
    this.expectedSymbols = new Set(symbols);
    this.symbolResponses = {};
    this.stocksDataSubject.next(null);


    this.realSocketService.connect();

    symbols.forEach(symbol => this.realSocketService.subscribeToSymbol(symbol));
  }

  public subscribeToSymbol(card: IStockResponce) {
    this.realSocketService.subscribeToSymbol(card.symbol);
    this.socketSimulatorService.subscribeToSymbol(card.symbol);
    card.status = CardStatusEnum.ON;
  }

  public unsubscribeFromSymbol(card: IStockResponce) {
    this.realSocketService.unsubscribeFromSymbol(card.symbol);
    this.socketSimulatorService.unsubscribeFromSymbol(card.symbol);
    card.status = CardStatusEnum.OFF;
  }

  private updateStockData(data: IStockResponce[]) {
    const currentArray: IStockResponce[] = data;
    const previousArray = Array.from(this.initialStockData.values());

    this.setStockData = this.getUpdatedCards(previousArray, currentArray);
  }

  private startSimulation(initialData: IStockResponce[]): void {
    this.socketSimulatorService.start(initialData);
  }

  private emitCollectedResponses(): void {
    this.updateStockData(Object.values(this.symbolResponses))
  }

  private getUpdatedCards(
    previous: IStockResponce[],
    current: IStockResponce[]
  ): IStockResponce[] {
    const previousMap = new Map<string, IStockResponce>(
      previous.map(stock => [stock.symbol, stock])
    );

    current.forEach(card => {
      const prev = previousMap.get(card.symbol);

      if (prev?.status === CardStatusEnum.OFF) {
        this.initialStockData.set(card.symbol, prev);
        return;
      }

      let status: 'up' | 'down' | 'on' = 'on';

      if (prev) {
        if (card.price > prev.price) status = 'up';
        else if (card.price < prev.price) status = 'down';
      }

      this.initialStockData.set(card.symbol, { ...card, status });
    });

    return Array.from(this.initialStockData.values());
  }

  set setStockData(data: IStockResponce[]) {
    this.stocksDataSubject.next(data);
  }

  get getSocketData(): Observable<IStockResponce[] | null> {
    return this.stocksDataSubject.asObservable();
  }

  get getSocketDataValue(): IStockResponce[] | null {
    return this.stocksDataSubject.getValue();
  }

  public disconnect(): void {
    this.realSocketService.disconnect();
    this.messageSub?.unsubscribe();
    this.socketSimulatorService.disconnect();
    this.simulationSub?.unsubscribe();
  }
}
