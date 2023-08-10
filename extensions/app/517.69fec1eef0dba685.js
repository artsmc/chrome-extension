"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[517],{6517:(i,e,n)=>{n.r(e),n.d(e,{SignupModule:()=>S});var r=n(6814),t=n(95),o=n(591),s=n(228),u=n(4769),l=n(6295);function a(i,e){1&i&&u._UZ(0,"div",15)}function d(i,e){1&i&&(u.TgZ(0,"div"),u._uU(1,"email is required. "),u.qZA())}function c(i,e){1&i&&(u.TgZ(0,"div"),u._uU(1,"You did not supply a valid email address."),u.qZA())}function g(i,e){if(1&i&&(u.TgZ(0,"div",15),u.YNc(1,d,2,0,"div",1),u.YNc(2,c,2,0,"div",1),u.qZA()),2&i){const i=u.oxw(2);u.xp6(1),u.Q6J("ngIf",i.fSignup.email.errors&&i.fSignup.email.errors.required),u.xp6(1),u.Q6J("ngIf",i.fSignup.email.errors&&i.fSignup.email.errors.email)}}function p(i,e){1&i&&(u.TgZ(0,"div"),u._uU(1,"password is required."),u.qZA())}function m(i,e){if(1&i&&(u.TgZ(0,"div",15),u.YNc(1,p,2,0,"div",1),u.qZA()),2&i){const i=u.oxw(2);u.xp6(1),u.Q6J("ngIf",i.fSignup.password.errors&&i.fSignup.password.errors.required)}}const f=function(){return["/login"]},Z=function(i){return{"text-danger":i}};function v(i,e){if(1&i){const i=u.EpF();u.ynx(0),u.TgZ(1,"div",2)(2,"h2",3),u._uU(3,"Welcome!"),u.qZA(),u.TgZ(4,"h5"),u._uU(5,"Start your free trial today by signing up below or click here to "),u.TgZ(6,"a",4),u._uU(7,"log in."),u.qZA()()(),u.TgZ(8,"form",5)(9,"div",6)(10,"div",7)(11,"div",8)(12,"label"),u._uU(13,"Full name *"),u.qZA(),u._UZ(14,"input",9),u.qZA(),u.TgZ(15,"div",10),u.YNc(16,a,1,0,"div",11),u.qZA()(),u.TgZ(17,"div",7)(18,"div",8)(19,"label"),u._uU(20,"Email *"),u.qZA(),u._UZ(21,"input",12),u.qZA()(),u.TgZ(22,"div",10),u.YNc(23,g,3,2,"div",11),u.qZA(),u.TgZ(24,"div",7)(25,"div",8)(26,"label"),u._uU(27,"Password *"),u.qZA(),u._UZ(28,"input",13),u.qZA(),u.TgZ(29,"div",10),u.YNc(30,m,2,1,"div",11),u.qZA()(),u.TgZ(31,"div",7)(32,"h5"),u._uU(33,"By signing up you agree to our "),u.TgZ(34,"a"),u._uU(35,"Terms and Conditions"),u.qZA(),u._uU(36," of use and "),u.TgZ(37,"a"),u._uU(38,"Privacy Policy"),u.qZA()()(),u.TgZ(39,"div",2)(40,"button",14),u.NdJ("click",(function(){u.CHM(i);const e=u.oxw();return u.KtG(e.signup())})),u._uU(41," Start free trial "),u.qZA()()()(),u.BQk()}if(2&i){const i=u.oxw();u.xp6(6),u.Q6J("routerLink",u.DdM(8,f)),u.xp6(2),u.Q6J("formGroup",i.signupForm),u.xp6(6),u.Q6J("ngClass",u.VKq(9,Z,i.submitted&&i.fSignup.fullName.errors)),u.xp6(2),u.Q6J("ngIf",i.fSignup.fullName.touched&&i.fSignup.fullName.invalid),u.xp6(5),u.Q6J("ngClass",u.VKq(11,Z,i.submitted&&i.fSignup.email.errors)),u.xp6(2),u.Q6J("ngIf",i.fSignup.email.touched&&i.fSignup.email.invalid),u.xp6(5),u.Q6J("ngClass",u.VKq(13,Z,i.submitted&&i.fSignup.password.errors)),u.xp6(2),u.Q6J("ngIf",i.fSignup.password.touched&&i.fSignup.password.invalid)}}function h(i,e){1&i&&(u.ynx(0),u.TgZ(1,"div",6)(2,"div",2)(3,"h2",16),u._uU(4,"Success"),u.qZA()(),u.TgZ(5,"div",17),u._uU(6," We sent you a link to your email to login to your dashboard "),u.qZA()(),u.BQk())}const x=[{path:"",component:(()=>{class i{constructor(i,e,n,r){this.router=i,this.formBuilder=e,this.userService=n,this.route=r,this.submitted=!1,this.isLoginSection=!0,this.userService.getUserValue()}ngOnInit(){this.initializesSignupForm()}initializesSignupForm(){this.signupForm=this.formBuilder.group({email:[null,t.kI.compose([t.kI.required,t.kI.email])],password:[null,t.kI.required],fullName:[null,t.kI.required]})}get fSignup(){return this.signupForm.controls}signup(){console.log(this.signupForm),this.submitted=!0,!this.signupForm.invalid&&this.userService.createUser(this.signupForm.value.email,this.signupForm.value.password,this.signupForm.value.fullName).subscribe((i=>{document.getElementById("ex1-tab-1"),this.router.navigate(["/login"])}))}}return i.ɵfac=function(e){return new(e||i)(u.Y36(s.F0),u.Y36(t.qu),u.Y36(l.K),u.Y36(s.F0))},i.ɵcmp=u.Xpm({type:i,selectors:[["app-sign-up"]],decls:3,vars:2,consts:[[1,"message-container"],[4,"ngIf"],[1,"col-xs-12"],[1,""],["routerLinkActive","router-link-active",3,"routerLink"],[3,"formGroup"],[1,"row"],[1,"col-xs-11"],[1,"d-flex","justify-content-center"],["formControlName","fullName","type","text","id","fullName","aria-describedby","fullNameHelp","placeholder","Enter your full name",1,"form-control","max-width-250",3,"ngClass"],[1,"col-xs-11","mt-4"],["class","alert alert-danger",4,"ngIf"],["formControlName","email","type","email","id","email","aria-describedby","emailHelp","placeholder","Enter you email",1,"form-control","max-width-250",3,"ngClass"],["formControlName","password","type","password","id","password","aria-describedby","emailHelp","placeholder","Enter your Password",1,"form-control","max-width-250",3,"ngClass"],["type","button",1,"btn",3,"click"],[1,"alert","alert-danger"],[1,"text-danger","col-xs-6"],[1,"col-xs-12","d-flex","succ-text"]],template:function(i,e){1&i&&(u.TgZ(0,"div",0),u.YNc(1,v,42,15,"ng-container",1),u.YNc(2,h,7,0,"ng-container",1),u.qZA()),2&i&&(u.xp6(1),u.Q6J("ngIf",e.isLoginSection),u.xp6(1),u.Q6J("ngIf",!e.isLoginSection))},dependencies:[r.mk,r.O5,s.rH,s.Od,t._Y,t.Fj,t.JJ,t.JL,t.sg,t.u],styles:[".message-container[_ngcontent-%COMP%]{width:90%}"]}),i})()}];let q=(()=>{class i{}return i.ɵfac=function(e){return new(e||i)},i.ɵmod=u.oAB({type:i}),i.ɵinj=u.cJS({imports:[s.Bz.forChild(x),s.Bz]}),i})(),S=(()=>{class i{}return i.ɵfac=function(e){return new(e||i)},i.ɵmod=u.oAB({type:i}),i.ɵinj=u.cJS({imports:[r.ez,s.Bz,t.UX,o.nM.forRoot(),q]}),i})()}}]);