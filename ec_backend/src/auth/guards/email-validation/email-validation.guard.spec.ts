import { EmailValidationGuard } from './email-validation.guard';

describe('EmailValidationGuard', () => {
  it('should be defined', () => {
    expect(new EmailValidationGuard()).toBeDefined();
  });
});
