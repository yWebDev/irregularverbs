import { Component, OnInit, inject } from '@angular/core';
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  imports: [MatButtonToggleGroup, MatButtonToggle, TranslatePipe],
})
export class LanguageSwitcherComponent implements OnInit {
  private readonly translate = inject(TranslateService);

  protected currentLang = 'en';

  ngOnInit(): void {
    this.currentLang = this.translate.getCurrentLang();
    this.translate.onLangChange.subscribe((e) => {
      this.currentLang = e.lang;
    });
  }

  protected onLangSelect(event: MatButtonToggleChange): void {
    if (event.value) {
      this.translate.use(event.value);
    }
  }
}
