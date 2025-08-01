import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCardTemplateComponent } from './stock-card-template.component';

describe('StockCardTemplateComponent', () => {
  let component: StockCardTemplateComponent;
  let fixture: ComponentFixture<StockCardTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockCardTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockCardTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
