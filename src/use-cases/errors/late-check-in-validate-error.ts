export class LateCheckInValidateError extends Error {
  constructor() {
    super(
      'The check-in can only be validated unitl 20 minutes of it is creation.',
    )
  }
}
