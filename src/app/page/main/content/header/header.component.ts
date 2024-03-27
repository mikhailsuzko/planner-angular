import {Component, EventEmitter, input, Output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {MatMenuModule} from "@angular/material/menu";
import {DialogAction} from "../../../../model/DialogResult";
import {MatDialog} from "@angular/material/dialog";
import {SettingsComponent} from "../../../dialog/settings/settings.component";
import {UserProfile} from "../../../../dto/UserProfile";
import {Priority} from "../../../../dto/Priority";
import {NgIf} from "@angular/common";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, TranslateModule, MatMenuModule, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userProfile = input.required<UserProfile>();

  showSidebar = input.required<boolean>();
  @Output() toggleSidebarEvent = new EventEmitter<boolean>();

  showStat = input.required<boolean>();
  showSearch = input.required<boolean>();
  @Output() toggleStatEvent = new EventEmitter<boolean>();
  @Output() toggleSearchEvent = new EventEmitter<boolean>();

  @Output() logoutEvent = new EventEmitter<void>();
  @Output() settingsChangedEvent = new EventEmitter<Priority[]>();
  isMobile: boolean;


  constructor(private dialog: MatDialog,
              deviceService: DeviceDetectorService) {
    this.isMobile = deviceService.isMobile();
  }

  onToggleMenu() {
    this.toggleSidebarEvent.emit(!this.showSidebar())
  }

  onToggleStat(): void {
    this.toggleStatEvent.emit(!this.showStat());
  }

  onToggleSearch(): void {
    this.toggleSearchEvent.emit(!this.showSearch());
  }


  logout() {
    this.logoutEvent.emit()
  }

  showSettings() {
    const dialogRef = this.dialog.open(SettingsComponent,
      {
        autoFocus: false,
        width: '600px',
        minHeight: '300px',
        data: [this.userProfile],
        maxHeight: '90vh'
      },
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === DialogAction.SETTINGS_CHANGE) {
        this.settingsChangedEvent.emit(result.obj);
      }
    });
  }
}
