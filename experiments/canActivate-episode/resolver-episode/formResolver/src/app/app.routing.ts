import { Routes, RouterModule } from "@angular/router";
import { TableComponent } from "./table/table.component";
import { ModelResolver } from "./model/model.resolver";
import { FormComponent } from "./table/form.component";

const routes: Routes = [
    {
        path: "", 
        redirectTo: "/table",
        pathMatch: "full",
        resolve: { model: ModelResolver }
    },
    {
        path: "table", 
        component: TableComponent,
        resolve: { model: ModelResolver }
    },
    {
        path: "form/:mode/:id", component: FormComponent,
        resolve: { model: ModelResolver },
    },
    {
        path: "form/:mode", component: FormComponent,
        //resolve: { model: ModelResolver },
    },    
]

export const routing = RouterModule.forRoot(routes);
