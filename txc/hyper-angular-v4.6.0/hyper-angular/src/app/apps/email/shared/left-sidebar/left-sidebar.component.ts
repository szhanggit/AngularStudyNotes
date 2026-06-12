import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuillModules } from 'ngx-quill';

@Component({
  selector: 'app-email-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {

  email: string = "";
  subject: string = "";
  message: string = "";
  submitted: boolean = false;
  quillConfig: QuillModules = {};


  @ViewChild('content', { static: true }) content!: TemplateRef<NgbModal>;

  constructor (public activeModal: NgbModal) { }

  ngOnInit(): void {
    this.quillConfig = {
      toolbar: [
        ["bold", "italic", "underline", "blockquote",
          { list: "ordered" }, { list: "bullet" },
          "link", "image", "video"],
      ]
    }
  }

  openModal(): void {
    this.activeModal.open(this.content);
  }

  saveEvent() {
    this.submitted = true;
    if (this.email !== '' && this.subject !== '' && this.message !== '') {
      this.activeModal.dismissAll();
    }
  }


}
