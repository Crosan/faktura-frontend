import {
  MatInputModule,
  MatCardModule,
  MatTableModule,
  MatGridListModule,
  MatSelectModule,
  MatIconModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatButtonModule,
  MatTabsModule
} from '@angular/material';

import { MaterialFileInputModule } from 'ngx-material-file-input';
import localeDA from '@angular/common/locales/da';
import { registerLocaleData } from '@angular/common';

import { ToasterModule, ToasterService } from 'angular2-toaster';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppErrorHandler } from './common/error-handling/app-error-handler';
import { NgxSpinnerModule } from 'ngx-spinner';

import { BannerComponent } from './common/component/banner/banner.component';
import { NavbarComponent } from './common/component/navbar/navbar.component';
import { NotFoundComponent } from './common/component/not-found/not-found.component';
import { NoAccessComponent } from './common/component/no-access/no-access.component';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { MatDialogModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UploadService } from './common/services/upload.service';
import { PriceComponent } from './price/price.component';
import { PriceService } from './common/services/price.service';
import { AnalysePrisService } from './common/services/analyse-pris.service';
import { AnalyseTypeService } from './common/services/analyse-type.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DownloadService } from './common/services/download.service';
import { FakturaPdfComponent } from './common/component/faktura-pdf/faktura-pdf.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './common/services/guards/auth-guard.service';
import { SendService } from './common/services/send.service';
import { ParsingComponent } from './parsing/parsing.component';
import { RekvirentComponent } from './rekvirenter/rekvirenter.component';
import { LayoutModule } from '@angular/cdk/layout';
// import { EANdialogComponent } from './rekvirenter/EANdialog/EANdialog.component'

registerLocaleData(localeDA);

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'priser',
    component: PriceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'no-access',
    component: NoAccessComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parses',
    component: ParsingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rekvirenter',
    component: RekvirentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    NavbarComponent,
    NotFoundComponent,
    NoAccessComponent,
    LoginComponent,
    HomeComponent,
    PriceComponent,
    FakturaPdfComponent,
    ParsingComponent,
    RekvirentComponent,
    // EANdialogComponent,
    // EANdialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ToasterModule.forRoot(),
    MatInputModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatGridListModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatExpansionModule,
    // MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MaterialFileInputModule,
    HttpClientModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  // entryComponents: [EANdialogComponent],
  // entryComponents:[MatDialogModule],
  providers: [
    { provide: LOCALE_ID, useValue: "da" },
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler
    },
    JwtHelperService,
    ToasterService,
    StorageServiceModule,
    UploadService,
    AuthGuard,
    PriceService,
    AnalysePrisService,
    SendService, 
    AnalyseTypeService,
    DownloadService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
