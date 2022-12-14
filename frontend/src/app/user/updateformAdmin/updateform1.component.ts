import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from '../model/address';
import { Bank } from '../model/bank';
import { Userr } from '../model/userr';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-updateform1',
  templateUrl: './updateform1.component.html',
  styleUrls: ['./updateform1.component.css'],
})
export class Updateform1Component implements OnInit {
  id: string;
  username: string = '';
  user: Userr = {
    id: '',
    roles: '',
    email: '',
    active: true,
  };
  roles: string = '';
  bank: Bank = {};
  address: Address = {};
  val: boolean = false;

  constructor(private service: ServiceService, private router: Router) {}

  ngOnInit(): void {
    this.id=this.service.getId();
  }

  onsubmit(updateForm: NgForm): void {
    console.log('data in ng form' + updateForm.value.usertype);
    console.log('data in ng form' + updateForm.value.username);
    console.log('data in ng form' + updateForm.value.accountno);
    
    this.user.roles = updateForm.value.usertype;
    this.user.fullName = updateForm.value.fullname;
    this.user.userName = updateForm.value.username;
    this.user.email = updateForm.value.email;
    this.user.phoneNumber = updateForm.value.mobileno;
    this.user.active = true;

    this.bank.accountHolderName = updateForm.value.accountname;
    this.bank.bankName = updateForm.value.bankname;
    this.bank.bankBranch = updateForm.value.bankbranch;
    this.bank.bankIFSC = updateForm.value.ifsccode;
    this.bank.accountNo = updateForm.value.accountno;

    this.address.city = updateForm.value.city;
    this.address.country = updateForm.value.country;
    this.address.houseNo = updateForm.value.houseno;
    this.address.streetName = updateForm.value.streetname;

    this.address.localityName = updateForm.value.localityname;
    this.address.pincode = updateForm.value.pincode;
    this.address.state = updateForm.value.state;

    this.user.bank = this.bank;
    this.user.address = this.address;

    console.log('requested user data is:');
    console.log(this.user);

    this.service.updateUser(this.id, this.user).subscribe((data) => {
      console.log('updated data is:');
      console.log(data);
    });
  }

  goToAdminPage() {
    this.router.navigate(['admin']);
  }
}
