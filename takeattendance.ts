import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController  } from 'ionic-angular';
import {Http,Response,Request,Headers} from  '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { StudentsProvider } from '../../providers/students/students';
import { ToastController, LoadingController } from 'ionic-angular';
import {FormsModule} from '@angular/forms';
import { PeriodpagePage } from '../periodpage/periodpage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotocapturePage } from '../photocapture/photocapture';
/**
 * Generated class for the TakeattendancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-takeattendance',
  templateUrl: 'takeattendance.html',

})
export class TakeattendancePage implements OnInit {
  students: any[] ;
  photo: string;
  username: string;
  loading:any;
  selectedClass: string = 'presentClass';
  labelValue: string = 'P';
  value:string;
  className:string;
  attStatus_1:string = 'A';
  studentsdata : any[] = [{}];
  result:any;
 schoolId = localStorage.getItem('schoolId');
 branchId = localStorage.getItem('branchId');
classId = localStorage.getItem('classId');
sectionId = localStorage.getItem('sectionId');
myClassName = localStorage.getItem('myClassName');
mySectionName = localStorage.getItem('mySectionName');
periodId = localStorage.getItem('periodId');
periodName = localStorage.getItem('periodName');
studentData:any;
imageData:any;
imageStatus:any;
student_id: any;
image_data: any;
  constructor(private alert:AlertController, private camera: Camera,private el: ElementRef,public loadingCtrl: LoadingController,private toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams, private http:Http, private studentService: StudentsProvider) {
   // this.changePresent();
   //this.selectedClass = 'presentClass';
  //this.getStudents();
//this.loadingAbsent();
}
  ngOnInit(): void {
   // this.statusValue  = 'P';
  this.username = localStorage.getItem('loginUser');
  this.schoolId = localStorage.getItem('schoolId');

   console.log(this.username);
    this.getStudents();

  }

  ionViewDidLoad() {
   // this.students.pop();
    console.log('ionViewDidLoad TakeattendancePage');
  }
  ionViewCanLeave()
  {
    this.students.pop();
  }
  getStudents()
  {
    this.loadingPresent();
  this.studentService.getStudents(this.classId,this.sectionId,this.branchId,this.schoolId,this.periodId).subscribe(resp=>{ this.students  = resp;  },err=>{console.log('Unable to Load Data')}, ()=>this.loadingAbsent());
  //this.getStudents();
}
  radioChange(studentId,value)
  {

  }
  adminlogin()
  {

  }
  imageUpload(studentId,imageData)
  {
    this.studentService.updatePhoto(studentId,imageData).subscribe(res => {this.imageStatus = res['_body'] ; if(this.imageStatus =='Inserted'){ this.successToast();} else { this.errorToast();}}, error => {this.result = error['_body']; },()=>this.loadingAbsent());

  }


  //loading pannel
  loadingPresent() {

        this.loading = this.loadingCtrl.create({
          content: 'Loading...'
        });
         this.loading.present();


      }
      loadingAbsent(){

          this.loading.dismiss();

      }
/*
      changeStatus(event: Event): void{


       if((event.target as Element).className == 'presentClass activated')
       {

        (event.target as Element).closest('.div4').querySelector('input').setAttribute('ng-reflect-model','A');
        (event.target as Element).closest('.div4').querySelector('input').setAttribute('value','A');
        (event.target as Element).closest('.div4').querySelector('input').value = 'A';
        (event.target as Element).closest('.div4').querySelector('input').className= 'txt ng-valid ng-touched ng-dirty';

        // (event.target as Element).closest('.div4').querySelector('.txt').nodeValue = 'A';
        // this.statusValue = 'A';
         console.log((event.target as Element).className);
        (event.target as Element).className = 'absentClass';
        (event.target as Element).innerHTML = 'A';



       }

      if((event.target as Element).className == 'absentClass activated')
       {
     (event.target as Element).closest('.div4').querySelector('input').setAttribute('ng-reflect-model','P');
       //  (event.target as Element).closest('.div4').querySelector('.txt').nodeValue = 'P';
       (event.target as Element).closest('.div4').querySelector('input').setAttribute('value','P');
       (event.target as Element).closest('.div4').querySelector('input').value = 'P';
       (event.target as Element).closest('.div4').querySelector('input').className= 'txt ng-valid ng-touched ng-dirty';
        console.log((event.target as Element).className);
        (event.target as Element).className = 'presentClass';
        (event.target as Element).innerHTML = 'P';


       }



      }
*/


     changeValue(value,event: Event)
      {
        if((event.target as Element).className == 'presentClass activated')
        {
          (event.target as Element).className = 'absentClass';
          (event.target as Element).innerHTML = 'A';
        }
        if((event.target as Element).className == 'absentClass activated')
        {
          (event.target as Element).className = 'presentClass';
          (event.target as Element).innerHTML = 'P';

        }
       if(value=='P')
       {

       return 'A';
       }
       else
       {

       return 'P';
       }

      }
      postAttendance(myform:any)
      {
        this.loadingPresent();
        let n = this.students.length ;
        this.studentsdata = [];
       // this.studentsdata = myform;

        for(let i =0; i<= n; i++)
        {
          console.log(i);

        this.studentsdata.push({'rollNo': myform['rollNo_'+i], 'classId': myform['classId_'+i], 'sectionId': myform['sectionId_'+i], 'branchId': this.branchId,'schoolId': this.schoolId,'periodId': this.periodId, 'attStatus':myform['attStatus_'+i]});

        }

        console.log(this.studentsdata);

        this.studentService.todayAttendance(this.studentsdata) .subscribe(res => {this.result = res['_body'] ; if(this.result =='Inserted'){ this.successToast();} else { this.errorToast();}}, error => {this.result = error['_body']; },()=>this.loadingAbsent());


      }
      goback()
      {
         this.navCtrl.push(PeriodpagePage);
      }
      successToast() {
        let toast = this.toastCtrl.create({
          message: 'Attedance Taken Successfully!',
          duration: 3000,
          position: 'top',
          cssClass: "greenColor"
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();
      }
      successToast2() {
        let toast = this.toastCtrl.create({
          message: 'Photo Updated Successfully!',
          duration: 3000,
          position: 'top',
          cssClass: "greenColor"
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();
      }

      errorToast() {
        let toast = this.toastCtrl.create({
          message: 'Error-> Try Again..',
          duration: 3000,
          position: 'top',
          cssClass: "redColor"
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();
      }

      takePhoto(studentId,myClassName,mySectionName,myStudentName,event)
      {
       // console.log('testing');
           localStorage.setItem('photoStudentId',studentId);
           localStorage.setItem('photoClassName',myClassName);
           localStorage.setItem('photoSectionName',mySectionName);
           localStorage.setItem('photoStudentName',myStudentName);
           this.navCtrl.push(PhotocapturePage);
        /*
        console.log('working');
      //  let img = '2222';
         this.studentData = studentId;
       //  console.log(this.studentData + '/' + this.imageData);
        // let img = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAHgAA/+4ADkFkb2JlAGTAAAAAAf/bAIQAEAsLCwwLEAwMEBcPDQ8XGxQQEBQbHxcXFxcXHx4XGhoaGhceHiMlJyUjHi8vMzMvL0BAQEBAQEBAQEBAQEBAQAERDw8RExEVEhIVFBEUERQaFBYWFBomGhocGhomMCMeHh4eIzArLicnJy4rNTUwMDU1QEA/QEBAQEBAQEBAQEBA/8AAEQgAlgCWAwEiAAIRAQMRAf/EAHQAAQADAQEBAQAAAAAAAAAAAAAEBQYHAwECAQEAAAAAAAAAAAAAAAAAAAAAEAABAwIDAgwEBgMAAAAAAAAAAQIDBAURITESBkFRYXGRsSJSE3NUFsFCNDWB4TKSIxRyUyQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHzRMVXBONcj7lw5Jwqc/vd5qbhVyI2RWUrFVsUbVwRUT5lw1A323H32/uQbcffb+5Dl207vL0qNp3eXpUDqSOYq4I5qrxI5D6ctbJI1Uc17muTRUVUU2m6t3lr4JKapdtT0+Co9dXMXj5gL4AAAAAAAAAAAAAAAEW43CnttK6pqFyTJjU1c7iQyM++F2keqw+HCzgYjdpcOVSVvtI5aikix7CMc7Dlx1MyBbSb0XqSN0bpW7L0VrsG4LgpUgAAWtFu1dqxiSJGkMa5tdKuzjzIS37l3NExbLE9eLHADPkihr6q3z/wBilcjJMFaqqmKKi8grbfW0Enh1cSxqui6tXmUjgXHuy9/7Wfs/MtLRvc+WZlPcWtaj1wbO3JEVe8hkwugHVARba90lupXuXFzom4r+BKAAAAAAAAAAADH77fW03lr1oZs0m+31tN5a9aGbAGq3Vscb2NudU3bxX/njXTL51+BlVTHLjOjzO/oWZyxZeBB2OfD8wIF43op6CRaeBn9iob+vPBjF4lUq4t9qpH/zUrHM4Uaqov4Gb2nO7blxc7tOVeFVzUAdFhmt19oFy8SB+T2L+qN3wUw11t0ltrX0r12mp2o395i6E/dGpfFdmwIv8dQ1WuTgxTNFLDfeJuzSTYdrFzFXk1AygXQBdAOkWn7XSeU3qJhDtP2uk8pvUTAAAAAAAAAAAAx++31tN5a9aGbNJvt9bTeWvWhmwC6ZanRaKSO6WZmeU8XhvXiciYHOi3sN9fapFjlRX0ci4vamrF7zQK6ro56GofSzt2XsXBOJycCoeJ0aSG03qBquRlSzVrkXtt+KEePdWyxP2/Ac7DPB7lVoFNufbJXTrcpG7MTEVsOPzOXVU5hvrVMfUU9I1cViRXv5FdohcXW/0Vri8KFWy1CJhHCz9Lf8sDDTzy1Mz553bcsi7TncoHmF0AXQDpFp+10nlN6iYQ7T9rpPKb1EwAAAAAAAAAAAMvvpRyObT1rExZGixyYfLjmimTOpPYyRjo5Go9jkwc1c0VCim3Otcj1fG+SFFz2G4Kic2IGKBsfZVB6iXoaPZVB6iXoaBkI5JIl2onujXjaqp1Hq+urpE2X1Ejm8W0pqvZVB6iXoaPZVB6iXoaBjuXhXVQbH2VQeol6Gj2VQeol6GgY4/Ucb5pGxRtV0kio1rU1VVNf7KoPUS9DSxttht9sd4kLVfNp4r81Tm4gJlJAtPSQ066xMa1edEzPYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k=";
       this.student_id = studentId;
       const confirm = this.alert.create({
        title: 'Student ID: ' + studentId,
        message: 'Student Name: ' +  myStudentName + '<br>Class Name: ' + myClassName + '-' + mySectionName,
        buttons: [

          {
            text: 'Take Photo',
            cssClass: 'btnphoto',
            handler: () => {

              const options: CameraOptions = {
                quality:50,
                destinationType: this.camera.DestinationType.FILE_URI,
                encodingType: this.camera.EncodingType.PNG,
                mediaType: this.camera.MediaType.PICTURE
              }

              this.camera.getPicture(options).then((imageData) => {
               // imageData is either a base64 encoded string or a file URI
               // If it's base64 (DATA_URL):
               let base64Image = 'data:image/png;base64,' + imageData;
               if(base64Image!='')
               {
           //alert(base64Image);
                 // console.log(base64Image);
            //  this.loadingPresent();
               //this.getStudents();
              this.studentService.uploadPic(this.student_id,this.image_data).subscribe(res => {this.imageStatus = res['_body'] ;if(this.imageStatus=='Inserted  ') { this.loadingAbsent();} }, error => {this.result = error['_body']; },()=>this.loadingAbsent());
             //  this.getStudents();
               }


              }, (err) => {
               // Handle error
              });


            }
          },
          {
            text: 'Cancel',
            handler: () => {
              console.log('Disagree clicked');
            }
          }
        ]
      });
      confirm.present();
       // let img = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAHgAA/+4ADkFkb2JlAGTAAAAAAf/bAIQAEAsLCwwLEAwMEBcPDQ8XGxQQEBQbHxcXFxcXHx4XGhoaGhceHiMlJyUjHi8vMzMvL0BAQEBAQEBAQEBAQEBAQAERDw8RExEVEhIVFBEUERQaFBYWFBomGhocGhomMCMeHh4eIzArLicnJy4rNTUwMDU1QEA/QEBAQEBAQEBAQEBA/8AAEQgAlgCWAwEiAAIRAQMRAf/EAHQAAQADAQEBAQAAAAAAAAAAAAAEBQYHAwECAQEAAAAAAAAAAAAAAAAAAAAAEAABAwIDAgwEBgMAAAAAAAAAAQIDBAURITESBkFRYXGRsSJSE3NUFsFCNDWB4TKSIxRyUyQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHzRMVXBONcj7lw5Jwqc/vd5qbhVyI2RWUrFVsUbVwRUT5lw1A323H32/uQbcffb+5Dl207vL0qNp3eXpUDqSOYq4I5qrxI5D6ctbJI1Uc17muTRUVUU2m6t3lr4JKapdtT0+Co9dXMXj5gL4AAAAAAAAAAAAAAAEW43CnttK6pqFyTJjU1c7iQyM++F2keqw+HCzgYjdpcOVSVvtI5aikix7CMc7Dlx1MyBbSb0XqSN0bpW7L0VrsG4LgpUgAAWtFu1dqxiSJGkMa5tdKuzjzIS37l3NExbLE9eLHADPkihr6q3z/wBilcjJMFaqqmKKi8grbfW0Enh1cSxqui6tXmUjgXHuy9/7Wfs/MtLRvc+WZlPcWtaj1wbO3JEVe8hkwugHVARba90lupXuXFzom4r+BKAAAAAAAAAAADH77fW03lr1oZs0m+31tN5a9aGbAGq3Vscb2NudU3bxX/njXTL51+BlVTHLjOjzO/oWZyxZeBB2OfD8wIF43op6CRaeBn9iob+vPBjF4lUq4t9qpH/zUrHM4Uaqov4Gb2nO7blxc7tOVeFVzUAdFhmt19oFy8SB+T2L+qN3wUw11t0ltrX0r12mp2o395i6E/dGpfFdmwIv8dQ1WuTgxTNFLDfeJuzSTYdrFzFXk1AygXQBdAOkWn7XSeU3qJhDtP2uk8pvUTAAAAAAAAAAAAx++31tN5a9aGbNJvt9bTeWvWhmwC6ZanRaKSO6WZmeU8XhvXiciYHOi3sN9fapFjlRX0ci4vamrF7zQK6ro56GofSzt2XsXBOJycCoeJ0aSG03qBquRlSzVrkXtt+KEePdWyxP2/Ac7DPB7lVoFNufbJXTrcpG7MTEVsOPzOXVU5hvrVMfUU9I1cViRXv5FdohcXW/0Vri8KFWy1CJhHCz9Lf8sDDTzy1Mz553bcsi7TncoHmF0AXQDpFp+10nlN6iYQ7T9rpPKb1EwAAAAAAAAAAAMvvpRyObT1rExZGixyYfLjmimTOpPYyRjo5Go9jkwc1c0VCim3Otcj1fG+SFFz2G4Kic2IGKBsfZVB6iXoaPZVB6iXoaBkI5JIl2onujXjaqp1Hq+urpE2X1Ejm8W0pqvZVB6iXoaPZVB6iXoaBjuXhXVQbH2VQeol6Gj2VQeol6GgY4/Ucb5pGxRtV0kio1rU1VVNf7KoPUS9DSxttht9sd4kLVfNp4r81Tm4gJlJAtPSQ066xMa1edEzPYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k=";

*/


      }
      uploadphoto()
      {

       const options: CameraOptions = {
        quality:50,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE
      }

      this.camera.getPicture(options).then((imageData) => {
       // imageData is either a base64 encoded string or a file URI
       // If it's base64 (DATA_URL):
       let base64Image = 'data:image/jpeg;base64,' + imageData;
       if(base64Image!='')
       {

         // console.log(base64Image);
      this.loadingPresent();
       //this.getStudents();
      this.studentService.uploadPic(this.student_id,this.image_data).subscribe(res => {this.imageStatus = res['_body'] ;if(this.imageStatus=='Inserted  ') { this.loadingAbsent();} }, error => {this.result = error['_body']; },()=>this.loadingAbsent());
     //  this.getStudents();
       }


      }, (err) => {
       // Handle error
      });
      }



}
