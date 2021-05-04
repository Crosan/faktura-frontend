// import {
//   MatInputModule,
//   MatCardModule,
//   MatTableModule,
//   MatGridListModule,
//   MatSelectModule,
//   MatIconModule,
//   MatNativeDateModule,
//   MatDatepickerModule,
//   MatAutocompleteModule,
//   MatExpansionModule,
//   MatButtonModule,
//   MatTabsModule,
//   MatSnackBarModule,
//   MatSnackBar,
//   MAT_DIALOG_DATA,
//   MatSnackBarContainer
// } from '@angular/material';

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
// import {MatNativeDateModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';

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
// import { MatDialogModule } from '@angular/material/dialog';

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
import { EANdialogComponent } from './rekvirenter/EANdialog/EANdialog.component';
import { MatNativeDateModule } from '@angular/material/core';
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
    EANdialogComponent,
  ],
  entryComponents: [EANdialogComponent],//,MatSnackBarContainer],
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
    MatSnackBarModule,
    MaterialFileInputModule,
    HttpClientModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "da" },
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler
    },
    MatSnackBar, {
      provide: MAT_DIALOG_DATA,
      useValue: {}
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
