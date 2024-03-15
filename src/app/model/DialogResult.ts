export class DialogResult {
  action: DialogAction;
  obj: any;


  constructor(action: DialogAction, obj?: any) {
    this.action = action;
    this.obj = obj;
  }
}

export enum DialogAction {
  SETTINGS_CHANGE,
  SAVE,
  OK,
  CANCEL,
  DELETE,
  COMPLETE,
  ACTIVATE
}
