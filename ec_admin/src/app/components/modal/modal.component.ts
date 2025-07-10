import { Component, computed, input, output } from '@angular/core';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-modal',
  imports: [ChangePasswordComponent, EditProfileComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  closeModal = output<boolean>();
  menuSelection = input<string>('');
  selectionComputed = computed<string>(() => this.menuSelection());

  handleClick(): void {
    this.closeModal.emit(true);
  }
}
