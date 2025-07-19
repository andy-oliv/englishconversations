import {
  Component,
  computed,
  effect,
  input,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { UserStateService } from '../../services/user-state.service';
import { HttpClient } from '@angular/common/http';
import { LogService } from '../../services/log.service';
import dayjs from 'dayjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { State, StatesSchema } from '../../../schemas/state.schema';
import { CitiesSchema, City } from '../../../schemas/city.schema';
import { exceptionMessages } from '../../../common/messages/exceptionMessages';
import { environment } from '../../../environments/environment';
import { UserSchema } from '../../../schemas/user.schema';
import { ToastService } from '../../services/toast.service';
import { ToastTypes } from '../../../common/types/ToastTypes';
import { toastMessages } from '../../../common/messages/toastMessages';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent implements OnInit, OnChanges {
  profileForm: FormGroup;
  user = computed(() => this.userService.userSignal());
  inputType = signal<string>('text');
  birthdate = signal<string>('');
  states = signal<State[]>([]);
  cities = signal<City[]>([]);
  previewUrl = signal<string | null>(null);
  isClosed = output<boolean>();
  setClosed = input<boolean>(false);
  loading = signal<boolean>(false);

  constructor(
    private readonly userService: UserStateService,
    private formBuilder: FormBuilder,
    private readonly httpClient: HttpClient,
    private readonly logService: LogService,
    private readonly toastService: ToastService,
    private readonly imageService: ImageService,
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.minLength(2)]],
      bio: [''],
      birthdate: [''],
      city: [''],
      state: [''],
      country: [''],
      file: [null],
    });

    effect(() => {
      this.setDefault();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.setClosed()) {
      this.closeModal();
    }
  }

  ngOnInit(): void {
    this.fetchStates();
  }

  setDefault(): void {
    const user = this.user();
    if (!user) return;

    this.profileForm.patchValue({
      name: user.name ?? '',
      bio: user.bio ?? '',
      birthdate: user.birthdate
        ? dayjs(user.birthdate).add(1, 'day').format('YYYY-MM-DD')
        : '',
    });
  }

  fetchStates(): void {
    const stateSubscription = this.httpClient.get<State[]>(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
    );

    stateSubscription.subscribe({
      next: (response) => {
        const parsedData = StatesSchema.safeParse(response);
        if (parsedData.success) {
          this.states.set(parsedData.data);
          if (this.user()?.state) {
            this.profileForm.get('state')?.setValue(this.user()?.state);
          }
          this.fetchCities();
        } else {
          this.logService.logError(
            exceptionMessages.zod,
            parsedData.error.issues,
          );
        }
      },
      error: (error) => {
        this.logService.logError(
          exceptionMessages.editProfile.stateFetch,
          error,
        );
      },
    });
  }

  fetchCities(): void {
    let selectedState: string | null | undefined =
      this.profileForm.get('state')?.value;

    let uf: State | undefined = this.states().find(
      (state) => state.sigla === selectedState,
    );

    const citySubscription = this.httpClient.get<City[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf?.id}/municipios`,
    );

    citySubscription.subscribe({
      next: (response) => {
        const parsedData = CitiesSchema.safeParse(response);
        if (parsedData.success) {
          this.cities.set(parsedData.data);
          if (
            this.user()?.city &&
            this.profileForm.get('state')?.value === this.user()?.state
          ) {
            this.profileForm.get('city')?.setValue(this.user()?.city);
          } else {
            this.profileForm.get('city')?.setValue('n/a');
          }
        } else {
          this.logService.logError(
            exceptionMessages.zod,
            parsedData.error.issues,
          );
        }
      },
      error: (error) => {
        this.logService.logError(
          exceptionMessages.editProfile.cityFetch,
          error,
        );
      },
    });
  }

  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (this.previewUrl()) {
        URL.revokeObjectURL(this.previewUrl()!);
      }

      const resizedImage = await this.imageService.resizeImage(file, 600, 600);

      this.profileForm.get('file')?.setValue(resizedImage);
      this.previewUrl.set(URL.createObjectURL(resizedImage));
    } else {
      this.profileForm.get('file')?.setValue(null);
      this.previewUrl.set(null);
    }
  }

  saveChanges(): void {
    this.loading.set(true);
    const formData = new FormData();
    formData.append(
      'metadata',
      `{"name": "${this.profileForm.get('name')?.value}", "bio":"${this.profileForm.get('bio')?.value}", "birthdate": "${this.profileForm.get('birthdate')?.value}", "state": "${this.profileForm.get('state')?.value}", "city":"${this.profileForm.get('city')?.value}"}`,
    );

    if (this.profileForm.get('file')?.value) {
      formData.append('file', this.profileForm.get('file')?.value);
    }

    const subscription = this.httpClient.patch<{
      message: string;
      data: unknown;
    }>(`${environment.apiUrl}/users/${this.user()?.id}`, formData, {
      withCredentials: true,
    });

    subscription.subscribe({
      next: (response) => {
        this.loading.set(false);
        const parsedData = UserSchema.safeParse(response.data);
        if (parsedData.success) {
          this.isClosed.emit(true);
          this.userService.fetchUser();
          this.toastService.toast.set({
            type: ToastTypes.SUCCESS,
            message: toastMessages.editProfile.status_200,
            duration: 2000,
          });

          this.toastService.callToast(this.toastService.toast().duration);
        } else {
          this.isClosed.emit(true);
          this.toastService.toast.set({
            type: ToastTypes.FAILURE,
            message: toastMessages.editProfile.status_500,
            duration: 5000,
          });

          this.toastService.callToast(this.toastService.toast().duration);

          this.logService.logError(
            exceptionMessages.zod,
            parsedData.error.issues,
          );
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.isClosed.emit(true);
        this.toastService.toast.set({
          type: ToastTypes.FAILURE,
          message: toastMessages.editProfile.status_500,
          duration: 5000,
        });

        this.toastService.callToast(this.toastService.toast().duration);
        this.logService.handleException(error, 'editProfile');
      },
    });
  }

  closeModal(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    URL.revokeObjectURL(this.previewUrl()!);
    this.previewUrl.set(null);
    this.profileForm.get('file')?.setValue(null);
    this.setDefault();
    this.fetchStates();

    this.isClosed.emit(true);
  }
}
