import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, timer } from 'rxjs';
import { AlertMessage, AlertService, AlertType } from 'src/app/shared/services/alert-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toast',
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast implements OnInit,OnDestroy {
  faInfoCircle=faInfoCircle;

  message: string | null = null;
  alertType: AlertType = AlertType.Info;
  alertClass: string = '';

  alertService = inject(AlertService)


  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.alertService.alert$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ message, type, autoClose }:AlertMessage) => {
        this.message = message;
        this.alertType = type;
        this.setAlertClass();

        if (autoClose) {
          timer(5000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.closeAlert());
        }
      });
  }

 

  setAlertClass(): void {
    switch (this.alertType) {
      case AlertType.Success:
        this.alertClass = 'alert-success';
        break;
      case AlertType.Error:
        this.alertClass = 'alert-error';
        break;
      case AlertType.Warning:
        this.alertClass = 'alert-warning';
        break;
      case AlertType.Info:
      default:
        this.alertClass = 'alert-info';
        break;
    }
  }


  closeAlert(): void {
    this.message = null;
    this.alertType = AlertType.Info;
    this.alertClass = '';
  }

   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
