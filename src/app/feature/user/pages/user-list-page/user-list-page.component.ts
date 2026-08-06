import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { IUserFormSearchData, IUserFormSearchParams, IUserFormSearchResolved, UserFormSearchComponent } from "@app/feature/user/ui";

@Component({
  standalone: true,
  selector: 'app-user-list-page',
  templateUrl: './user-list-page.component.html',
  styleUrls: ['./user-list-page.component.scss'],
  imports: [
    UserFormSearchComponent
  ]
})
export class UserListPageComponent implements OnInit {

  ngOnInit(): void {
    const resolved: IUserFormSearchResolved = this.route.snapshot.data['resolved'];
    this.data = resolved.data;
    this.params = resolved.params;
  }

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  
  protected params!: IUserFormSearchParams;
  protected data!: IUserFormSearchData;



}