
export interface IStockResponce {
    symbol: string;
    price: number;
    dailyHigh: number;
    dailyLow: number;
    week52High: number;
    week52Low: number;
    status?: 'up' | 'down' | 'off' | 'on';
}