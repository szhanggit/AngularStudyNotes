import { Injectable, Inject, InjectionToken } from "@angular/core";
import { BehaviorSubject } from 'rxjs'; 
export const MY_SUBJECT_TOKEN = new InjectionToken<BehaviorSubject<string>>('mySubjectToken');