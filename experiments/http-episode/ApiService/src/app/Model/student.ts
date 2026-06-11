export class Student {
    id :number;
    firstName :string;
    lastName :string;
    grade :number;
    gender :boolean
    constructor(
        id :number,
        firstName :string,
        lastName :string,
        grade :number,
        gender :boolean
    ){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.grade = grade;
        this.gender = gender;
    }
}
