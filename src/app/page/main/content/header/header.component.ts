import {Component, effect, EventEmitter, input, OnInit, Output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatMenuModule} from "@angular/material/menu";
import {DialogAction} from "../../../../model/DialogResult";
import {MatDialog} from "@angular/material/dialog";
import {SettingsComponent} from "../../../dialog/settings/settings.component";
import {UserProfile} from "../../../../dto/UserProfile";
import {Priority} from "../../../../dto/Priority";
import {NgIf} from "@angular/common";
import {DeviceDetectorService} from "ngx-device-detector";
import {StatComponent} from "../stat/stat.component";
import {MatToolbarModule} from "@angular/material/toolbar";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, TranslateModule, MatMenuModule, NgIf, StatComponent, MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  userProfile = input.required<UserProfile>();
  categoryName = input.required<string>();

  showSidebar = input.required<boolean>();
  @Output() toggleSidebarEvent = new EventEmitter<boolean>();

  showStat = input.required<boolean>();
  showSearch = input.required<boolean>();
  @Output() toggleStatEvent = new EventEmitter<boolean>();
  @Output() toggleSearchEvent = new EventEmitter<boolean>();

  @Output() logoutEvent = new EventEmitter<void>();
  @Output() settingsChangedEvent = new EventEmitter<Priority[]>();
  isMobile: boolean;
  email = '';

  exit!: string;

  constructor(private dialog: MatDialog,
              private translate: TranslateService,
              deviceService: DeviceDetectorService) {
    this.isMobile = deviceService.isMobile();
    effect(() => {
      if (this.userProfile()) {
        this.email = this.userProfile().email as string;
      }
    })
  }

  ngOnInit(): void {
    this.exit = this.translate.instant('COMMON.EXIT');
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
