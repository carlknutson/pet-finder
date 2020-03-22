import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ShelterService } from './services/shelter.service';
import { ChromeStorageService } from './services/chrome-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PetWatch';

  constructor(private changeDetectorRef: ChangeDetectorRef, private shelterService: ShelterService, 
              private chromeStorageService: ChromeStorageService){ }

  pets = [];

  selectedPetType: string;

  filterListTypes = [
    {value: 'all', viewValue: 'All Types'},
    {value: 'dog', viewValue: 'Dog'},
    {value: 'cat', viewValue: 'Cat'},
    {value: 'other', viewValue: 'Other Small Animals'},
  ];

  openShelterSite(site:string) {
    window.open(site, "_blank");
  };

  ngOnInit() {
    this.chromeStorageService.getFilterType().then((value:string) => {
      this.selectedPetType = value;
      this.updatePetList();
    });
  };

  updatePetList() {
    this.chromeStorageService.setFilterType(this.selectedPetType);

    this.shelterService.getPets(this.selectedPetType).then(value => {
      console.log(value);
      this.pets = [];
      this.pets = this.pets.concat(value);
      this.changeDetectorRef.detectChanges();
    });

    // var pets = this.shelterService.getPets(this.selectedPetType)
    // console.log(pets);
      
    // this.pets = [];
    // this.pets = this.pets.concat(pets);
    // this.changeDetectorRef.detectChanges();
  };

  hidePet(index, id) {
    this.chromeStorageService.dismissPet(id);

    this.pets.splice(index, 1);
    this.changeDetectorRef.detectChanges();
  };

  watchPetToggle(index, id, status) {

    // TODO: would boolean take up 4 char in storage?
    if (status == "") {
      status = "W";
    } else {
      status = "";
    }

    this.chromeStorageService.watchPet(id, status);

    this.pets[index].status = status;
    this.changeDetectorRef.detectChanges();
  }

  // TODO: remove
  printCount() {
    console.log("Count of the pets: " + this.pets.length);
  }

}
