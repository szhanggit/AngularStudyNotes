import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// types
import { User } from '../models/auth.models';

/**
 * @returns registered user list
 */
function getUsers(): User[] {
    // array in session storage for registered users
    let users: User[] = JSON.parse(sessionStorage.getItem('users')!) || [
        {
            id: 1, username: 'test', email: 'hyper@coderthemes.com', password: 'test', firstName: 'Dominic', lastName: 'Keller',
            avatar: 'assets/images/users/avatar-1.jpg', location: 'California, USA', title: 'Founder'
        }
    ];
    return users;
}

let users: User[] = getUsers();

let approval_list : any[] = [
    {
       "batch_no" : "20200925112008209ZDF",
       "creator": "Peter",
       "import_date": "10/12/2021 10:08:16 AM",
       "voucher_qty": "N",
       "status": "Pending",
       "approver": "--",
       "approval_date": "--"
    },
    {
       "batch_no" : "20200925112008209ZDF",
       "creator": "Dominic Keller",
       "import_date": "10/12/2021 10:08:16 AM",
       "voucher_qty": "N",
       "status": "Pending",
       "approver": "--",
       "approval_date": "--"
    },
    {
       "batch_no" : "20200925112008209ZDF",
       "creator": "Peter",
       "import_date": "10/12/2021 10:08:16 AM",
       "voucher_qty": "N",
       "status": "Approved",
       "approver": "UserName",
       "approval_date": "10/12/2021 10:08:16 AM"
    },
    {
       "batch_no" : "20200925112008209ZDF",
       "creator": "Peter",
       "import_date": "10/12/2021 10:08:16 AM",
       "voucher_qty": "N",
       "status": "Rejected",
       "approver": "UserName",
       "approval_date": "10/12/2021 10:08:16 AM",
       "reject_reason" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
    }
 ];

 let batch_detail_list : any[] = [
    {
       "po_no" : "123456789",
       "supplier_code": "Supplier Name",
       "merchant_code": "987654321",
       "merchant_sku": "123456789",
       "program_code": "987654321",
       "voucher_no": "1,000",
       "barcode1": "barcode 1",
       "barcode2": "barcode 2",
       "ref_code": "123456789"
    },
    {
       "po_no" : "123456789",
       "supplier_code": "Supplier Name",
       "merchant_code": "987654321",
       "merchant_sku": "123456789",
       "program_code": "987654321",
       "voucher_no": "1,000",
       "barcode1": "barcode 1",
       "barcode2": "barcode 2",
       "ref_code": "123456789"
    },
    {
       "po_no" : "123456789",
       "supplier_code": "Supplier Name",
       "merchant_code": "987654321",
       "merchant_sku": "123456789",
       "program_code": "987654321",
       "voucher_no": "1,000",
       "barcode1": "barcode 1",
       "barcode2": "barcode 2",
       "ref_code": "123456789"
    },
    {
       "po_no" : "123456789",
       "supplier_code": "Supplier Name",
       "merchant_code": "987654321",
       "merchant_sku": "123456789",
       "program_code": "987654321",
       "voucher_no": "1,000",
       "barcode1": "barcode 1",
       "barcode2": "barcode 2",
       "ref_code": "123456789"
    },
    {
       "po_no" : "123456789",
       "supplier_code": "Supplier Name",
       "merchant_code": "987654321",
       "merchant_sku": "123456789",
       "program_code": "987654321",
       "voucher_no": "1,000",
       "barcode1": "barcode 1",
       "barcode2": "barcode 2",
       "ref_code": "123456789"
    }
 ];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {
            let temp: User[] = [];
            // authenticate - public
            if (request.url.endsWith('/api/login') && request.method === 'POST') {
                const user = users.find(x => x.email === request.body.email && x.password === request.body.password);
                if (!user) { return error('Email or password is incorrect'); }
                return ok({
                    ...user,
                    name: user.firstName + ' ' + user.lastName,
                    token: `fake-jwt-token`
                });
            }

            // store new user - public
            if (request.url.endsWith('/api/signup') && request.method === 'POST') {
                const user = users.find(x => x.email === request.body.email && x.password === request.body.password);
                if (user) { return error('User Already Exists'); }
                else {
                    let [firstName, lastName] = request.body.name.split(' ');
                    const newUser: User = {
                        id: users.length + 1, username: firstName, email: request.body.email, password: request.body.password, firstName: firstName, lastName: lastName,
                        avatar: 'assets/images/users/avatar-5.jpg', location: 'California, USA', title: 'Admin'
                    }
                    temp = [...users];
                    temp.push(newUser);
                    [...users] = temp;

                    sessionStorage.setItem('users', JSON.stringify(users));
                    return ok();
                }
            }

            // get all users
            if (request.url.endsWith('/api/users') && request.method === 'GET') {
                if (!isLoggedIn) { return unauthorised(); }
                return ok(users);
            }

            // get approval list
            if (request.url.endsWith('/api/approval-list') && request.method === 'GET') {
                if (!isLoggedIn) { return unauthorised(); }
                return ok(approval_list);
            }

            // get batch detail list
            if (request.url.endsWith('/api/batch-detail-list') && request.method === 'GET') {
                if (!isLoggedIn) { return unauthorised(); }
                return ok(batch_detail_list);
            }

            // pass through any requests not handled above
            return next.handle(request);
        }))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        // private helper functions
        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message: any) {
            return throwError({ status: 400, error: { message } });
        }
    }
}

export let FakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
