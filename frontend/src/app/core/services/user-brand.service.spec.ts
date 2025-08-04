import { TestBed } from '@angular/core/testing';

import { UserBrandService } from './user-brand.service';

describe('UserBrandService', () => {
  let service: UserBrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserBrandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
