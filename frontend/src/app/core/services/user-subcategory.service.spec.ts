import { TestBed } from '@angular/core/testing';
import { UserSubCategoryService } from './user-subcategory.service';


describe('UserSubcategoryService', () => {
  let service: UserSubCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSubCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
