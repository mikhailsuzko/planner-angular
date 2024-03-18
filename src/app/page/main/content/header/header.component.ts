import {Component, EventEmitter, input, Output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showSidebar = input.required<boolean>();
  @Output() toggleSidebarEvent = new EventEmitter<boolean>();

  showStat = input.required<boolean>();
  @Output() toggleStatEvent = new EventEmitter<boolean>();

  @Output() logoutEvent = new EventEmitter<void>();

  onToggleMenu() {
    this.toggleSidebarEvent.emit(!this.showSidebar())
  }

  onToggleStat(): void {
    this.toggleStatEvent.emit(!this.showStat());
  }


  logout() {
    this.logoutEvent.emit()
  }
}
