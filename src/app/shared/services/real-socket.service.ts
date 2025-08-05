import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { IStockResponce } from '../models/StockResponce';

@Injectable({
  providedIn: 'root'
})
export class RealSocketService {

  private socket: WebSocket | null = null;
  private readonly url = 'wss://ws.finnhub.io?token=d26ab8pr01qh25lmk5hgd26ab8pr01qh25lmk5i0';
  private messageSubject = new Subject<any>();

  private onOpen = this.handleOpen.bind(this);
  private onMessage = this.handleMessage.bind(this);
  private onClose = this.handleClose.bind(this);
  private onError = this.handleError.bind(this);

  public connect(): void {
    if (this.socket) return;

    this.socket = new WebSocket(this.url);

    this.socket.addEventListener('open', this.onOpen);
    this.socket.addEventListener('message', this.onMessage);
    this.socket.addEventListener('close', this.onClose);
    this.socket.addEventListener('error', this.onError);
  }

  private handleOpen(): void {
    console.log('WebSocket connected.');
  }

  private handleMessage(event: MessageEvent): void {
    const data = JSON.parse(event.data);
    if (!Array.isArray(data?.data)) {
      console.warn('Ignored:', data);
      return;
    }
    const transformedData: IStockResponce[] = data.data.map((trade: any) => {
      return {
        symbol: trade.s,
        price: trade.p,
        dailyHigh: undefined,
        dailyLow: undefined,
        week52High: undefined,
        week52Low: undefined
      };
    });

    this.setMessages = transformedData;

  }

  private handleClose(): void {
    console.log('WebSocket closed.');
    this.cleanupSocket();
  }

  private handleError(error: Event): void {
    console.error('WebSocket error', error);
  }

  public subscribeToSymbol(symbol: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'subscribe', symbol }));
    } else {
      this.socket?.addEventListener('open', () => {
        this.socket?.send(JSON.stringify({ type: 'subscribe', symbol }));
      });
    }
  }

  unsubscribeFromSymbol(symbol: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
  }

  set setMessages(data: IStockResponce[]) {
    this.messageSubject.next(data);
  }

  get getMessages() {
    return this.messageSubject.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeEventListener('open', this.onOpen);
      this.socket.removeEventListener('message', this.onMessage);
      this.socket.removeEventListener('close', this.onClose);
      this.socket.removeEventListener('error', this.onError);

      this.socket.close();
      this.cleanupSocket();
    }
  }

  private cleanupSocket(): void {
    this.socket = null;
  }
}
