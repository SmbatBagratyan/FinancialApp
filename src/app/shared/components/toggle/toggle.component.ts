import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css'
})
export class ToggleComponent implements OnChanges {
  isOn = input<boolean>();
  toggleState = true;
  toggleChange = output<boolean>();

  toggle() {
    this.toggleState = !this.toggleState;
    this.toggleChange.emit(this.toggleState);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOn'] && changes['isOn'].currentValue) {
      this.toggleState = changes['isOn'].currentValue;
    }
  }
}
