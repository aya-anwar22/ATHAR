import { TestBed } from '@angular/core/testing';

import { HandleProfileByAdminService } from './handle-profile-by-admin.service';

describe('HandleProfileByAdminService', () => {
  let service: HandleProfileByAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleProfileByAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
