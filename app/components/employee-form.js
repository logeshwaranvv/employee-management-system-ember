import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class EmployeeFormComponent extends Component {
  @service router;
  @service employeeStore;

  @tracked employee = this.args.employee || {
    name: '',
    email: '',
    gender: '',
    dob: '',
    address: '',
    country: '',
    department: '',
    skills: [],
    employmentType: '',
    salary: '',
  };
  @tracked selectedName = this.employee.name || '';
  @tracked selectedEmail = this.employee.email || '';
  @tracked selectedDOB = this.employee.dob || '';
  @tracked selectedAddress = this.employee.address || '';
  @tracked selectedSalary = this.employee.salary || '';

  @tracked selectedDepartment = this.employee.department || null;
  @tracked selectedCountry = this.employee.country || null;
  @tracked selectedGender = this.employee.gender || null;
  @tracked selectedSkills = this.employee.skills || [];
  @tracked selectedEmploymentType = this.employee.employmentType.value || '';

  @tracked genders = ['Male', 'Female'];

  @tracked countries = [
    'Australia',
    'Bangladesh',
    'Brazil',
    'Canada',
    'China',
    'Denmark',
    'Egypt',
    'France',
    'Germany',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Italy',
    'Japan',
    'Kuwait',
    'Lebanon',
    'Malaysia',
    'Mexico',
    'Pakistan',
    'Poland',
    'Portugal',
    'Russia',
    'Saudi Arabia',
    'Singapore',
    'South Korea',
    'Spain',
    'Sweden',
    'Thailand',
    'UAE',
    'UK',
    'USA',
    'Ukraine',
    'Vietnam',
  ];

  @tracked departments = [
    'Human Resources',
    'Engineering',
    'Marketing',
    'Finance',
    'Operations',
    'Sales',
    'IT',
  ];

  @tracked skills = [
    'JavaScript',
    'Python',
    'Java',
    'Project Management',
    'UI/UX',
    'DevOps',
    'Data Analysis',
    'Cloud Computing',
  ];

  @tracked employmentTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contractor', label: 'Contractor' },
    { value: 'intern', label: 'Intern' },
  ];

  @action
  selectGender(gender) {
    this.selectedGender = gender;
    this.employee.gender = gender;
  }

  @action
  selectCountry(country) {
    this.selectedCountry = country;
    this.employee.country = country;
  }
  @action
  selectDepartment(department) {
    this.selectedDepartment = department;
    this.employee.department = department;
  }
  @action
  selectSkills(skills) {
    this.selectedSkills = skills;
    this.employee.skills = skills;
  }
  @action
  selectEmploymentType(type) {
    this.selectedEmploymentType = type.value;
    this.employee.employmentType = type;
  }
  @action
  validateForm(event) {
    event.preventDefault();
    if (
      this.selectedGender === null ||
      this.selectedCountry === null ||
      this.selectedDepartment === null ||
      this.selectedSkills.length === 0 ||
      this.selectedEmploymentType === ''
    ) {
      event.preventDefault();
      alert('Please fill all the fields');
      return false;
    }
    this.employee.name = event.target.name.value;
    this.employee.email = event.target.email.value;
    this.employee.dob = event.target.dob.value;
    this.employee.salary = event.target.salary.value;
    this.employee.address = event.target.address.value;
    this.args.onSubmit(this.employee);
  }

  @action
  toIndex() {
    this.router.transitionTo('index');
  }
  @action
  toView() {
    this.router.transitionTo('view');
  }
}
