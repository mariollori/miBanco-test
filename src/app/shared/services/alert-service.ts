import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum AlertType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

export interface AlertMessage {
  message: string;
  type: AlertType;
  autoClose?: boolean;
}

@Injectable({
  providedIn: 'root' 
})
export class AlertService {

  private alertSubject = new Subject<AlertMessage>();

  alert$: Observable<AlertMessage> = this.alertSubject.asObservable();

  success(message: string, autoClose: boolean = true): void {
    this.alertSubject.next({ message, type: AlertType.Success, autoClose });
  }

  error(message: string, autoClose: boolean = false): void {
    this.alertSubject.next({ message, type: AlertType.Error, autoClose });
  }

  warning(message: string, autoClose: boolean = true): void {
    this.alertSubject.next({ message, type: AlertType.Warning, autoClose });
  }

  info(message: string, autoClose: boolean = true): void {
    this.alertSubject.next({ message, type: AlertType.Info, autoClose });
  }
}