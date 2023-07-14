import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageComponent } from './components/message/message.component';
import { ZendeskService } from './services/zendesk.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AgentReponseModule } from './components/agent-reponse/agent-reponse.module';
import { AddAgentModule } from './components/add-agent/add-agent.module';
import { LoginModule } from './components/login/login.module';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    AgentReponseModule,
    AddAgentModule,
    LoginModule
  ],
  providers: [ZendeskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
