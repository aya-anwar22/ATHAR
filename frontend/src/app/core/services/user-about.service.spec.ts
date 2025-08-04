import { TestBed } from '@angular/core/testing';

import { UserAboutService } from './user-about.service';

describe('UserAboutService', () => {
  let service: UserAboutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAboutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
