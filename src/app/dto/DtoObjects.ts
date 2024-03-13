export class SearchValues {
  constructor(readonly searchString: String) {
  }
}

export class DataResult {
  constructor(readonly data: String) {
  }
}


export class UserProfile {
  constructor(
    readonly givenName: String,
    readonly familyName: String,
    readonly address: String,
    readonly email: String,
    readonly id: String,
  ) {
  }
}
