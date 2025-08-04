import { TestBed } from '@angular/core/testing';

import { AdminSubcategoryService } from './admin-subcategory.service';

describe('AdminSubcategoryService', () => {
  let service: AdminSubcategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminSubcategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
