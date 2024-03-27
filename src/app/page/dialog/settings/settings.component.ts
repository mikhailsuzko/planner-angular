import {Component, OnInit} from '@angular/core';
import {Priority} from "../../../dto/Priority";
import {LANG_EN, LANG_RU} from "../../main/main.component";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {PriorityService} from "../../../dao/impl/PriorityService";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DialogAction, DialogResult} from "../../../model/DialogResult";
import {MatTabsModule} from "@angular/material/tabs";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {PrioritiesComponent} from "./priorities/priorities.component";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatDialogModule, MatTabsModule, TranslateModule, PrioritiesComponent,
    MatRadioModule, MatButtonModule,
    NgIf, NgClass, FormsModule, NgOptimizedImage],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  priorities!: Priority[];
  settingsChanged = false;
  lang: string;
  isLoading!: boolean;

  en = LANG_EN;
  ru = LANG_RU;

  constructor(private dialogRef: MatDialogRef<SettingsComponent>,
              private priorityService: PriorityService,
              private translate: TranslateService) {
    this.lang = translate.currentLang;
  }

  ngOnInit(): void {
    this.loadPriorities();
  }

  private loadPriorities(): void {
    this.isLoading = true;
    this.priorityService.findAll().subscribe(priorities => {
      this.priorities = priorities;
      this.isLoading = false;
    });
  }

  close(): void {
    if (this.settingsChanged) {
      this.dialogRef.close(new DialogResult(DialogAction.SETTINGS_CHANGE, this.priorities));
    } else {
      this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
    }
  }


  addPriority(priority: Priority): void {
    this.settingsChanged = true;
    this.priorityService.add(priority).subscribe(result => {
      this.priorities.push(result);
    });
  }

  deletePriority(priority: Priority): void {
    this.settingsChanged = true;
    this.priorityService.delete(priority.id!).subscribe(() => {
        this.priorities.splice(this.getPriorityIndex(priority), 1);
      }
    );
  }

  updatePriority(priority: Priority): void {
    this.settingsChanged = true;
    this.priorityService.update(priority).subscribe(() => {
        this.priorities[this.getPriorityIndex(priority)] = priority;
      }
    );
  }

  getPriorityIndex(priority: Priority): number {
    const tmpPriority = this.priorities.find(t => t.id === priority.id)!;
    return this.priorities.indexOf(tmpPriority);
  }

  langChanged(): void {
    this.translate.use(this.lang);
    this.settingsChanged = true;
  }
}
