import { Component, computed, input, output, signal } from '@angular/core';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ChangeEmailComponent } from '../change-email/change-email.component';

@Component({
  selector: 'app-modal',
  imports: [
    ChangePasswordComponent,
    EditProfileComponent,
    ChangeEmailComponent,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  closeModal = output<boolean>();
  menuSelection = input<string>('');
  selectionComputed = computed<string>(() => this.menuSelection());
  resetComponentValues = signal<boolean>(false);

  handleClick(): void {
    this.resetComponentValues.set(true);

    //Set to true to trigger reset, then back to false so that future changes can be detected by onChanges
    setTimeout(() => {
      this.resetComponentValues.set(false);
    });
    this.closeModal.emit(true);
  }
}
