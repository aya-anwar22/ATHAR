import { TestBed } from '@angular/core/testing';

import { AdminAboutService } from './admin-about.service';

describe('AdminAboutService', () => {
  let service: AdminAboutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAboutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
