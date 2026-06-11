import { Injectable } from "@angular/core";
import { Student } from "./student";
import { Observable } from "rxjs";
import { RestDataSource } from "./rest-data-source";

@Injectable()
export class StudentRepo {
    private students: Student[] = new Array<Student>();
    private locator = (s: Student, id: number) => s.id == id;

    constructor(private dataSource: RestDataSource) {
        this.dataSource.getData().subscribe({
            next: data => {
                var len = data.length;
                console.log("The length of the student list is: " + len);    
                this.students = data;
            },
            error: e => console.log(e),
            complete:()=>{
                console.log("Completed!");                
            }
        });
    }

    getStudents(): Student[] {
        return this.students;
    }

    getStudent(id: number): Student {
        return this.students.find(s => this.locator(s, id));
    }

    saveStudent(student: Student){
        if (student.id == 0 || student.id == null) {
            this.dataSource.saveStudent(student).subscribe(s => {this.students.push(s); console.log(`New Id is: ${s.id}`);});
        } else {
            this.dataSource.updateStudent(student).subscribe(s => {
                let index = this.students
                .findIndex(item => this.locator(item, s.id));
                this.students.splice(index, 1, s);
                console.log(`Updated name is ${s.firstName} ${s.lastName}`);
            });
        }
    }

    deleteProduct(id: number) {
        this.dataSource.deleteStudent(id).subscribe(() => {
            let index = this.students.findIndex(s => this.locator(s, id));
            if (index > -1) {
                this.students.splice(index, 1);
            }
        });
    }

    private generateID(): number {
        let candidate = 100;
        while (this.getStudent(candidate) != null) {
            candidate++;
        }
        return candidate;
    }
}
