import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { SuccessDialogService } from '../../services/success-dialog.service';
import { ErrorDialogService } from '../../services/error-dialog.service';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog.component';
import { NewGroupComponent } from './newgroup.component';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})

export class GroupComponent {
  groups: Array<any> = [];

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private groupService: GroupService,
    private successDialogService: SuccessDialogService,
    private errorDialogService: ErrorDialogService,
    public dialog: MdDialog ) {

  }

  ngOnInit() {
    this.getAllGroups();
  }

  getAllGroups(){
    this.groupService.getAllGroups("").subscribe(
      result => {
        this.groups = result;
      },
      error => {
        this.errorDialogService
        .dialogPopup(error.message );
      });
  }

 toGroup(group: any) {
    this.router.navigate(['/home/group',  group._id ]);
 }
 
 createGroup(){
    let dialogRef = this.dialog.open(NewGroupComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe(
      result => {
        if(result) {          
          this.groupService.createGroup(result).subscribe(
            res => {
                this.getAllGroups();
                this.successDialogService.dialogPopup("Group Created " + result.name);               
            },
            err => this.errorDialogService.dialogPopup(err.message)
          );
        }
      }
    );
  }
  

  deleteGroup(group: any){
    let dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.dialogText = "Delete Group " + group.name + "?";
    dialogRef.componentInstance.confirmText = "Delete";
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.groupService.deleteGroup(group._id).subscribe(
            result => {
              this.getAllGroups();
              this.successDialogService
              .dialogPopup('Successfully deleted: ' + group.name);
            },
            error => this.errorDialogService
            .dialogPopup(error.message + ': ' + group.name)
            ); // End Delete Group Subscribe
        } // End if
      } // End result
     ); // End subscribe

  } // End function



}