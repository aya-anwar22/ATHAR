import { TestBed } from '@angular/core/testing';

import { AdminBrandService } from './admin-brand.service';

describe('AdminBrandService', () => {
  let service: AdminBrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminBrandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
