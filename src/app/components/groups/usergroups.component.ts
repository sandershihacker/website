import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { UserService } from '../../services/user.service';
import { SuccessDialogService } from '../../services/success-dialog.service';
import { ErrorDialogService } from '../../services/error-dialog.service';
import { GroupService } from '../../services/group.service';
import { NewGroupComponent } from './newgroup.component';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog.component';

@Component({
  selector: 'user-groups',
  templateUrl: './usergroups.component.html',
  styleUrls: ['./usergroups.component.scss']
})

export class UserGroupsComponent {
  groups: Array<any> = [];

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private groupService: GroupService, 
    private successDialogService: SuccessDialogService,
    private errorDialogService: ErrorDialogService,
    private userService: UserService,
    public dialog: MdDialog) {

  }

  ngOnInit() {
    this.loadUserGroups();
  }

  loadUserGroups(){
    this.userService.getUser().subscribe(
      result => this.groups = result.groups,
      error => this.router.navigate(['/home'])
      );
  }
  gotoGroup(id: string) {
    this.router.navigate(['/home/group', id ]);    
  }


  createGroup(){
    let dialogRef = this.dialog.open(NewGroupComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe(
      result => {
        if(result) {          
          this.groupService.createGroup(result).subscribe(
            res => {
              this.loadUserGroups();
              this.successDialogService.dialogPopup("Group Created " + result.name);               
            },
            err => this.errorDialogService.dialogPopup(err.message)
            );
        }
      }
      );
  }


  leaveGroup(group: any){
    let dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.dialogText = "Leave Group " + group.name + "?";
    dialogRef.componentInstance.confirmText = "Leave";
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.userService.leaveGroup(group.group_id).subscribe(
            result => {
              this.loadUserGroups();
              this.successDialogService
              .dialogPopup('Left group: ' + group.name);
            },
            error => this.errorDialogService
            .dialogPopup(error.message + ': ' + group.name)
            ); // End Delete Group Subscribe
        } // End if
      } // End result
      ); // End subscribe

  } // End function

}