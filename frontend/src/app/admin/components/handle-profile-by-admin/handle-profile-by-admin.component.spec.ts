import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleProfileByAdminComponent } from './handle-profile-by-admin.component';

describe('HandleProfileByAdminComponent', () => {
  let component: HandleProfileByAdminComponent;
  let fixture: ComponentFixture<HandleProfileByAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleProfileByAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleProfileByAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
