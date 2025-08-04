import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubCategoryComponent } from './admin-sub-category.component';

describe('AdminSubCategoryComponent', () => {
  let component: AdminSubCategoryComponent;
  let fixture: ComponentFixture<AdminSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSubCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
