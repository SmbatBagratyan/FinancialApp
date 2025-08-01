import { CommonModule } from '@angular/common';
import { Component, ContentChild, input, TemplateRef } from '@angular/core';
import { IStockResponce } from '../../models/StockResponce';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-card.component.html',
  styleUrl: './stock-card.component.css'
})
export class StockCardComponent {
  @ContentChild('content') content!: TemplateRef<any>;
  @ContentChild('toggle') toggle!: TemplateRef<any>;
  data = input<IStockResponce[]>();
  bgColor = input<string>()

}
