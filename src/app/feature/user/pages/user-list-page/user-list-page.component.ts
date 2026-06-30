import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { IUserFormSearchResolved, UserFormSearchComponent } from "@app/feature/user/ui";

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
    this.resolved = this.route.snapshot.data['resolved'];
  }

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  
  protected resolved!: IUserFormSearchResolved;



}