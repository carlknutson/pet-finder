import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMParser } from 'dom-parser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'petfinder';

  constructor(private http: HttpClient){ }

  pets = [];

  ngOnInit() {
    // make call to animalhumanesociety
    this.http.get('https://www.animalhumanesociety.org/adoption', { responseType: 'text' }).subscribe(data => {
          console.log(data);
          var DomParser = require('dom-parser');
          var parser = new DomParser();
          var httpDoc = parser.parseFromString(data,"text/html");
          console.log(httpDoc);

          var petDataList = [];
          var petList = httpDoc.getElementsByClassName('field--name-name');
          var imageList = httpDoc.getElementsByClassName('field--name-field-main-image');

          // for each, parse out: animalID, cloudfront url, name,
          //LATER implement following: breed, sex/year, location
          var i;
          for (i = 0; i < petList.length; i++) {
            var petObj = petList[i].getElementsByTagName('a');
            var imageObj = imageList[i].getElementsByTagName('img');
            var pet = {};
            console.log(imageObj);
            pet['name'] = petObj[0]['innerHTML'];
            pet['id'] = petObj[0].attributes[0].value;
            pet['img'] = imageObj[0].attributes[0].value;
            petDataList.push(pet);
          }
          console.log(petDataList);

          this.pets = petDataList;

          chrome.storage.local.set({key: 'testing the value'}, function() {
            console.log('Value is set to ' + 'testing the value');
          });

          chrome.storage.local.get(['0','key', '121'], function(result) {
            if (result['0'] == null) {
              console.log('key:0 results are empty');
            } else {
              console.log('key:0 results are not empty');
            }
            if (result['key'] == null) {
              console.log('key:key results are empty');
            } else {
              console.log('key:key results are not empty');
            }
          });
    });


    // remove any 'dismissed' pets from list that will be shown
  }

}
